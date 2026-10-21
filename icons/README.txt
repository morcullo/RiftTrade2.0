CARD TRADING — ICON / PWA ASSETS

Included:
- favicon.ico: 16, 24, 32, 48, 64, 128, 256
- PNG icons: 29, 40, 58, 60, 76, 80, 87, 96, 120, 144, 152, 167, 180, 192, 256, 512, 1024
- apple-touch-icon.png: 180x180
- safari-pinned-tab.svg: Safari pinned-tab icon
- manifest.json: PWA / installed web-app manifest
- index-head-snippet.html: ready-to-paste <head> tags

RECOMMENDED WEB STRUCTURE

/public
  /icons
    favicon.ico
    apple-touch-icon.png
    safari-pinned-tab.svg
    manifest.json
    icon-16.png ... icon-1024.png

For an iPhone/iPad:
1. Serve the app over HTTPS.
2. Add the supplied HTML head snippet to the main document.
3. Keep manifest.json reachable at /icons/manifest.json.
4. In Safari, use Share -> Add to Home Screen.
5. iOS will use apple-touch-icon.png for the Home Screen icon.

For Android/desktop PWA:
- The manifest provides 192px and 512px icons.
- "display": "standalone" makes the installed app open without the normal browser UI.

IMPORTANT:
If your app already has a public/ or assets/ directory, copy the files into that directory and adjust the /icons/ paths in the snippet/manifest to match your actual deployment path.
