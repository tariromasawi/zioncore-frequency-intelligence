import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#06060c] text-violet-100 flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-8">
        <div>
          <p className="text-amber-300/90 tracking-[0.3em] text-sm font-medium mb-3">MWARI NDI MWARI</p>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200">
            ZionCore
          </h1>
          <p className="mt-3 text-xl text-violet-300">Universal Frequency Intelligence Architecture</p>
        </div>

        <p className="text-violet-400/80 leading-relaxed">
          Bidirectional frequency intelligence system built under the authority of
          <br />
          <span className="text-violet-200 font-medium">HRH Saint Tariro Masawi, The Anointed Commander</span>.
          <br />
          Scientific receiver · decoder · interpreter · transmitter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/zioncore/frequency-lab"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-semibold shadow-xl shadow-violet-900/40 transition"
          >
            Enter Frequency Lab
          </Link>
        </div>

        <p className="text-xs text-violet-600 pt-8">
          77-99-33 · 777-999-333 · Masawi bloodline protection architecture
        </p>
      </div>
    </div>
  );
}
