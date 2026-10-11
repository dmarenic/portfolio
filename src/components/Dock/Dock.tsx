"use client";

import { useEffect, useState } from "react";
import styles from "./Dock.module.css";

type DockProps = {
  label: string;
  items: { id: string; label: string }[];
};

/*
 * The floating navigation at the bottom of the home page. The link of the
 * section that is in the middle of the screen is highlighted.
 *
 * Panels slide over each other, and the contact section waits pinned under
 * the About panel, so a section can be "on screen" while it is hidden. So
 * instead of watching positions, the dock asks the browser which element is
 * actually drawn in the middle of the screen (elementFromPoint) and takes the
 * section around it (data-section, set by Section). This runs at most once
 * per frame while scrolling.
 * Sections that are not in the navigation (the hero, About) highlight
 * nothing. Without JavaScript the links still work, they are just never
 * highlighted.
 */
export function Dock({ label, items }: DockProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const element = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2,
      );
      const id =
        element?.closest("[data-section]")?.getAttribute("data-section") ??
        null;
      setActive(items.some((item) => item.id === id) ? id : null);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    // data-dock: on phones the corner buttons move up above the dock on the
    // pages that have it (see --corner-bottom in globals.css).
    <nav className={styles.dock} aria-label={label} data-dock>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              className={styles.link}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
