'use client';

import styles from "./ask-alfred-button.module.scss";
import { useChat } from "@/components/context/ChatContext";

type Props = {
  /** What Alfred receives as the visitor's first message. */
  message: string;
  label?: string;
  variant?: "solid" | "ghost";
  className?: string;
};

export default function AskAlfredButton({
  message,
  label = "Ask Alfred about this",
  variant = "ghost",
  className,
}: Props) {
  const { askAlfred } = useChat();

  return (
    <button
      type="button"
      className={`${styles.ask} ${styles[variant]} ${className ?? ""}`}
      onClick={() => askAlfred(message)}
    >
      <span className={styles.dot} aria-hidden />
      {label}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
