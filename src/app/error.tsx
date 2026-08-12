"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("VentureLens Pipeline Crash Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface px-6 text-center max-w-md mx-auto font-sans">
      <span className="material-symbols-outlined text-5xl text-error mb-4 animate-bounce">warning</span>
      <h2 className="text-2xl font-extrabold mb-2 tracking-tight">Something Went Wrong</h2>
      <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
        The VentureLens Decision Pipeline encountered an unexpected runtime error. Your reports and inputs remain safe.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={reset}
          className="flex-1 bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="flex-1 border border-outline-variant text-on-surface px-6 py-3 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-all text-center block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
