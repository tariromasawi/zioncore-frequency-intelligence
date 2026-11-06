/**
 * ZionCore commercial model
 * Pro: $1 / £1 · Free in Zimbabwe · Free AI tier · Prepaid credits for premium features
 * Authority: HRH Saint Tariro Masawi · MWARI NDI MWARI
 */

export type CurrencyCode = "USD" | "GBP" | "ZWL_FREE";

/** Regions treated as free Pro (Zimbabwe). */
export const FREE_COUNTRY_CODES = ["ZW", "ZWE"] as const;

export interface SubscriptionOffer {
  id: string;
  name: string;
  amount: number;
  currency: "usd" | "gbp";
  interval: "month";
  label: string;
  priceIdEnv: string;
}

/** Attractive ultra-low Pro — $1 and £1 only */
export const PRO_OFFERS: SubscriptionOffer[] = [
  {
    id: "pro-usd",
    name: "ZionCore Pro",
    amount: 1,
    currency: "usd",
    interval: "month",
    label: "$1 / month",
    priceIdEnv: "STRIPE_PRICE_PRO_USD",
  },
  {
    id: "pro-gbp",
    name: "ZionCore Pro (UK)",
    amount: 1,
    currency: "gbp",
    interval: "month",
    label: "£1 / month",
    priceIdEnv: "STRIPE_PRICE_PRO_GBP",
  },
];

/** Prepaid credit packs (user buys once, spends on premium features) */
export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  priceUsd: number;
  priceGbp: number;
  labelUsd: string;
  labelGbp: string;
  badge?: string;
  priceIdEnvUsd: string;
  priceIdEnvGbp: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "credits-50",
    name: "Starter Credits",
    credits: 50,
    priceUsd: 3,
    priceGbp: 2.5,
    labelUsd: "$3 · 50 credits",
    labelGbp: "£2.50 · 50 credits",
    priceIdEnvUsd: "STRIPE_PRICE_CREDITS_50_USD",
    priceIdEnvGbp: "STRIPE_PRICE_CREDITS_50_GBP",
  },
  {
    id: "credits-200",
    name: "Lab Credits",
    credits: 200,
    priceUsd: 10,
    priceGbp: 8,
    labelUsd: "$10 · 200 credits",
    labelGbp: "£8 · 200 credits",
    badge: "Best value",
    priceIdEnvUsd: "STRIPE_PRICE_CREDITS_200_USD",
    priceIdEnvGbp: "STRIPE_PRICE_CREDITS_200_GBP",
  },
  {
    id: "credits-1000",
    name: "Throne Credits",
    credits: 1000,
    priceUsd: 40,
    priceGbp: 32,
    labelUsd: "$40 · 1,000 credits",
    labelGbp: "£32 · 1,000 credits",
    badge: "Power user",
    priceIdEnvUsd: "STRIPE_PRICE_CREDITS_1000_USD",
    priceIdEnvGbp: "STRIPE_PRICE_CREDITS_1000_GBP",
  },
];

/**
 * Feature costs in credits.
 * Free tier = 0. Premium AI / heavy features cost credits.
 * Internal cost is estimated; retail includes minimum margin ≥ 40%.
 */
export interface FeatureCost {
  id: string;
  name: string;
  credits: number;
  freeTier: boolean;
  notes: string;
  /** Estimated provider cost USD for margin math (internal) */
  estCostUsd: number;
}

export const FEATURE_COSTS: FeatureCost[] = [
  {
    id: "fft_listen",
    name: "Live FFT & spectrum",
    credits: 0,
    freeTier: true,
    notes: "Always free in browser",
    estCostUsd: 0,
  },
  {
    id: "local_interpret",
    name: "Local scientific interpretation",
    credits: 0,
    freeTier: true,
    notes: "On-device heuristics — free plan AI",
    estCostUsd: 0,
  },
  {
    id: "bfsk_transmit",
    name: "BFSK / protection tones",
    credits: 0,
    freeTier: true,
    notes: "Local audio synthesis",
    estCostUsd: 0,
  },
  {
    id: "ai_standard",
    name: "Cloud AI (free-tier model)",
    credits: 0,
    freeTier: true,
    notes: "Uses free Gemini / open routes when available",
    estCostUsd: 0,
  },
  {
    id: "ai_premium",
    name: "Premium model interpretation",
    credits: 5,
    freeTier: false,
    notes: "Stronger models · charged in credits",
    estCostUsd: 0.02,
  },
  {
    id: "ai_deep",
    name: "Deep multi-domain analysis",
    credits: 15,
    freeTier: false,
    notes: "Long context · multi-pass",
    estCostUsd: 0.08,
  },
  {
    id: "session_cloud_save",
    name: "Cloud session archive",
    credits: 1,
    freeTier: false,
    notes: "Supabase write",
    estCostUsd: 0.001,
  },
  {
    id: "batch_export_pack",
    name: "Batch research export",
    credits: 3,
    freeTier: false,
    notes: "Large JSON/CSV packs",
    estCostUsd: 0.005,
  },
];

/** Credit retail value for margin checks (~$0.05–0.06 per credit blended) */
export const CREDIT_RETAIL_USD = 0.05;

export function minMarginOk(estCostUsd: number, creditsCharged: number): boolean {
  const revenue = creditsCharged * CREDIT_RETAIL_USD;
  if (estCostUsd <= 0) return true;
  const margin = (revenue - estCostUsd) / revenue;
  return margin >= 0.4; // minimum 40% gross margin target
}

export function isZimbabweFree(countryCode?: string | null): boolean {
  if (!countryCode) return false;
  const c = countryCode.toUpperCase();
  return c === "ZW" || c === "ZWE" || c === "ZIMBABWE";
}

export const PRICING_COPY = {
  headline: "Pro from $1 or £1 — free in Zimbabwe",
  freeTier:
    "Everyone gets the full Frequency Lab, local AI interpretation, spectrum, and transmit tools at no charge.",
  zimbabwe:
    "Users in Zimbabwe receive Pro entitlements free. No card required for core access.",
  credits:
    "Premium cloud models and heavy features use prepaid credits. Buy once, spend only when you need more power. Fair usage, minimum 40% platform margin on paid AI.",
  attractive:
    "Start free. Upgrade for $1 or £1. Top up credits only if you want premium AI depth.",
};
