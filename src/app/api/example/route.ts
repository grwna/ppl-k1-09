/**
 * API ROUTE TEMPLATE
 * Use for external requests (e.g. mobile apps) or programmatic access.
 */

import { NextResponse } from "next/server";
import { ExampleService } from "@/services/example.service";

export async function GET() {
  console.log("API: Handling GET request...");
  const data = await ExampleService.findAll();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log("API: Handling POST request with body:", body);
  const result = await ExampleService.create(body);
  return NextResponse.json({ success: true, result }, { status: 201 });
}
