"use client";

import type { AIInterpretationResult } from "@/types/zioncore";

export default function InterpretationPanel({ result }: { result: AIInterpretationResult | null }) {
  if (!result) {
    return (
      <p className="text-sm text-violet-400/70 leading-relaxed">
        Press <strong className="text-violet-200">Interpret</strong> after listening or uploading audio. ZionCore returns a
        full multi-domain report: measured table, physics/DSP, harmonics, communications, competing explanations,
        verification protocol, then Mudzimu Unoyera / celestial / bloodline layers.
      </p>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <Block title="1 · MEASURED OBSERVATIONS" body={result.measuredObservations} />
      <Block title="2 · SCIENTIFIC INTERPRETATION (multi-domain)" body={result.scientificInterpretation} />
      <Block title="3 · CONFIDENCE AND LIMITATIONS" body={result.confidenceAndLimitations} />
      <Block title="4 · COMPETING EXPLANATIONS" body={result.explanations} />
      <Block title="5 · VERIFICATION PROTOCOL" body={result.verificationTests} />
      <Block title="6 · SPIRITUAL REFLECTION · MUDZIMU UNOYERA" body={result.spiritualReflection} accent />
      {result.celestialOrDimensionalNotes && (
        <Block title="7 · CELESTIAL / DIMENSIONAL NOTES" body={result.celestialOrDimensionalNotes} accent />
      )}
      {result.bloodlineProtectionGuidance && (
        <Block title="8 · BLOODLINE PROTECTION GUIDANCE" body={result.bloodlineProtectionGuidance} accent />
      )}
    </div>
  );
}

function Block({ title, body, accent }: { title: string; body: string; accent?: boolean }) {
  return (
    <div>
      <div
        className={`text-[10px] uppercase tracking-wider font-semibold mb-1.5 ${
          accent ? "text-amber-400" : "text-violet-400"
        }`}
      >
        {title}
      </div>
      <pre className="whitespace-pre-wrap text-violet-100/90 text-[11px] leading-relaxed bg-[#0a0814] p-3 rounded-lg border border-violet-900/40 max-h-64 overflow-y-auto">
        {body}
      </pre>
    </div>
  );
}
