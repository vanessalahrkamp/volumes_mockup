"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dataTaxonomy, type DataTaxonomyItem } from "@/lib/dataTaxonomy";
import { buildMailto } from "@/lib/buildMailto";
import { ChromeButton } from "@/components/ui/ChromeButton";
import { inputClass } from "./styles";

type Phase = "select" | "details" | "done";

const PHASE_ORDER: Record<Phase, number> = { select: 0, details: 1, done: 2 };

export function DataInterestStep({
  role,
  onClose,
}: {
  role: "Buyer" | "Seller";
  onClose: () => void;
}) {
  const [[phase, direction], setPhaseState] = useState<[Phase, number]>([
    "select",
    1,
  ]);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [mailtoHref, setMailtoHref] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const verb = role === "Buyer" ? "buying" : "selling";

  function goTo(next: Phase) {
    setPhaseState([next, PHASE_ORDER[next] >= PHASE_ORDER[phase] ? 1 : -1]);
  }

  const unknownItem = useMemo(
    () => dataTaxonomy.find((entry) => entry.category === "Unknown")!,
    [],
  );

  const groupedCategories = useMemo(() => {
    const map = new Map<string, DataTaxonomyItem[]>();
    for (const entry of dataTaxonomy) {
      if (entry.category === "Unknown") continue;
      if (!map.has(entry.category)) map.set(entry.category, []);
      map.get(entry.category)!.push(entry);
    }
    return Array.from(map.entries());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return dataTaxonomy.filter(
      (entry) =>
        entry.item.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q),
    );
  }, [query]);

  function toggleCategory(category: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function toggle(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const checkboxes = Array.from(
      listRef.current?.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]',
      ) ?? [],
    );
    const currentIndex = checkboxes.indexOf(
      document.activeElement as HTMLInputElement,
    );
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex =
      (currentIndex + delta + checkboxes.length) % checkboxes.length;
    checkboxes[nextIndex]?.focus();
  }

  const selectedNames = dataTaxonomy
    .filter((entry) => selectedIds.has(entry.id))
    .map((entry) => entry.item);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = buildMailto({
      role,
      name,
      email,
      company,
      message,
      dataTypes: selectedNames,
    });
    setMailtoHref(href);
    goTo("done");
  }

  const donePhase = (
    <div>
      <h2
        id="contact-modal-title"
        className="text-xl font-semibold text-ink-primary"
      >
        Ready to send
      </h2>
      <p className="mt-3 text-sm text-ink-body">
        We&apos;ve put together your message to Volumes. Open it in your
        email client to send.
      </p>
      <ChromeButton href={mailtoHref} className="mt-6">
        Open email
        <span aria-hidden>→</span>
      </ChromeButton>
      <button
        type="button"
        onClick={onClose}
        className="chrome-underline focus-ring mt-4 block cursor-pointer text-sm text-ink-muted transition-colors hover:text-ink-primary"
      >
        Close
      </button>
    </div>
  );

  const detailsPhase = (
    <div>
      <h2
        id="contact-modal-title"
        className="text-xl font-semibold text-ink-primary"
      >
        Your details
      </h2>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Field label="Name" htmlFor="contact-name">
          <input
            id="contact-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Email" htmlFor="contact-email">
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Company (optional)" htmlFor="contact-company">
          <input
            id="contact-company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Message (optional)" htmlFor="contact-message">
          <textarea
            id="contact-message"
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goTo("select")}
            className="chrome-underline focus-ring cursor-pointer text-sm text-ink-muted transition-colors hover:text-ink-primary"
          >
            Back
          </button>
          <ChromeButton type="submit">
            Next
            <span aria-hidden>→</span>
          </ChromeButton>
        </div>
      </form>
    </div>
  );

  const selectPhase = (
    <div>
      <h2
        id="contact-modal-title"
        className="text-xl font-semibold text-ink-primary"
      >
        What data are you interested in {verb}?
      </h2>

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search data types…"
        aria-label="Search data types"
        className={`mt-5 ${inputClass}`}
      />

      <div
        ref={listRef}
        onKeyDown={handleListKeyDown}
        className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-white/12"
      >
        {filtered ? (
          <>
            {filtered.map((entry) => (
              <ItemRow
                key={entry.id}
                entry={entry}
                checked={selectedIds.has(entry.id)}
                onToggle={toggle}
                showCategory
              />
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-sm text-ink-muted">No matches.</p>
            )}
          </>
        ) : (
          <>
            <ItemRow
              entry={unknownItem}
              checked={selectedIds.has(unknownItem.id)}
              onToggle={toggle}
            />
            {groupedCategories.map(([category, items]) => {
              const isOpen = expandedCategories.has(category);
              const selectedCount = items.filter((entry) =>
                selectedIds.has(entry.id),
              ).length;
              return (
                <div
                  key={category}
                  className="border-b border-white/5 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    aria-expanded={isOpen}
                    className="focus-ring flex w-full cursor-pointer items-center justify-between px-3 py-3 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                      {category}
                      {selectedCount > 0 ? ` (${selectedCount})` : ""}
                    </span>
                    <span aria-hidden className="text-ink-muted">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen &&
                    items.map((entry) => (
                      <ItemRow
                        key={entry.id}
                        entry={entry}
                        checked={selectedIds.has(entry.id)}
                        onToggle={toggle}
                        indent
                      />
                    ))}
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end">
        <ChromeButton
          disabled={selectedIds.size === 0}
          onClick={() => goTo("details")}
        >
          Next
          <span aria-hidden>→</span>
        </ChromeButton>
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={phase}
        initial={{ opacity: 0, x: direction * 20, filter: "blur(3px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: direction * -20, filter: "blur(3px)" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {phase === "select"
          ? selectPhase
          : phase === "details"
            ? detailsPhase
            : donePhase}
      </motion.div>
    </AnimatePresence>
  );
}

function ItemRow({
  entry,
  checked,
  onToggle,
  showCategory,
  indent,
}: {
  entry: DataTaxonomyItem;
  checked: boolean;
  onToggle: (id: number) => void;
  showCategory?: boolean;
  indent?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 border-b border-white/5 py-3 pr-3 text-sm last:border-b-0 hover:bg-white/5 ${
        indent ? "pl-9" : "pl-3"
      }`}
    >
      <span className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(entry.id)}
          className="chrome-checkbox focus-ring"
        />
        <span className="text-ink-body">{entry.item}</span>
      </span>
      {showCategory && (
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
          {entry.category}
        </span>
      )}
    </label>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
