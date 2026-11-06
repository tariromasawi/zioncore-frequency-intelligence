# ZionCore live Stripe IDs (Masowe Faith Group Ltd)

Account: `acct_1UNOguCzY6aOUtjF` · **livemode**

## Pro subscriptions

| Offer | Product | Price ID | Amount |
|-------|---------|----------|--------|
| Pro USD | `prod_VZyaBON1TWXVhv` | `price_1UYodVCzY6aOUtjFz5p511h5` | **$1 / month** |
| Pro GBP | `prod_VZyaffDLP8Olau` | `price_1UYodWCzY6aOUtjF10D3bYGd` | **£1 / month** |

## Credit packs (one-time)

| Pack | Product | USD Price | GBP Price |
|------|---------|-----------|-----------|
| 50 credits | `prod_VZyaP100IrT1KZ` | `price_1UYodaCzY6aOUtjFFs1QaWXF` ($3) | `price_1UYodfCzY6aOUtjFmWpfAzXd` (£2.50) |
| 200 credits | `prod_VZyaiTR6aydX3p` | `price_1UYodbCzY6aOUtjFew0vd2aM` ($10) | `price_1UYodgCzY6aOUtjFznBLOxAW` (£8) |
| 1000 credits | `prod_VZyaMlXB3IWgDH` | `price_1UYodcCzY6aOUtjFOscvMzzQ` ($40) | `price_1UYodhCzY6aOUtjFyrQLVfzN` (£32) |

## Still required on Vercel (cannot be read from Stripe MCP)

From [Stripe Dashboard → API keys](https://dashboard.stripe.com/apikeys):

- `STRIPE_SECRET_KEY` = `sk_live_...`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`

Webhook (optional but recommended):

- Endpoint: `https://zioncore-frequency-intelligence.vercel.app/api/stripe/webhook`
- Secret → `STRIPE_WEBHOOK_SECRET`

Price IDs are already set on the Vercel project.

MWARI NDI MWARI.
