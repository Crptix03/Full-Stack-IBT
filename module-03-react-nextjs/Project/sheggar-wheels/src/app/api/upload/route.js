// Local photo upload route.
// Saves the uploaded file to public/cars/ and returns the public path.
//
// ⚠️ LOCAL ONLY — public/ is writable in dev but read-only on Vercel.
// When deploying, replace this with Vercel Blob (see FUTURE.md).

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { cookies } from "next/headers";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request) {
  // Must be signed in
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG and WebP images are allowed" },
      { status: 400 }
    );
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File must be under 5 MB" },
      { status: 400 }
    );
  }

  // Build a unique filename: {userId}-{timestamp}{ext}
  const ext = extname(file.name) || ".jpg";
  const filename = `${userId}-${Date.now()}${ext}`;

  // Save to public/cars/
  const dir  = join(process.cwd(), "public", "cars");
  const path = join(dir, filename);

  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path, buffer);

  return NextResponse.json({ path: `/cars/${filename}` });
}
