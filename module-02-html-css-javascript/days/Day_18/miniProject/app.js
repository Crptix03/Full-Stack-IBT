import { transactions } from "./transactions.js";
import { totalByType, debitTransaction, creditTransaction, receipts, upDatedReceipts, correctedTransaction } from "./report.js";
console.log(`Debits: ${totalByType(transactions, "debit")} ETB`);
console.log("Debits Transactions:", debitTransaction)
console.log(`Credits: ${totalByType(transactions, "credit")} ETB`)
console.log("Credits Transactions:", creditTransaction)
console.log("original Receipts", receipts)
console.log("Updated Recipts", upDatedReceipts)
