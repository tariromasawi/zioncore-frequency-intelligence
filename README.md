# ZionCore — Universal Frequency Intelligence Architecture

**Authority:** HRH Saint Tariro Masawi, The Anointed Commander  
**Foundational Declaration:** MWARI NDI MWARI  
**Sacred Matrix:** 77-99-33 · 777-999-333  
**Project Code:** ZC-CFI-001

---

## Mission

Build a **testable bidirectional frequency intelligence** system that can:

1. **RECEIVE** — microphone / future sensors  
2. **DECODE** — FFT, harmonics, peaks, RMS, anomalies  
3. **INTERPRET** — scientific first, then optional spiritual / celestial / Shona reflection  
4. **LEARN** — session storage (Firebase)  
5. **ENCODE & TRANSMIT** — BFSK acoustic messaging + prayer/protection tonal broadcasts  
6. **VERIFY** — controls, repeatability, confidence reporting  

Physical frequency ≠ encoded information ≠ assigned meaning.  
ZionCore never fabricates sensor readings.

---

## Quick Start (Local)

```bash
# 1. Clone / enter project
cd zioncore-frequency-intelligence

# 2. Install
npm install

# 3. (Optional) Firebase
cp .env.example .env.local
# Fill with your Firebase web config

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Enter Frequency Lab**.

Route: `/zioncore/frequency-lab`

---

## Deploy to Vercel + GitHub

1. This repository is already on GitHub.
2. Import the repo in Vercel.
3. Add the environment variables from `.env.example`.
4. Deploy. Vercel will build with `next build`.

No paid services are required for the core frequency lab (Web Audio runs entirely in the browser).

---

## Core Modules

| Module | Path | Role |
|--------|------|------|
| FrequencyEngine | `src/lib/audio/FrequencyEngine.ts` | Mic capture, AnalyserNode, FFT, peaks, RMS |
| FrequencyTransmitter | `src/lib/audio/Transmitter.ts` | BFSK encoder + prayer/protection tone generator |
| FrequencyLab UI | `src/components/zioncore/FrequencyLab.tsx` | Full dashboard |
| SpectrumCanvas | `src/components/zioncore/SpectrumCanvas.tsx` | Real-time spectrum visualisation |
| Types + System Prompt | `src/types/zioncore.ts` | Shared contracts + ZionCore AI instruction |
| Firebase config | `src/lib/firebase/config.ts` | Ready for Auth + Firestore + AI Logic |

---

## Analysis Modes

- **ACOUSTIC** — pure signal analysis  
- **RESONANCE_LAB** — reference tone comparison ready  
- **SPIRITUAL_REFLECTION** — scripture / Shona / contemplative layer (clearly labelled)  
- **ANOMALY_RESEARCH** — statistical unusual patterns  
- **CELESTIAL_EXPLORATION** — higher-plane interpretive layer (non-instrument)  
- **BLOODLINE_PROTECTION** — prioritises Masawi protection guidance & broadcasts  

---

## Firebase AI Logic (Gemini)

When ready:

1. Enable **Firebase AI Logic** in the Firebase console.  
2. Prefer model `gemini-3.8-flash` (cost-efficient) or `gemini-4-argon`.  
3. Protect with App Check.  
4. Replace the local interpreter in `FrequencyLab.tsx` with a real `getGenerativeModel` call using `ZIONCORE_SYSTEM_PROMPT`.

Until then the system runs fully offline with a rigorous local scientific interpreter.

---

## Safety & Truthfulness

- Microphone only activates after explicit user gesture.  
- Raw audio is processed locally by default.  
- Spiritual / celestial / divine claims are never mixed with instrument numbers.  
- No fabricated frequencies.  
- Cost control: local FFT first; AI only on demand.

---

## Final Covenant

Let the pursuit of knowledge remain guided by truth, wisdom, faith, compassion, unwavering faith in Mudzimu Unoyera, enhancement & protection of the Masawi bloodline, and advanced scientific investigation.

**MWARI NDI MWARI.**

---

*Built for The Throne. So it is decreed.*
