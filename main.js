(function () {
  "use strict";

  function injectCSS() {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
            img.twemoji-img {
                width: 1.25em !important;
                height: 1.25em !important;
                max-width: 1.33em !important;
                max-height: 1.33em !important;
                margin: 0 0.05em !important;
                vertical-align: -0.2em !important;
                display: inline-block !important;
            }

            [role="tab"] img.twemoji-img,
            [role="dialog"] img.twemoji-img,
            [role="option"] img.twemoji-img,
            img.twemoji-img.twemoji-compact,
            [role="tablist"] img.twemoji-img,
            [role="listbox"] img.twemoji-img,
            [role="gridcell"] img.twemoji-img,
            [data-testid="HoverCard"] img.twemoji-img,
            [data-testid="sheetDialog"] img.twemoji-img,
            [data-testid="emojiPicker"] img.twemoji-img {
                width: 1.25em !important;
                height: 1.25em !important;
                max-width: 100% !important;
                max-height: 100% !important;
                margin: 0 0.05em !important;
                padding: 0 !important;
                vertical-align: middle !important;
                object-fit: contain !important;
                pointer-events: none !important;
                display: inline-block !important;
            }
        `;
    (document.head || document.documentElement).appendChild(styleEl);
  }

  const EMOJI_MAP = window.EMOJI_MAP || {};
  const EMOJI_REGEX =
    /(?:[#*0-9]\uFE0F?\u20E3|[©®]\uFE0F?|\u2122\uFE0F?|[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]+\u{E007F}|\p{Extended_Pictographic})(?:\uFE0F|\u200D(?:\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]{2}))*/gu;

  function toCodePoint(unicode) {
    const codePoints = [];
    for (const char of unicode) {
      codePoints.push(char.codePointAt(0).toString(16));
    }
    return codePoints.join("-");
  }

  function getEmojiData(codePoint) {
    if (EMOJI_MAP[codePoint]) return EMOJI_MAP[codePoint];
    const noFe = codePoint.replace(/-fe0f/g, "");
    if (EMOJI_MAP[noFe]) return EMOJI_MAP[noFe];
    return null;
  }

  function isCompactContext(parent) {
    if (!parent || !parent.closest) return false;
    return !!parent.closest(
      '[role="option"], [role="listbox"], [role="gridcell"], [role="dialog"], [data-testid="emojiPicker"]',
    );
  }

  function parseNode(rootNode) {
    if (!rootNode) return;

    const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;

        const tag = parent.tagName ? parent.tagName.toUpperCase() : "";
        if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }

        if (
          parent.isContentEditable ||
          (parent.closest &&
            parent.closest('[contenteditable="true"], [role="textbox"]'))
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        if (tag === "IMG" || (parent.dataset && parent.dataset.twemojiImg)) {
          return NodeFilter.FILTER_REJECT;
        }

        EMOJI_REGEX.lastIndex = 0;
        return EMOJI_REGEX.test(node.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });

    const nodesToReplace = [];
    while (walker.nextNode()) {
      nodesToReplace.push(walker.currentNode);
    }

    nodesToReplace.forEach((textNode) => {
      const text = textNode.nodeValue;
      EMOJI_REGEX.lastIndex = 0;

      const parent = textNode.parentNode;
      if (!parent) return;

      const compact = isCompactContext(parent);
      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      let match;
      let replaced = false;

      while ((match = EMOJI_REGEX.exec(text)) !== null) {
        const matchText = match[0];
        const offset = match.index;

        if (offset > lastIndex) {
          frag.appendChild(
            document.createTextNode(text.slice(lastIndex, offset)),
          );
        }

        const codePoint = toCodePoint(matchText);
        const b64 = getEmojiData(codePoint);

        if (b64) {
          replaced = true;
          const img = document.createElement("img");
          img.alt = matchText;
          img.className = compact
            ? "twemoji-img twemoji-compact"
            : "twemoji-img";
          img.dataset.twemojiImg = "true";
          img.src = b64;
          frag.appendChild(img);
        } else {
          frag.appendChild(document.createTextNode(matchText));
        }

        lastIndex = EMOJI_REGEX.lastIndex;
      }

      if (replaced) {
        if (lastIndex < text.length) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        parent.replaceChild(frag, textNode);
      }
    });
  }

  function collectTargets(mutations) {
    const targets = new Set();

    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;

      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches && node.matches("img.twemoji-img")) return;
          targets.add(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
          targets.add(node.parentNode);
        }
      });
    }

    return targets;
  }

  function start() {
    injectCSS();
    parseNode(document.body);

    let timer = null;
    let pending = [];

    const observer = new MutationObserver((mutations) => {
      pending.push.apply(pending, mutations);
      if (timer) return;
      timer = setTimeout(() => {
        const targets = collectTargets(pending);
        pending = [];
        timer = null;
        targets.forEach((target) => parseNode(target));
      }, 100);
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
