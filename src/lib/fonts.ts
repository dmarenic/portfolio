import { Geist, Geist_Mono } from "next/font/google";

// Geist is a variable font (weights 100 to 900) with Croatian letters
// (latin-ext). Large headings use weight 500 with tight letter spacing.
// next/font downloads the files at build time and serves them from this site,
// so visitors never request anything from Google.
export const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
  display: "swap",
});

// Used only for Socket.IO event names and payloads, because they are code.
export const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
  display: "swap",
});
