# Dominik Marenić – portfolio

My portfolio site: projects, skills, experience and contact, in English and
Croatian, with a light and a dark theme.

**Live:** https://dominik-marenic.vercel.app

## What is in it

- **Home page** with my projects (Online Trivia Quiz, RateMyMeal, Blue Pulse),
  skills, experience, education, About and contact.
- **Case study** of my bachelor's thesis project, Online Trivia Quiz, with an
  interactive diagram of the real Socket.IO events of one round.
- **Dominik AI**, a chat assistant that answers visitors' questions about me.
  It runs on the server with Google Gemini and knows only what the site says:
  its knowledge is built from the same content file as the pages.

## Built with

- Next.js 16 (App Router), React 19, TypeScript, CSS Modules
- Static pages for both languages (English at `/`, Croatian at `/hr`)
- Chat: `@google/genai` (Gemini), Upstash Redis, Cloudflare Turnstile,
  Nodemailer (Gmail), Zod
- Vitest, ESLint, Prettier, GitHub Actions (lint, format, type check, tests,
  build), hosted on Vercel

## How the chat is protected

- The Gemini key is read only on the server and never reaches the browser.
- The browser sends only the new message; the server keeps the conversation
  itself, so nobody can fake earlier answers of the model.
- Input checks (Zod), limits per visitor, per conversation and for the whole
  site, a check of the request origin, a hidden field for bots and Turnstile.
- Visitors are counted by a salted hash of their IP address; full addresses
  are never stored or logged.

## Run it locally

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY to try the chat
npm run dev
```

Then open http://localhost:3000. Without the other keys the chat keeps its
data in memory and prints the emails to the terminal.

Other scripts: `npm test`, `npm run lint`, `npm run typecheck`,
`npm run build`.

All environment variables are listed in `.env.example`. A step-by-step setup
guide for the chat (in Croatian) is in
[docs/chatbot-postavljanje.md](docs/chatbot-postavljanje.md).

## Where things are

- `src/content/site.ts` – all text of the site, in both languages
- `src/components/` – one folder per component, with its CSS module
- `src/app/api/chat/` – the chat routes; their logic is in `src/lib/chatbot/`

## Contact

dominik.marenic@gmail.com · [LinkedIn](https://www.linkedin.com/in/dominik-marenic/) · [GitHub](https://github.com/dmarenic)
