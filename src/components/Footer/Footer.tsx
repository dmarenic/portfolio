import { footer, profile } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import styles from "./Footer.module.css";

// Pages are built ahead of time, so this is the year of the last build.
const year = new Date().getFullYear();

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className={`tone-dark ${styles.footer}`}>
      <div className="container">
        <div className={styles.inner}>
          <p>
            © {year} {profile.name}
          </p>
          <p>{footer.builtWith[locale]}</p>
        </div>
      </div>
    </footer>
  );
}
