"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PRO_OFFERS,
  CREDIT_PACKS,
  FEATURE_COSTS,
  PRICING_COPY,
  isZimbabweFree,
} from "@/lib/billing/pricing";
import { addCredits, getCreditBalance } from "@/lib/billing/credits";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [zwNote, setZwNote] = useState<string | null>(null);

  useEffect(() => {
    setCredits(getCreditBalance());
    // Soft geo hint (Vercel / client); user can still self-identify ZW
    fetch("https://ipapi.co/country_code/")
      .then((r) => r.text())
      .then((c) => setCountry(c.trim().toUpperCase()))
      .catch(() => {});
  }, []);

  const zwFree = isZimbabweFree(country);

  const checkout = async (opts: { kind: "subscription" | "credits"; offerId: string }) => {
    setLoading(opts.offerId);
    setError(null);
    setZwNote(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...opts, countryCode: country }),
      });
      const data = await res.json();
      if (data.free) {
        setZwNote(data.message);
        // Local entitlement flag for ZW free Pro
        localStorage.setItem("zioncore_pro_zw", "1");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL");
    } catch (e: any) {
      setError(e.message || "Could not start checkout");
    } finally {
      setLoading(null);
    }
  };

  /** Demo top-up when Stripe not wired — still shows credit UX */
  const demoCredits = (packId: string) => {
    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    if (!pack) return;
    const next = addCredits(pack.credits, `demo_${packId}`);
    setCredits(next);
  };

  return (
    <div className="min-h-screen bg-[#06060c] text-violet-100 px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <p className="text-amber-300/90 tracking-[0.25em] text-xs font-medium mb-3">MWARI NDI MWARI</p>
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-amber-200">
          {PRICING_COPY.headline}
        </h1>
        <p className="mt-3 text-violet-400 max-w-2xl">{PRICING_COPY.attractive}</p>
        <p className="mt-2 text-sm text-violet-500">{PRICING_COPY.freeTier}</p>

        {zwFree && (
          <div className="mt-4 rounded-xl border border-emerald-700/50 bg-emerald-950/40 px-4 py-3 text-emerald-200 text-sm">
            Detected region: Zimbabwe — Pro is free. {PRICING_COPY.zimbabwe}
          </div>
        )}

        <div className="mt-4 text-sm text-violet-400">
          Your prepaid credits: <span className="text-amber-200 font-semibold">{credits}</span>
        </div>

        {/* Pro $1 / £1 */}
        <h2 className="mt-12 text-lg font-semibold text-violet-200">Pro subscription</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-5">
          {PRO_OFFERS.map((offer) => (
            <div key={offer.id} className="rounded-2xl border border-violet-800/50 bg-[#0d0b18] p-6">
              <h3 className="text-xl font-semibold">{offer.name}</h3>
              <p className="text-3xl text-amber-200 mt-2">{offer.label}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-violet-300">
                <li>• Full Frequency Lab</li>
                <li>• Free-plan AI interpretation</li>
                <li>• Protection & supremacy broadcasts</li>
                <li>• Cloud archive when Supabase is linked</li>
              </ul>
              <button
                onClick={() => checkout({ kind: "subscription", offerId: offer.id })}
                disabled={loading === offer.id}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-medium disabled:opacity-50"
              >
                {zwFree ? "Activate free Pro (ZW)" : loading === offer.id ? "…" : `Subscribe ${offer.label}`}
              </button>
            </div>
          ))}
        </div>

        {/* Credits */}
        <h2 className="mt-14 text-lg font-semibold text-violet-200">Prepaid credits (premium AI)</h2>
        <p className="text-sm text-violet-500 mt-1">{PRICING_COPY.credits}</p>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {CREDIT_PACKS.map((pack) => (
            <div key={pack.id} className="rounded-2xl border border-amber-900/40 bg-[#120e1a] p-5 relative">
              {pack.badge && (
                <span className="absolute -top-2 right-3 text-[10px] uppercase bg-amber-600 text-black px-2 py-0.5 rounded-full font-bold">
                  {pack.badge}
                </span>
              )}
              <h3 className="font-semibold text-amber-100">{pack.name}</h3>
              <p className="text-lg text-violet-100 mt-1">{pack.credits} credits</p>
              <p className="text-sm text-violet-400">{pack.labelUsd} · {pack.labelGbp}</p>
              <button
                onClick={() => checkout({ kind: "credits", offerId: pack.id })}
                disabled={loading === pack.id}
                className="mt-4 w-full py-2.5 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-sm font-medium disabled:opacity-50"
              >
                {loading === pack.id ? "…" : "Buy with Stripe"}
              </button>
              <button
                onClick={() => demoCredits(pack.id)}
                className="mt-2 w-full py-2 rounded-xl border border-violet-800/50 text-xs text-violet-400"
              >
                Demo add credits (local)
              </button>
            </div>
          ))}
        </div>

        {/* Feature cost table */}
        <h2 className="mt-14 text-lg font-semibold text-violet-200">What things cost</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-violet-900/40">
          <table className="w-full text-sm">
            <thead className="bg-[#0d0b18] text-violet-400 text-left">
              <tr>
                <th className="px-4 py-2">Feature</th>
                <th className="px-4 py-2">Credits</th>
                <th className="px-4 py-2">Tier</th>
                <th className="px-4 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_COSTS.map((f) => (
                <tr key={f.id} className="border-t border-violet-900/30">
                  <td className="px-4 py-2 text-violet-100">{f.name}</td>
                  <td className="px-4 py-2 text-amber-200">{f.credits === 0 ? "Free" : f.credits}</td>
                  <td className="px-4 py-2">{f.freeTier ? "Free plan" : "Credits"}</td>
                  <td className="px-4 py-2 text-violet-500">{f.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {zwNote && (
          <p className="mt-6 text-emerald-300 text-sm bg-emerald-950/30 px-4 py-3 rounded-xl">{zwNote}</p>
        )}
        {error && (
          <p className="mt-6 text-rose-400 text-sm bg-rose-950/40 px-4 py-3 rounded-xl">{error}</p>
        )}

        <p className="mt-10 text-sm text-violet-500">
          <Link href="/zioncore/frequency-lab" className="underline text-violet-300">
            Frequency Lab
          </Link>{" "}
          · Always free for listen / local AI / transmit · Premium models use credits · Min ~40% margin on paid AI
        </p>
        <p className="mt-2 text-xs text-violet-700">Authority: HRH Saint Tariro Masawi · MWARI NDI MWARI</p>
      </div>
    </div>
  );
}
