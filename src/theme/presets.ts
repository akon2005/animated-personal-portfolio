/**
 * Theme presets.
 *
 * A preset owns exactly one thing: the accent colour. Backgrounds, surfaces,
 * text, borders and shadows come from the Light/Dark mode, so the same preset
 * works in both modes and switching modes never resets the visitor's accent.
 *
 * Every accent below was picked to clear a 3:1 contrast ratio (WCAG AA for
 * large text) against *both* mode backgrounds, so the accent can be used for
 * headings and labels in either mode without being altered.
 */

import { normalizeHex } from "./color";

export type ModePreference = "system" | "light" | "dark";
export type ResolvedMode = "light" | "dark";

export interface ThemePreset {
  id: string;
  /** Shown in the theme panel. */
  name: string;
  /** One accent that is shared by both modes. */
  accent: string;
}

export const CUSTOM_THEME_ID = "custom";

export const THEME_PRESETS: ThemePreset[] = [
  { id: "ocean", name: "Ocean Blue", accent: "#2563eb" },
  { id: "midnight", name: "Midnight Purple", accent: "#7c3aed" },
  { id: "emerald", name: "Emerald Green", accent: "#059669" },
  { id: "sunset", name: "Sunset Orange", accent: "#ea580c" },
  { id: "rose", name: "Rose Pink", accent: "#ec4899" },
  { id: "cyber", name: "Cyber Cyan", accent: "#0891b2" },
  { id: "mono", name: "Minimal Monochrome", accent: "#6b7280" },
  { id: "lavender", name: "Lavender Dream", accent: "#9370f0" },
];

/** The preset a visitor sees before they have chosen anything. */
export const DEFAULT_THEME_ID = "cyber";

/**
 * The `--color-bg` value of each mode, mirrored from `theme/tokens.css`.
 * The contrast helpers need a surface colour while rendering, before the
 * `data-mode` attribute has been committed to the DOM, so it is duplicated
 * here on purpose. Keep the two files in step.
 */
export const MODE_BACKGROUND: Record<ResolvedMode, string> = {
  light: "#f2f3f8",
  dark: "#0b080c",
};

export function presetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((preset) => preset.id === id);
}

export function isPresetId(id: string): boolean {
  return THEME_PRESETS.some((preset) => preset.id === id);
}

export const DEFAULT_ACCENT = presetById(DEFAULT_THEME_ID)!.accent;

/**
 * The accent for a stored theme choice. A custom theme resolves to the
 * visitor's own colour, a preset to its accent - never to a per-mode variant,
 * which is what keeps the accent stable when the mode changes.
 */
export function resolveAccent(themeId: string, customAccent: string): string {
  const custom = normalizeHex(customAccent);
  if (themeId === CUSTOM_THEME_ID && custom) return custom;
  return presetById(themeId)?.accent ?? DEFAULT_ACCENT;
}
