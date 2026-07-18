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
  title: "VentureLens AI | Decision Intelligence for Startups",
  description:
    "Evaluate your startup idea through deterministic scoring, rules, evidence, consistency validation, and expert AI strategic reviews.",
  metadataBase: new URL("https://venturelens-two.vercel.app"),
  openGraph: {
    title: "VentureLens AI — Decision Intelligence Platform",
    description:
      "Move beyond chatbot guesses. Run your startup through a deterministic 9-stage validation pipeline. Free during beta.",
    url: "https://venturelens-two.vercel.app",
    siteName: "VentureLens AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VentureLens AI — Decision Intelligence for Founders",
    description:
      "Deterministic startup scoring, live competitor analysis, and AI cross-verification. Free for founders.",
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
