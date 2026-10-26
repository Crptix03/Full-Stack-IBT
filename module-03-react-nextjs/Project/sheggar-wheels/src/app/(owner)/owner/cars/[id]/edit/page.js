import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import EditCarForm from "@/components/EditCarForm";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Edit Car" };

export default async function EditCarPage({ params }) {
  const session = await getSession();
  if (!session) redirect("/signin?next=/owner/cars");

  const { id } = await params;
  const car = db.cars.find((c) => c.id === id);
  if (!car || car.ownerId !== session.userId) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/owner/cars" className="text-indigo-600 text-sm hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> My Cars
        </Link>
      </div>
      <div className="bg-white border border-neutral-200 rounded-2xl p-8">
        <h1 className="text-2xl font-black mb-1">Edit Car</h1>
        <p className="text-sm text-neutral-500 mb-6">Changes send the listing back to pending for re-approval.</p>
        <EditCarForm car={car} />
      </div>
    </div>
  );
}
