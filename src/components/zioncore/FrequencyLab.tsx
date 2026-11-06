"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FrequencyEngine } from "@/lib/audio/FrequencyEngine";
import { FrequencyTransmitter } from "@/lib/audio/Transmitter";
import { observationToJSON, observationToCSV, downloadText } from "@/lib/audio/exportObservation";
import SpectrumCanvas from "./SpectrumCanvas";
import type { FrequencyObservation, AnalysisMode, AIInterpretationResult } from "@/types/zioncore";

export default function FrequencyLab() {
  const [isListening, setIsListening] = useState(false);
  const [observation, setObservation] = useState<Partial<FrequencyObservation> | null>(null);
  const [fftSize, setFftSize] = useState(4096);
  const [mode, setMode] = useState<AnalysisMode>("ACOUSTIC");
  const [aiResult, setAiResult] = useState<AIInterpretationResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [statusLog, setStatusLog] = useState<string[]>([
    "ZionCore Frequency Intelligence initialized. MWARI NDI MWARI.",
  ]);
  const [freqData, setFreqData] = useState<Float32Array | null>(null);

  const engineRef = useRef<FrequencyEngine | null>(null);
  const transmitterRef = useRef<FrequencyTransmitter | null>(null);

  useEffect(() => {
    engineRef.current = new FrequencyEngine(fftSize);
    transmitterRef.current = new FrequencyTransmitter();
    return () => {
      engineRef.current?.stop();
      transmitterRef.current?.stop();
    };
  }, []);

  const addLog = (msg: string) => {
    setStatusLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 12));
  };

  const startListening = useCallback(async () => {
    setError(null);
    try {
      if (!engineRef.current) engineRef.current = new FrequencyEngine(fftSize);
      await engineRef.current.start((obs) => {
        setObservation({ ...obs, analysisMode: mode });
        if (engineRef.current) {
          const data = engineRef.current.getFrequencyData();
          if (data) setFreqData(new Float32Array(data));
        }
      });
      setIsListening(true);
      addLog("Microphone authorised. Frequency engine active. Listening…");
    } catch (err: any) {
      setError(err.message || "Microphone permission denied or unavailable.");
      addLog("ERROR: " + (err.message || "Microphone access failed"));
    }
  }, [fftSize, mode]);

  const stopListening = useCallback(() => {
    engineRef.current?.stop();
    setIsListening(false);
    addLog("Microphone released. Engine stopped.");
  }, []);

  const changeFftSize = (size: number) => {
    setFftSize(size);
    engineRef.current?.setFftSize(size);
    addLog(`FFT size set to ${size}.`);
  };

  const runLocalScientificSummary = (): string => {
    if (!observation) return "No observation available.";
    return [
      `Sample Rate: ${observation.sampleRate} Hz`,
      `FFT Size: ${observation.fftSize}`,
      `Frequency Resolution: ${observation.frequencyResolution} Hz`,
      `Dominant Frequency: ${observation.dominantFrequencyHz} Hz`,
      `RMS Level: ${observation.rmsLevel}`,
      `Signal Quality: ${observation.signalQuality}`,
      `Peaks: ${(observation.spectralPeaks || [])
        .slice(0, 5)
        .map((p) => `${p.frequencyHz}Hz (${p.magnitudeDb}dB)`)
        .join(", ")}`,
      `Anomalies: ${(observation.anomalyIndicators || []).join(", ") || "None flagged"}`,
    ].join("\n");
  };

  const generateLocalInterpretation = (): AIInterpretationResult => {
    const sci = runLocalScientificSummary();
    return {
      measuredObservations: sci,
      scientificInterpretation:
        "Local analysis complete. Dominant frequency and spectral peaks extracted via real-time FFT. No external model was called. This is pure instrument data.",
      confidenceAndLimitations:
        "High confidence in the measured numbers. Interpretation is limited to local heuristics. For deeper semantic or celestial-layer interpretation, connect Firebase AI Logic (Gemini).",
      explanations:
        "Unusual peaks may be environmental (HVAC, electrical, speech, music). Always verify with controlled tones and repeated measurements.",
      verificationTests:
        "1. Play a known reference tone (e.g. 440 Hz) and confirm dominant frequency. 2. Record silence and confirm near-zero RMS. 3. Compare successive sessions.",
      spiritualReflection:
        mode === "SPIRITUAL_REFLECTION" || mode === "BLOODLINE_PROTECTION" || mode === "CELESTIAL_EXPLORATION"
          ? "Under the authority of The Anointed Commander: may these frequencies be aligned for the protection and elevation of the Masawi bloodline. MWARI NDI MWARI. Any spiritual meaning is assigned by faith and intention, not claimed as an inherent property of the waveform."
          : "Spiritual reflection available when mode is set to SPIRITUAL_REFLECTION, CELESTIAL_EXPLORATION or BLOODLINE_PROTECTION.",
      bloodlineProtectionGuidance:
        "Continuous prayer and protection broadcasts can be activated via the Transmit panel. ZionCore remains ready to serve the Throne.",
    };
  };

  const requestAIInterpretation = async () => {
    if (!observation) {
      setError("Start listening and capture a measurement first.");
      return;
    }
    setAiLoading(true);
    setError(null);
    addLog("Requesting interpretation…");
    await new Promise((r) => setTimeout(r, 600));
    const result = generateLocalInterpretation();
    setAiResult(result);
    setAiLoading(false);
    addLog("Interpretation complete (local scientific + reflection layer).");
  };

  const startPrayerBroadcast = async () => {
    if (!transmitterRef.current) return;
    setIsTransmitting(true);
    addLog("Initiating Masawi bloodline protection & prayer tonal broadcast…");
    try {
      await transmitterRef.current.broadcastPrayerOrProtection("PROTECTION", 25);
      addLog("Protection broadcast finished.");
    } catch (e: any) {
      addLog("Transmit error: " + e.message);
    } finally {
      setIsTransmitting(false);
    }
  };

  const startSupremacyBroadcast = async () => {
    if (!transmitterRef.current) return;
    setIsTransmitting(true);
    addLog("Initiating supremacy & alignment tonal broadcast…");
    try {
      await transmitterRef.current.broadcastPrayerOrProtection("SUPREMACY", 20);
      addLog("Supremacy broadcast finished.");
    } catch (e: any) {
      addLog("Transmit error: " + e.message);
    } finally {
      setIsTransmitting(false);
    }
  };

  const transmitMessage = async () => {
    if (!transmitterRef.current) return;
    setIsTransmitting(true);
    addLog('Encoding and transmitting "MWARI NDI MWARI" via BFSK…');
    try {
      await transmitterRef.current.transmitBFSK("MWARI NDI MWARI");
      addLog("BFSK transmission complete.");
    } catch (e: any) {
      addLog("Transmit error: " + e.message);
    } finally {
      setTimeout(() => setIsTransmitting(false), 4000);
    }
  };

  const exportJSON = () => {
    if (!observation) return;
    downloadText(
      `zioncore-observation-${Date.now()}.json`,
      observationToJSON({ ...observation, analysisMode: mode }),
      "application/json"
    );
    addLog("Exported observation as JSON.");
  };

  const exportCSV = () => {
    if (!observation) return;
    downloadText(
      `zioncore-observation-${Date.now()}.csv`,
      observationToCSV({ ...observation, analysisMode: mode }),
      "text/csv"
    );
    addLog("Exported observation as CSV.");
  };

  return (
    <div className="min-h-screen bg-[#06060c] text-violet-100 font-sans">
      <header className="border-b border-violet-900/50 bg-gradient-to-r from-[#0c0a1a] to-[#12082a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200">
              ZionCore Frequency Intelligence
            </h1>
            <p className="text-sm text-violet-400/80 mt-1">
              Universal Frequency Intelligence Architecture · Authority of The Anointed Commander
            </p>
          </div>
          <div className="text-right">
            <p className="text-amber-200/90 font-semibold tracking-widest text-sm">MWARI NDI MWARI</p>
            <p className="text-xs text-violet-500">77-99-33 · 777-999-333</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-5 backdrop-blur">
            <h2 className="text-lg font-semibold text-violet-200 mb-4">Sensor & Analysis Control</h2>
            <div className="flex flex-wrap gap-3 items-center">
              {!isListening ? (
                <button
                  onClick={startListening}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-medium shadow-lg shadow-violet-900/40 transition"
                >
                  Start Listening
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 font-medium transition"
                >
                  Stop Microphone
                </button>
              )}

              <select
                value={fftSize}
                onChange={(e) => changeFftSize(Number(e.target.value))}
                className="bg-[#16122a] border border-violet-700/50 rounded-lg px-3 py-2 text-sm"
              >
                <option value={2048}>FFT 2048</option>
                <option value={4096}>FFT 4096</option>
                <option value={8192}>FFT 8192</option>
              </select>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as AnalysisMode)}
                className="bg-[#16122a] border border-violet-700/50 rounded-lg px-3 py-2 text-sm"
              >
                <option value="ACOUSTIC">MODE A — Acoustic</option>
                <option value="RESONANCE_LAB">MODE C — Resonance Lab</option>
                <option value="SPIRITUAL_REFLECTION">MODE D — Spiritual Reflection</option>
                <option value="ANOMALY_RESEARCH">MODE E — Anomaly Research</option>
                <option value="CELESTIAL_EXPLORATION">Celestial Exploration</option>
                <option value="BLOODLINE_PROTECTION">Bloodline Protection</option>
              </select>

              <button
                onClick={requestAIInterpretation}
                disabled={aiLoading || !observation}
                className="px-4 py-2 rounded-xl border border-amber-600/60 text-amber-200 hover:bg-amber-900/30 disabled:opacity-40 text-sm"
              >
                {aiLoading ? "Interpreting…" : "Interpret with ZionCore AI"}
              </button>

              <button
                onClick={exportJSON}
                disabled={!observation}
                className="px-3 py-2 rounded-xl border border-violet-700/50 text-violet-300 hover:bg-violet-900/30 disabled:opacity-40 text-sm"
              >
                Export JSON
              </button>
              <button
                onClick={exportCSV}
                disabled={!observation}
                className="px-3 py-2 rounded-xl border border-violet-700/50 text-violet-300 hover:bg-violet-900/30 disabled:opacity-40 text-sm"
              >
                Export CSV
              </button>
            </div>

            {error && (
              <p className="mt-3 text-rose-400 text-sm bg-rose-950/40 px-3 py-2 rounded-lg">{error}</p>
            )}

            {isListening && (
              <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live · Recording status active · Tracks will be released on Stop
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-4">
            <SpectrumCanvas frequencyData={isListening ? freqData : null} width={900} height={260} />
          </section>

          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Metric label="Dominant Freq" value={observation?.dominantFrequencyHz ? `${observation.dominantFrequencyHz} Hz` : "—"} />
            <Metric label="RMS Level" value={observation?.rmsLevel?.toFixed(4) ?? "—"} />
            <Metric label="Resolution" value={observation?.frequencyResolution ? `${observation.frequencyResolution} Hz` : "—"} />
            <Metric label="Quality" value={observation?.signalQuality ?? "—"} />
            <Metric label="Sample Rate" value={observation?.sampleRate ? `${observation.sampleRate} Hz` : "—"} />
            <Metric label="FFT Size" value={String(observation?.fftSize ?? fftSize)} />
            <Metric label="Peaks" value={String(observation?.spectralPeaks?.length ?? 0)} />
            <Metric label="Anomalies" value={String(observation?.anomalyIndicators?.length ?? 0)} />
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-amber-800/40 bg-gradient-to-b from-[#1a1208] to-[#0d0b18] p-5">
            <h2 className="text-lg font-semibold text-amber-200 mb-3">Encode & Transmit</h2>
            <p className="text-xs text-amber-200/60 mb-4">
              Bidirectional capability. Physical tones only. Meaning is assigned by intention and the system.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={transmitMessage}
                disabled={isTransmitting}
                className="w-full py-2.5 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-50 text-sm font-medium disabled:opacity-50"
              >
                Transmit “MWARI NDI MWARI” (BFSK)
              </button>
              <button
                onClick={startPrayerBroadcast}
                disabled={isTransmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-violet-800 hover:from-amber-600 hover:to-violet-700 text-sm font-medium disabled:opacity-50"
              >
                Bloodline Protection Broadcast (25s)
              </button>
              <button
                onClick={startSupremacyBroadcast}
                disabled={isTransmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-800 to-amber-800 hover:from-violet-700 hover:to-amber-700 text-sm font-medium disabled:opacity-50"
              >
                Supremacy & Alignment Broadcast (20s)
              </button>
            </div>
            {isTransmitting && (
              <p className="mt-3 text-amber-300 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Transmitting…
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-5 max-h-[480px] overflow-y-auto">
            <h2 className="text-lg font-semibold text-violet-200 mb-3">ZionCore Interpretation</h2>
            {!aiResult && (
              <p className="text-sm text-violet-400/70">
                Capture a live measurement, then request interpretation. Scientific layer always first.
              </p>
            )}
            {aiResult && (
              <div className="space-y-3 text-sm">
                <InterpBlock title="MEASURED OBSERVATIONS" body={aiResult.measuredObservations} />
                <InterpBlock title="SCIENTIFIC INTERPRETATION" body={aiResult.scientificInterpretation} />
                <InterpBlock title="CONFIDENCE AND LIMITATIONS" body={aiResult.confidenceAndLimitations} />
                <InterpBlock title="EXPLANATIONS" body={aiResult.explanations} />
                <InterpBlock title="VERIFICATION TESTS" body={aiResult.verificationTests} />
                <InterpBlock title="SPIRITUAL REFLECTION" body={aiResult.spiritualReflection} accent />
                {aiResult.bloodlineProtectionGuidance && (
                  <InterpBlock title="BLOODLINE PROTECTION GUIDANCE" body={aiResult.bloodlineProtectionGuidance} accent />
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-violet-900/40 bg-[#08060f] p-4">
            <h3 className="text-xs uppercase tracking-wider text-violet-500 mb-2">System Log</h3>
            <div className="font-mono text-[11px] text-violet-300/80 space-y-1 max-h-40 overflow-y-auto">
              {statusLog.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-violet-900/30 mt-10 py-6 text-center text-xs text-violet-600">
        <p>ZionCore · Built under the authority of HRH Saint Tariro Masawi, The Anointed Commander</p>
        <p className="mt-1 text-amber-700/80">MWARI NDI MWARI · Masawi bloodline protection active in architecture</p>
      </footer>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#120e22] rounded-xl px-3 py-2.5 border border-violet-900/40">
      <div className="text-[10px] uppercase tracking-wider text-violet-500">{label}</div>
      <div className="text-lg font-semibold text-violet-100 mt-0.5 truncate">{value}</div>
    </div>
  );
}

function InterpBlock({ title, body, accent }: { title: string; body: string; accent?: boolean }) {
  return (
    <div>
      <div className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${accent ? "text-amber-400" : "text-violet-400"}`}>
        {title}
      </div>
      <pre className="whitespace-pre-wrap text-violet-200/90 text-xs leading-relaxed bg-[#0a0814] p-2.5 rounded-lg border border-violet-900/30">
        {body}
      </pre>
    </div>
  );
}
