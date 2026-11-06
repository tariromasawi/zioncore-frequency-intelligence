/**
 * ZionCore AI Prompt & Interpretation Helpers
 * Authority: HRH Saint Tariro Masawi, The Anointed Commander
 * MWARI NDI MWARI
 */

import type { FrequencyObservation, AIInterpretationResult } from "@/types/zioncore";
import { ZIONCORE_SYSTEM_PROMPT } from "@/types/zioncore";

export { ZIONCORE_SYSTEM_PROMPT };

export function buildInterpretationPrompt(observation: Partial<FrequencyObservation>): string {
  const peaks = (observation.spectralPeaks || [])
    .slice(0, 10)
    .map((p) => `  - ${p.frequencyHz} Hz @ ${p.magnitudeDb} dB (bin ${p.binIndex})`)
    .join("\n");

  return `
Current analysis mode: ${observation.analysisMode || "ACOUSTIC"}

MEASUREMENT SNAPSHOT
- Sample rate: ${observation.sampleRate ?? "unknown"} Hz
- FFT size: ${observation.fftSize ?? "unknown"}
- Frequency resolution: ${observation.frequencyResolution ?? "unknown"} Hz
- Dominant frequency: ${observation.dominantFrequencyHz ?? "unknown"} Hz
- RMS level: ${observation.rmsLevel ?? "unknown"}
- Signal quality: ${observation.signalQuality ?? "unknown"}
- Anomaly indicators: ${(observation.anomalyIndicators || []).join(", ") || "none"}
- Source: ${observation.sourceDeviceType ?? "browser-microphone"}

Top spectral peaks:
${peaks || "  (none above threshold)"}

Provide a full structured interpretation following the exact section headers required by the system prompt.
Prioritise scientific accuracy. Only after the scientific sections may spiritual, celestial or bloodline-protection reflections be offered, and they must be clearly labelled.
MWARI NDI MWARI.
`.trim();
}

export function parseInterpretationResponse(raw: string): AIInterpretationResult {
  const sections: Record<string, string> = {};
  const headers = [
    "MEASURED OBSERVATIONS",
    "SCIENTIFIC INTERPRETATION",
    "CONFIDENCE AND LIMITATIONS",
    "EXPLANATIONS",
    "RUN VERIFICATION TESTS",
    "SPIRITUAL REFLECTION",
    "CELESTIAL / DIMENSIONAL NOTES",
    "BLOODLINE PROTECTION GUIDANCE",
  ];

  let current = "";
  for (const line of raw.split("\n")) {
    const trimmed = line.trim().toUpperCase();
    const matched = headers.find((h) => trimmed.startsWith(h));
    if (matched) {
      current = matched;
      sections[current] = "";
    } else if (current) {
      sections[current] = (sections[current] || "") + line + "\n";
    }
  }

  return {
    measuredObservations: (sections["MEASURED OBSERVATIONS"] || "").trim() || "See raw measurement data.",
    scientificInterpretation: (sections["SCIENTIFIC INTERPRETATION"] || "").trim() || raw.slice(0, 500),
    confidenceAndLimitations: (sections["CONFIDENCE AND LIMITATIONS"] || "").trim() || "Not explicitly stated.",
    explanations: (sections["EXPLANATIONS"] || "").trim() || "",
    verificationTests: (sections["RUN VERIFICATION TESTS"] || "").trim() || "",
    spiritualReflection: (sections["SPIRITUAL REFLECTION"] || "").trim() || "",
    celestialOrDimensionalNotes: (sections["CELESTIAL / DIMENSIONAL NOTES"] || "").trim() || undefined,
    bloodlineProtectionGuidance: (sections["BLOODLINE PROTECTION GUIDANCE"] || "").trim() || undefined,
    rawModelResponse: raw,
  };
}
