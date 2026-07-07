import { NextRequest, NextResponse } from "next/server";
import { isAdminSecret } from "@/lib/authz";
import { getAdminStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminSecret(request.headers.get("x-admin-secret"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getAdminStats();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" }
  });
}
