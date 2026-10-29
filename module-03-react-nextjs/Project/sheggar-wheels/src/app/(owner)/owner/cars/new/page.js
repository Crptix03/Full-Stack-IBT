"use client";

import Link from "next/link";
import { useActionState } from "react";
import { addCarAction } from "@/app/actions";
import PhotoUpload from "@/components/PhotoUpload";
import { ArrowLeft, Loader2 } from "lucide-react";

const NEIGHBOURHOODS = ["Bole","Kazanchis","Megenagna","Piassa","CMC","Old Airport","Saris","Gerji","Summit","Ayat","Lafto"];

export default function NewCarPage() {
  const [state, formAction, isPending] = useActionState(addCarAction, null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/owner/cars" className="text-indigo-600 text-sm hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> My Cars
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-8">
        <h1 className="text-2xl font-black mb-1">Add New Car</h1>
        <p className="text-sm text-neutral-500 mb-6">New cars are pending until an admin approves them.</p>

        <form action={formAction} className="space-y-4">
          {/* Photo upload */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-2">
              Car Photo
            </label>
            <PhotoUpload name="photo" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Make" name="make" placeholder="Toyota" required />
            <Field label="Model" name="model" placeholder="Corolla" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Year" name="year" type="number" defaultValue={2022} min={1990} max={2030} required />
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Transmission</label>
              <select name="transmission" defaultValue="automatic" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <Field label="Seats" name="seats" type="number" defaultValue={5} min={2} max={9} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Neighbourhood <span className="text-red-500">*</span></label>
              <select name="neighbourhood" defaultValue="Bole" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
                {NEIGHBOURHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <Field label="Price per day (ETB)" name="pricePerDay" type="number" defaultValue={2000} min={500} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Description</label>
            <textarea name="description" rows={3} placeholder="A short description…" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 resize-none" />
          </div>

          {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

          <button type="submit" disabled={isPending} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Submit for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder, required, defaultValue, min, max }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        min={min}
        max={max}
        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
}
