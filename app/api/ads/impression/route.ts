import { NextRequest, NextResponse } from "next/server";
import { recordAdImpression } from "@/lib/events";

export async function GET(request: NextRequest) {
  const campaignId = request.nextUrl.searchParams.get("campaignId");
  const slug = request.nextUrl.searchParams.get("slug");
  const visitorId = request.cookies.get("adl_vid")?.value || request.headers.get("x-vercel-id");
  await recordAdImpression({ campaignId, slug, visitorId });
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
