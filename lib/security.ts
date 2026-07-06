import { createHmac, timingSafeEqual } from "crypto";

const TEN_MINUTES = 10 * 60;

type TokenPayload = {
  slug: string;
  visitorId: string;
  exp: number;
};

function secret() {
  return process.env.ADLINKLY_SIGNING_SECRET || "development-only-change-me";
}

function encode(input: string) {
  return Buffer.from(input).toString("base64url");
}

function decode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export async function createUnlockToken(input: { slug: string; visitorId: string }) {
  const payload: TokenPayload = {
    slug: input.slug,
    visitorId: input.visitorId,
    exp: Math.floor(Date.now() / 1000) + TEN_MINUTES
  };
  const body = encode(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifyUnlockToken(token: string, expectedSlug: string) {
  const [body, signature] = token.split(".");
  if (!body || !signature) return { ok: false as const, reason: "Malformed token" };

  const expected = sign(body);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return { ok: false as const, reason: "Invalid signature" };
  }

  const payload = JSON.parse(decode(body)) as TokenPayload;
  if (payload.slug !== expectedSlug) return { ok: false as const, reason: "Slug mismatch" };
  if (payload.exp < Math.floor(Date.now() / 1000)) return { ok: false as const, reason: "Token expired" };

  return { ok: true as const, payload };
}

export function scoreVisitRisk(input: { ip?: string | null; userAgent?: string | null; country?: string | null }) {
  let score = 0;
  if (!input.userAgent) score += 25;
  if (!input.country) score += 10;
  if (input.ip?.startsWith("10.") || input.ip?.startsWith("192.168.")) score += 15;
  return {
    score,
    action: score >= 50 ? "block" : score >= 25 ? "review" : "allow"
  };
}
