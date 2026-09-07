/**
 * Free replacement for the GSAP Club "SplitText" trial plugin.
 *
 * Splits text content into per-character spans (grouped into per-word spans)
 * while preserving the original element structure (e.g. <br />, nested <span>).
 * The original innerHTML is kept so `revert()` can restore the element.
 */

export interface SplitResult {
  chars: HTMLElement[];
  words: HTMLElement[];
  revert: () => void;
}

type SplitTarget = string | Element | NodeListOf<Element> | Element[];

export function splitText(target: SplitTarget): SplitResult {
  const els: Element[] =
    typeof target === "string"
      ? Array.from(document.querySelectorAll(target))
      : Array.isArray(target)
        ? Array.from(target)
        : target instanceof NodeList
          ? Array.from(target)
          : [target];

  const chars: HTMLElement[] = [];
  const words: HTMLElement[] = [];
  const restoreFns: Array<() => void> = [];

  els.forEach((el) => {
    const original = el.innerHTML;
    restoreFns.push(() => {
      el.innerHTML = original;
    });

    // Collect all text nodes first (static list, safe to mutate while walking).
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    textNodes.forEach((textNode) => {
      const text = textNode.nodeValue ?? "";
      if (text.trim() === "") return; // preserve whitespace-only nodes as-is

      const fragment = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);

      parts.forEach((part) => {
        if (part === "") return;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
          return;
        }
        const word = document.createElement("span");
        word.className = "split-word";
        word.style.display = "inline-block";
        word.style.whiteSpace = "nowrap";
        for (const ch of part) {
          const c = document.createElement("span");
          c.className = "split-char";
          c.style.display = "inline-block";
          c.textContent = ch;
          word.appendChild(c);
          chars.push(c);
        }
        words.push(word);
        fragment.appendChild(word);
      });

      textNode.parentNode?.replaceChild(fragment, textNode);
    });
  });

  return {
    chars,
    words,
    revert: () => restoreFns.forEach((fn) => fn()),
  };
}