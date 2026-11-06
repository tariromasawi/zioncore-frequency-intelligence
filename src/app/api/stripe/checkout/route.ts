import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { PRO_OFFERS, CREDIT_PACKS, isZimbabweFree } from "@/lib/billing/pricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { kind = "subscription", offerId, countryCode, priceId: clientPriceId } = body as {
      kind?: "subscription" | "credits";
      offerId?: string;
      countryCode?: string;
      priceId?: string;
    };

    // Zimbabwe → no charge for Pro
    if (kind === "subscription" && isZimbabweFree(countryCode)) {
      return NextResponse.json({
        free: true,
        message: "Pro is free in Zimbabwe. No payment required.",
        entitlement: "pro_zw_free",
      });
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error:
            "Stripe not configured yet. Set STRIPE_SECRET_KEY and $1 / £1 price IDs. Lab remains free to use.",
        },
        { status: 503 }
      );
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const stripe = getStripe();

    let priceId = clientPriceId as string | undefined;
    let mode: "subscription" | "payment" = "subscription";
    let metadata: Record<string, string> = {
      product: "zioncore",
      creed: "MWARI NDI MWARI",
    };

    if (kind === "credits") {
      mode = "payment";
      const pack = CREDIT_PACKS.find((p) => p.id === offerId);
      if (!pack && !priceId) {
        return NextResponse.json({ error: "Unknown credit pack" }, { status: 400 });
      }
      if (pack) {
        priceId =
          process.env[pack.priceIdEnvUsd] ||
          process.env[pack.priceIdEnvGbp] ||
          priceId;
        metadata = {
          ...metadata,
          kind: "credits",
          packId: pack.id,
          credits: String(pack.credits),
        };
      }
    } else {
      const offer = PRO_OFFERS.find((o) => o.id === offerId) || PRO_OFFERS[0];
      priceId = process.env[offer.priceIdEnv] || priceId || process.env.STRIPE_PRICE_PRO_USD;
      metadata = {
        ...metadata,
        kind: "subscription",
        offerId: offer.id,
        currency: offer.currency,
      };
    }

    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "No Stripe price ID. Create $1 USD and £1 GBP products, set STRIPE_PRICE_PRO_USD / STRIPE_PRICE_PRO_GBP.",
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pricing?success=1&kind=${kind}`,
      cancel_url: `${origin}/pricing?cancelled=1`,
      metadata,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err: any) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}
