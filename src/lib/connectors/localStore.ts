/**
 * Local browser session store — zero backend required
 * Uses IndexedDB-style localStorage for frequency sessions
 */

import type { FrequencyObservation } from "@/types/zioncore";
import type { SessionStore } from "./types";

const KEY = "zioncore_frequency_sessions_v1";

function readAll(): (FrequencyObservation & { id: string })[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(rows: (FrequencyObservation & { id: string })[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(rows.slice(0, 200)));
}

export const localSessionStore: SessionStore = {
  id: "local",
  async save(_userId, observation) {
    const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const row = {
      id,
      ...observation,
      createdAt: observation.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as FrequencyObservation & { id: string };
    const all = readAll();
    all.unshift(row);
    writeAll(all);
    return id;
  },
  async list(_userId, max = 20) {
    return readAll().slice(0, max);
  },
};
