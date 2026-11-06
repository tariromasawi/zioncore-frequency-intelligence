"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function SiteNav() {
  const { user, isAdmin, signOut, loading } = useAuth();

  return (
    <nav className="border-b border-violet-900/40 bg-[#08060f]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight text-violet-100">
          Zion<span className="text-amber-300">Core</span>
        </Link>
        <div className="flex items-center gap-3 text-sm text-violet-300">
          <Link href="/zioncore/frequency-lab" className="hover:text-white hidden sm:inline">
            Lab
          </Link>
          <Link href="/pricing" className="hover:text-white hidden sm:inline">
            Pricing
          </Link>
          {!loading && user && (
            <Link href="/account" className="hover:text-white">
              Account
            </Link>
          )}
          {!loading && isAdmin && (
            <Link href="/admin" className="text-amber-300 hover:text-amber-200">
              Admin
            </Link>
          )}
          {!loading && !user && (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-violet-700/80 text-white hover:bg-violet-600"
            >
              Sign in
            </Link>
          )}
          {!loading && user && (
            <button onClick={() => signOut()} className="text-violet-500 hover:text-violet-300 text-xs">
              Sign out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
