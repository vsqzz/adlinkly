# Adlinkly

Adlinkly is a modern monetized-link platform starter for `adlinkly.net`. It includes a Next.js app, Tailwind UI, dark/light/system theming, creator dashboards, premium plan pages, support/admin surfaces, signed unlock tokens, API skeletons, and a Prisma data model for the real business system.

## What is included

- Public homepage for `adlinkly.net`
- Creator dashboard with revenue, premium boost, payout, and link analytics sections
- Monetized unlock route at `/l/[slug]`
- Server-side signed unlock token verification at `/api/unlock`
- Creator API starter at `/api/v1/links`
- Premium visitor and creator plan page
- Support center page
- Admin dashboard starter
- PostgreSQL Prisma schema for users, creator profiles, links, clicks, ledgers, payouts, affiliates, support tickets, and API keys

## Local setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Create a new Vercel project from that repository.
3. Add these environment variables in Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL=https://adlinkly.net`
   - `ADLINKLY_SIGNING_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `TURNSTILE_SECRET_KEY`
4. In Vercel, connect the purchased domain `adlinkly.net` to the project.
5. Deploy.

## Production roadmap

Build these next, in this order:

1. Auth with creator/admin roles.
2. Real database reads/writes through Prisma.
3. Manual payout requests and admin review.
4. Manual payout requests first, then PayPal, Wise, Tipalti, Stripe, or another provider when the business is verified.
5. PayPal, Wise, Tipalti, Stripe, or another provider when your business can pass verification.
6. Turnstile verification and IP/device risk scoring.
7. Admin moderation for links, abuse reports, and payout holds.
8. Automated premium subscription revenue allocation.
9. Advertiser campaign marketplace.

## Premium boost model

Visitor Premium should contribute a percentage of subscription revenue into a monthly creator pool. Qualified premium visits receive weighted credit, and the pool is distributed to creators based on those weights.

Example:

```txt
premium_pool = subscription_revenue * creator_share
creator_share = creator_qualified_premium_visit_weight / all_premium_visit_weight
creator_payout = premium_pool * creator_share
```

This lets Adlinkly offer fewer ads to premium visitors while creators still earn more from premium traffic.
