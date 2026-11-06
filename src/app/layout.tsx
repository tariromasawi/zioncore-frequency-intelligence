import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "ZionCore | Frequency Intelligence Platform",
  description:
    "Bidirectional frequency intelligence — live spectrum, scientific analysis, and faith-aligned tools under HRH Saint Tariro Masawi. MWARI NDI MWARI.",
  openGraph: {
    title: "ZionCore Frequency Intelligence",
    description: "Listen. Measure. Interpret. Transmit. Science first — faith clearly labelled.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#06060c] text-violet-100">
        <AuthProvider>
          <SiteNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
