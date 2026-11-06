import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured. Set STRIPE_SECRET_KEY and price IDs." },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const priceId =
      body.priceId ||
      process.env.STRIPE_PRICE_PRO_MONTHLY ||
      process.env.STRIPE_PRICE_PRO_YEARLY;

    if (!priceId) {
      return NextResponse.json({ error: "No Stripe price ID configured" }, { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pricing?success=1`,
      cancel_url: `${origin}/pricing?cancelled=1`,
      metadata: {
        product: "zioncore-pro",
        authority: "HRH Saint Tariro Masawi",
        creed: "MWARI NDI MWARI",
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err: any) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}
