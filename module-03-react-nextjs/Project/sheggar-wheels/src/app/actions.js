"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { findUserByUsername, findUserById } from "@/lib/users";
import { createSession, destroySession, getSession } from "@/lib/session";
import { createRenterAccount } from "@/lib/auth";
import {
  createBooking,
  cancelBooking,
  confirmBooking,
  declineBooking,
  startRental,
  completeRental,
  submitReview,
  isCarAvailable,
} from "@/lib/bookings";
import { replyToReview } from "@/lib/reviews";
import { resolveDispute } from "@/lib/disputes";
import { db } from "@/lib/db";
import { newId } from "@/lib/id";

// ── Auth ─────────────────────────────────────────────

export async function signIn(prevState, formData) {
  const username = (formData.get("username") || "").trim();
  const password = formData.get("password") || "";
  const next = formData.get("next") || "/";

  if (!username || !password) {
    return { error: "Please fill in both fields." };
  }

  const user = findUserByUsername(username);

  // ⚠️ Plaintext comparison — demo only!
  if (!user || user.password !== password) {
    return { error: "Incorrect username or password." };
  }
  if (user.status !== "active") {
    return { error: "This account has been suspended." };
  }

  // Store the highest-privilege role so the proxy grants correct access.
  // Priority: admin > owner > renter
  const roleToStore = user.roles.includes("admin")
    ? "admin"
    : user.roles.includes("owner")
    ? "owner"
    : "renter";

  await createSession(user.id, roleToStore);

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  redirect(safeNext);
}

export async function signOut() {
  await destroySession();
  revalidatePath("/");
  redirect("/");
}

export async function signUp(prevState, formData) {
  const name = (formData.get("name") || "").trim();
  const email = (formData.get("email") || "").trim();
  const phone = (formData.get("phone") || "").trim();
  const password = formData.get("password") || "";

  const result = createRenterAccount({ name, email, phone, password });
  if (result.error) return { error: result.error };

  // Auto sign-in after registration
  await createSession(result.user.id, "renter");
  redirect("/dashboard");
}

// ── Booking: Renter ──────────────────────────────────

export async function placeBooking(prevState, formData) {
  const session = await getSession();
  if (!session) redirect("/signin?next=/cars");

  const carId = formData.get("carId");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");

  if (!carId || !startDate || !endDate) {
    return { error: "Missing required fields." };
  }
  if (startDate >= endDate) {
    return { error: "End date must be after start date." };
  }

  const result = createBooking({ carId, startDate, endDate, renterId: session.userId });
  if (result.error) return { error: result.error };

  redirect(`/bookings/${result.booking.id}`);
}

export async function cancelBookingAction(bookingId) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const result = cancelBooking(bookingId, session.userId);
  if (result.error) return { error: result.error };

  revalidatePath("/bookings");
  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function submitReviewAction(bookingId, rating, comment) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const result = submitReview(bookingId, rating, comment, session.userId);
  if (result.error) return { error: result.error };

  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/bookings");
  return { success: true };
}

// ── Booking: Owner ───────────────────────────────────

export async function confirmBookingAction(bookingId) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const result = confirmBooking(bookingId, session.userId);
  if (result.error) return { error: result.error };

  revalidatePath("/owner");
  revalidatePath("/owner/bookings");
  return { success: true };
}

export async function declineBookingAction(bookingId) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const result = declineBooking(bookingId, session.userId);
  if (result.error) return { error: result.error };

  revalidatePath("/owner");
  revalidatePath("/owner/bookings");
  return { success: true };
}

export async function startRentalAction(bookingId) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const result = startRental(bookingId, session.userId);
  if (result.error) return { error: result.error };

  revalidatePath("/owner/bookings");
  return { success: true };
}

export async function completeRentalAction(bookingId) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const result = completeRental(bookingId, session.userId);
  if (result.error) return { error: result.error };

  revalidatePath("/owner/bookings");
  return { success: true };
}

export async function replyToReviewAction(reviewId, reply) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const result = replyToReview(reviewId, reply, session.userId);
  if (result.error) return { error: result.error };

  revalidatePath("/owner/reviews");
  return { success: true };
}

// ── Cars: Owner ──────────────────────────────────────

