const dishes = [
    {name: "tibs", price: 1500},
    {name: "dorowet", price: 2000},
    {name: "shiro", price: 500},
];
const result = dishes
    .filter(d => d.price < 1000)
    .map(d => d.price *1.15)
    .reduce((sum, p) => sum + p,0)
console.log(result)

const customer = {
    name: "Abebe Melaku",
    city: "Addis Abeba",
    balance: 45000,
};
for (const key of Object.keys(customer)) {
    console.log(key);
}
for (const [key, value] of
        Object.entries(customer)) {
    console.log(`${key}: ${value}`);
}

const user = {name: "Bekele Abebe", city: "DireDewa"};
const {name, city} = user
console.log(name);
console.log(city);
function greet({name}){
    console.log(`Hello, ${name}`)
}
greet(user)

const description = {name: "Abel Melaku", city: "Bole"}
const updated = { ...description, city: "Kazanchis" };
console.log(updated)