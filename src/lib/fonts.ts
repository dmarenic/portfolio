import { Archivo, JetBrains_Mono } from "next/font/google";

// Archivo is a variable font with a width axis ("wdth"). Headings use the
// expanded width (font-stretch: 112%–125%), body text the normal width (100%).
// next/font downloads the files at build time and serves them from this site,
// so visitors never request anything from Google.
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Used only for Socket.IO event names, because they are code.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
