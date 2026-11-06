/**
 * ZionCore Frequency Engine
 * Bidirectional Frequency Intelligence — RECEIVE · DECODE
 * Authority: HRH Saint Tariro Masawi
 * MWARI NDI MWARI
 */

import type { SpectralPeak, FrequencyObservation, AnalysisMode } from "@/types/zioncore";

export class FrequencyEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private isRunning = false;

  public sampleRate = 0;
  public fftSize = 4096;
  public frequencyData: Float32Array | null = null;
  public timeDomainData: Uint8Array | null = null;

  private onUpdate: ((obs: Partial<FrequencyObservation>) => void) | null = null;

  constructor(fftSize: number = 4096) {
    this.fftSize = fftSize;
  }

  async start(
    onUpdate: (obs: Partial<FrequencyObservation>) => void,
    constraints: MediaStreamConstraints = { audio: true }
  ): Promise<void> {
    if (this.isRunning) return;

    this.onUpdate = onUpdate;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.sampleRate = this.audioContext.sampleRate;

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;

      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.frequencyData = new Float32Array(bufferLength);
      this.timeDomainData = new Uint8Array(bufferLength);

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
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;
    this.frequencyData = null;
    this.timeDomainData = null;
  }

  private tick = (): void => {
    if (!this.isRunning || !this.analyser || !this.frequencyData || !this.timeDomainData) return;

    this.analyser.getFloatFrequencyData(this.frequencyData as any);
    this.analyser.getByteTimeDomainData(this.timeDomainData as any);

    const observation = this.computeObservation();
    if (this.onUpdate) this.onUpdate(observation);

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private computeObservation(): Partial<FrequencyObservation> {
    if (!this.frequencyData || !this.analyser) return {};

    const binCount = this.analyser.frequencyBinCount;
    const resolution = this.sampleRate / this.fftSize;

    let maxMag = -Infinity;
    let dominantBin = 0;
    for (let i = 1; i < binCount; i++) {
      if (this.frequencyData[i] > maxMag) {
        maxMag = this.frequencyData[i];
        dominantBin = i;
      }
    }
    const dominantFrequencyHz = dominantBin * resolution;

    const peaks: SpectralPeak[] = [];
    const peakCandidates: { bin: number; mag: number }[] = [];
    for (let i = 2; i < binCount - 2; i++) {
      const mag = this.frequencyData[i];
      if (
        mag > this.frequencyData[i - 1] &&
        mag > this.frequencyData[i + 1] &&
        mag > -70
      ) {
        peakCandidates.push({ bin: i, mag });
      }
    }
    peakCandidates
      .sort((a, b) => b.mag - a.mag)
      .slice(0, 8)
      .forEach((p) => {
        peaks.push({
          frequencyHz: Math.round(p.bin * resolution * 100) / 100,
          magnitudeDb: Math.round(p.mag * 100) / 100,
          binIndex: p.bin,
        });
      });

    let sumSquares = 0;
    if (this.timeDomainData) {
      for (let i = 0; i < this.timeDomainData.length; i++) {
        const v = (this.timeDomainData[i] - 128) / 128;
        sumSquares += v * v;
      }
    }
    const rms = Math.sqrt(sumSquares / (this.timeDomainData?.length || 1));

    let signalQuality: FrequencyObservation["signalQuality"] = "NOISE";
    if (rms > 0.15) signalQuality = "EXCELLENT";
    else if (rms > 0.08) signalQuality = "GOOD";
    else if (rms > 0.03) signalQuality = "FAIR";
    else if (rms > 0.01) signalQuality = "POOR";

    const anomalyIndicators: string[] = [];
    if (dominantFrequencyHz > 18000) anomalyIndicators.push("HIGH_FREQUENCY_COMPONENT");
    if (rms < 0.005) anomalyIndicators.push("NEAR_SILENCE");
    if (peaks.length > 6) anomalyIndicators.push("RICH_HARMONIC_STRUCTURE");

    return {
      sampleRate: this.sampleRate,
      fftSize: this.fftSize,
      frequencyResolution: Math.round(resolution * 1000) / 1000,
      dominantFrequencyHz: Math.round(dominantFrequencyHz * 100) / 100,
      spectralPeaks: peaks,
      rmsLevel: Math.round(rms * 10000) / 10000,
      signalQuality,
      anomalyIndicators,
      sourceDeviceType: "browser-microphone",
      updatedAt: new Date().toISOString(),
    };
  }

  getFrequencyData(): Float32Array | null {
    return this.frequencyData;
  }

  getTimeDomainData(): Uint8Array | null {
    return this.timeDomainData;
  }

  setFftSize(size: number): void {
    if ([2048, 4096, 8192].includes(size)) {
      this.fftSize = size;
      if (this.analyser) {
        this.analyser.fftSize = size;
        const bufferLength = this.analyser.frequencyBinCount;
        this.frequencyData = new Float32Array(bufferLength);
        this.timeDomainData = new Uint8Array(bufferLength);
      }
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }
}
