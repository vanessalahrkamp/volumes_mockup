export function Footer({
  infoOpen,
  onToggleInfo,
}: {
  infoOpen: boolean;
  onToggleInfo: () => void;
}) {
  if (infoOpen) return null;

  return (
    <footer className="relative z-10 flex justify-center px-6 pb-8 sm:px-10 sm:pb-10">
      <button
        type="button"
        onClick={onToggleInfo}
        className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted underline decoration-ink-muted/40 underline-offset-4 transition-colors hover:text-ink-primary hover:decoration-ink-primary"
      >
        Info
      </button>
    </footer>
  );
}
