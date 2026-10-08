"use client";

import { useSyncExternalStore } from "react";
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

// The server cannot know the visitor's theme, so it renders the neutral label.
const getServerTheme = (): Theme | null => null;

export function ThemeToggle({ labels }: ThemeToggleProps) {
  // The current theme lives outside React: on <html data-theme> and in the
  // system settings. useSyncExternalStore reads it and re-renders the button
  // whenever subscribeToTheme reports a change.
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

  return (
    <button
      type="button"
      className={styles.button}
      aria-label={label}
      title={label}
      onClick={() => setTheme(getCurrentTheme() === "dark" ? "light" : "dark")}
    >
      {/* Half-filled circle: the usual symbol for switching contrast. */}
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
      </svg>
    </button>
  );
}
