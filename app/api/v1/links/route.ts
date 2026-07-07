import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCreatorFromApiKey } from "@/lib/authz";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { randomSuffix, slugify } from "@/lib/slug";

const createLinkSchema = z.object({
  destinationUrl: z.string().url(),
  title: z.string().min(2).max(120),
  monetization: z.enum(["standard", "premium_boost", "affiliate"]).default("standard"),
  slug: z.string().min(3).max(64).regex(/^[a-z0-9-]+$/).optional()
});

export async function POST(request: NextRequest) {
  const creator = await requireCreatorFromApiKey(request.headers);
  if (!creator) {
    return NextResponse.json({ error: "Missing or invalid API key" }, { status: 401 });
  }

  const parsed = createLinkSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const baseSlug = parsed.data.slug || slugify(parsed.data.title);
  const slug = baseSlug || `link-${randomSuffix()}`;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      id: `link_${randomUUID()}`,
      slug,
      shortUrl: `https://adlinkly.net/l/${slug}`,
      ...parsed.data,
      warning: "DATABASE_URL is not configured, so this link was not persisted"
    });
  }

  const existing = await prisma.link.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${randomSuffix()}` : slug;

  const link = await prisma.link.create({
    data: {
      creatorId: creator.id,
      slug: finalSlug,
      title: parsed.data.title,
      destinationUrl: parsed.data.destinationUrl,
      status: creator.admin ? "LIVE" : "REVIEW",
      premiumBoost: parsed.data.monetization === "premium_boost",
      apiCreated: true
    }
  });

  return NextResponse.json({
    id: link.id,
    slug: link.slug,
    shortUrl: `https://adlinkly.net/l/${link.slug}`,
    destinationUrl: link.destinationUrl,
    title: link.title,
    status: link.status
  });
}