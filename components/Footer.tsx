export function Footer() {
  return (
    <footer className="relative z-10 px-6 pb-6 sm:px-10 sm:pb-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
        Volumes, Inc. · 2026 · NYC ·{" "}
        <a
          href="mailto:Hello@volumes.cloud"
          className="text-ink-muted underline decoration-ink-muted/40 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          Hello@volumes.cloud
        </a>
      </p>
    </footer>
  );
}
