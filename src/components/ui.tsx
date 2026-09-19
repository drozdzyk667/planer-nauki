"use client";
import { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, LockKeyhole, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useLocale } from "./providers";
import { brand, motionTokens } from "@/lib/config";
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`reveal ${className}`}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: reduced ? 0 : motionTokens.slow,
        delay: reduced ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
export function Logo() {
  return (
    <span className="wordmark">
      <span className="brand-symbol" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {brand.name.toLowerCase()}
      <span className="brand-dot">.</span>
    </span>
  );
}
export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog?.open) {
      dialog?.showModal();
      closeRef.current?.focus();
    } else if (!open && dialog?.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]',
          ),
        );
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        ref={closeRef}
        className="icon-button modal-close"
        onClick={onClose}
        aria-label={useLocale().t.closeDialog}
      >
        <X size={20} />
      </button>
      <h2 id={titleId}>{title}</h2>
      {children}
    </dialog>
  );
}
export function UpgradeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const premiumList = usePremiumList();
  return (
    <Dialog open={open} onClose={onClose} title={t.upgradeTitle}>
      <div className="upgrade-emblem">
        <LockKeyhole size={42} />
        <Sparkles size={24} />
      </div>
      <p>{t.upgradeCopy}</p>
      <ul className="check-list">
        {["advanced", "practice", "project"].map((v, i) => (
          <li key={v}>
            <Check size={17} />
            {premiumList[i]}
          </li>
        ))}
      </ul>
      <p className="fine-print">{t.upgradeNote}</p>
      <button className="button primary full" onClick={onClose}>
        {t.keepLearning}
        <ArrowUpRight size={18} />
      </button>
    </Dialog>
  );
}
function usePremiumList() {
  const { locale } = useLocale();
  return locale === "en"
    ? [
        "Advanced modules and developer-level details",
        "Full practice, flashcards and knowledge library",
        "Projects, checkpoints and assessments",
      ]
    : [
        "Zaawansowane moduły i smaczki developerskie",
        "Pełna praktyka, fiszki i biblioteka wiedzy",
        "Projekty, checkpointy i testy",
      ];
}
export function EmptyState({
  title,
  description,
  action,
  href,
}: {
  title: string;
  description: string;
  action: string;
  href: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Sparkles size={30} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="button primary" href={href}>
        {action}
        <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
