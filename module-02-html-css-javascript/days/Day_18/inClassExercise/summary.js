import { withVat, format, calculatePrice } from "./pricing.js";
import order from "./orders.js";
const total = order.map (o => {
    return  o.orderItem.reduce((sum, {price, quantity}) => {
        return sum + calculatePrice(quantity, price);
    },0);
 });
const orderWithTotal = order.map((o, i) =>{
    return {...o, total: total[i] };
});
const bigOrder = orderWithTotal.filter(o => o.total > 500)
orderWithTotal.forEach(o => {
  console.log(`Order ${o.orderId} (${o.customerName}): ${format(withVat(o.total))}`);
});

console.log("\nOrders over 500 ETB:");
bigOrder.forEach(o => {
  console.log(`- Order ${o.orderId} (${o.customerName}): ${format(withVat(o.total))}`);
});

const grandTotal = orderWithTotal.reduce((sum, o) => sum + withVat(o.total), 0);
console.log(`\nGrand total (with VAT): ${format(grandTotal)}`);