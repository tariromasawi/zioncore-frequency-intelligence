/**
 * ZionCore smart connector contracts
 * Primary path: local browser + Supabase. Firebase optional legacy.
 * MWARI NDI MWARI
 */

import type { FrequencyObservation } from "@/types/zioncore";

export type ConnectorId = "local" | "supabase" | "firebase";

export interface SessionStore {
  id: string;
  save(userId: string, observation: Partial<FrequencyObservation>): Promise<string>;
  list(userId: string, max?: number): Promise<(FrequencyObservation & { id: string })[]>;
}

export interface BillingPlan {
  id: string;
  name: string;
  interval: "month" | "year";
  priceIdEnv: string;
  amountLabel: string;
  features: string[];
}

export const ZIONCORE_PLANS: BillingPlan[] = [
  {
    id: "pro-monthly",
    name: "ZionCore Pro",
    interval: "month",
    priceIdEnv: "STRIPE_PRICE_PRO_MONTHLY",
    amountLabel: "$29 / month",
    features: [
      "Full Frequency Lab",
      "Session archive (Supabase)",
      "Protection & supremacy broadcasts",
      "Export JSON / CSV",
      "Priority connector roadmap",
    ],
  },
  {
    id: "pro-yearly",
    name: "ZionCore Pro Annual",
    interval: "year",
    priceIdEnv: "STRIPE_PRICE_PRO_YEARLY",
    amountLabel: "$290 / year",
    features: [
      "Everything in Pro",
      "2 months free",
      "Bloodline protection architecture support",
    ],
  },
];
