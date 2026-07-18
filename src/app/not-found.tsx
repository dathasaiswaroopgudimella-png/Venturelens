import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface px-6 text-center max-w-md mx-auto font-sans">
      <span className="material-symbols-outlined text-5xl text-secondary mb-4">explore_off</span>
      <h2 className="text-2xl font-extrabold mb-2 tracking-tight">Page Not Found</h2>
      <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
        The requested path does not exist in VentureLens AI. Check the URL or return to the dashboard.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link
          href="/dashboard"
          className="flex-1 bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all text-center block shadow-sm"
        >
          Go to Dashboard
        </Link>
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
