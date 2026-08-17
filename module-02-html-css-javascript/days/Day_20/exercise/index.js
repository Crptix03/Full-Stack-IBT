const orderFood = new Promise((resolve, reject) => {
    const isRawMeat = true;
    if (isRawMeat) {
        resolve("Raw meat is available");
    } else {
        reject("Raw meat is not available");
    }
});

const orderDrink = new Promise((resolve, reject) => {
    const isColdDrink = true;
    if (isColdDrink) {
        resolve("Cold drink is available");
    } else {
        reject("Cold drink is not available");
    }
});

const Receipt = new Promise((resolve, reject) => {
    const receiptReady = false;
    if (receiptReady) {
        resolve("Receipt is available");
    } else {
        reject("Receipt is not available");
    }
});

orderFood
    .then((message) => {
        console.log("Order Confirmed " + message);
    })
    .catch((error) => {
        console.log("Order Rejected " + error);
    });

orderDrink
    .then((drinkOrder) => {
        console.log("Drink Order Confirmed " + drinkOrder);
    })
    .catch((error) => {
        console.log("Drink Order Rejected " + error);
    });

Receipt
    .then((receipt) => {
        console.log("Receipt generated: " + receipt);
    })
    .catch((error) => {
        console.log("Receipt Failed: " + error);
    });