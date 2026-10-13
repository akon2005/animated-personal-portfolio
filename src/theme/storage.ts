/**
 * Theme persistence.
 *
 * Everything the theme system remembers lives in one localStorage entry. Reads
 * are defensive: a missing, corrupt or hand-edited value falls back to the
 * defaults instead of throwing, and every field is validated before use.
 */

import { normalizeHex } from "./color";
import {
  CUSTOM_THEME_ID,
  DEFAULT_ACCENT,
  DEFAULT_THEME_ID,
  isPresetId,
  ModePreference,
  presetById,
  ResolvedMode,
} from "./presets";

export const THEME_STORAGE_KEY = "portfolio-theme";

export interface StoredTheme {
  mode: ModePreference;
  themeId: string;
  /** The visitor's own accent, kept so it survives mode switches. */
  customAccent: string;
  /** The resolved accent, mirrored for the pre-paint init script. */
  accent: string;
}

const MODES: ModePreference[] = ["system", "light", "dark"];

export function createDefaultTheme(): StoredTheme {
  return {
    mode: "system",
    themeId: DEFAULT_THEME_ID,
    customAccent: "",
    accent: DEFAULT_ACCENT,
  };
}

function isMode(value: unknown): value is ModePreference {
  return typeof value === "string" && MODES.includes(value as ModePreference);
}

/** The OS preference, used only while the visitor has not picked a mode. */
export function systemMode(): ResolvedMode {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveMode(
  preference: ModePreference,
  system: ResolvedMode
): ResolvedMode {
  return preference === "system" ? system : preference;
}

export function readStoredTheme(): StoredTheme {
  const defaults = createDefaultTheme();
  if (typeof window === "undefined") return defaults;

  let parsed: unknown;
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return defaults;
    parsed = JSON.parse(raw);
  } catch {
    // Corrupt JSON or storage blocked (private mode, disabled cookies).
    return defaults;
  }

  if (!parsed || typeof parsed !== "object") return defaults;
  const value = parsed as Partial<Record<keyof StoredTheme, unknown>>;

  const mode = isMode(value.mode) ? value.mode : defaults.mode;

  const customAccent = normalizeHex(
    typeof value.customAccent === "string" ? value.customAccent : ""
  );

  let themeId = defaults.themeId;
  if (value.themeId === CUSTOM_THEME_ID && customAccent) {
    themeId = CUSTOM_THEME_ID;
  } else if (typeof value.themeId === "string" && isPresetId(value.themeId)) {
    themeId = value.themeId;
  }

  const storedAccent = normalizeHex(
    typeof value.accent === "string" ? value.accent : ""
  );
  const accent =
    themeId === CUSTOM_THEME_ID
      ? customAccent!
      : presetById(themeId)?.accent ?? storedAccent ?? DEFAULT_ACCENT;

  return {
    mode,
    themeId,
    customAccent: customAccent ?? "",
    accent,
  };
}

export function writeStoredTheme(theme: StoredTheme): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // Storage full or unavailable - the session still works, it just will not
    // be remembered. Never let this break the page.
  }
}
