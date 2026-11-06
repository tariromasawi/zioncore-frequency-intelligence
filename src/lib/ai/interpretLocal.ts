/**
 * ZionCore Deep Interpretation Engine
 * Multi-domain analysis: physics, DSP, communications, psychoacoustics, environment,
 * then clearly labelled Mudzimu Unoyera / celestial / bloodline layers.
 * Authority: HRH Saint Tariro Masawi · MWARI NDI MWARI
 *
 * Never fabricates divine/ET origin from ordinary spectra.
 */

import type { AnalysisMode, AIInterpretationResult, FrequencyObservation, SpectralPeak } from "@/types/zioncore";

type Dense = Partial<FrequencyObservation> & Record<string, unknown>;

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function bandName(hz: number): string {
  if (hz < 20) return "infrasonic / sub-audible edge";
  if (hz < 60) return "very low / possible mains region";
  if (hz < 250) return "low / bass / room-mode region";
  if (hz < 500) return "low-mid (voice fundamentals often sit here)";
  if (hz < 2000) return "midrange (speech formants, many instruments)";
  if (hz < 6000) return "upper-mid / presence";
  if (hz < 12000) return "high treble";
  if (hz < 18000) return "extreme treble / near ultrasonic for adults";
  return "ultrasonic edge / aliasing risk region";
}

function mainsHint(peaks: SpectralPeak[], df: number): string[] {
  const hints: string[] = [];
  for (const target of [50, 60, 100, 120, 150, 180]) {
    const hit = peaks.find((p) => Math.abs(p.frequencyHz - target) <= Math.max(df * 1.5, 3));
    if (hit) hints.push(`Peak near ${target} Hz (${hit.frequencyHz} Hz @ ${hit.magnitudeDb} dB) — consistent with mains hum / power harmonics in many environments.`);
  }
  return hints;
}

function harmonicAnalysis(dominant: number, peaks: SpectralPeak[], df: number): string {
  if (dominant < 30) return "Dominant too low for reliable harmonic-series classification against 2f–5f.";
  const lines: string[] = [];
  for (let h = 2; h <= 6; h++) {
    const target = dominant * h;
    const hit = peaks.find((p) => Math.abs(p.frequencyHz - target) <= df * 2.5);
    if (hit) {
      lines.push(
        `  H${h}: expected ~${target.toFixed(1)} Hz → observed ${hit.frequencyHz} Hz (Δ=${(hit.frequencyHz - target).toFixed(1)} Hz) magnitude ${hit.magnitudeDb} dB`
      );
    } else {
      lines.push(`  H${h}: expected ~${target.toFixed(1)} Hz → not clearly resolved in top peaks`);
    }
  }
  const hits = lines.filter((l) => l.includes("observed")).length;
  lines.unshift(
    hits >= 2
      ? `Harmonic series: ${hits} partials align with integer multiples of dominant — suggests tonal / voiced / musical source rather than pure noise.`
      : `Harmonic series: weak or absent alignment — spectrum may be noise-like, impulsive, or multi-source.`
  );
  return lines.join("\n");
}

