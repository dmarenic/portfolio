"use client";

import {
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Pause } from "@phosphor-icons/react/dist/ssr/Pause";
import { Play } from "@phosphor-icons/react/dist/ssr/Play";
import styles from "./Carousel.module.css";

/** How long one slide stays before the next one comes, in milliseconds. */
const INTERVAL_MS = 15000;

/** How far a finger has to move sideways to change the slide, in pixels. */
const SWIPE_PX = 50;

type CarouselProps = {
  /** id of the heading that names the carousel (aria-labelledby). */
  labelledBy: string;
  /** The heading and any text above the slides. */
  head: ReactNode;
  /** One element per slide. */
  slides: ReactNode[];
  /** Short name of every slide, for the buttons under it. */
  slideNames: string[];
  /** Screen reader name of every slide ("1 of 3"). */
  slideLabels: string[];
  labels: {
    previous: string;
    next: string;
    stop: string;
    start: string;
  };
};

/*
 * Slides that change by themselves every 15 seconds, one at a time, across
 * the whole width. Arrows, the bar under the slides and (on touch screens) a
 * swipe change the slide at once and start the 15 seconds again.
 *
 * Timing: the active part of the bar fills up with a CSS animation that lasts
 * 15 seconds, and when it ends (onAnimationEnd) the next slide comes. So the
 * bar and the timer can never disagree, and pausing is simply pausing that
 * animation (animation-play-state), which also keeps how far it had got.
 *
 * Automatic rotation runs only when all of these are true:
 * - the visitor has not stopped it with the button,
 * - they have not asked for reduced motion (then it never runs),
 * - the mouse is not over the carousel,
 * - keyboard focus is not inside it,
 * - the browser tab is visible,
 * - the carousel is on screen (IntersectionObserver), so the first 15
 *   seconds only start once the visitor can see it.
 *
 * Accessibility (WAI-ARIA carousel pattern): the wrapper is a section with
 * aria-roledescription="carousel", every slide is a group with
 * aria-roledescription="slide" and a name like "1 of 3", slides that are not
 * shown are inert (their links cannot be reached with the keyboard), and
 * while it does not rotate by itself the slides are a polite live region, so
 * screen readers read the new slide after the visitor changes it.
 */
export function Carousel({
  labelledBy,
  head,
  slides,
  slideNames,
  slideLabels,
  labels,
}: CarouselProps) {
  const count = slides.length;
  // index: the slide on screen; previous: the slide that is sliding away;
  // direction: 1 when the new slide comes from the right, -1 from the left.
  const [state, setState] = useState({
    index: 0,
    previous: null as number | null,
    direction: 1,
  });
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const running =
    playing &&
    !reducedMotion &&
    !hovered &&
    !keyboardFocus &&
    pageVisible &&
    onScreen;

  const goTo = (index: number, direction: number) => {
    setState((current) =>
      index === current.index
        ? current
        : { index, previous: current.index, direction },
    );
  };
  const next = () => goTo((state.index + 1) % count, 1);
  const previous = () => goTo((state.index - 1 + count) % count, -1);

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
  // leaves on an arrow button (:focus-visible tells them apart).
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
      style={{ "--interval": `${INTERVAL_MS}ms` } as CSSProperties}
    >
      <div className={styles.top}>
        <div className={styles.head}>{head}</div>
        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.button} ${styles.rotation}`}
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? labels.stop : labels.start}
          >
            {playing ? (
              <Pause size={14} weight="fill" aria-hidden="true" />
            ) : (
              <Play size={14} weight="fill" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={previous}
            aria-label={labels.previous}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={next}
            aria-label={labels.next}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* All slides share one grid cell, so the carousel is as tall as the
          tallest slide and the page never jumps when a slide changes. */}
      <div
        className={styles.slides}
        aria-live={running ? "off" : "polite"}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
      >
        {slides.map((slide, i) => {
          const isCurrent = i === state.index;
          const isLeaving = i === state.previous;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={slideLabels[i]}
              className={styles.slide}
              data-state={
                isCurrent ? "current" : isLeaving ? "leaving" : "hidden"
              }
              data-direction={state.direction === 1 ? "next" : "previous"}
              data-animate={state.previous === null ? undefined : ""}
              inert={!isCurrent}
            >
              {slide}
            </div>
          );
        })}
      </div>

      {/* Where we are: one thin part per slide. The active part fills up
          with the accent colour over 15 seconds; a click opens that slide. */}
      <div className={styles.progress}>
        {slideNames.map((name, i) => (
          <button
            key={name}
            type="button"
            className={styles.segment}
            onClick={() => goTo(i, i > state.index ? 1 : -1)}
            aria-label={name}
            aria-current={i === state.index ? "true" : undefined}
          >
            {i === state.index && (
              <span
                // A new key restarts the 15 seconds whenever the slide changes.
                key={state.index}
                className={styles.fill}
                data-running={running ? "" : undefined}
                onAnimationEnd={next}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
