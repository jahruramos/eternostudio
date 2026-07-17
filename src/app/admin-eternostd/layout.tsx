import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ppNeueMontreal = localFont({
  variable: "--font-pp-neue",
  display: "swap",
  src: [
    { path: "../../../fonts/ppneuemontreal-thin.otf", weight: "100", style: "normal" },
    { path: "../../../fonts/ppneuemontreal-book.otf", weight: "400", style: "normal" },
    { path: "../../../fonts/ppneuemontreal-italic.otf", weight: "400", style: "italic" },
    { path: "../../../fonts/ppneuemontreal-medium.otf", weight: "500", style: "normal" },
    { path: "../../../fonts/ppneuemontreal-semibolditalic.otf", weight: "600", style: "italic" },
    { path: "../../../fonts/ppneuemontreal-bold.otf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Eterno Studio™ — Admin",
  description: "Panel de administración de Eterno Studio",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ppNeueMontreal.variable} h-full`}>
      <body className="min-h-full bg-negro font-sans text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
