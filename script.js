'use strict';
// Data
const account1 = {
    owner: 'Umarov Ikrom',
    movements: [200, 450, -400, 3000, -650, -130, 70, 20300],
    interestRate: 1.2, // %
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
    currency: 'EUR',
    locale: 'pt-PT',
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
    currency: 'USD',
    locale: 'en-US',
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

/////////////////////////////////////////
//Functions
const formatMovementDate = function(date) {
    const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 *24);

    
    if (daysPassed === 0) return "Today";
    if (daysPassed === 1) return "Yesterday";
    if (daysPassed <= 7) return `${daysPassed} days ago`;

    const daysPassed = calcDaysPassed(new Date(), date);
    console.log(daysPassed);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear(0);
    return `${month}/${day}/${year}`;
};

// Dom manipulation of account1 object
const displayMovements = function(acc, sort = false) {
    containerMovements.innerHTML = ''; 

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements; 

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);


    movs.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        
        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__date">${displayDate}</div>
                <div class="movements__value">${mov.toFixed(2)} €</div>
            </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

// Displaying calculated balance to label
const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
}

//calc display summary 
const calcDisplaySummary = function(acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}€`;

    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((mov, int) => mov + int, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

//creating usernames
const createUsernames = function(accs) {
    accs.forEach(function(acc) {
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
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
}

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
        const day = `${now.getDate()}`.padStart(2, 0);
        const month = `${now.getMonth() + 1}`.padStart(2, 0);
        const year = now.getFullYear(0);
        const hour = `${now.getHours()}`.padStart(2, 0);
        const min = `${now.getMinutes()}`.padStart(2, 0);
        labelDate.textContent = `${month}/${day}/${year}, ${hour}:${min}`;

        // Clear input fields 
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

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
    }
});

//request loan
btnLoan.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);

    if(amount > 0 && currentAccount.movements.some(mov => mov >= amount + 0.1)) {
        //Add amount
        currentAccount.movements.push(amount);

        //Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());

        //update UI
        updateUI(currentAccount);
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
    }
});

//sort button
let sorted = false;
btnSort.addEventListener('click', function(e) {
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted
})
