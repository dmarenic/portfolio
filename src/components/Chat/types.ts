/** Text of the chat in the language of the page, picked from site.ts. */
export type ChatTexts = {
  name: string;
  badge: string;
  subtitle: string;
  open: string;
  close: string;
  newChat: string;
  greeting: string;
  tryAsking: string;
  suggestions: string[];
  placeholder: string;
  inputLabel: string;
  send: string;
  you: string;
  typing: string;
  disclaimer: string;
  // Shown when the server cannot be reached at all.
  error: string;
  newTab: string;
};
