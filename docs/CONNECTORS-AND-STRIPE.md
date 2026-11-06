# ZionCore Connectors & Stripe

**Authority:** HRH Saint Tariro Masawi  
**MWARI NDI MWARI**

## Important clarification

**Firebase Studio** (the cloud IDE) is sunsetting March 22, 2027.  
**Core Firebase** (Auth, Firestore, Hosting, etc.) is **not** shut down by that announcement.

ZionCore still migrates to a smarter, multi-connector design so you are not locked in.

## Connector strategy

| Connector | Role |
|-----------|------|
| **Local** | Always on — browser `localStorage` session archive |
| **Supabase** | Primary cloud (Auth + Postgres) when env is set |
| **Firebase** | Optional legacy — not required |
| **Stripe** | Billing — checkout, portal, webhooks |

Frequency Lab runs fully without any cloud backend.

## Supabase setup

1. Create a project at supabase.com  
2. Run SQL from `src/lib/connectors/supabase.ts` (`SUPABASE_SCHEMA_SQL`)  
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Stripe setup

1. Create products/prices in Stripe Dashboard  
2. Set env:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PRICE_PRO_MONTHLY` / `STRIPE_PRICE_PRO_YEARLY`
   - `STRIPE_WEBHOOK_SECRET` (for `/api/stripe/webhook`)  
3. Point webhook to `https://your-domain/api/stripe/webhook`  
4. Open `/pricing` to subscribe

## Routes

- `POST /api/stripe/checkout` — Checkout Session  
- `POST /api/stripe/portal` — Customer portal  
- `POST /api/stripe/webhook` — Lifecycle events  
- `/pricing` — Plan UI  

MWARI NDI MWARI.
