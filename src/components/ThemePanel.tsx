import {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  TbCheck,
  TbColorSwatch,
  TbMoon,
  TbRestore,
  TbSun,
  TbX,
} from "react-icons/tb";
import { normalizeHex, readableOn } from "../theme/color";
import { presetById } from "../theme/presets";
import { useTheme } from "../theme/themeContext";
import "./styles/ThemePanel.css";

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

const ThemePanel = () => {
  const {
    resolvedMode,
    themeId,
    accent,
    accentTextAdjusted,
    presets,
    customThemeId,
    panelOpen,
    setPanelOpen,
    setMode,
    selectPreset,
    applyCustomAccent,
    resetTheme,
  } = useTheme();

  // Draft colour: what the picker/hex field currently show. It only becomes
  // the live theme when Apply is pressed.
  const [draft, setDraft] = useState(accent);
  const [hexInput, setHexInput] = useState(accent);
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // Re-sync the custom controls whenever the active accent changes elsewhere
  // (picking a preset, resetting, or a restored preference).
  useEffect(() => {
    setDraft(accent);
    setHexInput(accent);
  }, [accent]);

  // Remember where focus came from so closing the panel hands it back.
  useEffect(() => {
    if (panelOpen) {
      lastFocused.current = document.activeElement as HTMLElement | null;
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    } else {
      lastFocused.current?.focus?.();
      lastFocused.current = null;
    }
  }, [panelOpen]);

  // Escape closes; Tab cycles inside the panel; a click outside dismisses it.
  useEffect(() => {
    if (!panelOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setPanelOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      // The navbar trigger owns its own toggle, so ignore clicks on it here.
      if (target.closest?.(".theme-trigger")) return;
      setPanelOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [panelOpen, setPanelOpen]);

  const normalizedInput = normalizeHex(hexInput);
  const normalizedDraft = normalizeHex(draft);
  const hexInvalid = hexInput.trim().length > 0 && !normalizedInput;
  const canApply = !hexInvalid && (normalizedInput ?? normalizedDraft) !== null;
  const previewColor = normalizedInput ?? normalizedDraft ?? accent;
  const activeName =
    themeId === customThemeId ? "Custom" : presetById(themeId)?.name ?? "Custom";

  const handlePickColor = (value: string) => {
    setDraft(value);
    setHexInput(value);
  };

  const handleHexChange = (value: string) => {
    setHexInput(value);
    const normalized = normalizeHex(value);
    if (normalized) setDraft(normalized);
  };

  const handleApply = () => {
    const value = normalizedInput ?? normalizedDraft;
    if (!value) return;
    applyCustomAccent(value);
    setHexInput(value);
  };

  // Arrow keys walk the swatch grid, matching how a radio group behaves.
  const handleGridKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];
    if (!keys.includes(event.key)) return;
    const items = Array.from(
      gridRef.current?.querySelectorAll<HTMLButtonElement>(".theme-swatch") ?? []
    );
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    items[(index + step + items.length) % items.length]?.focus();
  };

  return (
    <div
      className={`theme-panel${panelOpen ? " is-open" : ""}`}
      ref={panelRef}
      role="dialog"
      aria-label="Theme settings"
      aria-hidden={!panelOpen}
    >
      <div className="theme-panel-head">
        <h2 className="theme-panel-title">
          <TbColorSwatch aria-hidden="true" /> Appearance
        </h2>
        <button
          type="button"
          className="theme-close"
          onClick={() => setPanelOpen(false)}
          aria-label="Close theme settings"
        >
          <TbX aria-hidden="true" />
        </button>
      </div>

      <div className="theme-section">
        <h3 className="theme-label" id="theme-mode-label">
          Mode
        </h3>
        <div
          className="theme-mode"
          role="group"
          aria-labelledby="theme-mode-label"
        >
          {(["light", "dark"] as const).map((value) => {
            const active = resolvedMode === value;
            return (
              <button
                key={value}
                type="button"
                className="theme-mode-btn"
                aria-pressed={active}
                onClick={() => setMode(value)}
              >
                {value === "light" ? (
                  <TbSun aria-hidden="true" />
                ) : (
                  <TbMoon aria-hidden="true" />
                )}
                <span>{value === "light" ? "Light" : "Dark"}</span>
                <span className="theme-check" aria-hidden="true">
                  {active && <TbCheck />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="theme-section">
        <h3 className="theme-label" id="theme-presets-label">
          Presets
        </h3>
        <div
          className="theme-grid"
          role="group"
          aria-labelledby="theme-presets-label"
          ref={gridRef}
          onKeyDown={handleGridKeyDown}
        >
          {presets.map((preset) => {
            const active = themeId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className="theme-swatch"
                aria-pressed={active}
                title={preset.name}
                onClick={() => selectPreset(preset.id)}
                style={
                  {
                    "--swatch": preset.accent,
                    // Ink for the selected check, so it stays visible on any swatch.
                    "--swatch-ink": readableOn(preset.accent),
                  } as CSSProperties
                }
              >
                <span className="theme-swatch-dot" aria-hidden="true">
                  {active && <TbCheck />}
                </span>
                <span className="theme-swatch-name">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="theme-section">
        <h3 className="theme-label" id="theme-custom-label">
          Custom accent
        </h3>
        <div
          className="theme-custom"
          role="group"
          aria-labelledby="theme-custom-label"
        >
          <div className="theme-color-row">
            <input
              type="color"
              className="theme-color-input"
              value={previewColor}
              onChange={(event) => handlePickColor(event.target.value)}
              aria-label="Pick a custom accent colour"
            />
            <input
              type="text"
              className="theme-hex"
              value={hexInput}
              onChange={(event) => handleHexChange(event.target.value)}
              spellCheck={false}
              autoComplete="off"
              maxLength={7}
              placeholder="#7C3AED"
              aria-label="Custom accent hex value"
              aria-invalid={hexInvalid}
              aria-describedby={hexInvalid ? "theme-hex-error" : undefined}
            />
          </div>

          {hexInvalid && (
            <p className="theme-error" id="theme-hex-error" role="alert">
              Enter a 3 or 6 digit hex colour, for example <code>#7C3AED</code>.
            </p>
          )}

          <div className="theme-preview" aria-hidden="true">
            <span
              className="theme-preview-chip"
              style={{
                background: previewColor,
                color: readableOn(previewColor),
              }}
            >
              Accent
            </span>
            <span className="theme-preview-text" style={{ color: previewColor }}>
              Accent text
            </span>
          </div>

          <div className="theme-actions">
            <button
              type="button"
              className="theme-apply"
              onClick={handleApply}
              disabled={!canApply}
            >
              Apply
            </button>
            <button type="button" className="theme-reset" onClick={resetTheme}>
              <TbRestore aria-hidden="true" /> Reset to default
            </button>
          </div>
        </div>
      </div>

      <p className="theme-current">
        <span
          className="theme-current-dot"
          style={{ background: accent }}
          aria-hidden="true"
        />
        <span className="theme-current-label">
          {activeName} · <code>{accent}</code>
        </span>
      </p>

      {accentTextAdjusted && (
        <p className="theme-note">
          This accent is faint against the {resolvedMode} background, so
          accent-coloured text uses a slightly adjusted shade. Your colour is
          kept as-is for borders, glows and fills.
        </p>
      )}
    </div>
  );
};

export default ThemePanel;
