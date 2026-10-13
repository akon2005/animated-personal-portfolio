/**
 * Pre-paint theme bootstrap.
 *
 * Loaded synchronously from the <head> of both HTML entries so the very first
 * paint already has the right mode and accent. React (and the resume page's
 * script) only take over after this. Keep the storage shape in step with
 * `src/theme/storage.ts`.
 */
(function () {
  var STORAGE_KEY = "portfolio-theme";
  var LIGHT_BG = "#f2f3f8";
  var DARK_BG = "#0b080c";
  var root = document.documentElement;

  var saved = null;
  try {
    saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
  } catch (error) {
    // Corrupt JSON or storage blocked - fall through to the defaults.
    saved = null;
  }
  if (!saved || typeof saved !== "object") saved = {};

  // The OS preference only applies while the visitor has not chosen a mode.
  var mode = saved.mode === "light" || saved.mode === "dark" ? saved.mode : null;
  if (!mode) {
    mode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  }
  root.setAttribute("data-mode", mode);

  // One accent, shared by both modes - the mode never owns a colour.
  if (typeof saved.accent === "string" && /^#[0-9a-f]{6}$/i.test(saved.accent)) {
    root.style.setProperty("--accent", saved.accent);
  }

  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", mode === "dark" ? DARK_BG : LIGHT_BG);
})();
