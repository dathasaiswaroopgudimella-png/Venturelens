import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VentureLens AI — Institutional Venture Intelligence Platform",
  description:
    "Institutional startup due diligence, evidence-grounded scoring equations, 16 deterministic VC logic rules, and 5-pillar adversarial cross-verification. Founded by Datha Sai Swaroop (IIT BHU).",
  authors: [{ name: "Datha Sai Swaroop (IIT BHU)", url: "https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371" }],
  metadataBase: new URL("https://venturelens-two.vercel.app"),
  openGraph: {
    title: "VentureLens AI — Institutional Venture Intelligence",
    description:
      "Move beyond chatbot guesses. Stress-test your venture thesis with transparent mathematical scoring equations, 16 deterministic VC rules, and 5-pillar AI cross-checks.",
    url: "https://venturelens-two.vercel.app",
    siteName: "VentureLens AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VentureLens AI — Institutional Venture Intelligence Platform",
    description:
      "Evidence-grounded scoring equations, multi-layer pitch deck parsing, and 5-pillar cross-checks for serious founders.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
