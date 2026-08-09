const subTotal = (...prices) =>
    prices.reduce((sum, p) => sum + p, 0);
const discountBy = rate => 
    n => n * (1 - rate);
const withVat = n => n * 1.15;
const toETB = n => `${n.toFixed(2)} ETB`;
function makeReceiptMaker () {
    let orderNo = 0;
    const memberOf = discountBy(0.10);
    return function (...items) {
        orderNo++;
        const gross = subTotal(...items);
        const net = withVat(memberOf(gross));
        return `#${orderNo}: ${toETB(net)}`;
    };
}
const receipt = makeReceiptMaker();
console.log(receipt(1000, 2000, 3000));
console.log(receipt(400, 500, 600));