function signalPhysics(o: Dense): string {
  const dom = num(o.dominantFrequencyHz) ?? 0;
  const cent = num(o.spectralCentroidHz);
  const rms = num(o.rmsLevel);
  const snr = num(o.estimatedSnrDb);
  const crest = num(o.crestFactor);
  const df = num(o.frequencyResolution) ?? 1;
  const sr = num(o.sampleRate) ?? 48000;
  const fft = num(o.fftSize) ?? 4096;
  const peaks = (o.spectralPeaks || []) as SpectralPeak[];

  const nyquist = sr / 2;
  const lines: string[] = [];

  lines.push("═══ SIGNAL PHYSICS & DSP ═══");
  lines.push(
    `Sampling theorem: fs=${sr} Hz → Nyquist ${nyquist} Hz. Content above Nyquist cannot be represented and may alias if anti-alias filtering is weak.`
  );
  lines.push(
    `FFT size ${fft} → frequency bin width Δf ≈ ${df.toFixed(3)} Hz. Any reported frequency is quantised to this grid; true tone may sit between bins (picket-fence effect).`
  );
  if (dom > 0) {
    lines.push(
      `Dominant bin energy at ${dom.toFixed(2)} Hz → perceptual band: ${bandName(dom)}. Period of one cycle T=1/f ≈ ${dom > 0 ? (1000 / dom).toFixed(2) : "—"} ms.`
    );
  }
  if (cent != null && dom > 0) {
    const ratio = cent / (dom || 1);
    lines.push(
      `Spectral centroid ${cent.toFixed(1)} Hz (ratio to dominant ≈ ${ratio.toFixed(2)}). Higher centroid than dominant implies energy spread into upper harmonics or noise tilt (brighter timbre).`
    );
  }
  if (rms != null) {
    lines.push(
      `RMS amplitude ${rms.toFixed(5)} (normalised time-domain). This is not dB SPL — browser mics are uncalibrated; treat as relative energy only.`
    );
  }
  if (snr != null) {
    lines.push(
      `Estimated SNR vs adaptive noise floor ≈ ${snr.toFixed(1)} dB. Positive values mean current frame is louder than recent baseline; not laboratory SNR.`
    );
  }
  if (crest != null) {
    lines.push(
      `Crest factor ≈ ${crest.toFixed(2)}. High crest (>6–8) suggests transients/impulses; low crest suggests sustained/noisy/dense signals.`
    );
  }
  lines.push("");
  lines.push("═══ HARMONIC STRUCTURE ═══");
  lines.push(harmonicAnalysis(dom, peaks, df));
  const mains = mainsHint(peaks, df);
  if (mains.length) {
    lines.push("");
    lines.push("═══ POWER-LINE / ENVIRONMENT CUES ═══");
    mains.forEach((m) => lines.push(m));
  }
  return lines.join("\n");
}

function communicationsLayer(o: Dense, mode: AnalysisMode): string {
  const dom = num(o.dominantFrequencyHz) ?? 0;
  const lines: string[] = [];
  lines.push("═══ COMMUNICATIONS / INFORMATION LAYER ═══");
  lines.push(
    "ZionCore BFSK transmitter maps text → binary → two tones (default 440 Hz = 0, 880 Hz = 1) with preamble and checksum. This is intentional, human-designed encoding — not a claim that nature is sending ASCII."
  );
  lines.push(
    "To plant information into the field: write any message in Message Composer → Encode & Transmit. Another ZionCore instance listening with matching freq0/freq1/bit timing can attempt decode."
  );
  if (dom > 400 && dom < 1000) {
    lines.push(
      `Current dominant ${dom.toFixed(1)} Hz sits near common BFSK carriers — if a transmission is active, verify with known test string “MWARI NDI MWARI”.`
    );
  }
  lines.push(
    "Channel limits: speaker↔mic air path, room reverberation, and AGC will distort bit edges. Slow bit rates (higher bit ms) improve robustness."
  );
  if (mode === "ANOMALY_RESEARCH") {
    lines.push(
      "Anomaly mode: prioritise repeatability. A single unexplained peak is not a message. Log three independent captures before elevating curiosity."
    );
  }
  return lines.join("\n");
}

function bioPsycho(o: Dense): string {
  const dom = num(o.dominantFrequencyHz) ?? 0;
  const lines: string[] = [];
  lines.push("═══ BIO / PSYCHOACOUSTICS (non-clinical) ═══");
  lines.push(
    "Human hearing roughly 20 Hz–20 kHz (age-dependent). Speech fundamentals often 85–255 Hz; formants higher."
  );
  if (dom >= 85 && dom <= 300) {
    lines.push(
      `Dominant in ${dom.toFixed(0)} Hz range is compatible with voiced speech or similar biological / vocal sources — hypothesis only.`
    );
  }
  if (dom >= 250 && dom <= 4000) {
    lines.push("Energy in classic speech intelligibility bands may indicate conversation, media, or HVAC tonal components.");
  }
  lines.push(
    "No medical diagnosis is implied. Prolonged loud tones can fatigue hearing — keep transmit volume moderate."
  );
  return lines.join("\n");
}

