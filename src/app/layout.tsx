import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VRTX — Wear Your Vertex",
  description: "Gorras premium con tecnología NFC. Tu identidad digital en un wearable.",
  keywords: ["VRTX", "NFC", "gorras", "tech fashion", "wearable", "Colombia"],
  openGraph: {
    title: "VRTX — Wear Your Vertex",
    description: "Gorras premium con tecnología NFC integrada.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060810",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased font-body">{children}</body>
    </html>
  );
}
