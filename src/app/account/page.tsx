"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getCreditBalance } from "@/lib/billing/credits";
import { useState } from "react";

export default function AccountPage() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    setCredits(getCreditBalance());
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-16 text-center text-violet-400 text-sm">Loading account…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <p className="text-amber-300/80 text-xs tracking-[0.25em]">YOUR ACCOUNT</p>
      <h1 className="text-3xl font-bold text-violet-50 mt-2">Welcome back</h1>
      <div className="mt-8 rounded-2xl border border-violet-800/40 bg-[#0d0b18] p-6 flex gap-4 items-center">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" className="w-14 h-14 rounded-full" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-violet-800 flex items-center justify-center text-xl">
            {(user.name || user.email)[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-medium text-violet-100">{user.name || "ZionCore member"}</p>
          <p className="text-sm text-violet-400">{user.email}</p>
          <p className="text-xs text-violet-600 mt-1">via {user.provider}</p>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-violet-800/40 bg-[#0d0b18] p-5">
          <p className="text-xs text-violet-500 uppercase">Prepaid credits</p>
          <p className="text-2xl text-amber-200 mt-1">{credits}</p>
          <Link href="/pricing" className="text-sm text-violet-300 underline mt-2 inline-block">
            Buy credits
          </Link>
        </div>
        <div className="rounded-2xl border border-violet-800/40 bg-[#0d0b18] p-5">
          <p className="text-xs text-violet-500 uppercase">Lab</p>
          <Link href="/zioncore/frequency-lab" className="text-violet-100 font-medium mt-2 inline-block">
            Open Frequency Lab →
          </Link>
        </div>
      </div>

      {isAdmin && (
        <Link
          href="/admin"
          className="mt-6 block rounded-2xl border border-amber-700/40 bg-amber-950/20 p-5 text-amber-100"
        >
          Admin dashboard →
        </Link>
      )}

      <button onClick={() => signOut()} className="mt-10 text-sm text-violet-500 hover:text-violet-300">
        Sign out
      </button>
    </div>
  );
}
