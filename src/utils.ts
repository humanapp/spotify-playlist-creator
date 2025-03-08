import { nanoid } from "nanoid";
//import { v4 as uuid } from "uuid";
import { ToastType, ToastWithId } from "./types";

export {};

export function isLocalhost(): boolean {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

export function isNgrok(): boolean {
  return window.location.hostname.includes(".ngrok.");
}

export function classlist(...args: (string | boolean | undefined)[]): string {
  return args.filter(Boolean).join(" ");
}

export function makeToast(
  type: ToastType,
  text: string,
  timeoutMs: number = 5000
): ToastWithId {
  return {
    id: nanoid(),
    type,
    text,
    timeoutMs,
  };
}

export async function delayAsync(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  delayMs: number
) {
  let timeout: NodeJS.Timeout;

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delayMs);
  };

  return debounced;
}

export function levenshteinDistance(a: string, b: string): number {
  const dp: number[][] = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[a.length][b.length];
}

export function fuzzySubstringRank(text: string, substring: string): number {
  // swap the arguments if the substring is longer than the text
  if (substring.length > text.length) {
    //const penalty = substring.length - text.length;
    const penalty = 1;
    return penalty + fuzzySubstringRank(substring, text);
  }

  const ranks: number[] = [];

  for (let i = 0; i <= text.length - substring.length; i++) {
    const textSegment = text.slice(i, i + substring.length);
    const dist = levenshteinDistance(textSegment, substring);
    ranks.push(dist);
  }

  const penalty = text.length !== substring.length ? 1 : 0;

  return penalty + Math.min(...ranks);
}
