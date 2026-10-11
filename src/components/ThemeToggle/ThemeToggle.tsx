"use client";

import { type MouseEvent, useSyncExternalStore } from "react";
import { CircleHalf } from "@phosphor-icons/react/dist/ssr/CircleHalf";
import {
  getCurrentTheme,
  setTheme,
  subscribeToTheme,
  type Theme,
} from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = {
  labels: { toLight: string; toDark: string; unknown: string };
};

// The server cannot know whether the visitor saved the dark theme, so it
// renders the neutral label.
const getServerTheme = (): Theme | null => null;

export function ThemeToggle({ labels }: ThemeToggleProps) {
  // The current theme lives outside React, on <html data-theme>.
  // useSyncExternalStore reads it and re-renders the button whenever
  // subscribeToTheme reports a change.
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getCurrentTheme,
    getServerTheme,
  );

  const label =
    theme === null
      ? labels.unknown
      : theme === "dark"
        ? labels.toLight
        : labels.toDark;

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next = getCurrentTheme() === "dark" ? "light" : "dark";
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Where view transitions are supported, the new theme grows as a circle
    // from the button (the animation is in globals.css).
    if (!document.startViewTransition || reducedMotion) {
      setTheme(next);
      return;
    }
    const root = document.documentElement;
    const rect = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--vt-y", `${rect.top + rect.height / 2}px`);
    root.classList.add("theme-transition");
    const transition = document.startViewTransition(() => setTheme(next));
    transition.finished.finally(() =>
      root.classList.remove("theme-transition"),
    );
  }

  return (
    <button
      type="button"
      className={styles.button}
      aria-label={label}
      title={label}
      onClick={toggle}
    >
      <CircleHalf size={20} weight="bold" aria-hidden="true" />
    </button>
  );
}
