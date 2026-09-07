# Twitter Twemoji Local Replacer

A browser extension for replacing Twitter / X emojis with local embedded Base64 Twemojis. Completely offline with zero external network dependencies.

---

## Installation

### 1. Firefox

Firefox users can install and update the extension directly from the official store:

[Install from Firefox Add-ons](https://addons.mozilla.org/addon/twitter-twemoji-local-replacer/)

---

### 2. Chromium-based Browsers (Chrome, Edge, Brave, Vivaldi, etc.)

Follow these steps to install manually:

1. Download the latest release `.zip` file from the **Releases** page and extract it to a permanent directory on your computer (a folder that you will not accidentally move or delete).
2. Open your browser's extension management page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable "`Developer mode`" using the toggle switch.
4. Click "Load unpacked" and select the `extracted directory`.

---

## Known Issues

1. Input Areas Excluded: Rich text input areas (contenteditable / textboxes) are excluded from replacement to preserve native IME typing performance and stability.
2. Fast Scrolling Latency: Due to dynamic DOM rendering on Twitter / X, fast scrolling may cause a slight delay before newly loaded emojis are converted.
3. Developer Mode Warning: Chromium-based browsers may display a warning about running extensions in developer mode upon startup.

---

## License and Attribution

- Extension Code: Released under the MIT License.
- Emoji Graphics: Powered by [jdecked/twemoji](https://github.com/jdecked/twemoji), licensed under CC-BY 4.0.