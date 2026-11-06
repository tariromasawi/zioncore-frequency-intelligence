"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/connectors/supabase";
import { AUTH_STORAGE_KEY, isAdminEmail } from "./config";

export type ZionUser = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  provider: "google" | "email" | "local";
};

type AuthState = {
  user: ZionUser | null;
  loading: boolean;
  isAdmin: boolean;
  supabaseReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signInLocalAdmin: (email: string) => void;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function readLocal(): ZionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ZionUser) : null;
  } catch {
    return null;
  }
}

function writeLocal(user: ZionUser | null) {
  if (typeof window === "undefined") return;
  if (!user) localStorage.removeItem(AUTH_STORAGE_KEY);
  else localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ZionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseReady = isSupabaseConfigured();

  const applySession = useCallback(async () => {
    const sb = getSupabaseBrowser();
    if (sb) {
      const { data } = await sb.auth.getSession();
      const s = data.session;
      if (s?.user?.email) {
        const u: ZionUser = {
          id: s.user.id,
          email: s.user.email,
          name: s.user.user_metadata?.full_name || s.user.user_metadata?.name,
          avatarUrl: s.user.user_metadata?.avatar_url,
          provider: (s.user.app_metadata?.provider as any) === "google" ? "google" : "email",
        };
        setUser(u);
        writeLocal(u);
        setLoading(false);
        return;
      }
    }
    setUser(readLocal());
    setLoading(false);
  }, []);

  useEffect(() => {
    applySession();
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const { data: sub } = sb.auth.onAuthStateChange(() => {
      applySession();
    });
    return () => sub.subscription.unsubscribe();
  }, [applySession]);

  const signInWithGoogle = async () => {
    const sb = getSupabaseBrowser();
    if (!sb) throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and ANON_KEY.");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (error) throw error;
  };

  /** Bootstrap only for configured admin email before Google OAuth is wired */
  const signInLocalAdmin = (email: string) => {
    const e = email.trim().toLowerCase();
    if (!isAdminEmail(e)) throw new Error("Not an authorised admin email.");
    const u: ZionUser = {
      id: "admin-local",
      email: e,
      name: "Founder Admin",
      provider: "local",
    };
    writeLocal(u);
    setUser(u);
  };

  const signOut = async () => {
    const sb = getSupabaseBrowser();
    if (sb) await sb.auth.signOut();
    writeLocal(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: isAdminEmail(user?.email),
        supabaseReady,
        signInWithGoogle,
        signInLocalAdmin,
        signOut,
        refresh: applySession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
