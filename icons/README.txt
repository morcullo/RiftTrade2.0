RIFTTRADE — ICON / PWA ASSETS

Included:
- favicon.ico: 16, 24, 32, 48, 64, 128, 256 (32-bit bitmap entries for browser compatibility)
- PNG icons: 29, 40, 58, 60, 76, 80, 87, 96, 120, 144, 152, 167, 180, 192, 256, 512, 1024
- apple-touch-icon.png: 180x180
- safari-pinned-tab.svg: Safari pinned-tab icon
- manifest.json: alternative installed web-app manifest, aligned with ../site.webmanifest
- index-head-snippet.html: <head> tags for the app's index.html

RECOMMENDED WEB STRUCTURE

app root
  index.html
  site.webmanifest
  /icons
    favicon.ico
    apple-touch-icon.png
    safari-pinned-tab.svg
    manifest.json
    icon-29.png ... icon-1024.png (only the sizes listed above are included)

For an iPhone/iPad:
1. Serve the app over HTTPS.
2. Add the supplied HTML head snippet to the main document.
3. Keep site.webmanifest and the icons folder reachable relative to index.html.
4. In Safari, use Share -> Add to Home Screen.
5. iOS will use apple-touch-icon.png for the Home Screen icon.

For Android/desktop PWA:
- The app links site.webmanifest, which provides 192px and 512px icons.
- Keep manifest.json aligned if using it as an alternative.
- Icons use purpose "any"; the supplied artwork is not verified as maskable.
- "display": "standalone" makes the installed app open without the normal browser UI.

IMPORTANT:
The snippet uses app-relative paths and works at the domain root or in a subfolder.
If moving the assets, update the snippet and both manifests to match.
No separate icon-16.png or icon-32.png is included; those sizes are in favicon.ico.
Installation support varies by browser and OS; icon metadata does not add offline support.
Existing installed shortcuts may need to be removed and added again to refresh cached icons.
