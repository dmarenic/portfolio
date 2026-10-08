"use client";

import { useEffect } from "react";

/*
 * Pointer effects for the whole page, set up once in the layout:
 *
 *   data-spotlight  writes the pointer position inside the element to --mx/--my
 *   data-tilt       writes a small rotation towards the pointer to --rx/--ry
 *   data-magnetic   writes a small offset towards the pointer to --tx/--ty
 *
 * The CSS in globals.css turns those variables into the visible effect. This
 * component never re-renders: one pointermove listener for the whole page
 * stores the latest event, and at most once per frame (requestAnimationFrame)
 * the variables are written straight to the element's style. Nothing runs on
 * touch screens or when the visitor prefers reduced motion.
 */

const MAX_TILT_DEGREES = 5;
const MAGNET_STRENGTH = 0.25;
const MAX_MAGNET_PX = 10;

type Tracked = { element: HTMLElement; rect: DOMRect };

export function PointerEffects() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;
    // The element currently tilted / pulled, with its size measured when the
    // pointer entered it (measuring a tilted element would make it wobble).
    let tilt: Tracked | null = null;
    let magnet: Tracked | null = null;

    const enter = (
      current: Tracked | null,
      element: HTMLElement | null,
      reset: (el: HTMLElement) => void,
    ) => {
      if (current?.element === element) return current;
      if (current) {
        current.element.removeAttribute("data-pointer-inside");
        reset(current.element);
      }
      if (!element) return null;
      element.setAttribute("data-pointer-inside", "");
      return { element, rect: element.getBoundingClientRect() };
    };

    const resetTilt = (el: HTMLElement) => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    const resetMagnet = (el: HTMLElement) => {
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
    };

    const update = () => {
      frame = 0;
      const event = lastEvent;
      if (!event || !(event.target instanceof Element)) return;
      const { clientX: x, clientY: y } = event;

      const spotlight = event.target.closest<HTMLElement>("[data-spotlight]");
      if (spotlight) {
        const rect = spotlight.getBoundingClientRect();
        spotlight.style.setProperty("--mx", `${x - rect.left}px`);
        spotlight.style.setProperty("--my", `${y - rect.top}px`);
      }

      tilt = enter(
        tilt,
        event.target.closest<HTMLElement>("[data-tilt]"),
        resetTilt,
      );
      if (tilt) {
        // -0.5 .. 0.5 across the element, turned into degrees.
        const px = (x - tilt.rect.left) / tilt.rect.width - 0.5;
        const py = (y - tilt.rect.top) / tilt.rect.height - 0.5;
        tilt.element.style.setProperty(
          "--rx",
          `${(-py * MAX_TILT_DEGREES).toFixed(2)}deg`,
        );
        tilt.element.style.setProperty(
          "--ry",
          `${(px * MAX_TILT_DEGREES).toFixed(2)}deg`,
        );
      }

      magnet = enter(
        magnet,
        event.target.closest<HTMLElement>("[data-magnetic]"),
        resetMagnet,
      );
      if (magnet) {
        const clamp = (value: number) =>
          Math.max(
            -MAX_MAGNET_PX,
            Math.min(MAX_MAGNET_PX, value * MAGNET_STRENGTH),
          );
        const dx = x - (magnet.rect.left + magnet.rect.width / 2);
        const dy = y - (magnet.rect.top + magnet.rect.height / 2);
        magnet.element.style.setProperty("--tx", `${clamp(dx).toFixed(1)}px`);
        magnet.element.style.setProperty("--ty", `${clamp(dy).toFixed(1)}px`);
      }
    };

    const onMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Leaving the window releases whatever was tilted or pulled.
    const onLeave = () => {
      tilt = enter(tilt, null, resetTilt);
      magnet = enter(magnet, null, resetMagnet);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
