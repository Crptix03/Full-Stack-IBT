import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <p>Checkout form will go here.</p>
      <Link href="/">← Home</Link>
    </div>
  );
}
