function creatLoyalty(earnRule = etb => Math.floor(etb / 10)) {
    let points = 0;
    return {
        earn(etb) {points += earnRule(etb);}, 
        redeem(p) {points = Math.max(0, points - p);},
        balance() {return points;},
    };
}
const card = creatLoyalty();
card.earn(250);
card.redeem(10);
console.log(card.balance());

const holiday = creatLoyalty(etb => Math.floor(etb / 10) * 2);