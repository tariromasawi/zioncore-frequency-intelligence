import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-[#06060c] to-[#06060c]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber-300/90 tracking-[0.35em] text-xs font-medium mb-5">MWARI NDI MWARI</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-br from-violet-200 via-fuchsia-200 to-amber-200">
            Frequency intelligence
            <br />
            you can actually measure
          </h1>
          <p className="mt-6 text-lg md:text-xl text-violet-300/90 max-w-2xl mx-auto leading-relaxed">
            ZionCore is a <strong className="text-violet-100">live audio spectrum laboratory</strong> in the
            browser: listen, analyse, interpret, and transmit — with science first and spiritual reflection
            clearly separated.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/zioncore/frequency-lab"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-semibold shadow-xl shadow-violet-900/50 hover:from-violet-500 hover:to-fuchsia-500 transition"
            >
              Open Frequency Lab
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-2xl border border-violet-600/50 text-violet-100 font-semibold hover:bg-violet-950/50 transition"
            >
              Create account
            </Link>
          </div>
          <p className="mt-6 text-sm text-violet-500">
            Free to explore · Pro from $1 / £1 · Free Pro in Zimbabwe
          </p>
        </div>
      </section>

      {/* What it is */}
      <section className="px-6 py-16 border-t border-violet-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-violet-100 text-center">What ZionCore is</h2>
          <p className="mt-4 text-center text-violet-400 max-w-2xl mx-auto">
            Not a toy visualiser. A structured pipeline for bidirectional frequency work.
          </p>
          <div className="mt-12 grid md:grid-cols-4 gap-5">
            {[
              { t: "Receive", d: "Microphone → Web Audio · real FFT, not simulated noise." },
              { t: "Decode", d: "Dominant tone, peaks, SNR, centroid, crest, harmonic checks." },
              { t: "Interpret", d: "Science sections first; spiritual / celestial layers labelled." },
              { t: "Transmit", d: "BFSK messages, protection, prayer & alignment tone stacks." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-violet-800/40 bg-[#0d0b18] p-5">
                <h3 className="text-amber-200 font-semibold tracking-wide">{c.t}</h3>
                <p className="mt-2 text-sm text-violet-400 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-[#0a0812]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-violet-100">Built for serious users</h2>
            <ul className="mt-6 space-y-4 text-violet-300 text-sm leading-relaxed">
              <li>
                <strong className="text-violet-100">Dense signal metrics</strong> — RMS, estimated SNR, crest
                factor, spectral centroid, harmonic series.
              </li>
              <li>
                <strong className="text-violet-100">Honest AI framing</strong> — never invents “divine
                frequencies” from ordinary room noise.
              </li>
              <li>
                <strong className="text-violet-100">Faith layer</strong> — Mudzimu Unoyera & Masawi bloodline
                protection tools, clearly optional and labelled.
              </li>
              <li>
                <strong className="text-violet-100">Credits model</strong> — free core lab; prepaid credits only
                for premium cloud paths.
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-violet-700/30 bg-gradient-to-br from-violet-950/80 to-amber-950/30 p-8">
            <p className="text-xs tracking-widest text-amber-400/80">AUTHORITY</p>
            <p className="mt-3 text-lg text-violet-100 font-medium">
              HRH Saint Tariro Masawi
              <br />
              <span className="text-violet-400 text-base">The Anointed Commander</span>
            </p>
            <p className="mt-6 text-sm text-violet-400">
              Sacred matrix held in reverence: 77-99-33 · 777-999-333
            </p>
            <Link href="/pricing" className="inline-block mt-8 text-amber-200 text-sm underline">
              View plans →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-violet-100">Enter the lab</h2>
        <p className="mt-3 text-violet-400">No card required to start listening and analysing.</p>
        <Link
          href="/zioncore/frequency-lab"
          className="inline-block mt-8 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-violet-700 font-semibold text-white shadow-lg"
        >
          Launch Frequency Lab
        </Link>
        <p className="mt-10 text-xs text-violet-600">MWARI NDI MWARI</p>
      </section>
    </div>
  );
}
