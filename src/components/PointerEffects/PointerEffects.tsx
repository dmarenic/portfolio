"use client";

import { useEffect } from "react";

/*
 * Magnetic buttons, set up once in the layout: an element with
 * data-magnetic is pulled a little towards the pointer while the pointer is
 * over it. This component writes the offset to --tx/--ty and globals.css
 * turns it into movement.
 *
 * It never re-renders: one pointermove listener for the whole page stores
 * the latest event, and at most once per frame (requestAnimationFrame) the
 * variables are written straight to the element's style. Nothing runs on
 * touch screens or when the visitor prefers reduced motion.
 */

const MAGNET_STRENGTH = 0.25;
const MAX_MAGNET_PX = 8;

export function PointerEffects() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;
    // The element currently pulled, with its size measured when the pointer
    // entered it (measuring a moving element would make it wobble).
    let magnet: { element: HTMLElement; rect: DOMRect } | null = null;

    const release = () => {
      if (!magnet) return;
      magnet.element.removeAttribute("data-pointer-inside");
      magnet.element.style.setProperty("--tx", "0px");
      magnet.element.style.setProperty("--ty", "0px");
      magnet = null;
    };

    const update = () => {
      frame = 0;
      const event = lastEvent;
      if (!event || !(event.target instanceof Element)) return;

      const element = event.target.closest<HTMLElement>("[data-magnetic]");
      if (element !== magnet?.element) {
        release();
        if (element) {
          element.setAttribute("data-pointer-inside", "");
          magnet = { element, rect: element.getBoundingClientRect() };
        }
      }
      if (!magnet) return;

      const clamp = (value: number) =>
        Math.max(
          -MAX_MAGNET_PX,
          Math.min(MAX_MAGNET_PX, value * MAGNET_STRENGTH),
        );
      const { rect } = magnet;
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      magnet.element.style.setProperty("--tx", `${clamp(dx).toFixed(1)}px`);
      magnet.element.style.setProperty("--ty", `${clamp(dy).toFixed(1)}px`);
    };

    const onMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", release);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", release);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
