# Agentation Chrome Extension (experimental)

This package bundles Agentation as a Manifest V3 extension so you can run the toolbar on arbitrary websites.

## Build

```bash
pnpm --dir extension build
```

The unpacked extension is generated in `extension/dist/`.

## Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `extension/dist`

## Features

- Injects Agentation into all websites (except restricted browser pages)
- Popup toggle for global enable/disable
- Keyboard shortcut: `Alt+Shift+A`
- Reuses Agentation's annotation + freeze animation functionality
