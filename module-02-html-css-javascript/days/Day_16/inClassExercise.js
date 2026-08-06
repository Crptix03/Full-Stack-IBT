const bill = "100";
const partySize = 3;
const paymentMethod = "Telebirr"

const correctBill = Number(bill);
const tipBill = correctBill >= 300 ? 0.10 : 0.05;
const tip = correctBill * tipBill

console.log(`The bill is :${correctBill}`)
console.log(`The party size :${partySize}`)
console.log(`the percentage method is ${tipBill}`)
console.log(`The tip :${tip}`)


let serviceFee;
switch(paymentMethod){
    case "Telebirr":
        serviceFee  = 5;
    break;
    case "CBE BIRR":
        serviceFee = 10;
    break
    default:
        serviceFee = 0;
}
const totalBill = correctBill + tip + serviceFee
const totalPerPerson = totalBill / partySize
console.log(`The payment method is ${paymentMethod}`)
console.log(`the servie fee is: ${serviceFee}`)
console.log(`The total amount including tip is: ${totalBill}`)
console.log(`The total per-person amount is: ${totalPerPerson}`)