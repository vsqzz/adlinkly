import { NextRequest, NextResponse } from "next/server";
import { recordSponsorClick } from "@/lib/events";

export async function GET(request: NextRequest) {
  const campaignId = request.nextUrl.searchParams.get("campaignId");
  const slug = request.nextUrl.searchParams.get("slug");
  const visitorId = request.cookies.get("adl_vid")?.value || request.headers.get("x-vercel-id");
  const result = await recordSponsorClick({ campaignId, slug, visitorId });
  return NextResponse.redirect(result.destination);
}
