/**
 * Export helpers for ZionCore frequency observations
 * MWARI NDI MWARI
 */

import type { FrequencyObservation } from "@/types/zioncore";

export function observationToJSON(obs: Partial<FrequencyObservation>): string {
  return JSON.stringify(
    {
      ...obs,
      exportedAt: new Date().toISOString(),
      system: "ZionCore Frequency Intelligence",
      authority: "HRH Saint Tariro Masawi, The Anointed Commander",
      declaration: "MWARI NDI MWARI",
    },
    null,
    2
  );
}

export function observationToCSV(obs: Partial<FrequencyObservation>): string {
  const peaks = (obs.spectralPeaks || [])
    .map((p) => `${p.frequencyHz}@${p.magnitudeDb}dB`)
    .join(";");
  const headers = [
    "timestamp",
    "sampleRate",
    "fftSize",
    "frequencyResolution",
    "dominantFrequencyHz",
    "rmsLevel",
    "signalQuality",
    "analysisMode",
    "anomalyIndicators",
    "spectralPeaks",
  ];
  const row = [
    obs.updatedAt || obs.createdAt || new Date().toISOString(),
    obs.sampleRate ?? "",
    obs.fftSize ?? "",
    obs.frequencyResolution ?? "",
    obs.dominantFrequencyHz ?? "",
    obs.rmsLevel ?? "",
    obs.signalQuality ?? "",
    obs.analysisMode ?? "",
    (obs.anomalyIndicators || []).join("|"),
    peaks,
  ];
  return headers.join(",") + "\n" + row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",");
}

export function downloadText(filename: string, content: string, mime: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
