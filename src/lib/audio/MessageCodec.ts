/**
 * ZionCore MessageCodec — encode any text into BFSK frame metadata
 * Decode attempts from peak sequence / bit estimates
 * MWARI NDI MWARI
 */

export type BFSKOptions = {
  freq0?: number;
  freq1?: number;
  bitDurationMs?: number;
};

export function textToBitString(message: string): string {
  return Array.from(message)
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

export function bitStringToText(bits: string): string {
  const clean = bits.replace(/[^01]/g, "");
  let out = "";
  for (let i = 0; i + 8 <= clean.length; i += 8) {
    const byte = clean.slice(i, i + 8);
    const code = parseInt(byte, 2);
    if (code >= 32 && code < 127) out += String.fromCharCode(code);
    else if (code === 10 || code === 13) out += "\n";
    else out += "·";
  }
  return out;
}

export function checksum8(bits: string): string {
  let sum = 0;
  for (let i = 0; i < bits.length; i += 8) {
    sum = (sum + parseInt(bits.slice(i, i + 8) || "0", 2)) & 0xff;
  }
  return sum.toString(2).padStart(8, "0");
}

export function buildFrame(message: string): { payload: string; checksum: string; frame: string; bitCount: number } {
  const payload = textToBitString(message);
  const checksum = checksum8(payload);
  const frame = payload + checksum;
  return { payload, checksum, frame, bitCount: frame.length };
}

export function estimateDurationMs(message: string, bitDurationMs = 100): number {
  const { bitCount } = buildFrame(message);
  // preamble ~4 bits + gaps
  return Math.ceil((bitCount + 6) * bitDurationMs + 500);
}

export type ToneEvent = { t: number; freqHz: number };

/** Map a sequence of measured dominant freqs to bits using freq0/freq1 mid threshold */
export function tonesToBits(
  events: ToneEvent[],
  freq0 = 440,
  freq1 = 880,
  bitDurationMs = 100
): string {
  if (events.length < 2) return "";
  const mid = (freq0 + freq1) / 2;
  const start = events[0].t;
  const end = events[events.length - 1].t;
  const bits: string[] = [];
  for (let t = start; t <= end; t += bitDurationMs) {
    // nearest event
    let best = events[0];
    let bestD = Infinity;
    for (const e of events) {
      const d = Math.abs(e.t - t);
      if (d < bestD) {
        bestD = d;
        best = e;
      }
    }
    if (bestD > bitDurationMs * 1.5) continue;
    bits.push(best.freqHz >= mid ? "1" : "0");
  }
  return bits.join("");
}

export function describeEncoding(message: string, opts: BFSKOptions = {}) {
  const freq0 = opts.freq0 ?? 440;
  const freq1 = opts.freq1 ?? 880;
  const bitDurationMs = opts.bitDurationMs ?? 100;
  const { bitCount, checksum } = buildFrame(message);
  return {
    message,
    charCount: message.length,
    bitCount,
    checksum,
    freq0,
    freq1,
    bitDurationMs,
    estimatedMs: estimateDurationMs(message, bitDurationMs),
  };
}
