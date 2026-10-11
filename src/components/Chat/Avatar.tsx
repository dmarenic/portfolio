import type { CSSProperties } from "react";
import Image from "next/image";
import styles from "./Avatar.module.css";

type AvatarProps = {
  // A picture from public/chatbot/ (see findAvatar in Chat.tsx), or null for
  // the DM monogram.
  src: string | null;
  // Diameter in pixels.
  size: number;
  // The assistant is writing an answer: the ring around the avatar turns.
  typing?: boolean;
};

/*
 * The round picture of the assistant. Without a picture it shows the
 * monogram DM, set like the name in the hero: D as an outline, M solid.
 * A ring around it slowly "breathes" while idle and turns while an answer is
 * being written; with reduced motion it stays still (see Avatar.module.css).
 * It is decoration only: the buttons and headings around it carry the name.
 */
export function Avatar({ src, size, typing = false }: AvatarProps) {
  return (
    <span
      className={styles.avatar}
      style={{ "--size": `${size}px` } as CSSProperties}
      data-typing={typing || undefined}
      aria-hidden="true"
    >
      {src ? (
        <Image
          className={styles.picture}
          src={src}
          width={size}
          height={size}
          alt=""
          // next/image does not resize SVG files; they are already sharp.
          unoptimized={src.endsWith(".svg")}
        />
      ) : (
        <span className={styles.monogram}>
          <span className={styles.outline}>D</span>M
        </span>
      )}
    </span>
  );
}
