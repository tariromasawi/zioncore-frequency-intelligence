"use client";

import { useEffect, useRef } from "react";

interface SpectrumCanvasProps {
  frequencyData: Float32Array | null;
  width?: number;
  height?: number;
}

export default function SpectrumCanvas({
  frequencyData,
  width = 800,
  height = 240,
}: SpectrumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frequencyData) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(100, 80, 200, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const barCount = Math.min(frequencyData.length, 512);
    const barWidth = width / barCount;

    for (let i = 0; i < barCount; i++) {
      const db = frequencyData[i];
      const normalized = Math.max(0, (db + 100) / 100);
      const barHeight = normalized * height * 0.9;

      const hue = 260 + normalized * 60;
      ctx.fillStyle = `hsla(${hue}, 80%, 55%, 0.85)`;
      ctx.fillRect(i * barWidth, height - barHeight, Math.max(1, barWidth - 0.5), barHeight);
    }

    ctx.fillStyle = "rgba(200, 180, 255, 0.6)";
    ctx.font = "11px monospace";
    ctx.fillText("ZionCore Spectrum · Real-time FFT", 12, 18);
  }, [frequencyData, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, borderRadius: 12, border: "1px solid rgba(140,100,255,0.3)" }}
      className="w-full max-w-full"
    />
  );
}
