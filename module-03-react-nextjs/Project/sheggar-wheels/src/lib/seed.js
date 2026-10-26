// Seed data — the entire demo dataset.


const now = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const dayMs = 24 * 60 * 60 * 1000;
const daysFromNow = (n) => iso(new Date(now.getTime() + n * dayMs));

// ── Users ────────────────────────────────────────────
export const SEED_USERS = [
  {
    id: "u-admin", name: "Admin User", username: "admin", email: "admin@sheggar.et", phone: "+251911000001",
    password: "admin2026", roles: ["admin"], status: "active",
    createdAt: new Date(now.getTime() - 30 * dayMs).toISOString(),
  },
  {
    id: "u-owner-1", name: "Dawit Haile", username: "dawit", email: "dawit@sheggar.et", phone: "+251911000002",
    password: "dawit2026", roles: ["renter", "owner"], status: "active",
    createdAt: new Date(now.getTime() - 25 * dayMs).toISOString(),
  },
  {
    id: "u-owner-2", name: "Hanna Tesfaye", username: "hanna", email: "hanna@sheggar.et", phone: "+251911000003",
    password: "hanna2026", roles: ["renter", "owner"], status: "active",
    createdAt: new Date(now.getTime() - 20 * dayMs).toISOString(),
  },
  {
    id: "u-renter-1", name: "Yohannes Girma", username: "yohannes", email: "yohannes@sheggar.et", phone: "+251911000004",
    password: "yohannes2026", roles: ["renter"], status: "active",
    createdAt: new Date(now.getTime() - 15 * dayMs).toISOString(),
  },
];

