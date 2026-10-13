import { NextResponse } from "next/server";
import { getDishes } from "@/lib/dishes";

export async function GET() {
  const dishes = await getDishes();
  return NextResponse.json(dishes);
}