export async function addCarAction(prevState, formData) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const user = findUserById(session.userId);
  if (!user?.roles?.includes("owner")) return { error: "Not an owner" };

  const make = (formData.get("make") || "").trim();
  const model = (formData.get("model") || "").trim();
  const year = parseInt(formData.get("year") || "0", 10);
  const transmission = formData.get("transmission") || "automatic";
  const seats = parseInt(formData.get("seats") || "5", 10);
  const neighbourhood = (formData.get("neighbourhood") || "").trim();
  const pricePerDay = parseInt(formData.get("pricePerDay") || "0", 10);
  const description = (formData.get("description") || "").trim();

  if (!make || !model || !year || !neighbourhood || !pricePerDay) {
    return { error: "Please fill in all required fields." };
  }

  const car = {
    id: newId("car"),
    ownerId: session.userId,
    make, model, year, transmission, seats,
    city: "Addis Ababa",
    neighbourhood,
    pricePerDay,
    photos: ["/cars/placeholder.jpg"],
    description,
    status: "pending",
    unavailableDates: [],
    createdAt: new Date().toISOString(),
  };

  db.cars.push(car);
  revalidatePath("/owner/cars");
  redirect("/owner/cars");
}

export async function updateCarAction(prevState, formData) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const carId = formData.get("carId");
  const idx = db.cars.findIndex((c) => c.id === carId);
  if (idx === -1) return { error: "Car not found" };
  if (db.cars[idx].ownerId !== session.userId) return { error: "Not yours" };

  db.cars[idx] = {
    ...db.cars[idx],
    make: (formData.get("make") || db.cars[idx].make).trim(),
    model: (formData.get("model") || db.cars[idx].model).trim(),
    year: parseInt(formData.get("year") || db.cars[idx].year, 10),
    transmission: formData.get("transmission") || db.cars[idx].transmission,
    seats: parseInt(formData.get("seats") || db.cars[idx].seats, 10),
    neighbourhood: (formData.get("neighbourhood") || db.cars[idx].neighbourhood).trim(),
    pricePerDay: parseInt(formData.get("pricePerDay") || db.cars[idx].pricePerDay, 10),
    description: (formData.get("description") || db.cars[idx].description).trim(),
  };

  revalidatePath("/owner/cars");
  revalidatePath(`/cars/${carId}`);
  redirect("/owner/cars");
}

export async function deleteCarAction(carId) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const idx = db.cars.findIndex((c) => c.id === carId);
  if (idx === -1) return { error: "Car not found" };
  if (db.cars[idx].ownerId !== session.userId) return { error: "Not yours" };

  db.cars.splice(idx, 1);
  revalidatePath("/owner/cars");
  return { success: true };
}

// ── Admin ────────────────────────────────────────────

export async function approveCarAction(carId) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Admin only" };

  const idx = db.cars.findIndex((c) => c.id === carId);
  if (idx === -1) return { error: "Car not found" };

  db.cars[idx] = { ...db.cars[idx], status: "approved" };
  revalidatePath("/admin/listings");
  revalidatePath("/cars");
  return { success: true };
}

export async function rejectCarAction(carId) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Admin only" };

  const idx = db.cars.findIndex((c) => c.id === carId);
  if (idx === -1) return { error: "Car not found" };

  db.cars[idx] = { ...db.cars[idx], status: "rejected" };
  revalidatePath("/admin/listings");
  return { success: true };
}

export async function suspendUserAction(userId) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Admin only" };

  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) return { error: "User not found" };

  db.users[idx] = { ...db.users[idx], status: "suspended" };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function activateUserAction(userId) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Admin only" };

  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) return { error: "User not found" };

  db.users[idx] = { ...db.users[idx], status: "active" };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function resolveDisputeAction(disputeId, notes) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const result = resolveDispute(disputeId, notes, session.userId);
  if (result.error) return { error: result.error };

  revalidatePath("/admin/disputes");
  return { success: true };
}

export async function openDisputeAction(bookingId, reason, description) {
  const session = await getSession();
  if (!session) return { error: "Not signed in" };

  const { openDispute } = await import("@/lib/disputes");
  const result = openDispute(bookingId, reason, description, session.userId);
  if (result.error) return { error: result.error };

  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/admin/disputes");
  return { success: true };
}
