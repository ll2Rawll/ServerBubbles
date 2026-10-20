# Server Bubbles

A floating server switcher for BetterDiscord. Hover to enlarge a server; nearby bubbles move aside. Explore with your mouse, find a server by name, and give the whole space your own look.

[Download ServerBubbles.plugin.js](https://raw.githubusercontent.com/pistolswang013/ServerBubbles/main/ServerBubbles.plugin.js)

## Install

1. In Discord, open **Settings → BetterDiscord → Plugins → Open Plugins Folder**.
2. Put `ServerBubbles.plugin.js` in that folder and enable **ServerBubbles**.
3. Open its settings with the gear beside the plugin, or use **Customize** from the bubble menu.

Only the `.plugin.js` file is needed. It works with the default Discord theme and does not require DiscordEffects, NebulaDreamscape, Midnight, or a separate library. Existing Server Bubbles users can replace the old plugin file; saved favorites and preferences carry over.

## Find your servers

- **Ctrl + Shift + Space** opens and closes the field. You can change this shortcut.
- Move toward a screen edge to explore, or scroll. **Shift + scroll** moves sideways.
- Hover a server to enlarge it; click to open it.
- Press **/** to search. Names, abbreviations, and folder names are searchable.
- Use **arrow keys** to move between servers, **Enter** to open one, and **Escape** to go back.
- Right-click a server for favorite, open, and copy-ID actions. Right-click empty space for filters and customization.
- Drag the floating launcher to reposition it. The grid control switches between fit-all and free exploration.

## Customize

The mint-and-charcoal studio has a vertical control rail, circular look swatches, and an interactive bubble playground. It includes five starting looks and sample servers:

- **Style:** accent and atmosphere colors, three glass surfaces, tint, reflections, glow, built-in backgrounds, and a local wallpaper.
- **Bubbles:** diameter, idle and hover sizes, spacing, icon size, names, status text, badges, ordering, and default filters.
- **Motion:** responsiveness, wobble, drift, hover reach, parallax, ripples, edge speed, wheel sensitivity, and separate idle/interaction frame limits.
- **Controls:** launcher size, opacity, corner, keyboard shortcut, navigation hints, and the regular server list.
- **Share:** copy, download, or import an appearance preset. Undo restores the previous look after a preset, import, or reset.

Custom wallpapers can be PNG, JPEG, or WebP files up to 4 MB. Uploaded images stay in your local BetterDiscord configuration. A theme-provided wallpaper is optional; built-in scenes supply a fallback.

## Sharing

Share this repository or the download link above with your friends. Only `ServerBubbles.plugin.js` is needed; your personal configuration is not included.

To send just a look, use **Share → Copy look** or **Download look**. The exported JSON contains appearance and motion preferences. It leaves out server IDs, favorites, recently visited servers, launcher position, and uploaded wallpapers. Your friend can paste it under **Try someone else’s look**.

## Performance and cleanup

Moving bubbles use cached transform layers rather than animated backdrop blur. Offscreen bubbles skip paint updates, covered or offscreen settings previews stop, and hidden Discord windows pause the field. Reduced motion follows your system preference unless you switch that option off. Disabling the plugin restores the regular server list and removes its overlays and listeners.

The default limits are 60 fps during interaction and 30 fps while idle. Choose 30/15 for a lighter setup, or 90 fps for interaction on a faster display.

## Source

This is a plain JavaScript CommonJS plugin with embedded styles. There is no build step or remote script loader. Preferences are normalized on load; shared looks are parsed as JSON and only documented appearance keys are accepted. Server data comes from Discord’s own stores, and server icons use Discord’s image CDN.

Version 4.1.0 · 2Raw · MIT license
