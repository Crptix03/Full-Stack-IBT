export async function placeOrder(order) {
  await new Promise(resolve => setTimeout(resolve, 900));

  const shouldFail = Math.random() < 0.33;

  if (shouldFail) {
    const error = new Error("Order could not be placed");
    error.status = 422;
    error.fieldErrors = {
      phone: "This TeleBirr number could not be verified. Please check it and try again.",
    };
    throw error;
  }

  return { orderId: `ORD-${Date.now()}`, ...order };
}