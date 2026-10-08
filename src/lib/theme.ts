/**
 * Light and dark theme.
 *
 * By default the site follows the operating system setting
 * (prefers-color-scheme). When the visitor presses the theme button, their
 * choice is saved in localStorage and written to <html data-theme="...">,
 * which globals.css uses to override the system setting.
 */
export type Theme = "light" | "dark";

export const themeStorageKey = "theme";

/** Fired on window when the theme changes, so the toggle can update itself. */
export const themeChangeEvent = "themechange";

/**
 * Runs in <head> before the page is painted, so a saved theme is applied
 * without a flash of the wrong colours. localStorage can throw (for example
 * when storage is blocked), so it is wrapped in try/catch.
 */
export const themeScript = `try{var t=localStorage.getItem("${themeStorageKey}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const darkQuery = "(prefers-color-scheme: dark)";

/** The theme the page is showing right now. Browser only. */
export function getCurrentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia(darkQuery).matches ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage is unavailable; the theme still applies until the page reloads.
  }
  window.dispatchEvent(new Event(themeChangeEvent));
}

/** Calls `onChange` when the theme changes, by the button or by the system. */
export function subscribeToTheme(onChange: () => void): () => void {
  const media = window.matchMedia(darkQuery);
  media.addEventListener("change", onChange);
  window.addEventListener(themeChangeEvent, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(themeChangeEvent, onChange);
  };
}
