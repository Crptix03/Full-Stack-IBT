import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/signin?next=/checkout");

  const params = await searchParams;
  const carId = params.car;
  if (!carId) redirect("/cars");

  const car = db.cars.find((c) => c.id === carId && c.status === "approved");
  if (!car) notFound();

  if (car.ownerId === session.userId) redirect(`/cars/${carId}`);

  const bookedRanges = db.bookings
    .filter((b) => b.carId === carId && ["confirmed", "in_progress"].includes(b.status))
    .map((b) => ({ start: b.startDate, end: b.endDate }));

  return <CheckoutForm car={car} bookedRanges={bookedRanges} />;
}
