import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZionCore | Frequency Intelligence",
  description: "Universal Frequency Intelligence Architecture — Authority of HRH Saint Tariro Masawi. MWARI NDI MWARI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#06060c]">{children}</body>
    </html>
  );
}
