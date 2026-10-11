"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { LinkSimple } from "@phosphor-icons/react/dist/ssr/LinkSimple";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { useScrollCheck, visibleHeroLinks } from "@/lib/heroLinks";
import styles from "./LinksMenu.module.css";

type LinksMenuToggleProps = {
  label: string;
  // The <li> elements with the links, rendered by LinksMenu on the server.
  children: ReactNode;
};

/*
 * The part of the links menu that runs in the browser:
 *
 * - The button is shown only while the links in the hero are not on screen,
 *   so the same links are never shown twice. Pages without a hero (the case
 *   study) show it right away.
 * - The button opens and closes the column of links. A click outside it or
 *   the Esc key closes it too.
 */
export function LinksMenuToggle({ label, children }: LinksMenuToggleProps) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  // Checks the hero links at most once per frame while scrolling.
  const update = useCallback(() => {
    const show = visibleHeroLinks() === null;
    setVisible(show);
    if (!show) setOpen(false);
  }, []);
  useScrollCheck(update);

  // Listens for a click outside and for Esc only while the menu is open.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Focus goes back to the button only if it was inside the menu, so
      // Esc never moves the focus of someone working elsewhere on the page.
      if (rootRef.current?.contains(document.activeElement)) {
        buttonRef.current?.focus();
      }
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    // inert: while hidden, nothing inside can be focused or clicked.
    <div
      ref={rootRef}
      className={styles.menu}
      data-visible={visible || undefined}
      data-open={open || undefined}
      inert={!visible}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-label={label}
        title={label}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {open ? (
          <X size={22} weight="bold" aria-hidden="true" />
        ) : (
          <LinkSimple size={24} weight="bold" aria-hidden="true" />
        )}
      </button>
      <ul id={listId} className={styles.list} inert={!open}>
        {children}
      </ul>
    </div>
  );
}