// ── Cars ─────────────────────────────────────────────
export const SEED_CARS = [
  {
    id: "car-1", ownerId: "u-owner-1", make: "Toyota", model: "Corolla", year: 2022, transmission: "automatic", seats: 5,
    city: "Addis Ababa", neighbourhood: "Bole", latitude: 8.995, longitude: 38.7896, pricePerDay: 2500,
    photos: ["/cars/toyota-corolla.jpg"],
    description: "Well-maintained Corolla. Perfect for city driving and airport runs. Air conditioning, Bluetooth, and a full tank on pickup.",
    status: "approved", unavailableDates: [], createdAt: new Date(now.getTime() - 10 * dayMs).toISOString(),
  },
  {
    id: "car-2", ownerId: "u-owner-1", make: "Toyota", model: "RAV4", year: 2021, transmission: "automatic", seats: 5,
    city: "Addis Ababa", neighbourhood: "Kazanchis", latitude: 9.0186, longitude: 38.7643, pricePerDay: 4200,
    photos: ["/cars/toyota-rav4.jpg"],
    description: "Spacious SUV, ideal for weekend trips to Bishoftu or the Rift Valley. Roof rack, AWD, and a comfortable interior.",
    status: "approved", unavailableDates: [], createdAt: new Date(now.getTime() - 9 * dayMs).toISOString(),
  },
  {
    id: "car-3", ownerId: "u-owner-1", make: "Suzuki", model: "Swift", year: 2020, transmission: "manual", seats: 4,
    city: "Addis Ababa", neighbourhood: "Piassa", latitude: 9.035, longitude: 38.752, pricePerDay: 1800,
    photos: ["/cars/suzuki-swift.jpg"],
    description: "Compact, fuel-efficient hatchback. Great for navigating Addis traffic. Manual transmission, easy to drive.",
    status: "approved", unavailableDates: [], createdAt: new Date(now.getTime() - 8 * dayMs).toISOString(),
  },
  {
    id: "car-4", ownerId: "u-owner-2", make: "Hyundai", model: "Tucson", year: 2023, transmission: "automatic", seats: 5,
    city: "Addis Ababa", neighbourhood: "Megenagna", latitude: 9.022, longitude: 38.8022, pricePerDay: 3800,
    photos: ["/cars/hyundai-tucson.jpg"],
    description: "New Tucson, still under warranty. Modern interior, backup camera, and Apple CarPlay. Perfect for business trips.",
    status: "approved", unavailableDates: [], createdAt: new Date(now.getTime() - 7 * dayMs).toISOString(),
  },
  {
    id: "car-5", ownerId: "u-owner-2", make: "Nissan", model: "X-Trail", year: 2021, transmission: "automatic", seats: 7,
    city: "Addis Ababa", neighbourhood: "CMC", latitude: 9.019, longitude: 38.829, pricePerDay: 4500,
    photos: ["/cars/nissan-x-trail.jpg"],
    description: "7-seater family SUV. Ideal for groups and family trips. Third row folds flat for extra luggage space.",
    status: "approved", unavailableDates: [], createdAt: new Date(now.getTime() - 6 * dayMs).toISOString(),
  },
  {
    id: "car-6", ownerId: "u-owner-2", make: "Kia", model: "Picanto", year: 2019, transmission: "manual", seats: 4,
    city: "Addis Ababa", neighbourhood: "Old Airport", latitude: 9.001, longitude: 38.74, pricePerDay: 1500,
    photos: ["/cars/kia-picanto.jpg"],
    description: "Cheapest option on the platform. Small, fuel-efficient, easy to park. Best for solo city trips.",
    status: "approved", unavailableDates: [], createdAt: new Date(now.getTime() - 5 * dayMs).toISOString(),
  },
  {
    id: "car-7", ownerId: "u-owner-2", make: "Toyota", model: "Land Cruiser", year: 2020, transmission: "automatic", seats: 7,
    city: "Addis Ababa", neighbourhood: "Saris", latitude: 8.975, longitude: 38.758, pricePerDay: 6500,
    photos: ["/cars/toyota-land-cruiser.jpg"],
    description: "The ultimate road-trip vehicle. Rugged, spacious, and comfortable for long journeys outside Addis.",
    status: "approved", unavailableDates: [], createdAt: new Date(now.getTime() - 4 * dayMs).toISOString(),
  },
  {
    id: "car-8", ownerId: "u-owner-1", make: "Volkswagen", model: "Polo", year: 2020, transmission: "automatic", seats: 5,
    city: "Addis Ababa", neighbourhood: "Gerji", latitude: 9.017, longitude: 38.812, pricePerDay: 2200,
    photos: ["/cars/volkswagen-polo.jpg"], photoPosition: "center 80%",
    description: "Reliable European hatchback. Good fuel economy, stable at highway speeds. Comfortable for 4 adults.",
    status: "approved", unavailableDates: [], createdAt: new Date(now.getTime() - 3 * dayMs).toISOString(),
  },
  {
    id: "car-9", ownerId: "u-owner-2", make: "Mazda", model: "CX-5", year: 2022, transmission: "automatic", seats: 5,
    city: "Addis Ababa", neighbourhood: "Summit", latitude: 9.04, longitude: 38.842, pricePerDay: 3500,
    photos: ["/cars/mazda-cx-5.jpg"], photoPosition: "center 80%",
    description: "Premium compact SUV. Leather seats, Bose sound, and a smooth ride. Great for special occasions.",
    status: "approved", unavailableDates: [], createdAt: new Date(now.getTime() - 2 * dayMs).toISOString(),
  },
  {
    id: "car-10", ownerId: "u-owner-1", make: "Toyota", model: "Vitz", year: 2018, transmission: "automatic", seats: 5,
    city: "Addis Ababa", neighbourhood: "Ayat", latitude: 9.054, longitude: 38.883, pricePerDay: 1200,
    photos: ["/cars/toyota-vitz.jpg"],
    description: "Very affordable, very reliable. The Vitz is a favourite for city driving. Automatic, low fuel consumption.",
    status: "pending", unavailableDates: [], createdAt: new Date(now.getTime() - 1 * dayMs).toISOString(),
  },
  {
    id: "car-11", ownerId: "u-owner-2", make: "Honda", model: "CR-V", year: 2021, transmission: "automatic", seats: 5,
    city: "Addis Ababa", neighbourhood: "Lafto", latitude: 8.983, longitude: 38.732, pricePerDay: 4000,
    photos: ["/cars/honda-cr-v.jpg"],
    description: "Comfortable mid-size SUV. Reliable Honda engine, plenty of cargo space. Good for both city and country.",
    status: "pending", unavailableDates: [], createdAt: new Date(now.getTime() - 0.5 * dayMs).toISOString(),
  },
  {
    id: "car-12", ownerId: "u-owner-1", make: "Ford", model: "Focus", year: 2017, transmission: "manual", seats: 5,
    city: "Addis Ababa", neighbourhood: "Bole", latitude: 8.995, longitude: 38.7896, pricePerDay: 1600,
    photos: ["/cars/ford-focus.jpg"],
    description: "Older model but runs well. Budget-friendly, good for daily commuting.",
    status: "rejected", unavailableDates: [], createdAt: new Date(now.getTime() - 3 * dayMs).toISOString(),
  },
];

