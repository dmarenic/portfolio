"use client";

import { useCallback, useEffect, useRef } from "react";

/*
 * Cloudflare Turnstile in the chat window. The script is loaded only when
 * the window is open and the conversation still needs the check, so
 * visitors who never open the chat get nothing from Cloudflare.
 *
 * The widget is set to "interaction-only": it is invisible unless Cloudflare
 * needs the visitor to tick a box. It gives the browser a token, which goes
 * with the message to the server (see lib/chatbot/turnstile.ts).
 */

type TurnstileApi = {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      appearance: "interaction-only";
      size: "flexible";
      theme: "light" | "dark";
      language: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptLoading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  scriptLoading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoading = null;
      reject(new Error("Turnstile could not be loaded"));
    };
    document.head.append(script);
  });
  return scriptLoading;
}

/**
 * siteKey: NEXT_PUBLIC_TURNSTILE_SITE_KEY, or null when Turnstile is not
 * set up (then nothing happens). active: the conversation still needs the
 * check (the server has not answered it yet).
 */
export function useTurnstile(
  siteKey: string | null,
  active: boolean,
  language: string,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !active) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        const container = containerRef.current;
        if (cancelled || !container || !window.turnstile) return;
        widgetRef.current = window.turnstile.render(container, {
          sitekey: siteKey,
          action: "chat",
          appearance: "interaction-only",
          size: "flexible",
          theme:
            document.documentElement.dataset.theme === "dark"
              ? "dark"
              : "light",
          language,
          callback: (token) => {
            tokenRef.current = token;
          },
          "expired-callback": () => {
            tokenRef.current = null;
          },
          "error-callback": () => {
            tokenRef.current = null;
          },
        });
      })
      .catch(() => {
        // Without the widget there is no token, and the server answers with
        // the "could not confirm you're not a bot" message.
      });

    return () => {
      cancelled = true;
      if (widgetRef.current) window.turnstile?.remove(widgetRef.current);
      widgetRef.current = null;
      tokenRef.current = null;
    };
  }, [siteKey, active, language]);

  /** The token, waiting up to 15 seconds for the widget to finish. */
  const getToken = useCallback(async (): Promise<string | undefined> => {
    if (!siteKey || !active) return undefined;
    for (let waited = 0; !tokenRef.current && waited < 15_000; waited += 250) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return tokenRef.current ?? undefined;
  }, [siteKey, active]);

  /** A token works only once, so after each use the widget makes a new one. */
  const renew = useCallback(() => {
    tokenRef.current = null;
    if (widgetRef.current) window.turnstile?.reset(widgetRef.current);
  }, []);

  return { containerRef, getToken, renew };
}
