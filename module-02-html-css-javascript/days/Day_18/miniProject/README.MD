# Mini Project

## What the project does

This project tracks a small set of customer transactions and generates summary reports. It calculates the total debit and credit amounts, separates debit and credit transaction lists, applies a corrected transaction update, and creates receipt strings for both original and updated data.

## transactions.js

`transactions.js` contains the source transaction data exported as a constant array. Each transaction has an `id`, `customer`, `amount`, and `type` field.

## report.js

`report.js` defines reusable reporting functions and computed values:

- `totalByType` calculates the sum for a transaction type using `filter` and `reduce`
- `debitTransaction` and `creditTransaction` separate transactions by type using `filter`
- `correctedTransaction` creates an updated array with a corrected amount using `map` and object spread
- `receipts` and `upDatedReceipts` generate receipt strings using `map`

## app.js

`app.js` imports transaction data and report utilities, then logs the results to the console. It shows total debit and credit amounts, lists of debit and credit transactions, and both original and updated receipt outputs.

## JavaScript concepts used

- ES module imports and exports
- Arrow functions
- Array methods: `filter`, `reduce`, and `map`
- Template literals for formatted output
- Object spread syntax for creating updated transaction objects

## The output looks like

Debits: 430 ETB
Debits Transactions: [
{ id: 1, customer: 'Almaz', amount: 250, type: 'debit' },
{ id: 3, customer: 'Tigist', amount: 180, type: 'debit' }
]
Credits: 600 ETB
Credits Transactions: [ { id: 2, customer: 'Dawit', amount: 600, type: 'credit' } ]
original Receipts [
'Receipt: Almaz paid 250 ETB',
'Receipt: Dawit paid 600 ETB',
'Receipt: Tigist paid 180 ETB'
]
Updated Recipts [
'Receipt: Almaz paid 250 ETB',
'Receipt: Dawit paid 600 ETB',
'Receipt: Tigist paid 200 ETB'
]