// ── Bookings ─────────────────────────────────────────
export const SEED_BOOKINGS = [
  { id: "bk-1", carId: "car-1", renterId: "u-renter-1", ownerId: "u-owner-1", startDate: daysFromNow(-8), endDate: daysFromNow(-6), days: 2, pricePerDay: 2500, subtotal: 5000, fee: 250, total: 5250, paymentStatus: "paid", status: "completed", createdAt: new Date(now.getTime() - 10 * dayMs).toISOString(), updatedAt: new Date(now.getTime() - 6 * dayMs).toISOString() },
  { id: "bk-2", carId: "car-2", renterId: "u-renter-1", ownerId: "u-owner-1", startDate: daysFromNow(7), endDate: daysFromNow(10), days: 3, pricePerDay: 4200, subtotal: 12600, fee: 630, total: 13230, paymentStatus: "paid", status: "confirmed", createdAt: new Date(now.getTime() - 2 * dayMs).toISOString(), updatedAt: new Date(now.getTime() - 2 * dayMs).toISOString() },
  { id: "bk-3", carId: "car-4", renterId: "u-renter-1", ownerId: "u-owner-2", startDate: daysFromNow(-15), endDate: daysFromNow(-12), days: 3, pricePerDay: 3800, subtotal: 11400, fee: 570, total: 11970, paymentStatus: "paid", status: "completed", createdAt: new Date(now.getTime() - 20 * dayMs).toISOString(), updatedAt: new Date(now.getTime() - 12 * dayMs).toISOString() },
  { id: "bk-4", carId: "car-3", renterId: "u-renter-1", ownerId: "u-owner-1", startDate: daysFromNow(-30), endDate: daysFromNow(-28), days: 2, pricePerDay: 1800, subtotal: 3600, fee: 180, total: 3780, paymentStatus: "paid", status: "completed", createdAt: new Date(now.getTime() - 32 * dayMs).toISOString(), updatedAt: new Date(now.getTime() - 28 * dayMs).toISOString() },
  { id: "bk-5", carId: "car-5", renterId: "u-renter-1", ownerId: "u-owner-2", startDate: daysFromNow(-5), endDate: daysFromNow(-3), days: 2, pricePerDay: 4500, subtotal: 9000, fee: 450, total: 9450, paymentStatus: "paid", status: "cancelled", createdAt: new Date(now.getTime() - 8 * dayMs).toISOString(), updatedAt: new Date(now.getTime() - 6 * dayMs).toISOString() },
  { id: "bk-6", carId: "car-6", renterId: "u-renter-1", ownerId: "u-owner-2", startDate: daysFromNow(0), endDate: daysFromNow(2), days: 2, pricePerDay: 1500, subtotal: 3000, fee: 150, total: 3150, paymentStatus: "paid", status: "in_progress", createdAt: new Date(now.getTime() - 3 * dayMs).toISOString(), updatedAt: new Date(now.getTime() - 0.5 * dayMs).toISOString() },
];

// ── Reviews ──────────────────────────────────────────
export const SEED_REVIEWS = [
  { id: "rv-1", bookingId: "bk-3", carId: "car-4", renterId: "u-renter-1", ownerId: "u-owner-2", rating: 5, comment: "Excellent car. Very clean, smooth drive, and Hanna was extremely helpful. Would rent again.", ownerReply: "Thank you, Yohannes! Glad you enjoyed it.", createdAt: new Date(now.getTime() - 10 * dayMs).toISOString() },
  { id: "rv-2", bookingId: "bk-4", carId: "car-3", renterId: "u-renter-1", ownerId: "u-owner-1", rating: 4, comment: "Good value for money. The car was a bit older than expected but ran well.", ownerReply: null, createdAt: new Date(now.getTime() - 25 * dayMs).toISOString() },
];

