import { useEffect } from "react";

/*
 * The round buttons in the bottom corners must not cover or repeat the
 * profile links in the hero (marked with data-hero-links in Hero.tsx). These
 * two helpers let them check where those links are. Browser only.
 */

/**
 * The box of the hero links while they can be seen, or null.
 *
 * Being inside the screen is not enough: on wide screens the hero stays
 * pinned while the projects panel slides over it, so the links can be inside
 * the screen and still covered. So, like the Dock, it asks the browser which
 * element is drawn at the middle of the links (elementFromPoint).
 */
export function visibleHeroLinks(): DOMRect | null {
  const links = document.querySelector("[data-hero-links]");
  if (!links) return null;

  const rect = links.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= window.innerHeight) return null;

  const x = rect.left + rect.width / 2;
  // Only the visible part counts when the links are partly off screen.
  const y = Math.min(
    Math.max(rect.top + rect.height / 2, 0),
    window.innerHeight - 1,
  );
  const element = document.elementFromPoint(x, y);
  return element !== null && links.contains(element) ? rect : null;
}

/**
 * Calls `update` now, and again at most once per frame while the page
 * scrolls or the window is resized (the same pattern as the Dock).
 * `update` should not change between renders (define it outside the
 * component or with useCallback).
 */
export function useScrollCheck(update: () => void): void {
  useEffect(() => {
    let frame = 0;

    const run = () => {
      frame = 0;
      update();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [update]);
}
