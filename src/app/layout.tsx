import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

/* 見出しの書体。9件が同じ字面だと、並んだときに見分けが付かない */
const display = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://use-pwa.kkweb.io"),
  alternates: { canonical: "/" },
  title: "use-pwa",
  description: "React hook for PWA installation detection and handling",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={display.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
