import { NextRequest, NextResponse } from "next/server";
import { scoreVisitRisk, verifyUnlockToken } from "@/lib/security";

const demoDestinations: Record<string, string> = {
  "preset-pack": "https://adlinkly.net",
  "free-assets": "https://adlinkly.net",
  "discord-drop": "https://adlinkly.net"
};

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "";
  const token = request.nextUrl.searchParams.get("token") || "";
  const verified = verifyUnlockToken(token, slug);

  if (!verified.ok) {
    return NextResponse.json({ error: verified.reason }, { status: 403 });
  }

  const risk = scoreVisitRisk({
    ip: request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
    country: request.headers.get("x-vercel-ip-country")
  });

  if (risk.action === "block") {
    return NextResponse.json({ error: "Visit blocked by risk controls" }, { status: 403 });
  }

  const destination = demoDestinations[slug] || "https://adlinkly.net";
  return NextResponse.redirect(destination);
}
