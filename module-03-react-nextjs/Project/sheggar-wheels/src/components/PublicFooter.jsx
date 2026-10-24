import Link from "next/link";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-indigo-600 mb-3"
            >
              <Car className="w-5 h-5" />
              Sheggar Wheels
            </Link>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Peer-to-peer car rental in Addis Ababa. Rent directly from local
              owners.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Bole, Addis Ababa
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                hello@sheggar.et
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-600" />
                +251 911 000 000
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-indigo-600 transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-indigo-600 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Note */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">About</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              This is a demo project. No real cars, no real payments, no real
              bookings.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-200 text-center text-xs text-neutral-500">
          © 2026 Sheggar Wheels. Peer-to-peer car rental in Addis Ababa.
        </div>
      </div>
    </footer>
  );
}