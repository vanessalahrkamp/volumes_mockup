import { cn } from "@/lib/utils";

const baseClass =
  "chrome-pill focus-ring inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-primary disabled:cursor-not-allowed disabled:opacity-30";

type ChromeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Renders an <a> instead of a <button> when set. */
  href?: string;
};

export function ChromeButton({
  href,
  className,
  children,
  ...props
}: ChromeButtonProps) {
  if (href) {
    return (
      <a href={href} className={cn(baseClass, className)}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" {...props} className={cn(baseClass, className)}>
      {children}
    </button>
  );
}
