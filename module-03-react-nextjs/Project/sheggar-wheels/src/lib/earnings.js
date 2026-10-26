// Aggregates earnings by month and by car, for the current owner.

export function getEarningsBreakdown(cars, bookings, ownerId) {
  const ownerCars = cars.filter((c) => c.ownerId === ownerId);
  const ownerBookings = bookings.filter(
    (b) => b.ownerId === ownerId && ["completed", "reviewed"].includes(b.status)
  );

  // By month
  const byMonth = {};
  for (const b of ownerBookings) {
    const month = b.startDate.slice(0, 7); // YYYY-MM
    byMonth[month] = (byMonth[month] || 0) + b.subtotal;
  }
  const monthly = Object.entries(byMonth)
    .sort()
    .map(([month, revenue]) => ({ month, revenue }));

  // By car
  const byCar = ownerCars.map((car) => {
    const carBookings = ownerBookings.filter((b) => b.carId === car.id);
    const revenue = carBookings.reduce((s, b) => s + b.subtotal, 0);
    const days = carBookings.reduce((s, b) => s + b.days, 0);
    return {
      id: car.id,
      name: `${car.make} ${car.model}`,
      revenue,
      days,
      bookings: carBookings.length,
    };
  });

  const total = ownerBookings.reduce((s, b) => s + b.subtotal, 0);
  return { monthly, byCar, total, bookingCount: ownerBookings.length };
}