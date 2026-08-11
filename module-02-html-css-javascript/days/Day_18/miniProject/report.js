import {transactions} from './transactions.js'
export const totalByType = (txns, type) =>
txns.filter(t => t.type === type)
.reduce((sum, { amount }) => sum + amount, 0);
export const debitTransaction = transactions.filter(t => t.type ==="debit");
export const creditTransaction = transactions.filter(t => t.type ==="credit");
export const correctedTransaction = transactions.map(
    t => t.id === 3 ? {...t, amount: 200}: t
);

export const receipts = transactions.map(
    ({ customer, amount }) => `Receipt: ${customer} paid ${amount} ETB`
);
export const upDatedReceipts = correctedTransaction.map(
    ({ customer, amount }) => `Receipt: ${customer} paid ${amount} ETB`
);