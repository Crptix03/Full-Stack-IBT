import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import DeleteCarButton from "@/components/DeleteCarButton";
import { Plus, Edit, Car } from "lucide-react";

export const metadata = { title: "My Cars" };

export default async function OwnerCarsPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/owner/cars");

  const cars = db.cars
    .filter((c) => c.ownerId === session.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">My Cars</h1>
          <p className="text-neutral-500 text-sm">{cars.length} car{cars.length === 1 ? "" : "s"} listed</p>
        </div>
        <Link href="/owner/cars/new" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Car
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
          <Car className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600 mb-4">You haven&apos;t listed any cars yet.</p>
          <Link href="/owner/cars/new" className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl">Add your first car</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              <div className="relative h-40 bg-neutral-100">
                <Image src={car.photos[0]} alt={`${car.make} ${car.model}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" style={{ objectPosition: car.photoPosition || "center" }} />
                <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  car.status === "approved" ? "bg-green-100 text-green-800"
                  : car.status === "pending" ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
                }`}>{car.status.toUpperCase()}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{car.make} {car.model}</h3>
                <p className="text-xs text-neutral-500 mb-3">{car.year} · {car.neighbourhood} · {etb.format(car.pricePerDay)}/day</p>
                <div className="flex gap-2">
                  <Link href={`/owner/cars/${car.id}/edit`} className="flex-1 py-2 bg-indigo-600 text-white text-center text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <DeleteCarButton carId={car.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
