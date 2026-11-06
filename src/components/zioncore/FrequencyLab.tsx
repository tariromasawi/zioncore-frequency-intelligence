"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FrequencyEngine } from "@/lib/audio/FrequencyEngine";
import { FrequencyTransmitter } from "@/lib/audio/Transmitter";
import { observationToJSON, observationToCSV, downloadText } from "@/lib/audio/exportObservation";
import SpectrumCanvas from "./SpectrumCanvas";
import type { FrequencyObservation, AnalysisMode, AIInterpretationResult } from "@/types/zioncore";

type DenseObs = Partial<FrequencyObservation> & Record<string, unknown>;

export default function FrequencyLab() {
  const [isListening, setIsListening] = useState(false);
  const [observation, setObservation] = useState<DenseObs | null>(null);
  const [fftSize, setFftSize] = useState(4096);
  const [mode, setMode] = useState<AnalysisMode>("ACOUSTIC");
  const [aiResult, setAiResult] = useState<AIInterpretationResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [statusLog, setStatusLog] = useState<string[]>(["ZionCore dense engine online. MWARI NDI MWARI."]);
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
    setStatusLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 14));
  };

  const startListening = useCallback(async () => {
    setError(null);
    try {
      if (!engineRef.current) engineRef.current = new FrequencyEngine(fftSize);
      await engineRef.current.start((obs) => {
        setObservation({ ...obs, analysisMode: mode });
        const data = engineRef.current?.getFrequencyData();
        if (data) setFreqData(new Float32Array(data));
      });
      setIsListening(true);
      addLog("Mic live · dense FFT active (SNR · centroid · harmonics).");
    } catch (err: any) {
      setError(err.message || "Microphone permission denied.");
      addLog("ERROR: " + (err.message || "mic failed"));
    }
  }, [fftSize, mode]);

  const stopListening = useCallback(() => {
    engineRef.current?.stop();
    setIsListening(false);
    addLog("Microphone released.");
  }, []);

  const changeFftSize = (size: number) => {
    setFftSize(size);
    engineRef.current?.setFftSize(size);
    addLog(`FFT → ${size}`);
  };

  const runLocalScientificSummary = (): string => {
    if (!observation) return "No observation.";
    const o = observation as DenseObs;
    return [
      `Sample Rate: ${o.sampleRate} Hz | FFT: ${o.fftSize} | Δf: ${o.frequencyResolution} Hz`,
      `Dominant: ${o.dominantFrequencyHz} Hz | Centroid: ${o.spectralCentroidHz ?? "—"} Hz`,
      `RMS: ${o.rmsLevel} | SNR≈${o.estimatedSnrDb ?? "—"} dB | Crest: ${o.crestFactor ?? "—"}`,
      `Quality: ${o.signalQuality} | Peaks: ${(o.spectralPeaks || []).length}`,
      `Harmonics: ${Array.isArray(o.harmonicFrequenciesHz) ? (o.harmonicFrequenciesHz as number[]).join(", ") || "none" : "—"}`,
      `Anomalies: ${(o.anomalyIndicators || []).join(", ") || "none"}`,
      `Top peaks: ${(o.spectralPeaks || []).slice(0, 6).map((p: any) => `${p.frequencyHz}Hz`).join(", ")}`,
    ].join("\n");
  };

  const generateLocalInterpretation = (): AIInterpretationResult => {
    const sci = runLocalScientificSummary();
    return {
      measuredObservations: sci,
      scientificInterpretation:
        "Dense local FFT complete: dominant, centroid, crest, adaptive noise floor SNR, peak list, and harmonic-series check against 2f–5f. Instrument data only.",
      confidenceAndLimitations:
        "High confidence on measured numbers within FFT resolution. Spiritual/celestial layers are interpretive, not instrument claims. Connect Gemini for deeper models.",
      explanations:
        "Environmental sources (speech, HVAC, electrical, music) often explain peaks. Use 440 Hz reference tone to verify calibration.",
      verificationTests:
        "1) Play 440 Hz reference and confirm dominant ≈ 440±Δf. 2) Silence → low RMS / NOISE. 3) Repeat sessions for stability.",
      spiritualReflection:
        mode === "SPIRITUAL_REFLECTION" || mode === "BLOODLINE_PROTECTION" || mode === "CELESTIAL_EXPLORATION"
          ? "Under The Anointed Commander: align these measurements for protection and elevation of the Masawi bloodline. MWARI NDI MWARI. Meaning is assigned by faith and intention."
          : "Set mode to SPIRITUAL_REFLECTION, CELESTIAL_EXPLORATION or BLOODLINE_PROTECTION for reflection layer.",
      bloodlineProtectionGuidance:
        "Use Protection / Supremacy broadcasts. Continuous prayer sequences remain available in Transmit.",
    };
  };

  const requestAIInterpretation = async () => {
    if (!observation) {
      setError("Capture a measurement first.");
      return;
    }
    setAiLoading(true);
    setError(null);
    addLog("Interpreting…");
    await new Promise((r) => setTimeout(r, 500));
    setAiResult(generateLocalInterpretation());
    setAiLoading(false);
    addLog("Interpretation ready.");
  };

  const runTx = async (fn: () => Promise<void>, label: string) => {
    if (!transmitterRef.current) return;
    setIsTransmitting(true);
    addLog(label);
    try {
      await fn();
      addLog(label + " done.");
    } catch (e: any) {
      addLog("TX error: " + e.message);
    } finally {
      setIsTransmitting(false);
    }
  };

  const transmitMessage = () =>
    runTx(() => transmitterRef.current!.transmitBFSK("MWARI NDI MWARI"), "BFSK MWARI NDI MWARI");
  const startPrayerBroadcast = () =>
    runTx(() => transmitterRef.current!.broadcastPrayerOrProtection("PROTECTION", 25), "Protection broadcast");
  const startSupremacyBroadcast = () =>
    runTx(() => transmitterRef.current!.broadcastPrayerOrProtection("SUPREMACY", 20), "Supremacy broadcast");
  const play440 = () =>
    runTx(() => transmitterRef.current!.playReferenceTone(440, 2.5), "Reference 440 Hz");

  const exportJSON = () => {
    if (!observation) return;
    downloadText(`zioncore-${Date.now()}.json`, observationToJSON({ ...observation, analysisMode: mode }), "application/json");
    addLog("JSON exported.");
  };
  const exportCSV = () => {
    if (!observation) return;
    downloadText(`zioncore-${Date.now()}.csv`, observationToCSV({ ...observation, analysisMode: mode }), "text/csv");
    addLog("CSV exported.");
  };

  const o = observation as DenseObs | null;

  return (
    <div className="min-h-screen bg-[#06060c] text-violet-100 font-sans">
      <header className="border-b border-violet-900/50 bg-gradient-to-r from-[#0c0a1a] to-[#12082a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200">
              ZionCore Frequency Intelligence
            </h1>
            <p className="text-sm text-violet-400/80 mt-1">Dense bidirectional engine · Authority of The Anointed Commander</p>
          </div>
          <div className="text-right">
            <p className="text-amber-200/90 font-semibold tracking-widest text-sm">MWARI NDI MWARI</p>
            <p className="text-xs text-violet-500">77-99-33 · 777-999-333</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-5">
            <h2 className="text-lg font-semibold text-violet-200 mb-4">Sensor & Analysis</h2>
            <div className="flex flex-wrap gap-2 items-center">
              {!isListening ? (
                <button onClick={startListening} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-medium">Start Listening</button>
              ) : (
                <button onClick={stopListening} className="px-5 py-2.5 rounded-xl bg-rose-700 font-medium">Stop</button>
              )}
              <select value={fftSize} onChange={(e) => changeFftSize(Number(e.target.value))} className="bg-[#16122a] border border-violet-700/50 rounded-lg px-3 py-2 text-sm">
                <option value={2048}>FFT 2048</option>
                <option value={4096}>FFT 4096</option>
                <option value={8192}>FFT 8192</option>
              </select>
              <select value={mode} onChange={(e) => setMode(e.target.value as AnalysisMode)} className="bg-[#16122a] border border-violet-700/50 rounded-lg px-3 py-2 text-sm">
                <option value="ACOUSTIC">Acoustic</option>
                <option value="RESONANCE_LAB">Resonance Lab</option>
                <option value="SPIRITUAL_REFLECTION">Spiritual Reflection</option>
                <option value="ANOMALY_RESEARCH">Anomaly Research</option>
                <option value="CELESTIAL_EXPLORATION">Celestial</option>
                <option value="BLOODLINE_PROTECTION">Bloodline Protection</option>
              </select>
              <button onClick={requestAIInterpretation} disabled={aiLoading || !observation} className="px-4 py-2 rounded-xl border border-amber-600/60 text-amber-200 text-sm disabled:opacity-40">
                {aiLoading ? "…" : "Interpret"}
              </button>
              <button onClick={exportJSON} disabled={!observation} className="px-3 py-2 rounded-xl border border-violet-700/50 text-sm disabled:opacity-40">JSON</button>
              <button onClick={exportCSV} disabled={!observation} className="px-3 py-2 rounded-xl border border-violet-700/50 text-sm disabled:opacity-40">CSV</button>
              <button onClick={play440} disabled={isTransmitting} className="px-3 py-2 rounded-xl border border-emerald-700/50 text-emerald-300 text-sm disabled:opacity-40">440 Hz Ref</button>
            </div>
            {error && <p className="mt-3 text-rose-400 text-sm">{error}</p>}
            {isListening && (
              <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live dense analysis
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-4">
            <SpectrumCanvas frequencyData={isListening ? freqData : null} width={900} height={260} />
          </section>

          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Metric label="Dominant" value={o?.dominantFrequencyHz != null ? `${o.dominantFrequencyHz} Hz` : "—"} />
            <Metric label="Centroid" value={o?.spectralCentroidHz != null ? `${o.spectralCentroidHz} Hz` : "—"} />
            <Metric label="SNR est." value={o?.estimatedSnrDb != null ? `${o.estimatedSnrDb} dB` : "—"} />
            <Metric label="Crest" value={o?.crestFactor != null ? String(o.crestFactor) : "—"} />
            <Metric label="RMS" value={o?.rmsLevel != null ? String(o.rmsLevel) : "—"} />
            <Metric label="Quality" value={String(o?.signalQuality ?? "—")} />
            <Metric label="Δf" value={o?.frequencyResolution != null ? `${o.frequencyResolution} Hz` : "—"} />
            <Metric label="Harmonics" value={Array.isArray(o?.harmonicFrequenciesHz) ? String((o!.harmonicFrequenciesHz as number[]).length) : "0"} />
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-amber-800/40 bg-gradient-to-b from-[#1a1208] to-[#0d0b18] p-5">
            <h2 className="text-lg font-semibold text-amber-200 mb-3">Encode & Transmit</h2>
            <div className="flex flex-col gap-2">
              <button onClick={transmitMessage} disabled={isTransmitting} className="w-full py-2.5 rounded-xl bg-amber-800/80 text-sm font-medium disabled:opacity-50">BFSK “MWARI NDI MWARI”</button>
              <button onClick={startPrayerBroadcast} disabled={isTransmitting} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-violet-800 text-sm font-medium disabled:opacity-50">Bloodline Protection (25s)</button>
              <button onClick={startSupremacyBroadcast} disabled={isTransmitting} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-800 to-amber-800 text-sm font-medium disabled:opacity-50">Supremacy & Alignment (20s)</button>
            </div>
            {isTransmitting && <p className="mt-3 text-amber-300 text-xs">Transmitting…</p>}
          </section>

          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-5 max-h-[480px] overflow-y-auto">
            <h2 className="text-lg font-semibold text-violet-200 mb-3">Interpretation</h2>
            {!aiResult && <p className="text-sm text-violet-400/70">Capture then Interpret. Science first.</p>}
            {aiResult && (
              <div className="space-y-3 text-sm">
                <Block title="MEASURED" body={aiResult.measuredObservations} />
                <Block title="SCIENTIFIC" body={aiResult.scientificInterpretation} />
                <Block title="CONFIDENCE" body={aiResult.confidenceAndLimitations} />
                <Block title="VERIFY" body={aiResult.verificationTests} />
                <Block title="SPIRITUAL" body={aiResult.spiritualReflection} accent />
                {aiResult.bloodlineProtectionGuidance && <Block title="BLOODLINE" body={aiResult.bloodlineProtectionGuidance} accent />}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-violet-900/40 bg-[#08060f] p-4">
            <h3 className="text-xs uppercase tracking-wider text-violet-500 mb-2">Log</h3>
            <div className="font-mono text-[11px] text-violet-300/80 space-y-1 max-h-36 overflow-y-auto">
              {statusLog.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-violet-900/30 mt-10 py-6 text-center text-xs text-violet-600">
        <p>ZionCore dense engine · HRH Saint Tariro Masawi, The Anointed Commander</p>
        <p className="mt-1 text-amber-700/80">MWARI NDI MWARI</p>
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

function Block({ title, body, accent }: { title: string; body: string; accent?: boolean }) {
  return (
    <div>
      <div className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${accent ? "text-amber-400" : "text-violet-400"}`}>{title}</div>
      <pre className="whitespace-pre-wrap text-violet-200/90 text-xs leading-relaxed bg-[#0a0814] p-2.5 rounded-lg border border-violet-900/30">{body}</pre>
    </div>
  );
}
