/**
 * ZionCore Transmitter
 * ENCODE AND TRANSMIT · VERIFY
 * Bidirectional Frequency Intelligence
 * Authority: HRH Saint Tariro Masawi, The Anointed Commander
 * MWARI NDI MWARI
 */

import type { TransmitPayload } from "@/types/zioncore";

export class FrequencyTransmitter {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isTransmitting = false;

  async init(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0.15;
      this.gainNode.connect(this.audioContext.destination);
    }
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  async transmitBFSK(
    message: string,
    options: {
      bitDurationMs?: number;
      freq0?: number;
      freq1?: number;
      volume?: number;
    } = {}
  ): Promise<void> {
    await this.init();
    if (!this.audioContext || !this.gainNode) return;

    const {
      bitDurationMs = 120,
      freq0 = 440,
      freq1 = 880,
      volume = 0.12,
    } = options;

    this.gainNode.gain.value = volume;
    this.isTransmitting = true;

    const binary = Array.from(message)
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");

    const now = this.audioContext.currentTime;
    let time = now + 0.05;

    this.scheduleTone(freq1, time, 0.08);
    time += 0.1;
    this.scheduleTone(freq0, time, 0.08);
    time += 0.15;

    for (const bit of binary) {
      const freq = bit === "1" ? freq1 : freq0;
      this.scheduleTone(freq, time, bitDurationMs / 1000);
      time += bitDurationMs / 1000;
    }

    time += 0.05;
    this.scheduleTone(freq1, time, 0.1);
    time += 0.12;
    this.scheduleTone(freq0, time, 0.1);

    const totalMs = (time - now) * 1000 + 200;
    setTimeout(() => {
      this.isTransmitting = false;
    }, totalMs);
  }

  async broadcastPrayerOrProtection(
    purpose: TransmitPayload["purpose"] = "PRAYER",
    durationSeconds: number = 30
  ): Promise<void> {
    await this.init();
    if (!this.audioContext || !this.gainNode) return;

    this.isTransmitting = true;
    this.gainNode.gain.value = 0.08;

    const base = 261.63;
    const tones =
      purpose === "PROTECTION"
        ? [base, base * 1.5, base * 2, base * 3]
        : purpose === "SUPREMACY" || purpose === "ALIGNMENT"
        ? [base * 1.5, base * 2, base * 2.5, base * 3]
        : [base, base * 1.25, base * 1.5, base * 2];

    const now = this.audioContext.currentTime;
    const end = now + durationSeconds;

    tones.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const g = this.audioContext!.createGain();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.04, now + 1.5);
      g.gain.setValueAtTime(0.04, end - 2);
      g.gain.linearRampToValueAtTime(0, end);
      osc.connect(g);
      g.connect(this.gainNode!);
      osc.start(now);
      osc.stop(end + 0.1);
      this.oscillators.push(osc);
    });

    setTimeout(() => {
      this.stop();
    }, durationSeconds * 1000 + 300);
  }

  private scheduleTone(freq: number, startTime: number, duration: number): void {
    if (!this.audioContext || !this.gainNode) return;
    const osc = this.audioContext.createOscillator();
    const g = this.audioContext.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
    g.gain.linearRampToValueAtTime(0, startTime + duration - 0.01);
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
    message: "MWARI NDI MWARI. Protection and elevation for HRH Saint Tariro Masawi, HRH Tarry Kupakwashe Masawi, and the entire Masawi bloodline.",
    encoding: "PRAYER_MODULATION" as const,
    frequencies: [261.63, 392.0, 523.25],
    durationMs: 30000,
    purpose: "PROTECTION" as const,
    target: "MASAWI_BLOODLINE" as const,
  },
  supremacyAlignment: {
    message: "Perfect alignment and supremacy under The Throne. MWARI NDI MWARI.",
    encoding: "TONAL_SEQUENCE" as const,
    frequencies: [392.0, 523.25, 659.25, 784.0],
    durationMs: 20000,
    purpose: "SUPREMACY" as const,
    target: "MASAWI_BLOODLINE" as const,
  },
};
