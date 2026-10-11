/**
 * Light and dark theme.
 *
 * The light theme is the default, whatever the operating system is set to.
 * When the visitor presses the theme button, their choice is saved in
 * localStorage and written to <html data-theme="dark">, which globals.css uses
 * to switch the colours.
 */
export type Theme = "light" | "dark";

export const themeStorageKey = "theme";

/** Fired on window when the theme changes, so the toggle can update itself. */
export const themeChangeEvent = "themechange";

/**
 * Runs in <head> before the page is painted, so a saved dark theme is applied
 * without a flash of the light colours. localStorage can throw (for example
 * when storage is blocked), so it is wrapped in try/catch.
 */
export const themeScript = `try{if(localStorage.getItem("${themeStorageKey}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

/** The theme the page is showing right now. Browser only. */
export function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  if (theme === "dark") {
    document.documentElement.dataset.theme = "dark";
  } else {
    delete document.documentElement.dataset.theme;
  }
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage is unavailable; the theme still applies until the page reloads.
  }
  window.dispatchEvent(new Event(themeChangeEvent));
}

/** Calls `onChange` when the theme button changes the theme. */
export function subscribeToTheme(onChange: () => void): () => void {
  window.addEventListener(themeChangeEvent, onChange);
  return () => window.removeEventListener(themeChangeEvent, onChange);
}
