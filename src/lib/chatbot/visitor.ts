import { createHmac } from "node:crypto";
import { siteUrl } from "@/content/site";

/*
 * Who is asking and from where, for the limits and the origin check.
 */

/**
 * The visitor's IP address. On Vercel these headers are set by Vercel and
 * cannot be faked: it overwrites any X-Forwarded-For sent by the visitor.
 */
export function clientIp(request: Request): string {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "";
  return forwarded.split(",")[0].trim() || "unknown";
}

/**
 * An id for the visitor that is not their IP address: an HMAC-SHA256 of the
 * address with a secret salt (IP_HASH_SALT). The same address always gives
 * the same id, so the limits work, but without the salt the id cannot be
 * turned back into the address. The full address is never stored or logged.
 */
export function visitorId(ip: string, salt: string): string {
  return createHmac("sha256", salt).update(ip).digest("hex").slice(0, 32);
}

/** IP_HASH_SALT, or a fixed salt during local development. */
export function ipSaltFromEnv(): string | null {
  const salt = process.env.IP_HASH_SALT;
  if (salt) return salt;
  return process.env.NODE_ENV === "production" ? null : "local-development";
}

/**
 * The addresses the chat may be used from: the site itself (siteUrl), the
 * addresses Vercel gives this deployment, and any listed in
 * CHAT_ALLOWED_ORIGINS (comma separated, for example a custom domain).
 */
export function allowedOriginsFromEnv(): string[] {
  const origins = new Set([new URL(siteUrl).origin]);
  // Set by Vercel: this deployment, its branch and the production domain.
  for (const host of [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    if (host) origins.add(`https://${host}`);
  }
  for (const origin of (process.env.CHAT_ALLOWED_ORIGINS ?? "").split(",")) {
    if (origin.trim()) origins.add(origin.trim());
  }
  return [...origins];
}

/**
 * Browsers send the Origin header with every POST request, so a request
 * from a page on another site (or with no Origin at all) is refused. During
 * local development localhost is allowed too.
 */
export function isAllowedOrigin(
  origin: string | null,
  allowed: string[],
  development: boolean,
): boolean {
  if (!origin) return false;
  if (allowed.includes(origin)) return true;
  if (!development) return false;
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}
