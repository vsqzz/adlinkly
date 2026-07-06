import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createLinkSchema = z.object({
  destinationUrl: z.string().url(),
  title: z.string().min(2).max(120),
  monetization: z.enum(["standard", "premium_boost", "affiliate"]).default("standard")
});

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const parsed = createLinkSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const slug = parsed.data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

  return NextResponse.json({
    id: `link_${crypto.randomUUID()}`,
    slug,
    shortUrl: `https://adlinkly.net/l/${slug}`,
    ...parsed.data
  });
}
