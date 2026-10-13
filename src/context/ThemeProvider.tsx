import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { ensureContrast, normalizeHex, readableOn } from "../theme/color";
import {
  CUSTOM_THEME_ID,
  isPresetId,
  MODE_BACKGROUND,
  ModePreference,
  ResolvedMode,
  resolveAccent,
  THEME_PRESETS,
} from "../theme/presets";
import {
  createDefaultTheme,
  readStoredTheme,
  resolveMode,
  StoredTheme,
  systemMode,
  writeStoredTheme,
} from "../theme/storage";
import { ThemeContext, ThemeContextValue } from "../theme/themeContext";

/**
 * WCAG AA for large text. Every accent-bearing label in the portfolio is a
 * heading (>= 24px) or a bold uppercase label, so 3:1 is the right bar.
 */
const ACCENT_TEXT_CONTRAST = 3;

/**
 * Owns the theme state and pushes it onto the document as CSS custom
 * properties. Nothing below re-renders when the theme changes: the accent and
 * the mode neutralise through variables, so the Three.js scene and the GSAP
 * timelines are never disturbed.
 */
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<StoredTheme>(() => readStoredTheme());
  const [system, setSystem] = useState<ResolvedMode>(() => systemMode());
  const [panelOpen, setPanelOpen] = useState(false);

  const resolvedMode = resolveMode(theme.mode, system);
  const accent = resolveAccent(theme.themeId, theme.customAccent);

  const background = MODE_BACKGROUND[resolvedMode];
  const accentText = ensureContrast(accent, background, ACCENT_TEXT_CONTRAST);
  const accentContrast = readableOn(accent);

  // Follow the OS preference, but only while the visitor has not chosen a mode.
  useEffect(() => {
    if (theme.mode !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) =>
      setSystem(event.matches ? "dark" : "light");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme.mode]);

  // The only place the DOM is touched. Mode swaps the neutral tokens; the
  // accent is written once and stays put across mode changes.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-mode", resolvedMode);
    // Belt and braces: a stray inline background on <body> would win over
    // `--color-bg` and leave a mode looking half-applied, so the theme layer
    // always reclaims it.
    if (document.body.style.backgroundColor) {
      document.body.style.removeProperty("background-color");
    }
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-text", accentText);
    root.style.setProperty("--accent-contrast", accentContrast);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", background);
  }, [accent, accentContrast, accentText, background, resolvedMode]);

  // `accent` is mirrored into storage so the pre-paint init script can restore
  // it without re-deriving which preset is active.
  useEffect(() => {
    writeStoredTheme({ ...theme, accent });
  }, [accent, theme]);

  const setMode = useCallback((mode: ModePreference) => {
    if (mode === "system") setSystem(systemMode());
    setTheme((current) => ({ ...current, mode }));
  }, []);

  const toggleMode = useCallback(() => {
    setTheme((current) => ({
      ...current,
      mode: resolveMode(current.mode, systemMode()) === "dark" ? "light" : "dark",
    }));
  }, []);

  const selectPreset = useCallback((id: string) => {
    if (!isPresetId(id)) return;
    // `customAccent` is untouched, so a visitor can hop back to their own
    // colour after trying a preset.
    setTheme((current) => ({ ...current, themeId: id }));
  }, []);

  const applyCustomAccent = useCallback((hex: string) => {
    const normalized = normalizeHex(hex);
    if (!normalized) return false;
    setTheme((current) => ({
      ...current,
      themeId: CUSTOM_THEME_ID,
      customAccent: normalized,
      accent: normalized,
    }));
    return true;
  }, []);

  const resetTheme = useCallback(() => {
    setSystem(systemMode());
    setTheme(createDefaultTheme());
  }, []);

  const value: ThemeContextValue = useMemo(
    () => ({
      mode: theme.mode,
      resolvedMode,
      themeId: theme.themeId,
      customAccent: theme.customAccent,
      accent,
      accentText,
      accentTextAdjusted: accentText !== accent,
      presets: THEME_PRESETS,
      customThemeId: CUSTOM_THEME_ID,
      panelOpen,
      setPanelOpen,
      setMode,
      toggleMode,
      selectPreset,
      applyCustomAccent,
      resetTheme,
    }),
    [
      accent,
      accentText,
      applyCustomAccent,
      panelOpen,
      resetTheme,
      resolvedMode,
      selectPreset,
      setMode,
      theme.customAccent,
      theme.mode,
      theme.themeId,
      toggleMode,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
