import { NextResponse } from "next/server";
import { dishes } from "@/lib/dishes";

export async function GET() {
  return NextResponse.json(dishes);
}