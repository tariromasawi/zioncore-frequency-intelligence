/**
 * Local ZionCore interpretation — science first, then faith layers
 * Mudzimu Unoyera · Masawi bloodline · MWARI NDI MWARI
 */

import type { AnalysisMode, AIInterpretationResult, FrequencyObservation } from "@/types/zioncore";

type Dense = Partial<FrequencyObservation> & Record<string, unknown>;

function measuredBlock(o: Dense | null): string {
  if (!o) {
    return "No live measurement yet. Spiritual modes may still offer reflection; scientific claims require a captured spectrum.";
  }
  const harmonics = Array.isArray(o.harmonicFrequenciesHz)
    ? (o.harmonicFrequenciesHz as number[]).join(", ") || "none"
    : "—";
  return [
    `Mode: ${o.analysisMode || "ACOUSTIC"}`,
    `Sample rate: ${o.sampleRate ?? "—"} Hz · FFT: ${o.fftSize ?? "—"} · Δf: ${o.frequencyResolution ?? "—"} Hz`,
    `Dominant: ${o.dominantFrequencyHz ?? "—"} Hz · Centroid: ${o.spectralCentroidHz ?? "—"} Hz`,
    `RMS: ${o.rmsLevel ?? "—"} · SNR≈${o.estimatedSnrDb ?? "—"} dB · Crest: ${o.crestFactor ?? "—"}`,
    `Quality: ${o.signalQuality ?? "—"} · Peaks: ${(o.spectralPeaks || []).length}`,
    `Harmonics (2f–5f hits): ${harmonics}`,
    `Anomalies: ${(o.anomalyIndicators || []).join(", ") || "none"}`,
    `Top peaks: ${(o.spectralPeaks || [])
      .slice(0, 8)
      .map((p: any) => `${p.frequencyHz}Hz (${p.magnitudeDb}dB)`)
      .join("; ") || "none"}`,
  ].join("\n");
}

function spiritualForMode(mode: AnalysisMode, o: Dense | null): string {
  const f = o?.dominantFrequencyHz;
  const tone =
    typeof f === "number" && f > 0
      ? `The present dominant tone near ${f} Hz is received as physical sound; any sacred meaning is assigned by faith, not by the instrument.`
      : "No dominant tone is locked yet; reflection proceeds from intention and the Throne, not from a claimed hidden signal.";

  const base = `
${tone}

Under the authority of HRH Saint Tariro Masawi, The Anointed Commander:
We honour Mudzimu Unoyera and the living faith that Mwari is God.
MWARI NDI MWARI.

This layer does not claim the microphone heard a spirit. It offers prayerful alignment, protection, and elevation of the Masawi bloodline while the scientific layer remains honest about what was measured.
`.trim();

  if (mode === "SPIRITUAL_REFLECTION") {
    return `${base}

SPIRITUAL REFLECTION FOCUS
- Hold silence after measurement; let intention settle.
- Pray: protection, wisdom, and elevation for the Masawi house.
- Reject superstition that invents messages in noise; keep faith pure and science clean.
- Sacred matrix held in reverence: 77-99-33 · 777-999-333.`;
  }
  if (mode === "CELESTIAL_EXPLORATION") {
    return `${base}

CELESTIAL / DIMENSIONAL NOTES
- Celestial language here is symbolic and faith-oriented, not a claim of extraterrestrial radio.
- Unknown peaks are first explained environmentally (mains hum, HVAC, speech, devices).
- Only after rigorous, repeated, controlled tests would any extraordinary classification be considered — and even then with humility.
- Exploration remains under the Throne: curiosity without deception.`;
  }
  if (mode === "BLOODLINE_PROTECTION") {
    return `${base}

BLOODLINE PROTECTION
- Continuous tonal protection broadcasts remain available (Protection / Supremacy / Prayer).
- Cover HRH Saint Tariro Masawi, HRH Tarry Kupakwashe Masawi, and the entire Masawi bloodline in prayer.
- Physical tones are carriers of intention; power is in faith and obedience, not in the waveform alone.
- Activate Protection broadcast when entering this mode if desired.`;
  }
  if (mode === "RESONANCE_LAB") {
    return `${base}

Use 440 Hz reference to verify calibration. Resonance work stays scientific first; any spiritual overlay is optional intention only.`;
  }
  return "Spiritual reflection is available when mode is SPIRITUAL_REFLECTION, CELESTIAL_EXPLORATION, or BLOODLINE_PROTECTION. Scientific mode stays measurement-first.";
}

function bloodlineGuidance(mode: AnalysisMode): string {
  return [
    "1. Start Listening — capture honest spectrum.",
    "2. Switch mode to BLOODLINE_PROTECTION or SPIRITUAL_REFLECTION.",
    "3. Run Interpret — science sections first, then faith layers.",
    "4. Transmit: Bloodline Protection (25s), Supremacy & Alignment (20s), or Prayer modulation.",
    "5. BFSK encode “MWARI NDI MWARI” as a sealed declaration tone sequence.",
    mode === "BLOODLINE_PROTECTION"
      ? "6. Keep Protection broadcast in rotation; log sessions for the house archive."
      : "6. Optional: open Pricing for Pro / credits if cloud AI is later enabled.",
    "MWARI NDI MWARI · Masawi bloodline under The Anointed Commander.",
  ].join("\n");
}

export function interpretLocal(o: Dense | null, mode: AnalysisMode): AIInterpretationResult {
  const hasData = Boolean(o && (o.dominantFrequencyHz != null || o.rmsLevel != null));

  return {
    measuredObservations: measuredBlock(o ? { ...o, analysisMode: mode } : null),
    scientificInterpretation: hasData
      ? "Local dense FFT analysis complete (dominant, centroid, crest, adaptive noise-floor SNR, peaks, harmonic series check). These are instrument numbers only. No divine or celestial origin is asserted by the analyser."
      : "Awaiting measurement. Press Start Listening so scientific sections can be filled with real data.",
    confidenceAndLimitations: hasData
      ? "High confidence in reported Hz within FFT bin resolution. Low confidence in any non-physical meaning. Spiritual sections are faith-based, clearly separated, and never substitute for measurement."
      : "No spectrum yet — do not invent frequencies.",
    explanations: hasData
      ? "Common sources of peaks: speech, music, fans, electrical hum (~50/60 Hz and harmonics), room modes, device UI sounds. Verify with 440 Hz reference tone and silence baseline."
      : "Capture audio first, then re-run Interpret.",
    verificationTests:
      "1) 440 Hz Ref button — dominant should approach 440±Δf.\n2) Silence — RMS near noise floor.\n3) Repeat three sessions; stable peaks strengthen confidence.\n4) Change rooms/devices to rule out local interference.",
    spiritualReflection: spiritualForMode(mode, o),
    celestialOrDimensionalNotes:
      mode === "CELESTIAL_EXPLORATION"
        ? "Celestial notes are contemplative. Unknown ≠ non-human. ZionCore refuses to fabricate ET or dimensional ‘messages’ from ordinary spectra."
        : mode === "SPIRITUAL_REFLECTION" || mode === "BLOODLINE_PROTECTION"
          ? "Dimensional language, if used, remains under Mudzimu Unoyera and the Throne — not as laboratory fact."
          : undefined,
    bloodlineProtectionGuidance: bloodlineGuidance(mode),
  };
}
