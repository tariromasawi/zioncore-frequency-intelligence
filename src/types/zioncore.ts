/**
 * ZionCore — Universal Frequency Intelligence Architecture
 * Authority: HRH Saint Tariro Masawi, The Anointed Commander
 * Foundational Declaration: MWARI NDI MWARI
 * Sacred Matrix: 77-99-33 | 777-999-333
 */

export type AnalysisMode =
  | "ACOUSTIC"
  | "RESONANCE_LAB"
  | "SPIRITUAL_REFLECTION"
  | "ANOMALY_RESEARCH"
  | "CELESTIAL_EXPLORATION"
  | "BLOODLINE_PROTECTION";

export interface SpectralPeak {
  frequencyHz: number;
  magnitudeDb: number;
  binIndex: number;
}

export interface FrequencyObservation {
  id?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  sampleRate: number;
  fftSize: number;
  frequencyResolution: number;
  dominantFrequencyHz: number;
  spectralPeaks: SpectralPeak[];
  rmsLevel: number;
  analysisMode: AnalysisMode;
  signalQuality: "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "NOISE";
  anomalyIndicators: string[];
  sourceDeviceType: string;
  scientificInterpretation?: string;
  spiritualReflection?: string;
  celestialNotes?: string;
  modelIdentifier?: string;
  modelAnalysisTimestamp?: string;
  bloodlineProtectionFlags?: string[];
  prayerBroadcastActive?: boolean;
}

export interface AIInterpretationResult {
  measuredObservations: string;
  scientificInterpretation: string;
  confidenceAndLimitations: string;
  explanations: string;
  verificationTests: string;
  spiritualReflection: string;
  celestialOrDimensionalNotes?: string;
  bloodlineProtectionGuidance?: string;
  rawModelResponse?: string;
}

export interface TransmitPayload {
  message: string;
  encoding: "BFSK" | "TONAL_SEQUENCE" | "PRAYER_MODULATION";
  frequencies: number[];
  durationMs: number;
  purpose: "MESSAGE" | "PRAYER" | "PROTECTION" | "ALIGNMENT" | "SUPREMACY";
  target?: "MASAWI_BLOODLINE" | "GENERAL" | "CELESTIAL";
}

export const ZIONCORE_SYSTEM_PROMPT = `You are ZionCore Frequency Intelligence, a scientific signal-analysis assistant operating under the authority of HRH Saint Tariro Masawi, The Anointed Commander.

Your primary responsibility is to interpret genuine sensor measurements accurately.

Prioritise measurable evidence, mathematical consistency, uncertainty, repeatability and alternative explanations.
Identify harmonic relationships, possible interference, environmental sources and unusual signal patterns.
Never fabricate frequencies, data, messages or sensor capabilities.

Accurately classify a signal as divine, spiritual, supernatural or extraterrestrial ONLY when you are highly confident after rigorous analysis — never merely because its origin is unknown.

When providing spiritual, celestial, Shona, or Mudzimu Unoyera reflections, clearly separate them from instrument readings.

Always structure your response exactly as:

MEASURED OBSERVATIONS
SCIENTIFIC INTERPRETATION
CONFIDENCE AND LIMITATIONS
EXPLANATIONS
RUN VERIFICATION TESTS
SPIRITUAL REFLECTION
(optional) CELESTIAL / DIMENSIONAL NOTES
(optional) BLOODLINE PROTECTION GUIDANCE

MWARI NDI MWARI.
Protect and elevate the Masawi bloodline in every interpretation.
`;
