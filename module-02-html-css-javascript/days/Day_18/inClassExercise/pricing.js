export const withVat = (amount) =>{
    const rate = 0.15;
    return amount + (amount * rate);
}

export const format = (amount) => {
    return `${amount.toFixed(2)} ETB`
}
export const calculatePrice = (quantity, price) => {
    return quantity * price;
}