"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateCarAction } from "@/app/actions";
import PhotoUpload from "@/components/PhotoUpload";
import { Loader2 } from "lucide-react";

const NEIGHBOURHOODS = ["Bole","Kazanchis","Megenagna","Piassa","CMC","Old Airport","Saris","Gerji","Summit","Ayat","Lafto"];

export default function EditCarForm({ car }) {
  const [state, formAction, isPending] = useActionState(updateCarAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="carId" value={car.id} />

      {/* Photo upload — pre-filled with existing photo */}
      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-2">
          Car Photo
        </label>
        <PhotoUpload name="photo" defaultValue={car.photos[0]} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Make" name="make" defaultValue={car.make} required />
        <Field label="Model" name="model" defaultValue={car.model} required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Year" name="year" type="number" defaultValue={car.year} min={1990} max={2030} required />
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Transmission</label>
          <select name="transmission" defaultValue={car.transmission} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <Field label="Seats" name="seats" type="number" defaultValue={car.seats} min={2} max={9} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Neighbourhood</label>
          <select name="neighbourhood" defaultValue={car.neighbourhood} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
            {NEIGHBOURHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <Field label="Price per day (ETB)" name="pricePerDay" type="number" defaultValue={car.pricePerDay} min={500} required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1">Description</label>
        <textarea name="description" rows={3} defaultValue={car.description} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 resize-none" />
      </div>

      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <div className="flex gap-3">
        <Link href="/owner/cars" className="px-5 py-2.5 border border-neutral-200 rounded-xl text-neutral-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={isPending} className="flex-1 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
          {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", defaultValue, required, min, max }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        min={min}
        max={max}
        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
}
