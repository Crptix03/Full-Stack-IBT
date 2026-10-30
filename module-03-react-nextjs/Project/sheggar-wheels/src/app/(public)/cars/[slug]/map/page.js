import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { findCarBySlug, toCarSlug } from "@/lib/slug";
import CarMapClient from "@/components/CarMapClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = findCarBySlug(db.cars, slug);
  if (!car) return { title: "Car not found" };
  return { title: `Map — ${car.make} ${car.model}` };
}

export default async function CarMapPage({ params }) {
  const { slug } = await params;
  const car = findCarBySlug(db.cars, slug);
  if (!car || car.status !== "approved") notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href={`/cars/${slug}`} className="text-indigo-600 text-sm hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to {car.make} {car.model}
        </Link>
      </div>
      <h1 className="text-2xl font-black mb-2">{car.make} {car.model} — Location</h1>
      <p className="text-neutral-500 text-sm mb-6">{car.neighbourhood}, {car.city}</p>
      <CarMapClient lat={car.latitude} lng={car.longitude} label={`${car.make} ${car.model}`} />
    </div>
  );
}
