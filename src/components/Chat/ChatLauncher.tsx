"use client";

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useScrollCheck, visibleHeroLinks } from "@/lib/heroLinks";
import type { Locale } from "@/lib/i18n";
import { Avatar } from "./Avatar";
import type { ChatTexts } from "./types";
import styles from "./ChatLauncher.module.css";

// The window is a separate file that the browser downloads only after the
// first click on the button, so it does not slow down loading the page.
const ChatWindow = lazy(() => import("./ChatWindow"));

type ChatLauncherProps = {
  locale: Locale;
  texts: ChatTexts;
  avatarSrc: string | null;
  turnstileSiteKey: string | null;
};

/*
 * The round button with the avatar in the bottom right corner. The first
 * click loads and opens the chat window. When the window closes, the focus
 * comes back to this button.
 *
 * On some screen widths (about 1150-1470px) the button would cover the
 * profile links in the bottom right of the hero, so it stays hidden while it
 * would; everywhere else it is visible right away.
 */
export function ChatLauncher({
  locale,
  texts,
  avatarSrc,
  turnstileSiteKey,
}: ChatLauncherProps) {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  // True while an answer is being written; the avatar shows it too.
  const [typing, setTyping] = useState(false);
  const [visible, setVisible] = useState(false);
  // Set the first time the button is visible, and never unset, so the ring
  // flickers only once.
  const [shown, setShown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const update = useCallback(() => {
    const button = buttonRef.current;
    const links = visibleHeroLinks();
    const covers = button !== null && links !== null && overlaps(button, links);
    setVisible(!covers);
    if (!covers) setShown(true);
  }, []);
  useScrollCheck(update);

  // Runs after the window has closed its <dialog> (effects of children run
  // before the effects of their parent), so the focus lands on the button.
  useEffect(() => {
    if (wasOpen.current && !open) buttonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.launcher}
        data-visible={visible || undefined}
        data-shown={shown || undefined}
        inert={!visible}
        aria-label={texts.open}
        title={texts.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
      >
        <Avatar src={avatarSrc} size={54} typing={typing} />
      </button>
      {loaded && (
        <Suspense fallback={null}>
          <ChatWindow
            open={open}
            onClose={() => setOpen(false)}
            onTypingChange={setTyping}
            locale={locale}
            texts={texts}
            avatarSrc={avatarSrc}
            turnstileSiteKey={turnstileSiteKey}
          />
        </Suspense>
      )}
    </>
  );
}

// True when the button is within 12px of the box of the hero links.
// offsetLeft/offsetTop give the button's place without the small movement
// of its show and hide animation, so the answer does not flip back and forth
// while it moves.
function overlaps(button: HTMLElement, links: DOMRect): boolean {
  const gap = 12;
  return (
    button.offsetLeft < links.right + gap &&
    button.offsetLeft + button.offsetWidth > links.left - gap &&
    button.offsetTop < links.bottom + gap &&
    button.offsetTop + button.offsetHeight > links.top - gap
  );
}
