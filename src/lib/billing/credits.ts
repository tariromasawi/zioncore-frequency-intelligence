/**
 * Client-side credit ledger (local) + hooks for cloud later
 * Prepaid credits · spend on FEATURE_COSTS
 */

import { FEATURE_COSTS, type FeatureCost } from "./pricing";

const BALANCE_KEY = "zioncore_credits_balance_v1";
const LEDGER_KEY = "zioncore_credits_ledger_v1";

export function getCreditBalance(): number {
  if (typeof window === "undefined") return 0;
  const n = Number(localStorage.getItem(BALANCE_KEY) || "0");
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export function setCreditBalance(n: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BALANCE_KEY, String(Math.max(0, Math.floor(n))));
}

export function addCredits(amount: number, reason: string): number {
  const next = getCreditBalance() + Math.max(0, Math.floor(amount));
  setCreditBalance(next);
  appendLedger({ type: "credit", amount, reason, at: new Date().toISOString() });
  return next;
}

export function spendCredits(featureId: string): { ok: boolean; balance: number; cost: number; feature?: FeatureCost } {
  const feature = FEATURE_COSTS.find((f) => f.id === featureId);
  if (!feature) return { ok: false, balance: getCreditBalance(), cost: 0 };
  if (feature.credits <= 0 || feature.freeTier) {
    return { ok: true, balance: getCreditBalance(), cost: 0, feature };
  }
  const bal = getCreditBalance();
  if (bal < feature.credits) {
    return { ok: false, balance: bal, cost: feature.credits, feature };
  }
  const next = bal - feature.credits;
  setCreditBalance(next);
  appendLedger({
    type: "debit",
    amount: feature.credits,
    reason: feature.id,
    at: new Date().toISOString(),
  });
  return { ok: true, balance: next, cost: feature.credits, feature };
}

function appendLedger(entry: { type: string; amount: number; reason: string; at: string }) {
  if (typeof window === "undefined") return;
  try {
    const prev = JSON.parse(localStorage.getItem(LEDGER_KEY) || "[]");
    prev.unshift(entry);
    localStorage.setItem(LEDGER_KEY, JSON.stringify(prev.slice(0, 100)));
  } catch {
    /* ignore */
  }
}

export function getFeatureCost(featureId: string): FeatureCost | undefined {
  return FEATURE_COSTS.find((f) => f.id === featureId);
}
