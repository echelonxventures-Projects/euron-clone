import { NextResponse, type NextRequest } from "next/server";
import { listCourses } from "@/lib/queries";

/** Public JSON API: GET /api/courses?q=python&category=data */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? undefined;
  const category = req.nextUrl.searchParams.get("category") ?? undefined;
  const courses = await listCourses({ q, category });
  return NextResponse.json({ count: courses.length, courses });
}
