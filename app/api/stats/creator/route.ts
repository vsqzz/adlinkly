import { NextResponse } from "next/server";
import { getCreatorDashboardData } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getCreatorDashboardData();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" }
  });
}
