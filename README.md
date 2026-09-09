# Twitter Twemoji Local Replacer

A browser extension for replacing Twitter / X emojis with local embedded Base64 Twemojis. Completely offline with zero external network dependencies.

---

## Installation

### 1. Firefox or Tor Browser

> [!NOTE]
> The extension is currently self-distributed on Firefox. Please download the files from [Releases](https://github.com/auspiceshirley/twitter-twemoji-local-replacer/releases).

1. Download the latest signed `.xpi` from the **Releases** page.
2. Open `about:addons` → the gear icon → **Install Add-on From File…**, and select the `.xpi`.
3. Confirm the install prompt.

After installation, Firefox checks [updates.json](https://raw.githubusercontent.com/auspiceshirley/twitter-twemoji-local-replacer/master/updates.json) for newer signed builds. You do not need to reinstall each version by hand.

Tor Browser uses the same signed `.xpi`. Install it the same way from `about:addons`. Automatic updates also use `updates.json`; if a check fails (common when the circuit or extension update requests are restricted), download the newer `.xpi` from Releases and install it over the existing add-on. Do not load an unpacked folder in Firefox or Tor Browser — only the Mozilla-signed `.xpi` will install on release builds.

---

### 2. Chromium-based Browsers (Google Chrome, Microsoft Edge, Brave, Vivaldi, etc.)

[Install from Chrome Web Store](https://chromewebstore.google.com/detail/twitter-twemoji-local-rep/dmjgeppegljkhmoefnaldhdgdahihcle)

---

## Known Issues

1. Input Areas Excluded: Rich text input areas (contenteditable / textboxes) are excluded from replacement to preserve native IME typing performance and stability.
2. Fast Scrolling Latency: Due to dynamic DOM rendering on Twitter / X, fast scrolling may cause a slight delay before newly loaded emojis are converted.

---

## License and Attribution

- Extension Code: Released under the MIT License.
- Emoji Graphics: Powered by [jdecked/twemoji](https://github.com/jdecked/twemoji), licensed under CC-BY 4.0.
