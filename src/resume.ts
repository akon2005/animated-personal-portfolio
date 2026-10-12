/**
 * Resume viewer page behaviour.
 *
 * The original PDF is served untouched from `/Resume.pdf` and rendered by the
 * browser's built-in PDF viewer inside an iframe. This script only manages the
 * surrounding states. Note that Chrome's built-in viewer does not reliably fire
 * a `load` event on the frame, so the file itself is verified with a request
 * instead of being inferred from the frame.
 */
const frame = document.getElementById("resumeFrame") as HTMLIFrameElement | null;
const status = document.getElementById("resumeStatus");
const errorStatus = document.getElementById("resumeStatusError");
const hint = document.getElementById("resumeHint");

const PDF_URL = "/Resume.pdf";

let finished = false;

/** The preview is being handed to the browser: drop the spinner. */
function markReady() {
  status?.setAttribute("hidden", "");
}

/** The resume cannot be shown here: point at the open/download actions. */
function showError() {
  if (finished) return;
  finished = true;
  markReady();
  errorStatus?.removeAttribute("hidden");
  hint?.removeAttribute("hidden");
}

if (frame) {
  frame.addEventListener("load", markReady);
  // The spinner must not run forever if the viewer stays silent.
  window.setTimeout(markReady, 3000);

  // A narrow viewport usually means a browser that cannot preview PDFs inline
  // (or renders them too cramped), so surface the full-size options right away.
  if (window.matchMedia("(max-width: 820px)").matches) {
    hint?.removeAttribute("hidden");
  }

  // Authoritative check: the URL has to answer with a real PDF. This also
  // catches a deployment that returns the site's HTML fallback for the file.
  fetch(PDF_URL, { method: "GET" })
    .then((response) => {
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.includes("pdf")) {
        console.warn(
          `Resume file check failed (status ${response.status}, type "${contentType}")`
        );
        showError();
      }
    })
    .catch((error) => {
      console.warn("Resume file could not be requested:", error);
      showError();
    });
} else {
  showError();
}

// Keep the iframe pointed at the original PDF if the page is restored from the
// browser's back/forward cache after a failed load.
window.addEventListener("pageshow", () => {
  if (frame && !frame.getAttribute("src")) {
    frame.setAttribute("src", `${PDF_URL}#view=FitH`);
  }
});
