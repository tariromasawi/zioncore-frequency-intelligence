"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { FrequencyEngine } from "@/lib/audio/FrequencyEngine";
import { FrequencyTransmitter } from "@/lib/audio/Transmitter";
import { observationToJSON, observationToCSV, downloadText } from "@/lib/audio/exportObservation";
import { interpretLocal } from "@/lib/ai/interpretLocal";
import { getActiveSessionStore, getActiveConnectorId } from "@/lib/connectors";
import SpectrumCanvas from "./SpectrumCanvas";
import MessageComposer from "./MessageComposer";
import InterpretationPanel from "./InterpretationPanel";
import type { FrequencyObservation, AnalysisMode, AIInterpretationResult } from "@/types/zioncore";

type DenseObs = Partial<FrequencyObservation> & Record<string, unknown>;

const SPIRITUAL_MODES: AnalysisMode[] = ["SPIRITUAL_REFLECTION", "CELESTIAL_EXPLORATION", "BLOODLINE_PROTECTION"];

export default function FrequencyLab() {
  const [isListening, setIsListening] = useState(false);
  const [observation, setObservation] = useState<DenseObs | null>(null);
  const [fftSize, setFftSize] = useState(4096);
  const [mode, setMode] = useState<AnalysisMode>("ACOUSTIC");
  const [aiResult, setAiResult] = useState<AIInterpretationResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [statusLog, setStatusLog] = useState<string[]>(["ZionCore deep interpreter online. MWARI NDI MWARI."]);
  const [freqData, setFreqData] = useState<Float32Array | null>(null);
  const [connectorId, setConnectorId] = useState("local");
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

  const engineRef = useRef<FrequencyEngine | null>(null);
  const transmitterRef = useRef<FrequencyTransmitter | null>(null);
  const modeRef = useRef(mode);
  const deviceIdRef = useRef(deviceId);
  modeRef.current = mode;
  deviceIdRef.current = deviceId;

  useEffect(() => {
    engineRef.current = new FrequencyEngine(fftSize);
    transmitterRef.current = new FrequencyTransmitter();
    setConnectorId(getActiveConnectorId());
    return () => {
      engineRef.current?.stop();
      transmitterRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (SPIRITUAL_MODES.includes(mode)) {
      setAiResult(interpretLocal(observation, mode));
      addLog(`Mode → ${mode}`);
    }
  }, [mode]);

  const addLog = (msg: string) => {
    setStatusLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 16));
  };

  const onObs = useCallback((obs: Partial<FrequencyObservation> & Record<string, unknown>) => {
    setObservation({ ...obs, analysisMode: modeRef.current });
    const data = engineRef.current?.getFrequencyData();
    if (data) setFreqData(new Float32Array(data));
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    try {
      if (!engineRef.current) engineRef.current = new FrequencyEngine(fftSize);
      await engineRef.current.start(onObs, { deviceId: deviceIdRef.current });
      setIsListening(true);
      addLog("Listening · dense FFT");
    } catch (err: any) {
      setError(err.message || "Mic denied");
      addLog("ERROR: " + (err.message || "mic"));
    }
  }, [fftSize, onObs]);

  const stopListening = useCallback(() => {
    engineRef.current?.stop();
    setIsListening(false);
    addLog("Stopped");
  }, []);

  const requestAIInterpretation = async () => {
    setAiLoading(true);
    addLog("Deep multi-domain interpretation…");
    await new Promise((r) => setTimeout(r, 600));
    setAiResult(interpretLocal(observation, mode));
    setAiLoading(false);
    addLog("Deep report ready");
  };

  const runTx = async (fn: () => Promise<void>, label: string) => {
    if (!transmitterRef.current) return;
    setIsTransmitting(true);
    addLog(label);
    try {
      await fn();
      addLog(label + " done");
    } catch (e: any) {
      addLog("TX: " + e.message);
    } finally {
      setIsTransmitting(false);
    }
  };

  const transmitCustom = async (message: string, opts: { freq0: number; freq1: number; bitDurationMs: number }) => {
    await runTx(
      () => transmitterRef.current!.transmitBFSK(message, opts),
      `BFSK ${message.slice(0, 20)}`
    );
  };

  const analyseFile = async (file: Blob) => {
    try {
      if (isListening) stopListening();
      if (!engineRef.current) engineRef.current = new FrequencyEngine(fftSize);
      addLog("File analysis…");
      await engineRef.current.analyseFile(file, onObs);
      addLog("File ready — Deep Interpret");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const o = observation as DenseObs | null;

  return (
    <div className="min-h-screen bg-[#06060c] text-violet-100">
      <header className="border-b border-violet-900/50 bg-gradient-to-r from-[#0c0a1a] to-[#12082a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200">ZionCore Frequency Intelligence</h1>
            <p className="text-sm text-violet-400 mt-1">Deep multi-domain interpreter · science first · Mudzimu Unoyera</p>
          </div>
          <div className="text-right">
            <p className="text-amber-200 font-semibold tracking-widest text-sm">MWARI NDI MWARI</p>
            <Link href="/pricing" className="text-xs text-violet-400 underline">Pricing</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-5">
            <div className="flex flex-wrap gap-2">
              {!isListening ? (
                <button onClick={startListening} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-medium">Start Listening</button>
              ) : (
                <button onClick={stopListening} className="px-5 py-2.5 rounded-xl bg-rose-700 font-medium">Stop</button>
              )}
              <select value={fftSize} onChange={(e) => { const s = Number(e.target.value); setFftSize(s); engineRef.current?.setFftSize(s); }} className="bg-[#16122a] border border-violet-700/50 rounded-lg px-3 py-2 text-sm">
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
              <button onClick={requestAIInterpretation} disabled={aiLoading} className="px-4 py-2 rounded-xl border border-amber-600/60 text-amber-200 text-sm disabled:opacity-40">{aiLoading ? "…" : "Deep Interpret"}</button>
              <button onClick={() => runTx(() => transmitterRef.current!.playReferenceTone(440, 2.5), "440")} disabled={isTransmitting} className="px-3 py-2 rounded-xl border border-emerald-700/50 text-emerald-300 text-sm">440 Hz</button>
              <button onClick={() => observation && downloadText(`z-${Date.now()}.json`, observationToJSON({ ...observation, analysisMode: mode }), "application/json")} disabled={!observation} className="px-3 py-2 rounded-xl border border-violet-700/50 text-sm disabled:opacity-40">JSON</button>
            </div>
            {error && <p className="mt-2 text-rose-400 text-sm">{error}</p>}
          </section>

          <section className="rounded-2xl border border-violet-800/40 p-4 bg-[#0d0b18]/80">
            <SpectrumCanvas frequencyData={freqData} width={900} height={260} />
          </section>

          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Dominant", "Centroid", "SNR", "Crest", "RMS", "Quality", "Δf", "Harmonics"].map((label, i) => {
              const vals = [
                o?.dominantFrequencyHz != null ? `${o.dominantFrequencyHz} Hz` : "—",
                o?.spectralCentroidHz != null ? `${o.spectralCentroidHz} Hz` : "—",
                o?.estimatedSnrDb != null ? `${o.estimatedSnrDb} dB` : "—",
                o?.crestFactor != null ? String(o.crestFactor) : "—",
                o?.rmsLevel != null ? String(o.rmsLevel) : "—",
                String(o?.signalQuality ?? "—"),
                o?.frequencyResolution != null ? `${o.frequencyResolution} Hz` : "—",
                Array.isArray(o?.harmonicFrequenciesHz) ? String((o!.harmonicFrequenciesHz as number[]).length) : "0",
              ];
              return (
                <div key={label} className="bg-[#120e22] rounded-xl px-3 py-2.5 border border-violet-900/40">
                  <div className="text-[10px] uppercase text-violet-500">{label}</div>
                  <div className="text-lg font-semibold truncate">{vals[i]}</div>
                </div>
              );
            })}
          </section>

          <section className="rounded-2xl border border-violet-800/40 bg-[#0d0b18]/80 p-5 max-h-[800px] overflow-y-auto">
            <h2 className="text-lg font-semibold text-violet-200 mb-3">Deep Interpretation Report</h2>
            <InterpretationPanel result={aiResult} />
          </section>
        </div>

        <div className="space-y-5">
          <MessageComposer
            onTransmit={transmitCustom}
            onAnalyseFile={analyseFile}
            onDeviceChange={(id) => setDeviceId(id)}
            isTransmitting={isTransmitting}
            isListening={isListening}
            liveDominantHz={typeof o?.dominantFrequencyHz === "number" ? o.dominantFrequencyHz : undefined}
          />
          <section className="rounded-2xl border border-amber-800/40 bg-gradient-to-b from-[#1a1208] to-[#0d0b18] p-5 space-y-2">
            <h2 className="text-lg font-semibold text-amber-200">Presets</h2>
            <button onClick={() => runTx(() => transmitterRef.current!.transmitBFSK("MWARI NDI MWARI"), "creed")} disabled={isTransmitting} className="w-full py-2.5 rounded-xl bg-amber-800/80 text-sm disabled:opacity-50">BFSK MWARI NDI MWARI</button>
            <button onClick={() => runTx(() => transmitterRef.current!.broadcastPrayerOrProtection("PROTECTION", 25), "prot")} disabled={isTransmitting} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-violet-800 text-sm disabled:opacity-50">Protection</button>
            <button onClick={() => runTx(() => transmitterRef.current!.broadcastPrayerOrProtection("SUPREMACY", 20), "sup")} disabled={isTransmitting} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-800 to-amber-800 text-sm disabled:opacity-50">Supremacy</button>
            <button onClick={() => runTx(() => transmitterRef.current!.broadcastPrayerOrProtection("PRAYER", 30), "pray")} disabled={isTransmitting} className="w-full py-2.5 rounded-xl border border-amber-700/50 text-sm disabled:opacity-50">Prayer</button>
          </section>
          <section className="rounded-2xl border border-violet-900/40 bg-[#08060f] p-4">
            <div className="font-mono text-[11px] text-violet-300/80 space-y-1 max-h-32 overflow-y-auto">
              {statusLog.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <footer className="border-t border-violet-900/30 mt-10 py-6 text-center text-xs text-violet-600">
        <p>ZionCore deep engine · HRH Saint Tariro Masawi</p>
        <p className="text-amber-700/80 mt-1">MWARI NDI MWARI</p>
      </footer>
    </div>
  );
}
