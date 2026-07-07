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

## PayPal payouts and real ads MVP

Adlinkly now has a PayPal Payouts API wrapper and an admin-only payout endpoint:

```txt
POST /api/admin/paypal-payouts
```

Required environment variables:

```txt
ADMIN_PAYOUT_SECRET=replace-with-a-long-random-admin-secret
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your-paypal-rest-app-client-id
PAYPAL_CLIENT_SECRET=your-paypal-rest-app-secret
```

Start with `PAYPAL_MODE=sandbox`. Switch to `live` only after PayPal enables payouts for the account and you have tested small approved batches.

The unlock page also includes first-party sponsor placements. This lets Adlinkly sell direct ad slots and affiliate campaigns before larger ad networks approve the site.

Recommended launch flow:

1. Sell sponsor placements manually.
2. Track impressions/clicks and creator revenue internally.
3. Require admin approval before payouts.
4. Send approved creator payouts through PayPal Payouts.
5. Register KVK once revenue proves the project is worth formalizing.
## Production setup runbook

Adlinkly now supports database-backed links, creator stats, sponsor campaigns, ad impressions, qualified unlock tracking, ledger entries, payout requests, admin payout approval, and PayPal payout execution.

Required Vercel env vars:

```txt
DATABASE_URL=postgresql://...
ADLINKLY_SIGNING_SECRET=long-random-secret
IP_HASH_SECRET=long-random-secret
ADMIN_API_SECRET=long-random-secret
ADMIN_PAYOUT_SECRET=long-random-secret
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=paypal-rest-app-client-id
PAYPAL_CLIENT_SECRET=paypal-rest-app-secret
MIN_PAYOUT_CENTS=2500
DEFAULT_CPM_CENTS=120
DEFAULT_CPC_CENTS=8
DEFAULT_CREATOR_SHARE_BPS=5000
```

Apply the database schema before real traffic:

```bash
npx prisma db push
```

Bootstrap a creator and API key:

```bash
curl -X POST https://adlinkly.net/api/admin/setup \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: $ADMIN_API_SECRET" \
  -d '{"email":"creator@example.com","name":"First Creator","handle":"firstcreator"}'
```

Create a monetized link:

```bash
curl -X POST https://adlinkly.net/api/v1/links \
  -H "Authorization: Bearer $CREATOR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Download Pack","destinationUrl":"https://example.com/file","monetization":"standard"}'
```

Create a sponsor campaign:

```bash
curl -X POST https://adlinkly.net/api/admin/campaigns \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: $ADMIN_API_SECRET" \
  -d '{"sponsorName":"Example Sponsor","title":"Try our tool","description":"A real paid sponsor placement.","targetUrl":"https://example.com","budgetCents":5000,"payoutType":"CPC","creatorShareBps":5000}'
```

Live stats endpoints:

```txt
GET /api/stats/creator
GET /api/stats/admin with x-admin-secret
```

Creator payout request:

```bash
curl -X POST https://adlinkly.net/api/payouts/request \
  -H "Authorization: Bearer $CREATOR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paypalEmail":"creator@example.com","amountCents":2500}'
```

Admin payout approval and PayPal execution:

```bash
curl -X POST https://adlinkly.net/api/admin/payouts/approve \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: $ADMIN_PAYOUT_SECRET" \
  -d '{"payoutId":"payout_id_here"}'

curl -X POST https://adlinkly.net/api/admin/payouts/execute \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: $ADMIN_PAYOUT_SECRET" \
  -d '{"payoutIds":["payout_id_here"]}'
```

Keep PayPal in sandbox until PayPal confirms live payouts are available. Keep admin approval enabled so fraudulent traffic never auto-pays.