function domainMatrix(o: Dense | null, mode: AnalysisMode): string {
  const lines: string[] = [];
  lines.push("═══ 24-DOMAIN MASTERY MATRIX (applied snapshot) ═══");
  lines.push(
    "Domains engaged this session (honest scope): classical wave physics · Fourier analysis · digital sampling · spectral estimation · SNR/noise floors · harmonic analysis · environmental acoustics · psychoacoustics · digital modulation (BFSK) · information theory (channel, rate) · HCI/sensor limits · statistical repeatability · communications engineering · signal classification heuristics · anomaly protocol · ethics of extraordinary claims · Shona/Mudzimu Unoyera reflective practice · bloodline protection liturgy (non-instrument) · celestial symbolism (non-instrument) · prayer/intention as human meaning layer · archival logging · product safety (volume) · operator authority under The Anointed Commander · continuous learning loop (save → compare sessions)."
  );
  lines.push(
    `Active analysis mode: ${mode}. Mode biases which reflective sections expand; it does not invent sensor data.`
  );
  if (!o) lines.push("No observation object — matrix remains instructional until Start Listening or file analysis.");
  return lines.join("\n");
}

function measuredBlock(o: Dense | null, mode: AnalysisMode): string {
  if (!o) {
    return [
      "STATUS: No spectrum captured yet.",
      "ACTION: Press Start Listening, or upload/record audio in Message → Frequencies.",
      "NOTE: Spiritual modes may still open faith reflection; scientific claims require data.",
      `Requested mode: ${mode}`,
    ].join("\n");
  }
  const peaks = (o.spectralPeaks || []) as SpectralPeak[];
  const peakLines = peaks
    .slice(0, 12)
    .map(
      (p, i) =>
        `  ${String(i + 1).padStart(2, "0")}. ${p.frequencyHz.toFixed(2)} Hz | ${p.magnitudeDb.toFixed(1)} dB | bin ${p.binIndex} | ${bandName(p.frequencyHz)}`
    )
    .join("\n");

  return [
    `Session mode: ${mode}`,
    `Source device: ${o.sourceDeviceType ?? "unknown"}`,
    `Timestamp: ${o.updatedAt ?? new Date().toISOString()}`,
    `Sample rate: ${o.sampleRate ?? "—"} Hz | FFT: ${o.fftSize ?? "—"} | Δf: ${o.frequencyResolution ?? "—"} Hz`,
    `Dominant frequency: ${o.dominantFrequencyHz ?? "—"} Hz (${bandName(num(o.dominantFrequencyHz) || 0)})`,
    `Spectral centroid: ${o.spectralCentroidHz ?? "—"} Hz`,
    `RMS: ${o.rmsLevel ?? "—"} | Noise-floor RMS: ${o.noiseFloorRms ?? "—"}`,
    `Estimated SNR: ${o.estimatedSnrDb ?? "—"} dB | Crest factor: ${o.crestFactor ?? "—"}`,
    `Signal quality class: ${o.signalQuality ?? "—"}`,
    `Anomaly flags: ${(o.anomalyIndicators || []).join(", ") || "none"}`,
    `Harmonic hits (2f–5f): ${Array.isArray(o.harmonicFrequenciesHz) ? (o.harmonicFrequenciesHz as number[]).join(", ") || "none" : "—"}`,
    `Frame index: ${o.frameIndex ?? "—"}`,
    "",
    "Ranked spectral peaks:",
    peakLines || "  (none above threshold)",
  ].join("\n");
}

function scientificInterpretation(o: Dense | null, mode: AnalysisMode): string {
  if (!o || (num(o.dominantFrequencyHz) == null && num(o.rmsLevel) == null)) {
    return "No measurement body. Scientific interpretation withheld to avoid hallucination.";
  }
  return [
    signalPhysics(o),
    "",
    bioPsycho(o),
    "",
    communicationsLayer(o, mode),
    "",
    domainMatrix(o, mode),
    "",
    "CLASSIFICATION RULE: Instrument data supports acoustic/environmental hypotheses only unless extraordinary, controlled, multi-sensor evidence appears. ZionCore will not label this capture as divine, supernatural, or extraterrestrial merely because origin is unknown.",
  ].join("\n");
}

