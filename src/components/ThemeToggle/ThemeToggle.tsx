"use client";

import { useSyncExternalStore } from "react";
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
      <CircleHalf size={20} weight="bold" aria-hidden="true" />
    </button>
  );
}
