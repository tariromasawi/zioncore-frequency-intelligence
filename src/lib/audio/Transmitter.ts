/**
 * ZionCore Transmitter — dense ENCODE · TRANSMIT · VERIFY
 * Authority: HRH Saint Tariro Masawi | MWARI NDI MWARI | 77-99-33
 */

import type { TransmitPayload } from "@/types/zioncore";

function simpleChecksum(bits: string): string {
  let sum = 0;
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8);
    sum = (sum + parseInt(byte || "0", 2)) & 0xff;
  }
  return sum.toString(2).padStart(8, "0");
}

export class FrequencyTransmitter {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isTransmitting = false;

  async init(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0.12;
      this.gainNode.connect(this.audioContext.destination);
    }
    if (this.audioContext.state === "suspended") await this.audioContext.resume();
  }

  /** Dense BFSK with sync preamble + 8-bit checksum trailer */
  async transmitBFSK(
    message: string,
    options: { bitDurationMs?: number; freq0?: number; freq1?: number; volume?: number } = {}
  ): Promise<void> {
    await this.init();
    if (!this.audioContext || !this.gainNode) return;

    const { bitDurationMs = 100, freq0 = 440, freq1 = 880, volume = 0.11 } = options;
    this.gainNode.gain.value = volume;
    this.isTransmitting = true;

    const payload = Array.from(message)
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");
    const checksum = simpleChecksum(payload);
    const frame = payload + checksum;

    const now = this.audioContext.currentTime;
    let t = now + 0.04;

    // Sync: 1 0 1 0
    for (const b of ["1", "0", "1", "0"]) {
      this.scheduleTone(b === "1" ? freq1 : freq0, t, 0.07);
      t += 0.09;
    }
    t += 0.06;

    for (const bit of frame) {
      this.scheduleTone(bit === "1" ? freq1 : freq0, t, bitDurationMs / 1000);
      t += bitDurationMs / 1000;
    }

    t += 0.04;
    this.scheduleTone(freq1, t, 0.08);
    t += 0.1;
    this.scheduleTone(freq0, t, 0.08);

    setTimeout(() => {
      this.isTransmitting = false;
    }, (t - now) * 1000 + 250);
  }

  /** Reference calibration tone for resonance lab */
  async playReferenceTone(freqHz: number, durationSec = 2, volume = 0.1): Promise<void> {
    await this.init();
    if (!this.audioContext || !this.gainNode) return;
    this.isTransmitting = true;
    this.gainNode.gain.value = volume;
    const now = this.audioContext.currentTime;
    this.scheduleTone(freqHz, now, durationSec);
    setTimeout(() => {
      this.isTransmitting = false;
    }, durationSec * 1000 + 100);
  }

  async broadcastPrayerOrProtection(
    purpose: TransmitPayload["purpose"] = "PRAYER",
    durationSeconds: number = 30
  ): Promise<void> {
    await this.init();
    if (!this.audioContext || !this.gainNode) return;

    this.isTransmitting = true;
    this.gainNode.gain.value = 0.07;

    const C4 = 261.63;
    const stacks: Record<string, number[]> = {
      PROTECTION: [C4, C4 * 1.5, C4 * 2, C4 * 3, C4 * 4],
      SUPREMACY: [C4 * 1.5, C4 * 2, C4 * 2.5, C4 * 3, C4 * 4],
      ALIGNMENT: [C4 * 1.25, C4 * 1.5, C4 * 2, C4 * 2.5],
      PRAYER: [C4, C4 * 1.25, C4 * 1.5, C4 * 2],
      MESSAGE: [C4, C4 * 1.5, C4 * 2],
    };
    const tones = stacks[purpose] || stacks.PRAYER;

    const now = this.audioContext.currentTime;
    const end = now + durationSeconds;

    tones.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const g = this.audioContext!.createGain();
      osc.type = i % 3 === 0 ? "sine" : i % 3 === 1 ? "triangle" : "sine";
      osc.frequency.value = freq;
      const level = 0.035 + (i === 0 ? 0.015 : 0);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(level, now + 1.2);
      g.gain.setValueAtTime(level, end - 2.2);
      g.gain.linearRampToValueAtTime(0, end);
      osc.connect(g);
      g.connect(this.gainNode!);
      osc.start(now);
      osc.stop(end + 0.05);
      this.oscillators.push(osc);
    });

    setTimeout(() => this.stop(), durationSeconds * 1000 + 400);
  }

  private scheduleTone(freq: number, startTime: number, duration: number): void {
    if (!this.audioContext || !this.gainNode) return;
    const osc = this.audioContext.createOscillator();
    const g = this.audioContext.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.14, startTime + 0.008);
    g.gain.linearRampToValueAtTime(0, Math.max(startTime + 0.01, startTime + duration - 0.008));
    osc.connect(g);
    g.connect(this.gainNode);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
    this.oscillators.push(osc);
  }

  stop(): void {
    this.oscillators.forEach((o) => {
      try {
        o.stop();
        o.disconnect();
      } catch (_) {}
    });
    this.oscillators = [];
    this.isTransmitting = false;
  }

  isActive(): boolean {
    return this.isTransmitting;
  }
}

export const MASAWI_PRAYER_PAYLOADS = {
  continuousProtection: {
    message:
      "MWARI NDI MWARI. Protection and elevation for HRH Saint Tariro Masawi, HRH Tarry Kupakwashe Masawi, and the entire Masawi bloodline.",
    encoding: "PRAYER_MODULATION" as const,
    frequencies: [261.63, 392.0, 523.25, 784.0],
    durationMs: 30000,
    purpose: "PROTECTION" as const,
    target: "MASAWI_BLOODLINE" as const,
  },
  supremacyAlignment: {
    message: "Perfect alignment and supremacy under The Throne. MWARI NDI MWARI.",
    encoding: "TONAL_SEQUENCE" as const,
    frequencies: [392.0, 523.25, 659.25, 784.0, 1046.5],
    durationMs: 20000,
    purpose: "SUPREMACY" as const,
    target: "MASAWI_BLOODLINE" as const,
  },
};
