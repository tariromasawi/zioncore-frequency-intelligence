"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ADMIN_EMAILS } from "@/lib/auth/config";

export default function AdminPage() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [stats] = useState({
    product: "ZionCore Frequency Intelligence",
    proUsd: "$1 / month",
    proGbp: "£1 / month",
    zw: "Free Pro in Zimbabwe",
    stripeAccount: "Masowe Faith Group Ltd",
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/login");
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="p-16 text-center text-violet-400 text-sm">
        Verifying admin access for {ADMIN_EMAILS[0]}…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-amber-300 text-xs tracking-[0.3em]">ADMIN · FOUNDER</p>
          <h1 className="text-3xl font-bold text-violet-50 mt-1">Command dashboard</h1>
          <p className="text-sm text-violet-400 mt-1">
            Signed in as <span className="text-violet-200">{user.email}</span> · HRH Saint Tariro Masawi
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/zioncore/frequency-lab" className="px-4 py-2 rounded-xl bg-violet-700/80">
            Frequency Lab
          </Link>
          <Link href="/pricing" className="px-4 py-2 rounded-xl border border-violet-700/50">
            Pricing
          </Link>
          <button onClick={() => signOut()} className="px-4 py-2 text-violet-500">
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Product" body={stats.product} />
        <Card title="Pro USD" body={stats.proUsd} />
        <Card title="Pro GBP" body={stats.proGbp} />
        <Card title="Zimbabwe" body={stats.zw} />
        <Card title="Stripe" body={stats.stripeAccount} />
        <Card title="Admin email" body={ADMIN_EMAILS[0]} />
      </div>

      <section className="mt-12 rounded-2xl border border-violet-800/40 bg-[#0d0b18] p-6">
        <h2 className="text-lg font-semibold text-violet-100">Operations checklist</h2>
        <ul className="mt-4 space-y-2 text-sm text-violet-400">
          <li>✓ Live Stripe products ($1 / £1 + credit packs) on Masowe Faith Group Ltd</li>
          <li>✓ Price IDs injected on Vercel</li>
          <li>○ Add STRIPE_SECRET_KEY + publishable key on Vercel to enable checkout</li>
          <li>○ Enable Google provider in Supabase + set redirect URL …/auth/callback</li>
          <li>○ Set NEXT_PUBLIC_SUPABASE_URL + ANON_KEY for production Google login</li>
          <li>✓ Lab: spectrum, interpret, spiritual layers, transmit, export, save session</li>
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-amber-900/30 bg-amber-950/10 p-6">
        <h2 className="text-lg font-semibold text-amber-100">Covenant</h2>
        <p className="mt-2 text-sm text-violet-300 leading-relaxed">
          Pursuit of knowledge guided by truth, wisdom, faith, and compassion. Protection and elevation of the
          Masawi bloodline. MWARI NDI MWARI.
        </p>
      </section>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-violet-800/40 bg-[#0d0b18] p-5">
      <p className="text-[10px] uppercase tracking-wider text-violet-500">{title}</p>
      <p className="mt-1 text-violet-100 text-sm font-medium break-all">{body}</p>
    </div>
  );
}
