'use strict';
// Data
const account1 = {
    owner: 'Umarov Ikrom',
    movements: [200, 450, -400, 25000, -650, -130, 70, 1300],
    interestRate: 1.2, 
    pin: 1113,

    movementsDates: [
        '2021-11-18T21:31:17.178Z',
        '2021-12-23T07:42:02.383Z',
        '2022-01-28T09:15:04.904Z',
        '2022-04-01T10:17:24.185Z',
        '2022-05-08T14:11:59.604Z',
        '2022-05-27T17:01:17.194Z',
        '2022-06-11T23:36:17.929Z',
        '2022-06-12T10:51:36.790Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};
  
const account2 = {
    owner: 'Cristiano Ronaldo',
    movements: [5000, 3400, -150, -790, -3210, -1000, 10500, -30],
    interestRate: 1.5,
    pin: 7777,

    movementsDates: [
        '2021-11-01T13:15:33.035Z',
        '2021-11-30T09:48:16.867Z',
        '2021-12-25T06:04:23.907Z',
        '2022-01-25T14:18:46.235Z',
        '2022-02-05T16:33:06.386Z',
        '2022-04-10T14:43:26.374Z',
        '2022-06-15T18:49:59.371Z',
        '2022-06-17T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT',
};
  
const accounts = [account1, account2];
  
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

alert(`
PLEASE USE THIS LOGINS FOR ENTER THE ACCOUNTS!!!:

        User 1: ui          User 2: cr
         Pin 1: 1113         Pin 2: 7777

AND TRY BOTH OF THEM TO SEE MY WORKS!!!
`);
/////////////////////////////////////////
//Functions
const formatMovementDate = function(date, locale) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 *24));

    const daysPassed = calcDaysPassed(new Date(), date);

    if (daysPassed === 0) return "Today";
    if (daysPassed === 1) return "Yesterday";
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear(0);
    // return `${month}/${day}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function(value, locale, currency){
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(value);
};

// Dom manipulation
const displayMovements = function(acc, sort = false) {
    containerMovements.innerHTML = ''; 

    const movs = sort 
        ? acc.movements.slice().sort((a, b) => a - b) 
        : acc.movements; 
        
        movs.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
       
        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date, acc.locale);

        const formattedMov = formatCur(mov, acc.locale, acc.currency);
        
        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__date">${displayDate}</div>
                <div class="movements__value">${formattedMov}</div>
            </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

// Displaying calculated balance to label
const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
}

//calc display summary 
const calcDisplaySummary = function(acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((mov, int) => mov + int, 0);
    labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//creating usernames
const createUsernames = function(accs) {
    accs.forEach(function(acc) {
        acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');
    });
};
createUsernames(accounts);

const updateUI = function(acc) {
    // Display movements 
    displayMovements(acc);
    
    // Display balance 
    calcDisplayBalance(acc);
    
    // Display summary 
    calcDisplaySummary(acc);
};

//Timers
const startLogOutTimer = function() {
    const tick = function() {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);

        // In each call, print the remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;

        // When 0 seconds, stop timer and log out user
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = "Log in to get started";
            containerApp.style.opacity = 0;
        }
  
        // Decrease 1s
        time--;
    };

    // Set time to 5 minutes
    let time = 120;

    // Call the timer every second
    tick();
    const timer = setInterval(tick, 1000);

    return timer;
};

//////////////////////////////////
// Event handlers & Login 
let currentAccount;

btnLogin.addEventListener('click', function(e) {
    //Prevent form from submitting
    e.preventDefault();

    currentAccount = accounts
        .find(acc => acc.username === inputLoginUsername.value
    );

    if(currentAccount?.pin === Number(inputLoginPin.value)) {
        //Display UI and message
        labelWelcome.textContent = `Welcome back! ${currentAccount.owner.split(' ')[1]}`;
        containerApp.style.opacity = 100;

        //Create current date and time
        const now = new Date();
        const options = {
            hour: "numeric",
            minute: "numeric",
            day: "numeric",
            month: "numeric",
            year: "numeric",
        };

        labelDate.textContent = new Intl.DateTimeFormat(
            currentAccount.locale,
            options
        ).format(now);

        // const day = `${now.getDate()}`.padStart(2, 0);
        // const month = `${now.getMonth() + 1}`.padStart(2, 0);
        // const year = now.getFullYear(0);
        // const hour = `${now.getHours()}`.padStart(2, 0);
        // const min = `${now.getMinutes()}`.padStart(2, 0);
        // labelDate.textContent = `${month}/${day}/${year}, ${hour}:${min}`;

        // Clear input fields 
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        // Timer 
        if(timer) clearInterval(timer);
        timer = startLogOutTimer();

        // Update UI 
        updateUI(currentAccount);
    }
});

//Transfer money 
btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts
        .find(acc => acc.username === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = '';

    inputTransferAmount.value = inputTransferTo.value = '';

    if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
        //Doing the transfer
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        //Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());

        //Update UI 
        updateUI(currentAccount);

        // Reset timer
        clearInterval(timer);
        timer = startLogOutTimer();
    }
});

//request loan
btnLoan.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);

    if(amount > 0 && currentAccount.movements.some(mov => mov >= amount + 0.1)) {
        setTimeout(function () {
            // Add movement
            currentAccount.movements.push(amount);
      
            // Add loan date
            currentAccount.movementsDates.push(new Date().toISOString());
      
            // Update UI
            updateUI(currentAccount);
      
            // Reset timer
            clearInterval(timer);
            timer = startLogOutTimer();
        }, 2500);
    };
    inputLoanAmount.value = '';
});

//close account
btnClose.addEventListener('click', function(e) {
    e.preventDefault();

    if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === Number(currentAccount.pin)){
        const index = accounts
            .findIndex(acc => acc.username === currentAccount.username
        );

        //delete account
        accounts.splice(index, 1);

        //hide UI
        containerApp.style.opacity = 0;
    };

    inputCloseUsername.value = inputClosePin.value = "";
});

//sort button
let sorted = false;
btnSort.addEventListener('click', function(e) {
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted
});
