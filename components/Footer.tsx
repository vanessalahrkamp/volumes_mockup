import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 flex flex-col items-center gap-4 px-6 pb-8 text-center sm:px-10 sm:pb-10">
      <p className="text-sm text-ink-muted">
        Volumes buys and sells data for physical AI.
      </p>
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted underline decoration-ink-muted/40 underline-offset-4 transition-colors hover:text-ink-primary hover:decoration-ink-primary"
      >
        Home
      </Link>
    </footer>
  );
}
