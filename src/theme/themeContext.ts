import { createContext, useContext } from "react";
import { ModePreference, ResolvedMode, ThemePreset } from "./presets";

export interface ThemeContextValue {
  /** What the visitor chose; `"system"` until they pick a mode explicitly. */
  mode: ModePreference;
  /** The mode actually rendered right now. */
  resolvedMode: ResolvedMode;
  themeId: string;
  /** The visitor's own accent, remembered across mode switches. */
  customAccent: string;
  /** The active accent. Identical in both modes. */
  accent: string;
  /** Accent used as text, contrast-corrected only when the raw colour is too faint. */
  accentText: string;
  /** True when the accent had to be nudged to stay readable. */
  accentTextAdjusted: boolean;
  presets: ThemePreset[];
  customThemeId: string;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  setMode: (mode: ModePreference) => void;
  toggleMode: () => void;
  selectPreset: (id: string) => void;
  /** Returns false when the hex is invalid, so callers can flag the input. */
  applyCustomAccent: (hex: string) => boolean;
  resetTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return value;
};
