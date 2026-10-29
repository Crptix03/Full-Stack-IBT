import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import AdminUserActions from "@/components/AdminUserActions";
import { Mail, Phone } from "lucide-react";

export const metadata = { title: "Admin — Users" };

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/unauthorized");

  const users = [...db.users].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-1">Users</h1>
      <p className="text-neutral-500 text-sm mb-8">{users.length} total · {users.filter((u) => u.status === "active").length} active</p>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <ul className="divide-y divide-neutral-100">
          {users.map((user) => (
            <li key={user.id} className="p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-neutral-900">{user.name}</p>
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-semibold ${
                    user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>{user.status}</span>
                  {user.roles.map((r) => (
                    <span key={r} className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">{r}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</span>
                  {user.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{user.phone}</span>}
                </div>
              </div>
              <AdminUserActions userId={user.id} currentStatus={user.status} isCurrentUser={user.id === session.userId} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
