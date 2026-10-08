import type { Metadata } from "next";
import { notFoundPage } from "@/content/site";
import { archivo, jetbrainsMono } from "@/lib/fonts";
import { localePath } from "@/lib/i18n";
import { themeScript } from "@/lib/theme";
import "./globals.css";
import styles from "./not-found.module.css";

/*
 * Shown for every URL that matches no page. The root layout lives under
 * [locale], so a 404 for an unknown address has no layout to render in; this
 * file is a complete page of its own (enabled by experimental.globalNotFound
 * in next.config.ts). It does not know the visitor's language, so it shows
 * the message in both.
 */

export const metadata: Metadata = {
  title: notFoundPage.title,
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <main className={`container ${styles.page}`}>
          <p className={styles.code}>404</p>
          <div className={styles.messages}>
            <section>
              <h1 className={styles.heading}>{notFoundPage.en.heading}</h1>
              <p className={styles.text}>{notFoundPage.en.text}</p>
              <a className={styles.link} href={localePath("en")}>
                {notFoundPage.en.link}
              </a>
            </section>
            <section lang="hr">
              <h2 className={styles.heading}>{notFoundPage.hr.heading}</h2>
              <p className={styles.text}>{notFoundPage.hr.text}</p>
              <a className={styles.link} href={localePath("hr")} hrefLang="hr">
                {notFoundPage.hr.link}
              </a>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