function confidenceBlock(o: Dense | null): string {
  if (!o) return "Confidence: N/A — no data.";
  const q = String(o.signalQuality || "UNKNOWN");
  const snr = num(o.estimatedSnrDb);
  let conf = "MODERATE on frequency numbers within Δf; LOW on source identity.";
  if (q === "EXCELLENT" || (snr != null && snr > 12)) conf = "HIGH on relative spectral shape and dominant bin; still LOW on absolute SPL and source labels.";
  if (q === "NOISE" || q === "POOR") conf = "LOW–MODERATE: weak signal; peaks may be unstable frame-to-frame.";
  return [
    conf,
    "Limitations:",
    "• Browser microphone response is uneven and uncalibrated (no dB SPL).",
    "• Windowing/leakage spreads pure tones across bins.",
    "• Single microphone cannot do spatial source separation.",
    "• AI/heuristic layers can mis-attribute environmental sounds — always verify.",
    "• Spiritual meaning is not a measurement outcome.",
  ].join("\n");
}

function explanations(o: Dense | null): string {
  if (!o) return "Capture a spectrum to generate competing explanations.";
  const dom = num(o.dominantFrequencyHz) ?? 0;
  const candidates: string[] = [
    "1. Ambient room noise / computer fans / HVAC tonal components.",
    "2. Speech or media playing nearby (check mid-band peaks).",
    "3. Electrical hum (50/60 Hz and harmonics) from power or lighting.",
    "4. Structural vibration / footsteps / handling noise (high crest).",
    "5. Intentional ZionCore BFSK or reference tone if transmit was active.",
    "6. Device UI sounds, notifications, or feedback.",
  ];
  if (dom > 15000) candidates.push("7. Ultrasonic pest devices / poorly filtered switching supplies (verify with second device).");
  if ((o.anomalyIndicators as string[] | undefined)?.includes("HARMONIC_SERIES_DETECTED"))
    candidates.push("8. Sustained pitched source (voice, instrument, alarm) — harmonic series supports this.");
  return [
    "Competing explanations (rank by Occam — simplest first unless evidence contradicts):",
    ...candidates,
    "",
    "What would change ranking: silence test, 440 Hz calibration, device swap, room change, three repeated captures with timestamps.",
  ].join("\n");
}

function verificationTests(): string {
  return [
    "PROTOCOL V1 — VERIFICATION",
    "1. SILENCE BASELINE: Stop all media; note RMS & dominant. Should trend toward noise floor.",
    "2. 440 Hz REF: Press 440 Hz button; dominant should approach 440 ± Δf within 1–2 seconds.",
    "3. KNOWN MESSAGE: Transmit short ASCII via Message Composer; second device Start Listening + tone capture + decode.",
    "4. DEVICE SWAP: Repeat with external USB mic; compare peaks — source-local vs acoustic field.",
    "5. REPEATABILITY: Three sessions ≥30 s apart; stable peaks strengthen confidence.",
    "6. BAND-LIMIT: If possible, cup mic / change distance; near-field vs room change ranking of explanations.",
    "7. ARCHIVE: Save Session + JSON export for Masawi house / research log.",
  ].join("\n");
}

