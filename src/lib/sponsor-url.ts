
import { isIP } from "node:net";

export function validateSponsorUrl(
  destination: string | null | undefined
): URL | null {
  if (!destination || destination !== destination.trim()) {
    return null;
  }

  try {
    const url = new URL(destination);
    const host = url.hostname.toLowerCase();

    // Require HTTPS.
    if (url.protocol !== "https:") return null;

    // Do not allow embedded usernames or passwords.
    if (url.username || url.password) return null;

    // Reject nonstandard ports.
    if (url.port && url.port !== "443") return null;

    // Block local and direct IP destinations.
    if (
      !host.includes(".") ||
      host === "localhost" ||
      host.endsWith(".localhost") ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      isIP(host.replace(/^\[|\]$/g, "")) !== 0
    ) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}
