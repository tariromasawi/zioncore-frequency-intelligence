"use client";

import { useEffect, useRef, useState } from "react";
import { describeEncoding, bitStringToText, tonesToBits, type ToneEvent } from "@/lib/audio/MessageCodec";
import { FrequencyEngine } from "@/lib/audio/FrequencyEngine";

type Props = {
  onTransmit: (message: string, opts: { freq0: number; freq1: number; bitDurationMs: number }) => Promise<void>;
  onAnalyseFile: (file: Blob) => Promise<void>;
  onDeviceChange: (deviceId: string | undefined) => void;
  isTransmitting: boolean;
  isListening: boolean;
  liveDominantHz?: number;
};

export default function MessageComposer({
  onTransmit,
  onAnalyseFile,
  onDeviceChange,
  isTransmitting,
  isListening,
  liveDominantHz,
}: Props) {
  const [message, setMessage] = useState("MWARI NDI MWARI");
  const [freq0, setFreq0] = useState(440);
  const [freq1, setFreq1] = useState(880);
  const [bitMs, setBitMs] = useState(100);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [recording, setRecording] = useState(false);
  const [decodeLog, setDecodeLog] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const captureRef = useRef<ToneEvent[]>([]);
  const capturingRef = useRef(false);

  useEffect(() => {
    FrequencyEngine.listInputDevices()
      .then(setDevices)
      .catch(() => {});
  }, []);

  // Collect dominant tones while listening for decode
  useEffect(() => {
    if (!isListening || liveDominantHz == null || !capturingRef.current) return;
    captureRef.current.push({ t: performance.now(), freqHz: liveDominantHz });
  }, [liveDominantHz, isListening]);

  const meta = describeEncoding(message, { freq0, freq1, bitDurationMs: bitMs });

  const send = async () => {
    if (!message.trim()) return;
    await onTransmit(message.trim(), { freq0, freq1, bitDurationMs: bitMs });
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setDecodeLog(`Analysing file: ${f.name} (${Math.round(f.size / 1024)} KB)…`);
    await onAnalyseFile(f);
    setDecodeLog((p) => p + "\nSpectrum analysis complete. Review metrics & interpret.");
  };

  const startRec = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: deviceId ? { deviceId: { exact: deviceId } } : true,
    });
    const mr = new MediaRecorder(stream);
    chunksRef.current = [];
    mr.ondataavailable = (ev) => {
      if (ev.data.size) chunksRef.current.push(ev.data);
    };
    mr.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setDecodeLog(`Recorded ${Math.round(blob.size / 1024)} KB — analysing…`);
      await onAnalyseFile(blob);
      setDecodeLog((p) => p + "\nRecording analysed by ZionCore.");
    };
    mediaRecorderRef.current = mr;
    mr.start();
    setRecording(true);
  };

  const stopRec = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const startCaptureDecode = () => {
    captureRef.current = [];
    capturingRef.current = true;
    setDecodeLog("Capturing dominant tones for BFSK decode… play the message on another device or speaker.");
  };

  const finishDecode = () => {
    capturingRef.current = false;
    const bits = tonesToBits(captureRef.current, freq0, freq1, bitMs);
    const text = bitStringToText(bits);
    setDecodeLog(
      `Captured ${captureRef.current.length} tone samples.\nBits(~): ${bits.slice(0, 64)}${bits.length > 64 ? "…" : ""}\nDecoded text (best effort):\n${text || "(no printable ASCII recovered — align freq0/freq1 & bit timing)"}`
    );
  };

  return (
    <section className="rounded-2xl border border-fuchsia-800/40 bg-gradient-to-b from-[#14081c] to-[#0d0b18] p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-fuchsia-200">Message → Frequencies</h2>
        <p className="text-xs text-violet-500 mt-1">
          Type any message, upload a recording, or use an external mic/interface. ZionCore encodes to BFSK,
          analyses spectrum, and can attempt decode while listening.
        </p>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="Write the message to encode into frequencies…"
        className="w-full bg-[#16122a] border border-violet-800/50 rounded-xl px-3 py-2 text-sm text-violet-100 resize-y"
      />

      <div className="grid grid-cols-3 gap-2 text-xs">
        <label className="flex flex-col gap-1">
          <span className="text-violet-500">Bit 0 Hz</span>
          <input
            type="number"
            value={freq0}
            onChange={(e) => setFreq0(Number(e.target.value) || 440)}
            className="bg-[#16122a] border border-violet-800 rounded-lg px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-violet-500">Bit 1 Hz</span>
          <input
            type="number"
            value={freq1}
            onChange={(e) => setFreq1(Number(e.target.value) || 880)}
            className="bg-[#16122a] border border-violet-800 rounded-lg px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-violet-500">Bit ms</span>
          <input
            type="number"
            value={bitMs}
            onChange={(e) => setBitMs(Number(e.target.value) || 100)}
            className="bg-[#16122a] border border-violet-800 rounded-lg px-2 py-1.5"
          />
        </label>
      </div>

      <p className="text-[11px] text-violet-500 font-mono">
        {meta.charCount} chars · {meta.bitCount} bits · ~{Math.round(meta.estimatedMs / 1000)}s · checksum{" "}
        {meta.checksum}
      </p>

      <button
        onClick={send}
        disabled={isTransmitting || !message.trim()}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-700 to-violet-700 font-medium text-sm disabled:opacity-50"
      >
        Encode & Transmit message
      </button>

      <div className="border-t border-violet-900/40 pt-4 space-y-2">
        <p className="text-xs uppercase tracking-wider text-violet-500">External device / file</p>
        <select
          value={deviceId}
          onChange={(e) => {
            setDeviceId(e.target.value);
            onDeviceChange(e.target.value || undefined);
          }}
          className="w-full bg-[#16122a] border border-violet-800 rounded-lg px-2 py-2 text-xs"
        >
          <option value="">Default microphone</option>
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || d.deviceId.slice(0, 12)}
            </option>
          ))}
        </select>
        <p className="text-[10px] text-violet-600">
          USB interfaces, headsets, and external mics appear after permission. Select then Start Listening.
        </p>

        <label className="block w-full text-center py-2 rounded-xl border border-violet-700/50 text-xs cursor-pointer hover:bg-violet-950/40">
          Upload audio / recording
          <input type="file" accept="audio/*,.wav,.mp3,.ogg,.webm,.m4a" className="hidden" onChange={onFile} />
        </label>

        {!recording ? (
          <button
            onClick={startRec}
            className="w-full py-2 rounded-xl border border-rose-800/50 text-rose-200 text-xs"
          >
            Record clip from device
          </button>
        ) : (
          <button onClick={stopRec} className="w-full py-2 rounded-xl bg-rose-800 text-xs">
            Stop & analyse recording
          </button>
        )}
      </div>

      <div className="border-t border-violet-900/40 pt-4 space-y-2">
        <p className="text-xs uppercase tracking-wider text-violet-500">Decode while listening</p>
        <div className="flex gap-2">
          <button
            onClick={startCaptureDecode}
            disabled={!isListening}
            className="flex-1 py-2 rounded-lg border border-emerald-800/50 text-emerald-200 text-xs disabled:opacity-40"
          >
            Start tone capture
          </button>
          <button onClick={finishDecode} className="flex-1 py-2 rounded-lg border border-emerald-800/50 text-xs">
            Decode bits → text
          </button>
        </div>
        {decodeLog && (
          <pre className="text-[10px] text-violet-400 whitespace-pre-wrap bg-[#0a0814] p-2 rounded-lg border border-violet-900/40 max-h-28 overflow-y-auto">
            {decodeLog}
          </pre>
        )}
      </div>
    </section>
  );
}
