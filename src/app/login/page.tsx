"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function LoginPage() {
  const { signInWithGoogle, signInLocalAdmin, supabaseReady, user, isAdmin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const router = useRouter();

  if (user) {
    router.replace(isAdmin ? "/admin" : "/account");
  }

  const google = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e.message || "Google sign-in failed");
      setBusy(false);
    }
  };

  const localAdmin = () => {
    setError(null);
    try {
      signInLocalAdmin(adminEmail);
      router.push("/admin");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-violet-800/50 bg-[#0d0b18] p-8 shadow-2xl shadow-violet-950/50">
        <p className="text-amber-300/80 text-xs tracking-[0.3em]">MWARI NDI MWARI</p>
        <h1 className="mt-2 text-2xl font-bold text-violet-50">Sign in to ZionCore</h1>
        <p className="mt-2 text-sm text-violet-400">
          Save sessions, manage credits, and access your account. Admin access is restricted to the founder
          Google identity.
        </p>

        <button
          onClick={google}
          disabled={busy || !supabaseReady}
          className="mt-8 w-full py-3 rounded-xl bg-white text-gray-900 font-medium flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-50"
        >
          <span className="text-lg">G</span> Continue with Google
        </button>
        {!supabaseReady && (
          <p className="mt-2 text-xs text-amber-500/90">
            Google OAuth needs Supabase keys on Vercel (URL + anon key + Google provider enabled).
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-violet-900/50">
          <p className="text-xs text-violet-500 mb-2">Founder admin unlock (tariromasawi19@gmail.com only)</p>
          <input
            type="email"
            placeholder="tariromasawi19@gmail.com"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="w-full bg-[#16122a] border border-violet-800 rounded-lg px-3 py-2 text-sm mb-2"
          />
          <button
            onClick={localAdmin}
            className="w-full py-2.5 rounded-xl border border-amber-700/50 text-amber-100 text-sm hover:bg-amber-950/40"
          >
            Enter admin dashboard
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

        <p className="mt-6 text-center text-xs text-violet-600">
          <Link href="/" className="underline">
            Home
          </Link>
          {" · "}
          <Link href="/zioncore/frequency-lab" className="underline">
            Lab without account
          </Link>
        </p>
      </div>
    </div>
  );
}
