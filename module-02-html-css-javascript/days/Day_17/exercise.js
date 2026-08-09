const vat=(price, rate=0.15) => {
    return price + (price * rate);
}
function makeCounter () {
    let count = 0;
    return () => ++count;
}
const next = makeCounter();
next(); //1
next(); //2
// this will always return always private variable count and will not be able to access it from outside the function.//
const discountBy = (rate) => {
    return  price * rate;
    console.log(`Discount: ${rate}`);
}
const memberPrice = (price=1000) => {
    return price * 0.10;
    console.log(`Member Price: ${member}`);
}
const salePrice = (price=1000) => {
    return price * 0.30;
    console.log(`Sale Price: ${sale}`);
}
function applyToPrice(price, fn) {return fn(price);}
const addVat = p => p + (p * 0.15);
applyToPrice(1000, addVat);
console.log(`Price with VAT: ${applyToPrice(1000, addVat)}`);

const ethiopianCities = ["Addis Ababa", "Dire Dawa", "Nazret", "Jimma"];
    ethiopianCities.forEach((city, index) => {
    console.log(`${index + 1}. ${city}`);
});