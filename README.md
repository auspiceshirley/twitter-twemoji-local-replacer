# Twitter Twemoji Local Replacer

A browser extension for replacing Twitter / X emojis with local embedded Base64 Twemojis. Completely offline with zero external network dependencies.

---

## Installation

The extension is currently self-distributed. A store listing may be added later; until then, use the files from [Releases](https://github.com/auspiceshirley/twitter-twemoji-local-replacer/releases).

### 1. Firefox or Tor Browser

1. Download the latest signed `.xpi` from the **Releases** page.
2. Open `about:addons` → the gear icon → **Install Add-on From File…**, and select the `.xpi`.
3. Confirm the install prompt.

After installation, Firefox checks [updates.json](https://raw.githubusercontent.com/auspiceshirley/twitter-twemoji-local-replacer/master/updates.json) for newer signed builds. You do not need to reinstall each version by hand.

Tor Browser uses the same signed `.xpi`. Install it the same way from `about:addons`. Automatic updates also use `updates.json`; if a check fails (common when the circuit or extension update requests are restricted), download the newer `.xpi` from Releases and install it over the existing add-on. Do not load an unpacked folder in Firefox or Tor Browser — only the Mozilla-signed `.xpi` will install on release builds.

If a Firefox Add-ons (AMO) listing is published later, that page will be linked here. Store and self-hosted installs share the same extension ID; do not install both copies.

### 2. Chromium-based browsers (Google Chrome, Microsoft Edge, Brave, Vivaldi, etc.)

These browsers have no self-hosted update channel. Reinstall from a new Release zip when you want an update.

1. Download the latest release `.zip` and extract it to a permanent directory (do not move or delete that folder later).
2. Open the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the extracted directory.

---

## Known Issues

1. Input Areas Excluded: Rich text input areas (contenteditable / textboxes) are excluded from replacement to preserve native IME typing performance and stability.
2. Fast Scrolling Latency: Due to dynamic DOM rendering on Twitter / X, fast scrolling may cause a slight delay before newly loaded emojis are converted.
3. Developer Mode Warning: Chromium-based browsers may display a warning about running extensions in developer mode upon startup.

---

## License and Attribution

- Extension Code: Released under the MIT License.
- Emoji Graphics: Powered by [jdecked/twemoji](https://github.com/jdecked/twemoji), licensed under CC-BY 4.0.
