"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./chat.module.scss"
import { useChat } from "@/components/context/ChatContext";
import AlfredIcon from "./AlfredIcon";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatStatus = "ongoing" | "qualified" | "borderline" | "declined";

type ChatResponse = {
  reply: string;
  status: ChatStatus;
};

function makeSessionId() {
  // simple client-side session id; server uses it as Redis key
  const s = Math.random().toString(16).slice(2);
  return `s_${Date.now()}_${s}`;
}

export default function AlfredChat() {
  const { isOpen, closeChat } = useChat();
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ongoing");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const existing = typeof window !== "undefined"
      ? window.localStorage.getItem("alfred_session_id")
      : null;

    if (existing && existing.length > 0) {
      setSessionId(existing);
      return;
    }

    const sid = makeSessionId();
    setSessionId(sid);
    window.localStorage.setItem("alfred_session_id", sid);
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  const headerText = useMemo(() => {
    if (status === "qualified") return "Alfred is ready to book ✅";
    if (status === "borderline") return "Alfred needs a little more info ⚡";
    if (status === "declined") return "Alfred will close this politely ✨";
    return "Hi, I’m Alfred, ask me anything";
  }, [status]);
  if (!isOpen) {
    return null;
  }
  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setInput("");

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          history: messages.concat(userMsg), // include latest turn for safety
        }),
      });

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry—something went wrong. Please try again in a moment.",
          },
        ]);
        setStatus("ongoing");
        return;
      }

      const data = (await res.json()) as ChatResponse;

      setStatus(data.status);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry—something went wrong. Please try again in a moment.",
        },
      ]);
      setStatus("ongoing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="alfred-chat-widget" className={styles.chatWidget}>
      <div className={styles.chatWidget__container}>
        {/* Header */}
        <div className={styles.chatWidget__header}>
          <div className={styles["chatWidget__header--content"]}>
            <div className={styles.chatWidget__avatar}>
              <span
                className={`${styles["chatWidget__avatar--indicator"]} ${styles[status]}`}
              />
              <div className={styles["chatWidget__avatar--circle"]}>
                <span>
                  <AlfredIcon size={48} />
                </span>
              </div>
            </div>
            <div className={styles.chatWidget__headerText}>
              <div className={styles["chatWidget__headerText--title"]}>{headerText}</div>
              <div className={styles["chatWidget__headerText--subtitle"]}>
                Here to assist you
              </div>
            </div>
          </div>
          <button
            onClick={closeChat}
            className={styles.chatWidget__closeButton}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className={styles.chatWidget__messages}
        >
          {messages.length === 0 ? (
            <div className={styles.chatWidget__emptyState}>
              So, what&apos;s the dream?
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                className={`${styles.chatWidget__message} ${
                  m.role === "user"
                    ? styles["chatWidget__message--user"]
                    : styles["chatWidget__message--assistant"]
                }`}
              >
                <div className={styles.chatWidget__messageBubble}>
                  {m.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className={styles.chatWidget__loading}>
              <div className={styles.chatWidget__messageBubble}>
                Alfred is thinking…
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={styles.chatWidget__inputContainer}>
          <div className={styles.chatWidget__composerRow}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              className={styles.chatWidget__textarea}
              placeholder="Ask Alfred about your project…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className={styles.chatWidget__sendButton}
            >
              Send
            </button>
          </div>

          <div className={styles.chatWidget__consentText}>
            By chatting, you consent to verification workflow emails when needed.
          </div>
        </div>
      </div>
    </div>
  );
}
