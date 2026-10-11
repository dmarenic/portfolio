"use client";

import {
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import styles from "./PeekCarousel.module.css";

/** How far a finger has to move sideways to change the card, in pixels. */
const SWIPE_PX = 50;

/** How often the timer counts down the time left, in milliseconds. */
const TICK_MS = 100;

type PeekCarouselProps = {
  /** id of the heading that names the carousel (aria-labelledby). */
  labelledBy: string;
  /** One element per card. */
  slides: ReactNode[];
  /** Short name of every card, for the buttons under the cards. */
  slideNames: string[];
  /** Screen reader name of every card ("1 of 3"). */
  slideLabels: string[];
  /** How long a card stays before the next one comes, in milliseconds. */
  intervalMs: number;
  labels: {
    previous: string;
    next: string;
  };
};

/*
 * One card in the middle, the edges of the previous and the next card
 * peeking out at the sides. The cards change by themselves every intervalMs
 * (the current one slides out to the left, the next one slides in from the
 * right and fades in), with the arrows, the small bars under the cards, or a
 * swipe on touch screens. After the last card comes the first again.
 *
 * Timing: a timer runs every 100 ms while the carousel rotates and counts
 * down the time left. Nothing on the page shows it. At zero the next card
 * comes and the countdown starts again; any change of card by the visitor
 * starts it again too.
 *
 * Automatic rotation runs only when all of these are true:
 * - the visitor has not asked for reduced motion (then it never runs),
 * - the mouse is not over the carousel,
 * - keyboard focus is not inside it,
 * - the browser tab is visible,
 * - the carousel is on screen (IntersectionObserver), so the countdown only
 *   starts once the visitor can see it.
 *
 * Accessibility (WAI-ARIA carousel pattern): the wrapper is a section with
 * aria-roledescription="carousel", every card is a group with
 * aria-roledescription="slide" and a name like "1 of 3", cards that are not
 * the current one are inert (their links and buttons cannot be reached),
 * and while it does not rotate by itself the cards are a polite live region,
 * so screen readers read the new card after the visitor changes it.
 */
export function PeekCarousel({
  labelledBy,
  slides,
  slideNames,
  slideLabels,
  intervalMs,
  labels,
}: PeekCarouselProps) {
  const count = slides.length;
  // index: the card in the middle; previous: the card that was there
  // before; change: counts the changes, so a CSS animation can start again.
  const [state, setState] = useState({ index: 0, previous: 0, change: 0 });
  // Time left until the next card. A ref, not state: it changes ten times a
  // second and nothing shows it, so it must not re-render the carousel.
  const remainingRef = useRef(intervalMs);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const running =
    !reducedMotion && !hovered && !keyboardFocus && pageVisible && onScreen;

  // Every change of card starts the countdown again.
  const goTo = useCallback(
    (getIndex: (current: number) => number) => {
      setState((current) => {
        const index = getIndex(current.index);
        if (index === current.index) return current;
        return { index, previous: current.index, change: current.change + 1 };
      });
      remainingRef.current = intervalMs;
    },
    [intervalMs],
  );
  const next = useCallback(() => goTo((i) => (i + 1) % count), [goTo, count]);
  const previous = () => goTo((i) => (i - 1 + count) % count);

  // The countdown. performance.now() measures the real time between ticks,
  // so the timer stays right even if a tick comes late.
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      remainingRef.current -= now - last;
      last = now;
      if (remainingRef.current <= 0) next();
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [running, next]);

  // Reduced motion, page visibility and whether the carousel is on screen.
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReducedMotion(motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);

    const onVisibility = () =>
      setPageVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.3 },
    );
    if (rootRef.current) observer.observe(rootRef.current);

    return () => {
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  // Only keyboard focus pauses the rotation, not the focus a mouse click
  // leaves on a button (:focus-visible tells them apart).
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    setKeyboardFocus(event.target.matches(":focus-visible"));
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setKeyboardFocus(false);
    }
  };

  // Swipe with a finger or a pen; the mouse selects text as usual.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else previous();
  };

  // Where every card is: 0 in the middle, -1 on the left, 1 on the right
  // (and further away, hidden, when there are more than three cards).
  const half = Math.floor(count / 2);
  const offsetOf = (i: number, index: number) =>
    ((i - index + count + half) % count) - half;

  return (
    <section
      ref={rootRef}
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-labelledby={labelledBy}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className={styles.frame}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.previous}`}
          onClick={previous}
          aria-label={labels.previous}
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          onClick={next}
          aria-label={labels.next}
        >
          <ArrowRight size={20} aria-hidden="true" />
        </button>

        {/* All cards share one grid cell, so the carousel is as tall as the
            tallest card, and each is moved sideways to its place. */}
        <div
          className={styles.stage}
          aria-live={running ? "off" : "polite"}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          {slides.map((slide, i) => {
            const offset = offsetOf(i, state.index);
            // A card that jumps from one side to the other (with three
            // cards, the one that was on the left) must not slide across
            // the middle; it appears at its new place instead.
            const jumps =
              state.change > 0 &&
              Math.abs(offset - offsetOf(i, state.previous)) > 1;
            return (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={slideLabels[i]}
                className={styles.slide}
                style={{ "--offset": offset } as CSSProperties}
                data-place={
                  offset === 0
                    ? "current"
                    : Math.abs(offset) === 1
                      ? "side"
                      : "away"
                }
                data-animate={state.change > 0 ? "" : undefined}
                data-jump={jumps ? "" : undefined}
                // Two names for the same animation, used in turn, so it
                // starts again on every change (see the CSS).
                data-change={state.change % 2 ? "odd" : "even"}
                inert={offset !== 0}
              >
                {slide}
              </div>
            );
          })}
        </div>

        <div className={styles.dots}>
          {slideNames.map((name, i) => (
            <button
              key={name}
              type="button"
              className={styles.dot}
              onClick={() => goTo(() => i)}
              aria-label={name}
              aria-current={i === state.index ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
