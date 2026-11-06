/**
 * ZionCore Frequency Engine — dense RECEIVE · DECODE
 * Authority: HRH Saint Tariro Masawi | MWARI NDI MWARI | 77-99-33
 */

import type { SpectralPeak, FrequencyObservation } from "@/types/zioncore";

export class FrequencyEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private isRunning = false;
  private baselineRms = 0;
  private frameCount = 0;

  public sampleRate = 0;
  public fftSize = 4096;
  public frequencyData: Float32Array | null = null;
  public timeDomainData: Uint8Array | null = null;

  private onUpdate: ((obs: Partial<FrequencyObservation> & Record<string, unknown>) => void) | null = null;

  constructor(fftSize: number = 4096) {
    this.fftSize = fftSize;
  }

  async start(
    onUpdate: (obs: Partial<FrequencyObservation> & Record<string, unknown>) => void,
    constraints: MediaStreamConstraints = {
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    }
  ): Promise<void> {
    if (this.isRunning) return;
    this.onUpdate = onUpdate;
    this.frameCount = 0;
    this.baselineRms = 0;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.sampleRate = this.audioContext.sampleRate;

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = 0.75;
      this.analyser.minDecibels = -100;
      this.analyser.maxDecibels = -10;

      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.source.connect(this.analyser);

      const n = this.analyser.frequencyBinCount;
      this.frequencyData = new Float32Array(n);
      this.timeDomainData = new Uint8Array(n);

      this.isRunning = true;
      this.tick();
    } catch (err) {
      this.cleanup();
      throw err;
    }
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.cleanup();
  }

  private cleanup(): void {
    this.source?.disconnect();
    this.source = null;
    this.mediaStream?.getTracks().forEach((t) => t.stop());
    this.mediaStream = null;
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
    }
    this.audioContext = null;
    this.analyser = null;
    this.frequencyData = null;
    this.timeDomainData = null;
  }

  private tick = (): void => {
    if (!this.isRunning || !this.analyser || !this.frequencyData || !this.timeDomainData) return;
    this.analyser.getFloatFrequencyData(this.frequencyData as any);
    this.analyser.getByteTimeDomainData(this.timeDomainData as any);
    if (this.onUpdate) this.onUpdate(this.computeObservation());
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private computeObservation(): Partial<FrequencyObservation> & Record<string, unknown> {
    if (!this.frequencyData || !this.analyser || !this.timeDomainData) return {};

    const n = this.analyser.frequencyBinCount;
    const df = this.sampleRate / this.fftSize;
    this.frameCount++;

    let sumSq = 0;
    let peak = 0;
    for (let i = 0; i < this.timeDomainData.length; i++) {
      const v = (this.timeDomainData[i] - 128) / 128;
      sumSq += v * v;
      const a = Math.abs(v);
      if (a > peak) peak = a;
    }
    const rms = Math.sqrt(sumSq / this.timeDomainData.length);
    const crest = peak > 1e-9 ? peak / (rms + 1e-12) : 0;

    if (this.frameCount < 45 || rms < this.baselineRms * 1.15) {
      this.baselineRms = this.baselineRms === 0 ? rms : this.baselineRms * 0.95 + rms * 0.05;
    }
    const snrDb =
      this.baselineRms > 1e-8 ? 20 * Math.log10((rms + 1e-12) / (this.baselineRms + 1e-12)) : 0;

    let maxMag = -Infinity;
    let dominantBin = 0;
    let weightedSum = 0;
    let magSum = 0;
    const candidates: { bin: number; mag: number }[] = [];

    for (let i = 1; i < n; i++) {
      const mag = this.frequencyData[i];
      const linear = Math.pow(10, mag / 20);
      weightedSum += i * linear;
      magSum += linear;
      if (mag > maxMag) {
        maxMag = mag;
        dominantBin = i;
      }
      if (i > 1 && i < n - 1 && mag > this.frequencyData[i - 1] && mag > this.frequencyData[i + 1] && mag > -75) {
        candidates.push({ bin: i, mag });
      }
    }

    const dominantHz = dominantBin * df;
    const centroidHz = magSum > 0 ? (weightedSum / magSum) * df : 0;

    candidates.sort((a, b) => b.mag - a.mag);
    const peaks: SpectralPeak[] = candidates.slice(0, 12).map((p) => ({
      frequencyHz: Math.round(p.bin * df * 100) / 100,
      magnitudeDb: Math.round(p.mag * 100) / 100,
      binIndex: p.bin,
    }));

    const harmonics: number[] = [];
    if (dominantHz > 40) {
      for (let h = 2; h <= 5; h++) {
        const target = dominantHz * h;
        const hit = peaks.find((p) => Math.abs(p.frequencyHz - target) < df * 2.5);
        if (hit) harmonics.push(Math.round(hit.frequencyHz * 10) / 10);
      }
    }

    let signalQuality: FrequencyObservation["signalQuality"] = "NOISE";
    if (rms > 0.18 && snrDb > 12) signalQuality = "EXCELLENT";
    else if (rms > 0.09 && snrDb > 6) signalQuality = "GOOD";
    else if (rms > 0.035) signalQuality = "FAIR";
    else if (rms > 0.012) signalQuality = "POOR";

    const anomalyIndicators: string[] = [];
    if (dominantHz > 16000) anomalyIndicators.push("ULTRASONIC_EDGE");
    if (rms < 0.004) anomalyIndicators.push("NEAR_SILENCE");
    if (peaks.length >= 8) anomalyIndicators.push("RICH_HARMONIC_STRUCTURE");
    if (harmonics.length >= 2) anomalyIndicators.push("HARMONIC_SERIES_DETECTED");
    if (crest > 8) anomalyIndicators.push("HIGH_CREST_TRANSIENT");
    if (snrDb > 18) anomalyIndicators.push("HIGH_SNR");
    if (centroidHz > dominantHz * 2.2 && dominantHz > 80) anomalyIndicators.push("BRIGHT_SPECTRAL_TILT");

    return {
      sampleRate: this.sampleRate,
      fftSize: this.fftSize,
      frequencyResolution: Math.round(df * 1000) / 1000,
      dominantFrequencyHz: Math.round(dominantHz * 100) / 100,
      spectralPeaks: peaks,
      rmsLevel: Math.round(rms * 100000) / 100000,
      signalQuality,
      anomalyIndicators,
      sourceDeviceType: "browser-microphone",
      updatedAt: new Date().toISOString(),
      spectralCentroidHz: Math.round(centroidHz * 10) / 10,
      crestFactor: Math.round(crest * 100) / 100,
      estimatedSnrDb: Math.round(snrDb * 10) / 10,
      noiseFloorRms: Math.round(this.baselineRms * 100000) / 100000,
      harmonicFrequenciesHz: harmonics,
      peakCount: peaks.length,
      frameIndex: this.frameCount,
    };
  }

  getFrequencyData(): Float32Array | null {
    return this.frequencyData;
  }

  getTimeDomainData(): Uint8Array | null {
    return this.timeDomainData;
  }

  setFftSize(size: number): void {
    if (![2048, 4096, 8192].includes(size)) return;
    this.fftSize = size;
    if (this.analyser) {
      this.analyser.fftSize = size;
      const n = this.analyser.frequencyBinCount;
      this.frequencyData = new Float32Array(n);
      this.timeDomainData = new Uint8Array(n);
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }
}
