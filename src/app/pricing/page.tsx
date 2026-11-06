"use client";

import { useState } from "react";
import Link from "next/link";
import { ZIONCORE_PLANS } from "@/lib/connectors";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (planId: string) => {
    setLoading(planId);
    setError(null);
    try {
      const priceId =
        planId === "pro-yearly"
          ? process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY
          : process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY;

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (e: any) {
      setError(e.message || "Could not start checkout. Configure Stripe keys.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#06060c] text-violet-100 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="text-amber-300/90 tracking-[0.25em] text-xs font-medium mb-3">MWARI NDI MWARI</p>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-amber-200">
          ZionCore Plans
        </h1>
        <p className="mt-3 text-violet-400 max-w-xl">
          Frequency intelligence under the authority of HRH Saint Tariro Masawi. Core lab runs free in the
          browser. Pro unlocks cloud archive and billing-backed support.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {ZIONCORE_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-violet-800/50 bg-[#0d0b18] p-6 flex flex-col"
            >
              <h2 className="text-xl font-semibold text-violet-100">{plan.name}</h2>
              <p className="text-2xl text-amber-200 mt-2">{plan.amountLabel}</p>
              <ul className="mt-4 space-y-2 text-sm text-violet-300 flex-1">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button
                onClick={() => checkout(plan.id)}
                disabled={loading === plan.id}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-medium disabled:opacity-50"
              >
                {loading === plan.id ? "Redirecting…" : "Subscribe with Stripe"}
              </button>
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-6 text-rose-400 text-sm bg-rose-950/40 px-4 py-3 rounded-xl">{error}</p>
        )}

        <p className="mt-8 text-sm text-violet-500">
          <Link href="/zioncore/frequency-lab" className="underline text-violet-300">
            Enter Frequency Lab
          </Link>{" "}
          · Lab works without Stripe. Keys go in Vercel env / .env.local.
        </p>
      </div>
    </div>
  );
}
