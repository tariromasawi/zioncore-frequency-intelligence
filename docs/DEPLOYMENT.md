# ZionCore Deployment

**Repository:** https://github.com/tariromasawi/zioncore-frequency-intelligence

## Local

```bash
git clone https://github.com/tariromasawi/zioncore-frequency-intelligence.git
cd zioncore-frequency-intelligence
npm install
npm run dev
```

Open: http://localhost:3000/zioncore/frequency-lab

## Vercel

1. Import this GitHub repository in Vercel
2. Framework: Next.js
3. Add environment variables from `.env.example` if using Firebase
4. Deploy

HTTPS is required for microphone access in production (Vercel provides this).

## Firebase (optional for core lab)

1. Create / use a Firebase project
2. Enable Authentication and Firestore
3. Enable Firebase AI Logic for Gemini when ready
4. Prefer `gemini-3.8-flash` (cost-efficient) or `gemini-4-argon`
5. Enable App Check before public AI usage
6. Paste web config into `.env.local` / Vercel env

## Verification checklist

- [ ] Spectrum updates with live sound
- [ ] Dominant frequency responds to known tones (e.g. 440 Hz)
- [ ] Stop releases microphone tracks
- [ ] BFSK “MWARI NDI MWARI” produces audible tones
- [ ] Protection broadcast plays harmonic sequence
- [ ] Interpretation panel returns structured sections
- [ ] Export JSON works

MWARI NDI MWARI.
