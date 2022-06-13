'use strict';
// Data
const account1 = {
    owner: 'Umarov Ikrom',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1113,
};
  
const account2 = {
    owner: 'Cristiano Ronaldo',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 7777,
};
  
const account3 = {
    owner: 'Muhammad Salah',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 1111,
};
  
const account4 = {
    owner: 'Eden Hazard',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 9999,
};
  
const accounts = [account1, account2, account3, account4];
  
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

// Dom manipulation of account1 object
const displayMovements = function(movements) {
    containerMovements.innerHTML = ''; // => means that  .textContent = 0

    movements.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__value">${mov} €</div>
            </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

// Displaying calculated balance to label
const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance} €`;
}

//calc display summary 
const calcDisplaySummary = function(acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes}€`;

    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)}€`;

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * 1) / 100)
        .filter(int => int >= 1)
        .reduce((mov, int) => mov + int, 0);
    labelSumInterest.textContent = `${interest}€`;
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
    displayMovements(acc.movements);
    
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

        //Update UI 
        updateUI(currentAccount);
    }
});