function spiritualDeep(mode: AnalysisMode, o: Dense | null): string {
  const f = num(o?.dominantFrequencyHz);
  const physical =
    f && f > 0
      ? `Physical reading in this moment centres near ${f.toFixed(1)} Hz. That number is air pressure oscillation at the sensor — not a self-authenticating oracle.`
      : "No locked dominant tone yet; faith need not wait on a peak, and peaks must not invent faith.";

  const creed = `
Under authority of HRH Saint Tariro Masawi, The Anointed Commander.
Mudzimu Unoyera is honoured. Mwari is God.
MWARI NDI MWARI.
Sacred matrix held in reverence: 77-99-33 · 777-999-333.

${physical}

Discipline of the house: keep laboratory honesty and living faith in the same room without mixing their claims. The Throne is not proven by a spectrogram; neither is a spectrogram permitted to lie in the name of the Throne.
`.trim();

  if (mode === "SPIRITUAL_REFLECTION") {
    return [
      creed,
      "",
      "REFLECTION PRACTICE",
      "• After capture, sit with measured facts for one breath before assigning meaning.",
      "• Offer prayer for wisdom, purity of intention, and protection over the work.",
      "• Refuse superstition that turns random noise into secret commandments.",
      "• If encoding a prayer as BFSK, remember: the code is a human vessel; power is with Mwari.",
      "• Journal: what was measured · what was prayed · what remains unknown.",
    ].join("\n");
  }
  if (mode === "CELESTIAL_EXPLORATION") {
    return [
      creed,
      "",
      "CELESTIAL DISCIPLINE",
      "• Wonder is permitted; fabrication is not.",
      "• Unknown peaks → environmental checklist first (mains, HVAC, devices, speech).",
      "• Extraterrestrial or ‘dimensional signal’ claims require extraordinary, multi-instrument, repeatable evidence ZionCore does not currently possess from a laptop mic.",
      "• Symbolic celestial language may be used in prayer — never as a substitute for FFT output.",
    ].join("\n");
  }
  if (mode === "BLOODLINE_PROTECTION") {
    return [
      creed,
      "",
      "BLOODLINE COVER",
      "• Speak covering over HRH Saint Tariro Masawi, HRH Tarry Kupakwashe Masawi, and the entire Masawi bloodline.",
      "• Use Protection / Prayer / Supremacy broadcasts as tonal anchors of intention — not as magic frequency spells.",
      "• Encode declarations such as “MWARI NDI MWARI” when sealing a session.",
      "• Archive sessions for the house record.",
    ].join("\n");
  }
  if (mode === "RESONANCE_LAB") {
    return [
      creed,
      "",
      "Resonance lab prioritises calibration (440 Hz), harmonic inspection, and controlled tones. Spiritual overlay optional and secondary.",
    ].join("\n");
  }
  return [
    creed,
    "",
    "Select SPIRITUAL_REFLECTION, CELESTIAL_EXPLORATION, or BLOODLINE_PROTECTION to expand dedicated faith modules while keeping science upstream.",
  ].join("\n");
}

function celestialNotes(mode: AnalysisMode): string | undefined {
  if (mode !== "CELESTIAL_EXPLORATION" && mode !== "SPIRITUAL_REFLECTION" && mode !== "ANOMALY_RESEARCH")
    return undefined;
  return [
    "Celestial / dimensional notes are contemplative metadata.",
    "No claim is made that this capture contains non-terrestrial carriers.",
    "If future multi-sensor arrays, shielded chambers, and independent replication exist, re-open classification with new priors.",
    "Until then: stay curious, stay rigorous, stay under the Throne.",
  ].join("\n");
}

function bloodlineGuidance(mode: AnalysisMode): string {
  return [
    "OPERATIONS — MASAWI HOUSE",
    "1. Capture honest spectrum (mic or external device or upload).",
    "2. Interpret — read MEASURED → SCIENTIFIC before SPIRITUAL.",
    "3. Optional: Message Composer — plant prayer/declaration into BFSK.",
    "4. Broadcast Protection / Prayer / Supremacy as led.",
    "5. Save Session + export JSON for archive.",
    "6. Compare later sessions for stability (learning loop).",
    mode === "BLOODLINE_PROTECTION"
      ? "7. Priority mode: maintain protection rhythm; do not neglect verification tests."
      : "7. Elevate to BLOODLINE_PROTECTION mode when covering the house is the session intent.",
    "MWARI NDI MWARI.",
  ].join("\n");
}

export function interpretLocal(o: Dense | null, mode: AnalysisMode): AIInterpretationResult {
  const obs = o ? { ...o, analysisMode: mode } : null;
  return {
    measuredObservations: measuredBlock(obs, mode),
    scientificInterpretation: scientificInterpretation(obs, mode),
    confidenceAndLimitations: confidenceBlock(obs),
    explanations: explanations(obs),
    verificationTests: verificationTests(),
    spiritualReflection: spiritualDeep(mode, obs),
    celestialOrDimensionalNotes: celestialNotes(mode),
    bloodlineProtectionGuidance: bloodlineGuidance(mode),
  };
}
