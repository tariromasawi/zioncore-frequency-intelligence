/**
 * Supabase connector — primary cloud alternative to Firebase
 * Auth + Postgres sessions when env is configured
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { FrequencyObservation } from "@/types/zioncore";
import type { SessionStore } from "./types";

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseBrowser(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}

export const supabaseSessionStore: SessionStore = {
  id: "supabase",
  async save(userId, observation) {
    const sb = getSupabaseBrowser();
    if (!sb) throw new Error("Supabase not configured");
    const { data, error } = await sb
      .from("frequency_sessions")
      .insert({
        user_id: userId,
        payload: observation,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id as string;
  },
  async list(userId, max = 20) {
    const sb = getSupabaseBrowser();
    if (!sb) return [];
    const { data, error } = await sb
      .from("frequency_sessions")
      .select("id, payload, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(max);
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id,
      ...(row.payload as FrequencyObservation),
      createdAt: row.created_at,
    }));
  },
};

/** SQL to run once in Supabase SQL editor */
export const SUPABASE_SCHEMA_SQL = `
create table if not exists frequency_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  payload jsonb not null,
  created_at timestamptz default now()
);
create index if not exists frequency_sessions_user_idx on frequency_sessions (user_id, created_at desc);
`;
