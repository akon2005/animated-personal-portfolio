/**
 * Tiny colour toolkit for the theme system.
 *
 * Everything here is deliberately dependency-free: the project only needs hex
 * parsing plus WCAG contrast maths to derive accessible accent variants, so
 * pulling in a colour library would be overkill.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** `#abc` and `abc` are both accepted, and normalised to `#aabbcc`. */
const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const BLACK = "#000000";
export const WHITE = "#ffffff";

/** Returns a lowercase `#rrggbb` string, or `null` when the input is not hex. */
export function normalizeHex(input: string): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!HEX_PATTERN.test(trimmed)) return null;

  let hex = trimmed.replace("#", "").toLowerCase();
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  return `#${hex}`;
}

export function hexToRgb(hex: string): RGB | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const value = parseInt(normalized.slice(1), 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const channel = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function linearChannel(value: number): number {
  const channel = value / 255;
  return channel <= 0.03928
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  return (
    0.2126 * linearChannel(rgb.r) +
    0.7152 * linearChannel(rgb.g) +
    0.0722 * linearChannel(rgb.b)
  );
}

/** WCAG contrast ratio between two colours, 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  if (!first || !second) return 1;
  const lighter = Math.max(relativeLuminance(a), relativeLuminance(b));
  const darker = Math.min(relativeLuminance(a), relativeLuminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

/** Blends two colours; `weight` is how much of `a` ends up in the result. */
export function mixColors(a: string, b: string, weight: number): string {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  if (!first || !second) return a;
  const amount = Math.min(1, Math.max(0, weight));
  return rgbToHex({
    r: first.r * amount + second.r * (1 - amount),
    g: first.g * amount + second.g * (1 - amount),
    b: first.b * amount + second.b * (1 - amount),
  });
}

/** Black or white — whichever reads better on top of `background`. */
export function readableOn(background: string): string {
  return contrastRatio(WHITE, background) >= contrastRatio(BLACK, background)
    ? WHITE
    : BLACK;
}

/**
 * Nudges `color` away from `background` until it reaches `target` contrast.
 *
 * The visitor's accent is never changed by this - it is used for the *text*
 * variant of the accent, and the adjusted value is surfaced in the theme panel
 * rather than applied silently. Colours that already pass are returned as-is,
 * so a well-chosen accent stays identical in both modes.
 */
export function ensureContrast(
  color: string,
  background: string,
  target: number
): string {
  const start = normalizeHex(color);
  const surface = normalizeHex(background);
  if (!start || !surface) return color;
  if (contrastRatio(start, surface) >= target) return start;

  const toward = readableOn(surface);
  let best = start;
  const steps = 50;
  for (let step = 1; step <= steps; step++) {
    const candidate = mixColors(start, toward, 1 - step / steps);
    best = candidate;
    if (contrastRatio(candidate, surface) >= target) return candidate;
  }
  return best;
}
