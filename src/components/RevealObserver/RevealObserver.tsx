"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
 * Elements with data-reveal (fade in and rise) or data-row (fade in and
 * slide in from the left) appear the first time they come into view. The
 * movement itself is CSS (the motion system in globals.css); this component
 * only decides when.
 *
 * - One IntersectionObserver watches all of them. rootMargin shrinks the
 *   bottom of the screen by 15%, so an element counts as visible once its
 *   top is 15% above the bottom edge.
 * - A visible element gets data-revealed and is no longer watched, so it
 *   animates only once, not every time it comes back into view.
 * - Elements that become visible at the same moment get a growing delay
 *   (0, 80, 160 ms ...), so they appear one after another.
 * - Without JavaScript nothing is hidden: the CSS hides elements only after
 *   this component has set data-motion on <html>.
 *
 * It runs again after every client-side page change (usePathname), because
 * the layout, and with it this component, stays mounted between pages.
 */

const STAGGER_MS = 80;

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.style.setProperty(
            "--reveal-delay",
            `${order * STAGGER_MS}ms`,
          );
          element.setAttribute("data-revealed", "");
          observer.unobserve(element);
          order++;
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    document
      .querySelectorAll(
        "[data-reveal]:not([data-revealed]), [data-row]:not([data-revealed])",
      )
      .forEach((element) => observer.observe(element));
    document.documentElement.setAttribute("data-motion", "");

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
