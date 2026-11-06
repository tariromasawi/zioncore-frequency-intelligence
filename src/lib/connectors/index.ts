/**
 * Smart connector router — local always works; Supabase when configured
 */

import { localSessionStore } from "./localStore";
import { isSupabaseConfigured, supabaseSessionStore } from "./supabase";
import type { SessionStore, ConnectorId } from "./types";

export function getActiveSessionStore(): SessionStore {
  if (typeof window !== "undefined" && isSupabaseConfigured()) {
    return supabaseSessionStore;
  }
  return localSessionStore;
}

export function getActiveConnectorId(): ConnectorId {
  if (isSupabaseConfigured()) return "supabase";
  return "local";
}

export { localSessionStore, supabaseSessionStore, isSupabaseConfigured };
export { ZIONCORE_PLANS } from "./types";
export type { SessionStore, ConnectorId, BillingPlan } from "./types";
