# ZionCore Pricing

**MWARI NDI MWARI** · Authority: HRH Saint Tariro Masawi

## Summary

| Offer | Price |
|-------|--------|
| Frequency Lab (listen, spectrum, local AI, BFSK, protection tones) | **Free** |
| Cloud AI on free-tier models | **Free** |
| Pro subscription | **$1 / month** or **£1 / month** |
| Pro in **Zimbabwe** | **Free** |
| Premium AI / deep analysis / cloud archive | **Prepaid credits** |

## Credits

Users pre-purchase packs ($3 / $10 / $40 or GBP equivalents).  
Features debit credits only when they leave the free tier.

Target: **≥ 40% gross margin** on paid AI (retail credit value vs estimated provider cost).

## Stripe products to create

1. Subscription: **$1/month** USD → `STRIPE_PRICE_PRO_USD`  
2. Subscription: **£1/month** GBP → `STRIPE_PRICE_PRO_GBP`  
3. One-time: credit packs matching `CREDIT_PACKS` in `src/lib/billing/pricing.ts`

## Zimbabwe free

Checkout API short-circuits when `countryCode` is ZW/ZWE.  
Client also soft-detects via IP country. Harden with authenticated region later if needed.

## Attractive model

- Ultra-low Pro removes friction  
- Free core builds trust and usage  
- Credits only for expensive paths  
- Transparent cost table on `/pricing`
