"use client";

import {
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr/ArrowCounterClockwise";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import type { Locale } from "@/lib/i18n";
import { Avatar } from "./Avatar";
import { FormattedAnswer, plainText } from "./FormattedAnswer";
import type { ChatTexts } from "./types";
import { useTurnstile } from "./useTurnstile";
import styles from "./ChatWindow.module.css";

type ChatWindowProps = {
  open: boolean;
  onClose: () => void;
  onTypingChange: (typing: boolean) => void;
  locale: Locale;
  texts: ChatTexts;
  avatarSrc: string | null;
  turnstileSiteKey: string | null;
};

type Message = {
  role: "user" | "assistant";
  text: string;
  // An answer from the site instead of the model (an error or a limit).
  notice?: boolean;
};

type Conversation = {
  // A random UUID; the server stores the conversation under it.
  id: string;
  messages: Message[];
  // There are answers the server has not been asked to email yet.
  unsent?: boolean;
};

// Same limits as the server checks (see lib/chatbot/validation.ts).
const MAX_LENGTH = 500;
const SHOW_COUNTER_FROM = 400;
const CONTROL_CHARACTERS = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g;

/*
 * The chat window. It is a modal <dialog>: while it is open, the rest of the
 * page cannot be focused or clicked, Esc closes it, and the browser puts it
 * above everything else on the page.
 *
 * The browser only sends the new message and the id of the conversation. The
 * server keeps the whole conversation and sends the model only what it has
 * stored itself, so nobody can slip fake answers of the model into it. The
 * copy kept here (in sessionStorage) is only for showing the messages again
 * after moving to another page.
 */
export default function ChatWindow({
  open,
  onClose,
  onTypingChange,
  locale,
  texts,
  avatarSrc,
  turnstileSiteKey,
}: ChatWindowProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const counterId = useId();

  const [conversation, setConversation] = useState<Conversation>(load);
  const [input, setInput] = useState("");
  // null while no answer is coming; "" until the first piece arrives.
  const [streaming, setStreaming] = useState<string | null>(null);
  // The last complete answer, read out by screen readers (aria-live).
  const [announcement, setAnnouncement] = useState("");

  const busy = streaming !== null;
  const { messages } = conversation;

  // The server checks Turnstile until it has answered the conversation once.
  const needsCheck = !messages.some(
    (message) => message.role === "assistant" && !message.notice,
  );
  const {
    containerRef: turnstileRef,
    getToken,
    renew,
  } = useTurnstile(turnstileSiteKey, open && needsCheck, locale);

  // The latest conversation, for the end signal below, which runs from
  // event listeners that would otherwise see an old copy.
  const conversationRef = useRef(conversation);
  useEffect(() => {
    conversationRef.current = conversation;
    save(conversation);
  }, [conversation]);

  // Asks the server to email the new messages to Dominik. sendBeacon sends
  // the request even while the page is closing, and carries only the id: the
  // server reads the messages from its own store.
  const sendEndSignal = useCallback(() => {
    const current = conversationRef.current;
    if (!current.unsent) return;
    navigator.sendBeacon(
      "/api/chat/end",
      JSON.stringify({ conversationId: current.id }),
    );
    const sent = { ...current, unsent: false };
    conversationRef.current = sent;
    save(sent);
    setConversation((latest) => (latest.id === sent.id ? sent : latest));
  }, []);

  // pagehide: the visitor leaves the page or closes the tab.
  useEffect(() => {
    window.addEventListener("pagehide", sendEndSignal);
    return () => window.removeEventListener("pagehide", sendEndSignal);
  }, [sendEndSignal]);

  // Opens and closes the <dialog> when the button in the corner asks for it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // On a phone, focusing the text field would open the keyboard over the
      // suggested questions, so there the window itself gets the focus.
      if (window.matchMedia("(pointer: fine)").matches) {
        inputRef.current?.focus();
      } else {
        dialog.focus();
      }
    } else if (!open && dialog.open) {
      dialog.close();
      sendEndSignal();
    }
  }, [open, sendEndSignal]);

  // Keeps the newest message in view, unless the visitor has scrolled up to
  // read something earlier.
  useEffect(() => {
    const element = scrollRef.current;
    if (!element || messages.length === 0) return;
    const distance =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    if (distance < 120) element.scrollTop = element.scrollHeight;
  }, [messages.length, streaming]);

  async function send(text: string) {
    // The server refuses control characters (a pasted tab, for example), so
    // they become spaces; line breaks stay.
    const message = text.replace(CONTROL_CHARACTERS, " ").trim();
    if (!message || busy || message.length > MAX_LENGTH) return;

    const id = conversation.id;
    setConversation((current) => ({
      ...current,
      messages: [...current.messages, { role: "user", text: message }],
    }));
    setInput("");
    resize(inputRef.current, "");
    setStreaming("");
    onTypingChange(true);

    const turnstileToken = needsCheck ? await getToken() : undefined;
    const answer = await ask({
      request: {
        conversationId: id,
        message,
        locale,
        page: window.location.pathname,
        website: trapRef.current?.value ?? "",
        turnstileToken,
      },
      onText: setStreaming,
      fallback: texts.error,
    });
    if (turnstileToken) renew();

    // If the visitor started a new chat meanwhile, the answer belongs to the
    // old one and is dropped.
    setConversation((current) =>
      current.id === id
        ? { ...current, messages: [...current.messages, answer], unsent: true }
        : current,
    );
    setStreaming(null);
    setAnnouncement(plainText(answer.text));
    onTypingChange(false);
  }

  function startNewChat() {
    sendEndSignal();
    setConversation({ id: crypto.randomUUID(), messages: [] });
    setAnnouncement("");
    inputRef.current?.focus();
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  // Enter sends, Shift+Enter starts a new line. While an input method is
  // composing a character (isComposing), Enter belongs to it.
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      send(input);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.window}
      aria-labelledby={titleId}
      tabIndex={-1}
      data-chat
      // Esc: the browser would close the dialog by itself; instead the button
      // in the corner is told, so it knows the window is closed.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // A click on the backdrop around the window (the dialog element itself,
      // not anything inside it) closes it too.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.frame}>
        <header className={styles.header}>
          <Avatar src={avatarSrc} size={40} typing={busy} />
          <div className={styles.heading}>
            <h2 id={titleId} className={styles.title}>
              {texts.name}
              {/* The name already ends in "AI", so screen readers skip the label. */}
              <span className={styles.badge} aria-hidden="true">
                {texts.badge}
              </span>
            </h2>
            <p className={styles.subtitle}>{texts.subtitle}</p>
          </div>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={texts.newChat}
            title={texts.newChat}
            onClick={startNewChat}
            disabled={busy || messages.length === 0}
          >
            <ArrowCounterClockwise size={18} weight="bold" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={texts.close}
            title={texts.close}
            onClick={onClose}
          >
            <X size={18} weight="bold" aria-hidden="true" />
          </button>
        </header>

        <div ref={scrollRef} className={styles.body}>
          {messages.length === 0 ? (
            <div className={styles.empty}>
              <Avatar src={avatarSrc} size={96} typing={busy} />
              <p className={styles.emptyName}>{texts.name}</p>
              <p className={styles.greeting}>{texts.greeting}</p>
              <p className={styles.tryAsking}>{texts.tryAsking}</p>
              <ul className={styles.suggestions}>
                {texts.suggestions.map((question, index) => (
                  <li key={question} style={{ "--i": index } as CSSProperties}>
                    <button
                      type="button"
                      className={styles.suggestion}
                      onClick={() => send(question)}
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ol className={styles.messages}>
              {messages.map((message, index) => (
                <li
                  key={index}
                  className={
                    message.role === "user" ? styles.user : styles.assistant
                  }
                  data-notice={message.notice || undefined}
                >
                  <span className="visually-hidden">
                    {message.role === "user" ? texts.you : texts.name}:{" "}
                  </span>
                  {message.role === "user" ? (
                    message.text
                  ) : (
                    <FormattedAnswer
                      text={message.text}
                      newTabLabel={texts.newTab}
                    />
                  )}
                </li>
              ))}
              {busy && (
                <li className={styles.assistant}>
                  {streaming ? (
                    <FormattedAnswer
                      text={streaming}
                      newTabLabel={texts.newTab}
                    />
                  ) : (
                    <span
                      className={styles.dots}
                      role="img"
                      aria-label={texts.typing}
                    >
                      <span />
                      <span />
                      <span />
                    </span>
                  )}
                </li>
              )}
            </ol>
          )}
        </div>

        <form className={styles.composer} onSubmit={onSubmit}>
          <div className={styles.field}>
            <textarea
              ref={inputRef}
              className={styles.input}
              rows={1}
              value={input}
              maxLength={MAX_LENGTH}
              placeholder={texts.placeholder}
              aria-label={texts.inputLabel}
              aria-describedby={
                input.length > SHOW_COUNTER_FROM ? counterId : undefined
              }
              onChange={(event) => {
                setInput(event.target.value);
                resize(event.target, event.target.value);
              }}
              onKeyDown={onKeyDown}
            />
            <button
              type="submit"
              className={styles.send}
              aria-label={texts.send}
              title={texts.send}
              disabled={busy || input.trim() === ""}
            >
              <ArrowUp size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
          {input.length > SHOW_COUNTER_FROM && (
            <p id={counterId} className={styles.counter}>
              {input.length}/{MAX_LENGTH}
            </p>
          )}
          {/* Turnstile draws its box here, only when it needs the visitor. */}
          <div ref={turnstileRef} className={styles.turnstile} />
          {/* A field only bots see and fill in (see handler.ts). */}
          <div className={styles.trap} aria-hidden="true">
            <input
              ref={trapRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <p className={styles.disclaimer}>{texts.disclaimer}</p>
        </form>

        <div className="visually-hidden" aria-live="polite">
          {announcement}
        </div>
      </div>
    </dialog>
  );
}

/**
 * Sends one message to /api/chat and reads the answer as it arrives. The
 * server sends the text of the answer in pieces (streaming); onText gets the
 * text so far after every piece. When something goes wrong, the server sends
 * a friendly message as JSON instead, and that becomes the answer.
 */
async function ask({
  request,
  onText,
  fallback,
}: {
  // What the browser sends: the new message only, never the conversation.
  request: {
    conversationId: string;
    message: string;
    locale: Locale;
    page: string;
    website: string;
    turnstileToken?: string;
  };
  onText: (text: string) => void;
  fallback: string;
}): Promise<Message> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok || !response.body) {
      const data = await response.json().catch(() => null);
      const text = typeof data?.message === "string" ? data.message : fallback;
      return { role: "assistant", text, notice: true };
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();
    let text = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      text += value;
      onText(text);
    }
    return text.trim()
      ? { role: "assistant", text }
      : { role: "assistant", text: fallback, notice: true };
  } catch {
    return { role: "assistant", text: fallback, notice: true };
  }
}

// The text field grows with its text, up to four lines (the CSS sets the
// maximum height and scrolls beyond it).
function resize(element: HTMLTextAreaElement | null, value: string) {
  if (!element) return;
  element.style.height = "auto";
  if (value) element.style.height = `${element.scrollHeight}px`;
}

// sessionStorage keeps the conversation while the visitor moves between
// pages, and forgets it when the tab is closed. Reading and writing can throw
// when storage is blocked; the chat then simply starts empty.
const STORAGE_KEY = "dominik-ai-chat";

function load(): Conversation {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (typeof saved?.id === "string" && Array.isArray(saved.messages)) {
      return saved;
    }
  } catch {
    // Fall through to a new conversation.
  }
  return { id: crypto.randomUUID(), messages: [] };
}

function save(conversation: Conversation) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
  } catch {
    // Storage is unavailable; the conversation lives until the page closes.
  }
}
