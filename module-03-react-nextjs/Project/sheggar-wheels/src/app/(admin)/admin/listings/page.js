import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import AdminCarActions from "@/components/AdminCarActions";

export const metadata = { title: "Admin — Listings" };

export default async function AdminListingsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/unauthorized");

  const allCars = db.cars.sort((a, b) => {
    const order = { pending: 0, approved: 1, rejected: 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  });

  const ownerOf = (id) => db.users.find((u) => u.id === id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-1">Car Listings</h1>
      <p className="text-neutral-500 text-sm mb-8">
        {db.cars.filter((c) => c.status === "pending").length} pending · {db.cars.filter((c) => c.status === "approved").length} approved
      </p>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <ul className="divide-y divide-neutral-100">
          {allCars.map((car) => {
            const owner = ownerOf(car.ownerId);
            return (
              <li key={car.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                    <Image src={car.photos[0]} alt={`${car.make} ${car.model}`} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-neutral-900">{car.make} {car.model} ({car.year})</p>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        car.status === "approved" ? "bg-green-100 text-green-800"
                        : car.status === "pending" ? "bg-amber-100 text-amber-800"
                        : "bg-neutral-100 text-neutral-600"
                      }`}>{car.status}</span>
                    </div>
                    <p className="text-xs text-neutral-500">{car.neighbourhood} · {etb.format(car.pricePerDay)}/day</p>
                    <p className="text-xs text-neutral-500">Owner: {owner?.name || "—"}</p>
                  </div>
                </div>
                <div className="mt-3 pl-28">
                  <AdminCarActions carId={car.id} currentStatus={car.status} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
