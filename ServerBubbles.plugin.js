/**
 * @name ServerBubbles
 * @author 2Raw
 * @authorLink https://github.com/pistolswang013
 * @source https://github.com/pistolswang013/ServerBubbles/blob/main/ServerBubbles.plugin.js
 * @website https://github.com/pistolswang013/ServerBubbles
 * @version 4.1.0
 * @description Floating server bubbles with a live customization studio, glass styles, presets and shareable looks. Works with any theme.
 */

const DEFAULTS = Object.freeze({
    favorites: [],
    recent: [],
    sort: "native",
    compact: false,
    hideNative: true,
    showUnread: true,
    softMotion: true,
    overview: true,
    position: null,
    preset: "aero",
    accent: "#85dcff",
    secondary: "#5796ed",
    multicolor: true,
    material: "glass",
    glassTint: 62,
    sheen: 70,
    glow: 65,
    background: "theme",
    wallpaper: "",
    backgroundDim: 16,
    ambientLights: true,
    bubbleSize: 156,
    idleScale: 0.72,
    hoverScale: 1.65,
    spacing: 8,
    labelMode: "always",
    showStatus: true,
    iconScale: 1,
    favoritesFirst: false,
    defaultFilter: "all",
    hoverReach: 8,
    responsiveness: 1,
    wobble: 1,
    drift: 1,
    parallax: true,
    edgePan: true,
    panSpeed: 720,
    wheelSpeed: 1,
    clickRipples: true,
    fps: 60,
    idleFps: 30,
    respectReducedMotion: true,
    launcherSize: 62,
    launcherOpacity: 100,
    launcherCorner: "bottom-right",
    showHints: true,
    shortcut: "ctrl-shift-space",
});

const RANGES = Object.freeze({
    glassTint: [15, 100],
    sheen: [0, 100],
    glow: [0, 150],
    backgroundDim: [0, 85],
    bubbleSize: [80, 210],
    idleScale: [0.4, 1],
    hoverScale: [1.1, 2.4],
    spacing: [4, 48],
    iconScale: [0.7, 1.5],
    hoverReach: [0, 50],
    responsiveness: [0.5, 1.5],
    wobble: [0, 1.5],
    drift: [0, 2],
    panSpeed: [150, 1400],
    wheelSpeed: [0.25, 2],
    launcherSize: [42, 84],
    launcherOpacity: [35, 100],
});

const CHOICES = Object.freeze({
    sort: ["native", "name", "unread", "recent"],
    material: ["glass", "frost", "solid"],
    background: ["theme", "cosmos", "aero", "midnight", "custom"],
    labelMode: ["always", "focus", "never"],
    defaultFilter: ["all", "favorites", "unread", "recent"],
    launcherCorner: ["bottom-right", "bottom-left", "top-right", "top-left"],
    shortcut: ["ctrl-shift-space", "alt-b", "ctrl-alt-b", "none"],
});

const PRESETS = Object.freeze({
    aero: {
        name: "Liquid Aero",
        note: "Clear glass · ocean light",
        colors: ["#85dcff", "#5796ed"],
        settings: {
            accent: "#85dcff",
            secondary: "#5796ed",
            multicolor: true,
            material: "glass",
            glassTint: 62,
            sheen: 70,
            glow: 65,
            background: "aero",
            backgroundDim: 16,
            ambientLights: true,
            softMotion: true,
            wobble: 1,
            drift: 1,
        },
    },
    orbit: {
        name: "Orbit",
        note: "Deep space · electric blue",
        colors: ["#a2c7ff", "#6e67d8"],
        settings: {
            accent: "#a2c7ff",
            secondary: "#6e67d8",
            multicolor: false,
            material: "glass",
            glassTint: 74,
            sheen: 60,
            glow: 90,
            background: "cosmos",
            backgroundDim: 15,
            ambientLights: true,
            softMotion: true,
            wobble: 0.8,
            drift: 0.7,
        },
    },
    graphite: {
        name: "Graphite",
        note: "Smoked glass · quiet motion",
        colors: ["#c4d3e3", "#66778b"],
        settings: {
            accent: "#c4d3e3",
            secondary: "#66778b",
            multicolor: false,
            material: "frost",
            glassTint: 85,
            sheen: 35,
            glow: 20,
            background: "midnight",
            backgroundDim: 30,
            ambientLights: false,
            softMotion: true,
            wobble: 0.35,
            drift: 0.4,
        },
    },
    ember: {
        name: "Afterglow",
        note: "Warm reflections · sunset",
        colors: ["#ffbd8d", "#bd6f98"],
        settings: {
            accent: "#ffbd8d",
            secondary: "#bd6f98",
            multicolor: false,
            material: "glass",
            glassTint: 60,
            sheen: 80,
            glow: 80,
            background: "aero",
            backgroundDim: 20,
            ambientLights: true,
            softMotion: true,
            wobble: 1.1,
            drift: 1,
        },
    },
    minimal: {
        name: "Still",
        note: "Clean surfaces · no drift",
        colors: ["#9dc0ea", "#334a6a"],
        settings: {
            accent: "#9dc0ea",
            secondary: "#334a6a",
            multicolor: false,
            material: "solid",
            glassTint: 100,
            sheen: 10,
            glow: 0,
            background: "midnight",
            backgroundDim: 0,
            ambientLights: false,
            softMotion: false,
            wobble: 0,
            drift: 0,
        },
    },
});

// These are the only preferences a shared look can carry between accounts.
const LOOK_KEYS = [
    "accent",
    "secondary",
    "multicolor",
    "material",
    "glassTint",
    "sheen",
    "glow",
    "background",
    "backgroundDim",
    "ambientLights",
    "bubbleSize",
    "idleScale",
    "hoverScale",
    "spacing",
    "labelMode",
    "showStatus",
    "iconScale",
    "softMotion",
    "hoverReach",
    "responsiveness",
    "wobble",
    "drift",
    "parallax",
    "clickRipples",
];

const BACKGROUNDS = Object.freeze({
    cosmos: "radial-gradient(ellipse at 78% 28%, #2857a355, transparent 40%), radial-gradient(ellipse at 15% 90%, #11677866, transparent 50%), linear-gradient(145deg, #030816, #071830 55%, #02060f)",
    midnight:
        "radial-gradient(ellipse at 80% 0%, #18305277, transparent 65%), linear-gradient(150deg, #050a11, #09121e 55%, #020509)",
});

const ICONS = {
    pause: "M9 5v14M15 5v14",
    play: "m9 5 10 7-10 7Z",
    bubbles:
        "M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    search: "M21 21l-5-5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z",
    close: "M6 6l12 12M18 6 6 18",
    arrow: "M5 12h14m-5-5 5 5-5 5",
    star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z",
    unread: "M5 5h14v11H9l-4 4V5Zm4 4h6m-6 3h4",
    recent: "M3 11a9 9 0 1 1 2.5 7M3 4v7h7m2-4v5l3 2",
    folder: "M3 7V5h7l2 3h9v12H3V7Z",
    home: "m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10",
    grid: "M4 4h6v6H4Zm10 0h6v6h-6ZM4 14h6v6H4Zm10 0h6v6h-6Z",
    copy: "M8 8h12v12H8ZM4 16H3V3h13v1",
    check: "m5 12 4 4L19 6",
    chevron: "m8 10 4 4 4-4",
    more: "M5 12h.01M12 12h.01M19 12h.01",
    plus: "M12 4v16M4 12h16",
};
const el = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
};
const icon = (name, filled = false) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    for (const [key, value] of Object.entries({
        viewBox: "0 0 24 24",
        fill: filled ? "currentColor" : "none",
        stroke: "currentColor",
        "stroke-width": "1.65",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "aria-hidden": "true",
    }))
        svg.setAttribute(key, value);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", ICONS[name] || ICONS.bubbles);
    svg.append(path);
    return svg;
};
const button = (label, className, symbol) => {
    const result = el("button", className);
    result.type = "button";
    result.setAttribute("aria-label", label);
    result.title = label;
    if (symbol) result.append(icon(symbol));
    return result;
};
const normalizeText = (text) =>
    String(text || "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase();
const validIds = (value) =>
    Array.isArray(value)
        ? [...new Set(value.filter((id) => typeof id === "string" && /^\d{1,24}$/.test(id)))].slice(0, 250)
        : [];
const safe = (callback, fallback) => {
    try {
        return callback() ?? fallback;
    } catch {
        return fallback;
    }
};

module.exports = class ServerBubbles {
    constructor(meta = {}) {
        this.meta = { name: "ServerBubbles", version: "4.1.0", ...meta };
        this.api = new BdApi(this.meta.name);
        this.settings = this.normalize(this.api.Data.load("settings"));
        this.filter = "all";
        this.query = "";
        this.started = false;
        this.subscriptions = [];
        this.studios = new Set();
    }

    normalize(saved = {}) {
        const settings = { ...DEFAULTS, favorites: [], recent: [] };
        if (!saved || typeof saved !== "object" || Array.isArray(saved)) return settings;

        for (const key of Object.keys(DEFAULTS)) {
            const value = saved[key];
            if (typeof DEFAULTS[key] === "boolean" && typeof value === "boolean") settings[key] = value;
            if (RANGES[key] && typeof value === "number" && Number.isFinite(value)) {
                settings[key] = Math.max(RANGES[key][0], Math.min(RANGES[key][1], value));
            }
            if (CHOICES[key]?.includes(value)) settings[key] = value;
        }

        settings.favorites = validIds(saved.favorites);
        settings.recent = validIds(saved.recent).slice(0, 20);
        settings.preset = Object.hasOwn(PRESETS, saved.preset) ? saved.preset : "custom";
        for (const key of ["accent", "secondary"]) {
            if (/^#[\da-f]{6}$/i.test(saved[key])) settings[key] = saved[key];
        }
        settings.fps = [30, 60, 90].includes(saved.fps) ? saved.fps : DEFAULTS.fps;
        settings.idleFps = [15, 30].includes(saved.idleFps) ? saved.idleFps : DEFAULTS.idleFps;
        settings.wallpaper = this.validWallpaper(saved.wallpaper) ? saved.wallpaper : "";
        if (saved.position && Number.isFinite(saved.position.x) && Number.isFinite(saved.position.y)) {
            settings.position = {
                x: Math.max(0, Math.min(1, saved.position.x)),
                y: Math.max(0, Math.min(1, saved.position.y)),
            };
        }

        // Older releases offered a compact switch instead of a size slider.
        if (saved.bubbleSize === undefined && saved.compact === true) settings.bubbleSize = 132;
        return settings;
    }

    validWallpaper(value) {
        if (typeof value !== "string" || value.length > 6 * 1024 * 1024) return false;
        if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)) return true;
        try {
            const url = new URL(value);
            return url.protocol === "https:" && !url.username && !url.password;
        } catch {
            return false;
        }
    }

    applyAppearance(target) {
        if (!target) return;
        const settings = this.settings;
        const rgb = (value) =>
            [1, 3, 5].map((index) => parseInt(value.slice(index, index + 2), 16)).join(" ");
        const channels = [1, 3, 5].map(
            (index) => parseInt(settings.accent.slice(index, index + 2), 16) / 255,
        );
        const maximum = Math.max(...channels),
            delta = maximum - Math.min(...channels);
        const hue = !delta
            ? 210
            : ((maximum === channels[0]
                  ? (channels[1] - channels[2]) / delta
                  : maximum === channels[1]
                    ? (channels[2] - channels[0]) / delta + 2
                    : (channels[0] - channels[1]) / delta + 4) *
                  60 +
                  360) %
              360;
        const vars = {
            "--sb-accent": settings.accent,
            "--sb-secondary": settings.secondary,
            "--sb-accent-rgb": rgb(settings.accent),
            "--sb-secondary-rgb": rgb(settings.secondary),
            "--sb-accent-hue": hue,
            "--sb-tint": settings.glassTint / 100,
            "--sb-sheen": settings.sheen / 100,
            "--sb-glow": settings.glow / 100,
            "--sb-dim": settings.backgroundDim / 100,
            "--sb-icon-scale": settings.iconScale,
            "--sb-launcher-size": `${settings.launcherSize}px`,
            "--sb-launcher-opacity": settings.launcherOpacity / 100,
        };
        for (const [key, value] of Object.entries(vars)) target.style.setProperty(key, String(value));
        target.dataset.material = settings.material;
        target.dataset.labels = settings.labelMode;
        target.dataset.status = String(settings.showStatus);
        target.dataset.multicolor = String(settings.multicolor);
        target.dataset.ambient = String(settings.ambientLights);
        target.dataset.background = settings.background;
        target.dataset.hints = String(settings.showHints);

        const aero = `radial-gradient(ellipse at 14% 88%, rgb(${rgb(settings.accent)} / .26), transparent 50%), radial-gradient(ellipse at 85% 15%, rgb(${rgb(settings.secondary)} / .32), transparent 55%), linear-gradient(150deg, #020914, #0b2035 60%, #020711)`;
        let background = BACKGROUNDS[settings.background] || aero;
        if (settings.background === "theme")
            background = `var(--lg-photo, var(--lg-wallpaper, ${BACKGROUNDS.cosmos}))`;
        if (settings.background === "custom") {
            background = settings.wallpaper
                ? `url(${JSON.stringify(settings.wallpaper)})`
                : BACKGROUNDS.cosmos;
        }
        target.style.setProperty("--sb-background", background);
    }

    updateSettings(changes, remember = true) {
        const previous = this.settings;
        this.settings = this.normalize({ ...previous, ...changes });
        if (!Object.hasOwn(changes, "preset") && Object.keys(changes).some((key) => LOOK_KEYS.includes(key)))
            this.settings.preset = "custom";
        this.pendingSettings ||= new Set();
        for (const key of Object.keys(changes)) this.pendingSettings.add(key);

        if (remember) {
            clearTimeout(this.saveTimer);
            this.saveTimer = setTimeout(() => {
                this.saveTimer = null;
                this.save();
            }, 180);
        }
        if (this.settingsFrame) return;
        this.settingsFrame = requestAnimationFrame(() => {
            this.settingsFrame = null;
            const changed = this.pendingSettings;
            this.pendingSettings = new Set();
            const layout = ["bubbleSize", "idleScale", "hoverScale", "spacing"].some((key) =>
                changed.has(key),
            );
            const results = ["sort", "showUnread", "favoritesFirst"].some((key) => changed.has(key));
            this.applyNativeVisibility();
            this.applyAppearance(this.launcher);
            this.positionLauncher();
            if (results && this.started) {
                this.dataSignature = null;
                this.refreshData();
            }
            if (this.root) {
                this.applyAppearance(this.root);
                this.reducedMotion = this.settings.respectReducedMotion && this.motionPreference.matches;
                this.root.dataset.reduced = String(this.reducedMotion);
                if (changed.has("overview")) {
                    this.overview = this.settings.overview;
                    this.updateOverviewControl();
                }
                if (layout && !results) this.layoutBubbles(false);
            }
            for (const studio of this.studios || []) {
                studio.sync();
                studio.preview.settings = this.settings;
                studio.preview.reducedMotion = this.settings.respectReducedMotion && studio.media.matches;
                studio.canvas.dataset.reduced = String(studio.preview.reducedMotion);
                this.applyAppearance(studio.canvas);
                if (layout) studio.resize();
            }
        });
    }

    sharedLook() {
        const settings = Object.fromEntries(LOOK_KEYS.map((key) => [key, this.settings[key]]));
        if (settings.background === "custom") settings.background = "cosmos";
        return JSON.stringify({ format: "server-bubbles-look", version: 1, settings }, null, 2);
    }

    importLook(text) {
        if (typeof text !== "string" || text.length > 64000)
            throw new Error("That look is too large. Paste a Server Bubbles look under 64 KB.");
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch {
            throw new Error("This is not valid JSON. Paste the complete look, including its braces.");
        }
        if (
            parsed?.format !== "server-bubbles-look" ||
            parsed.version !== 1 ||
            !parsed.settings ||
            typeof parsed.settings !== "object" ||
            Array.isArray(parsed.settings)
        ) {
            throw new Error("This is not a supported Server Bubbles look.");
        }
        const keys = LOOK_KEYS.filter((key) => Object.hasOwn(parsed.settings, key));
        if (!keys.length) throw new Error("This look does not contain any appearance settings.");
        const changes = Object.fromEntries(keys.map((key) => [key, parsed.settings[key]]));
        if (changes.background === "custom") changes.background = "cosmos";
        this.rememberLook();
        this.updateSettings(changes);
    }

    rememberLook() {
        this.previousLook = Object.fromEntries(
            [...LOOK_KEYS, "preset"].map((key) => [key, this.settings[key]]),
        );
    }

    shortcutMatches(event) {
        if (event.repeat || event.metaKey) return false;
        const key = event.key.toLowerCase();
        if (this.settings.shortcut === "ctrl-shift-space")
            return (
                event.ctrlKey && event.shiftKey && !event.altKey && (event.code === "Space" || key === " ")
            );
        if (this.settings.shortcut === "alt-b")
            return event.altKey && !event.ctrlKey && !event.shiftKey && key === "b";
        if (this.settings.shortcut === "ctrl-alt-b")
            return event.ctrlKey && event.altKey && !event.shiftKey && key === "b";
        return false;
    }

    shortcutLabel() {
        return {
            "ctrl-shift-space": "Ctrl+Shift+Space",
            "alt-b": "Alt+B",
            "ctrl-alt-b": "Ctrl+Alt+B",
            none: "Launcher only",
        }[this.settings.shortcut];
    }

    openStudio() {
        this.close(true);
        const React = BdApi.React;
        if (!React || typeof BdApi.UI.showConfirmationModal !== "function") return;
        const panel = this.getSettingsPanel();
        const Host = () => {
            const mount = React.useRef(null);
            React.useEffect(() => {
                mount.current?.append(panel);
                return () => {
                    panel.remove();
                    this.disposeStudioFor(panel);
                };
            }, []);
            return React.createElement("div", { ref: mount });
        };
        BdApi.UI.showConfirmationModal("Server Bubbles", React.createElement(Host), {
            confirmText: "Done",
            cancelText: null,
        });
    }

    disposeStudioFor(panel) {
        const studio = [...(this.studios || [])].find((item) => item.panel === panel);
        if (!studio || studio.disposed) return;
        studio.disposed = true;
        cancelAnimationFrame(studio.preview.motionFrame || 0);
        cancelAnimationFrame(studio.resizeFrame || 0);
        studio.observer.disconnect();
        studio.intersection.disconnect();
        studio.abort.abort();
        studio.preview.root = null;
        this.studios.delete(studio);
    }

    save() {
        this.api.Data.save("settings", this.settings);
    }

    start() {
        if (this.started) return;
        try {
            const webpack = BdApi.Webpack;
            const store = (name) => safe(() => webpack.getStore(name), null);
            this.guildStore = store("GuildStore");
            this.sortedStore = store("SortedGuildStore");
            this.unreadStore = store("GuildReadStateStore");
            this.selectedStore = store("SelectedGuildStore");
            this.channelStore = store("SelectedChannelStore");
            this.iconUtils = safe(() => webpack.getByKeys("getGuildIconURL"), null);
            const routeModule = safe(() => webpack.getByKeys("transitionTo", "replaceWith"), null);
            this.transition = routeModule
                ? routeModule.transitionTo.bind(routeModule)
                : safe(
                      () => webpack.getByStrings("transitionTo - Transitioning to ", { searchExports: true }),
                      null,
                  );
            if (!this.transition) {
                const fallback = safe(() => webpack.getByKeys("transitionTo"), null);
                if (typeof fallback?.transitionTo === "function")
                    this.transition = fallback.transitionTo.bind(fallback);
            }
            if (typeof this.guildStore?.getGuilds !== "function" || typeof this.transition !== "function")
                throw new Error("Discord's server or navigation module is not available yet.");
            this.started = true;
            this.abort = new AbortController();
            BdApi.DOM.addStyle("ServerBubblesStyles", this.getStyles());
            this.save();
            this.api.Data.save("version", this.meta.version);
            this.mountLauncher();
            this.applyNativeVisibility();
            this.refreshData();
            for (const target of [this.guildStore, this.sortedStore, this.unreadStore, this.selectedStore]) {
                if (!target?.addChangeListener) continue;
                const listener = () => this.scheduleRefresh();
                target.addChangeListener(listener);
                this.subscriptions.push(() => target.removeChangeListener?.(listener));
            }
            document.addEventListener("keydown", (event) => this.onKeyDown(event), {
                capture: true,
                signal: this.abort.signal,
            });
            window.addEventListener("resize", () => this.positionLauncher(), { signal: this.abort.signal });
            // Replace settings left open while BetterDiscord reloads the plugin.
            for (const previous of document.querySelectorAll(".sb-studio")) {
                previous.replaceWith(this.getSettingsPanel());
            }
        } catch (error) {
            this.stop();
            this.api.Logger?.error("Could not start Server Bubbles", error);
            BdApi.UI.showToast(
                "Server Bubbles could not connect to Discord. Your normal server list is available.",
                { type: "error" },
            );
        }
    }

    stop() {
        this.started = false;
        if (this.saveTimer) this.save();
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
        cancelAnimationFrame(this.settingsFrame || 0);
        this.settingsFrame = null;
        for (const studio of [...this.studios]) this.disposeStudioFor(studio.panel);
        this.close(true);
        this.abort?.abort();
        for (const unsubscribe of this.subscriptions) safe(unsubscribe);
        this.subscriptions = [];
        clearTimeout(this.updateTimer);
        clearTimeout(this.closeTimer);
        cancelAnimationFrame(this.openFrame || 0);
        this.launcher?.remove();
        this.launcher = null;
        document.body.classList.remove("sb-native-hidden", "sb-dragging");
        BdApi.DOM.removeStyle("ServerBubblesStyles");
    }

    applyNativeVisibility() {
        document.body.classList.toggle("sb-native-hidden", this.started && this.settings.hideNative);
    }

    mountLauncher() {
        document.getElementById("sb-launcher")?.remove();
        this.launcher = button(
            "Open your servers (Ctrl+Shift+Space). Drag to reposition.",
            "sb-launcher",
            "bubbles",
        );
        this.launcher.id = "sb-launcher";
        this.launcher.setAttribute("aria-haspopup", "dialog");
        this.launcher.setAttribute("aria-expanded", "false");
        this.launcher.append(el("span", "sb-launcher-badge"), el("span", "sb-launcher-tip", "Your spaces"));
        this.launcher.addEventListener("click", () => {
            if (Date.now() < (this.suppressClickUntil || 0)) return;
            this.root ? this.close() : this.open();
        });
        this.launcher.addEventListener("pointerdown", (event) => this.beginDrag(event));
        this.applyAppearance(this.launcher);
        document.body.append(this.launcher);
        this.positionLauncher();
    }

    positionLauncher() {
        if (!this.launcher) return;
        const width = this.launcher.offsetWidth || 62;
        const height = this.launcher.offsetHeight || 62;
        const bounds = {
            x: Math.max(0, window.innerWidth - width - 12),
            y: Math.max(0, window.innerHeight - height - 12),
        };
        const corner = this.settings.launcherCorner;
        const dockX = corner.endsWith("left") ? 24 : Math.max(12, bounds.x - 12);
        const dockY = corner.startsWith("top") ? 48 : Math.max(12, bounds.y - 76);
        const x = this.settings.position ? Math.max(12, this.settings.position.x * bounds.x) : dockX;
        const y = this.settings.position ? Math.max(12, this.settings.position.y * bounds.y) : dockY;
        this.launcher.dataset.side = x < innerWidth / 2 ? "left" : "right";
        this.launcher.style.left = `${Math.min(bounds.x, x)}px`;
        this.launcher.style.top = `${Math.min(bounds.y, y)}px`;
    }

    beginDrag(event) {
        if (event.button !== 0 || this.root) return;
        const rect = this.launcher.getBoundingClientRect();
        const start = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
        let moved = false;
        const dragAbort = new AbortController();
        const stopDrag = () => {
            dragAbort.abort();
            document.body.classList.remove("sb-dragging");
            if (!moved) return;
            this.suppressClickUntil = Date.now() + 250;
            const current = this.launcher.getBoundingClientRect();
            this.settings.position = {
                x: current.left / Math.max(1, innerWidth - current.width - 12),
                y: current.top / Math.max(1, innerHeight - current.height - 12),
            };
            this.save();
        };
        this.abort.signal.addEventListener("abort", () => dragAbort.abort(), {
            once: true,
            signal: dragAbort.signal,
        });
        document.addEventListener(
            "pointermove",
            (move) => {
                const dx = move.clientX - start.x,
                    dy = move.clientY - start.y;
                if (!moved && Math.hypot(dx, dy) < 6) return;
                moved = true;
                document.body.classList.add("sb-dragging");
                this.launcher.style.left = `${Math.max(12, Math.min(innerWidth - rect.width - 12, start.left + dx))}px`;
                this.launcher.style.top = `${Math.max(12, Math.min(innerHeight - rect.height - 12, start.top + dy))}px`;
            },
            { signal: dragAbort.signal },
        );
        document.addEventListener("pointerup", stopDrag, { once: true, signal: dragAbort.signal });
        document.addEventListener("pointercancel", stopDrag, { once: true, signal: dragAbort.signal });
    }

    scheduleRefresh() {
        if (!this.started || this.updateTimer) return;
        this.updateTimer = setTimeout(() => {
            this.updateTimer = null;
            if (this.started) this.refreshData();
        }, 160);
    }

    refreshData() {
        const guildMap = safe(() => this.guildStore.getGuilds(), {});
        const guilds = guildMap instanceof Map ? [...guildMap.values()] : Object.values(guildMap);
        const ordered = safe(() => this.sortedStore.getFlattenedGuildIds(), []);
        const positions = new Map(ordered.map((id, index) => [id, index]));
        this.folders = safe(() => this.sortedStore.getGuildFolders(), [])
            .filter(
                (folder) =>
                    folder.folderId &&
                    /^\d+$/.test(String(folder.folderId)) &&
                    Array.isArray(folder.guildIds),
            )
            .map((folder, index) => {
                const firstGuild = guilds.find((guild) => String(guild.id) === String(folder.guildIds[0]));
                const automaticName = firstGuild
                    ? `${firstGuild.name}${folder.guildIds.length > 1 ? ` + ${folder.guildIds.length - 1}` : ""}`
                    : `Folder ${index + 1}`;
                return {
                    id: String(folder.folderId),
                    name: String(folder.folderName || automaticName),
                    guildIds: folder.guildIds.map(String),
                };
            });
        const folderByGuild = new Map(
            this.folders.flatMap((folder) => folder.guildIds.map((id) => [id, folder])),
        );
        this.selectedId = safe(() => this.selectedStore.getGuildId(), null);
        this.guilds = guilds
            .filter((guild) => guild?.id && /^\d{1,24}$/.test(String(guild.id)))
            .map((guild, index) => ({
                id: String(guild.id),
                name: String(guild.name || "Unnamed server"),
                guild,
                order: positions.get(guild.id) ?? ordered.length + index,
                mentions: Math.max(0, Number(safe(() => this.unreadStore.getMentionCount(guild.id), 0)) || 0),
                unread: Boolean(safe(() => this.unreadStore.hasUnread(guild.id), false)),
                folder: folderByGuild.get(String(guild.id)),
                favorite: this.settings.favorites.includes(String(guild.id)),
            }));
        this.guilds.sort((a, b) => a.order - b.order);
        const total = this.guilds.reduce((count, guild) => count + guild.mentions, 0);
        const badge = this.launcher?.querySelector(".sb-launcher-badge");
        if (badge) {
            badge.textContent = total > 99 ? "99+" : String(total);
            badge.hidden = !this.settings.showUnread || !total;
        }
        this.launcher?.setAttribute(
            "aria-label",
            `Open your ${this.guilds.length} servers${total && this.settings.showUnread ? `, ${total} mentions` : ""}. ${this.shortcutLabel()}. Drag to reposition.`,
        );
        const signature = JSON.stringify([
            this.selectedId,
            this.settings.showUnread,
            this.settings.sort,
            this.settings.recent,
            this.folders,
            this.guilds.map((guild) => [
                guild.id,
                guild.name,
                guild.guild.icon,
                guild.unread,
                guild.mentions,
                guild.favorite,
            ]),
        ]);
        const changed = signature !== this.dataSignature;
        this.dataSignature = signature;
        if (this.root && !this.closing && changed) {
            this.renderResults(false);
        }
    }

    open() {
        if (!this.started) return;
        if (this.root) {
            if (this.closing) this.finishClose();
            else return;
        }
        this.refreshData();
        for (const studio of this.studios) {
            studio.preview.sceneCovered = true;
            cancelAnimationFrame(studio.preview.motionFrame || 0);
            studio.preview.motionFrame = null;
        }
        this.query = "";
        this.filter = this.settings.defaultFilter;
        this.previousFocus = document.activeElement;
        this.modalAbort = new AbortController();
        this.motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
        this.reducedMotion = this.settings.respectReducedMotion && this.motionPreference.matches;
        this.pointer = { x: innerWidth / 2, y: innerHeight / 2, active: false, vx: 0, vy: 0, stamp: 0 };
        this.camera = { x: 0, y: 0, tx: 0, ty: 0, px: 0, py: 0 };
        this.overview = this.settings.overview;
        this.root = el("div", "sb-overlay");
        this.root.id = "sb-overlay";
        this.root.dataset.reduced = String(this.reducedMotion);
        this.applyAppearance(this.root);
        const atmosphere = el("div", "sb-atmosphere");
        atmosphere.setAttribute("aria-hidden", "true");
        for (let i = 0; i < 7; i++) {
            const light = el("i", "sb-bokeh");
            light.style.setProperty("--i", String(i));
            atmosphere.append(light);
        }
        atmosphere.append(el("div", "sb-caustics"), el("div", "sb-cursor-aura"));
        this.dialog = el("section", "sb-universe");
        this.dialog.setAttribute("role", "dialog");
        this.dialog.setAttribute("aria-modal", "true");
        this.dialog.setAttribute("aria-label", "Your floating server bubbles");
        this.dialog.setAttribute("aria-describedby", "sb-instructions");
        this.dialog.tabIndex = -1;
        const instructions = el(
            "p",
            "sb-sr-only",
            "Move your mouse near bubbles to play with them. Move to the screen edges to explore, or use the mouse wheel. Arrow keys explore servers, Enter opens one, slash searches, Escape closes.",
        );
        instructions.id = "sb-instructions";
        this.grid = el("div", "sb-world");
        this.grid.setAttribute("aria-label", "Your servers");
        this.dialog.append(instructions, this.grid);
        const controls = el("div", "sb-corner-controls");
        const find = button("Find a server ( / )", "sb-glass-control sb-find", "search");
        find.onclick = () => this.showSearch();
        const home = button("Open direct messages", "sb-glass-control sb-home", "home");
        home.onclick = () => this.navigate("@me");
        this.overviewButton = button("See all bubbles", "sb-glass-control sb-overview", "grid");
        this.overviewButton.onclick = () => this.toggleOverview();
        const close = button("Close server bubbles (Esc)", "sb-glass-control sb-close", "close");
        close.onclick = () => this.close();
        const customize = button("Customize Server Bubbles", "sb-glass-control sb-customize", "grid");
        customize.replaceChildren(icon("more"));
        customize.onclick = () => this.openStudio();
        controls.append(find, home, this.overviewButton, customize);
        this.searchBox = el("form", "sb-search-island");
        this.searchBox.hidden = true;
        this.searchBox.setAttribute("role", "search");
        this.searchBox.append(icon("search"));
        this.search = el("input", "sb-search");
        this.search.type = "search";
        this.search.placeholder = "Find your space…";
        this.search.setAttribute("aria-label", "Search your servers");
        this.search.autocomplete = "off";
        this.search.spellcheck = false;
        this.search.oninput = () => {
            this.query = this.search.value;
            this.renderResults(true);
        };
        this.searchBox.onsubmit = (event) => {
            event.preventDefault();
            if (this.visibleGuilds.length === 1) this.navigate(this.visibleGuilds[0].id);
            else this.focusBubble(this.visibleGuilds[0]?.id);
        };
        const clear = button("Close search", "sb-search-close", "close");
        clear.onclick = () => this.hideSearch();
        this.searchBox.append(this.search, clear);
        this.hint = el("div", "sb-explore-hint");
        this.hint.setAttribute("aria-hidden", "true");
        this.hint.append(
            el("span", "sb-hint-dot"),
            el("span", "", "Move to explore"),
            el("span", "sb-hint-separator", "·"),
            el("span", "", "/ to find a server"),
        );
        this.locationIndicator = el("div", "sb-position");
        this.locationIndicator.setAttribute("aria-hidden", "true");
        this.locationIndicator.append(el("i", "sb-position-dot"));
        this.resultsCount = el("span", "sb-sr-only");
        this.resultsCount.setAttribute("role", "status");
        this.resultsCount.setAttribute("aria-live", "polite");
        this.errorLabel = el("div", "sb-error");
        this.errorLabel.setAttribute("role", "alert");
        this.errorLabel.hidden = true;
        this.dialog.append(
            controls,
            close,
            this.searchBox,
            this.hint,
            this.locationIndicator,
            this.resultsCount,
            this.errorLabel,
        );
        this.root.append(atmosphere, this.dialog);
        document.body.append(this.root);
        this.updateOverviewControl();
        this.backgroundMount = document.getElementById("app-mount");
        this.wasInert = Boolean(this.backgroundMount?.inert);
        if (this.backgroundMount) this.backgroundMount.inert = true;
        this.launcher?.setAttribute("aria-expanded", "true");
        this.bindSpace();
        this.renderResults(true);
        this.openFrame = requestAnimationFrame(() => {
            this.openFrame = null;
            this.root?.classList.add("sb-is-open");
            this.dialog?.focus({ preventScroll: true });
            this.startMotion();
        });
    }

    showSearch(seed = "") {
        if (!this.root) return;
        this.searchBox.hidden = false;
        this.pointer.active = false;
        if (seed) {
            this.query = this.search.value = seed;
            this.renderResults(true);
        }
        this.search.focus();
        if (!seed) this.search.select();
    }

    toggleOverview() {
        this.overview = !this.overview;
        this.settings.overview = this.overview;
        this.save();
        this.pointer.active = false;
        this.updateOverviewControl();
        this.paintNodes(performance.now(), 0);
    }

    updateOverviewControl() {
        if (!this.overviewButton) return;
        this.overviewButton.setAttribute("aria-pressed", String(this.overview));
        this.overviewButton.setAttribute(
            "aria-label",
            this.overview ? "Explore bubbles at full size" : "See all bubbles",
        );
        this.overviewButton.title = this.overview ? "Explore at full size" : "Fit every bubble on screen";
        const note = this.hint?.querySelectorAll("span");
        if (note?.[1])
            note[1].textContent = this.overview
                ? "All your spaces · hover to play"
                : "Move toward the edges to explore";
    }

    hideSearch() {
        if (!this.root) return;
        this.searchBox.hidden = true;
        this.query = this.search.value = "";
        this.renderResults(true);
        this.dialog.focus({ preventScroll: true });
    }

    bindSpace() {
        const signal = this.modalAbort.signal;
        this.root.addEventListener(
            "pointermove",
            (event) => {
                if (event.pointerType === "touch") return;
                const now = performance.now(),
                    elapsed = Math.max(12, now - this.pointer.stamp);
                this.pointer.vx = Math.max(
                    -1400,
                    Math.min(1400, ((event.clientX - this.pointer.x) / elapsed) * 1000),
                );
                this.pointer.vy = Math.max(
                    -1400,
                    Math.min(1400, ((event.clientY - this.pointer.y) / elapsed) * 1000),
                );
                Object.assign(this.pointer, { x: event.clientX, y: event.clientY, active: true, stamp: now });
                this.pointer.intentId =
                    event.target.closest("[data-server-open], [data-pin]")?.dataset.serverOpen ||
                    event.target.closest("[data-pin]")?.dataset.pin ||
                    null;
                this.overControl = Boolean(
                    event.target.closest(".sb-corner-controls, .sb-close, .sb-search-island, .sb-context"),
                );
                this.focusedBubble = null;
            },
            { signal },
        );
        this.root.addEventListener(
            "pointerleave",
            () => {
                this.pointer.active = false;
            },
            { signal },
        );
        this.root.addEventListener(
            "pointerdown",
            (event) => {
                if (!event.target.closest(".sb-context")) this.closeContext(false);
                if (event.target.closest("button, input, .sb-search-island")) return;
                if (event.pointerType === "touch")
                    this.touchPan = {
                        id: event.pointerId,
                        x: event.clientX,
                        y: event.clientY,
                        cx: this.camera.tx,
                        cy: this.camera.ty,
                    };
                this.makeRipple(event.clientX, event.clientY);
            },
            { signal },
        );
        this.root.addEventListener(
            "pointermove",
            (event) => {
                if (!this.touchPan || this.touchPan.id !== event.pointerId) return;
                this.camera.tx = this.touchPan.cx - event.clientX + this.touchPan.x;
                this.camera.ty = this.touchPan.cy - event.clientY + this.touchPan.y;
                this.clampCamera();
            },
            { signal },
        );
        this.root.addEventListener(
            "pointerup",
            () => {
                this.touchPan = null;
            },
            { signal },
        );
        this.root.addEventListener(
            "pointercancel",
            () => {
                this.touchPan = null;
                this.pointer.active = false;
            },
            { signal },
        );
        this.root.addEventListener(
            "wheel",
            (event) => {
                if (event.target.closest(".sb-context, .sb-search-island")) return;
                event.preventDefault();
                if (this.overview) {
                    const target = this.nodes.find((node) => node.id === this.pointer.intentId);
                    this.overview = false;
                    this.settings.overview = false;
                    this.save();
                    this.updateOverviewControl();
                    if (target) this.centerBubble(target.id, true);
                }
                const factor =
                    (event.deltaMode === 1 ? 20 : event.deltaMode === 2 ? this.viewHeight : 1) *
                    this.settings.wheelSpeed;
                if (event.shiftKey && !event.deltaX) this.camera.tx += event.deltaY * factor;
                else {
                    this.camera.tx += event.deltaX * factor;
                    this.camera.ty += event.deltaY * factor;
                }
                this.pointer.active = false;
                this.clampCamera();
            },
            { signal, passive: false },
        );
        this.dialog.addEventListener(
            "focusin",
            (event) => {
                const id = event.target.dataset.serverOpen || event.target.dataset.pin;
                if (id && !this.pointer.active) this.centerBubble(id, false);
            },
            { signal },
        );
        this.root.addEventListener(
            "contextmenu",
            (event) => {
                if (event.target.closest(".sb-card, .sb-context, input")) return;
                event.preventDefault();
                this.openSpaceContext(event.clientX, event.clientY);
            },
            { signal },
        );
        window.addEventListener(
            "blur",
            () => {
                this.pointer.active = false;
            },
            { signal },
        );
        window.addEventListener(
            "resize",
            () => {
                cancelAnimationFrame(this.layoutFrame || 0);
                this.layoutFrame = requestAnimationFrame(() => {
                    this.layoutFrame = null;
                    this.layoutBubbles(false);
                });
            },
            { signal },
        );
        document.addEventListener(
            "visibilitychange",
            () => {
                cancelAnimationFrame(this.motionFrame || 0);
                this.motionFrame = null;
                this.pointer.active = false;
                if (!document.hidden) this.startMotion();
            },
            { signal },
        );
        this.motionPreference.addEventListener(
            "change",
            (event) => {
                this.reducedMotion = this.settings.respectReducedMotion && event.matches;
                this.root.dataset.reduced = String(this.reducedMotion);
            },
            { signal },
        );
    }

    makeRipple(x, y) {
        if (this.reducedMotion || !this.settings.clickRipples || !this.root) return;
        if (this.root.querySelectorAll(".sb-water-ripple").length >= 5) return;
        const ripple = el("i", "sb-water-ripple");
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        this.root.append(ripple);
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    }

    getVisibleGuilds() {
        const query = normalizeText(this.query).trim();
        const guilds = (this.guilds || []).filter(
            (guild) =>
                !query ||
                normalizeText(
                    `${guild.name} ${guild.folder?.name || ""} ${guild.guild.acronym || ""}`,
                ).includes(query),
        );
        const recent = new Map(this.settings.recent.map((id, index) => [id, index]));
        const filtered = guilds.filter((guild) =>
            this.filter === "favorites"
                ? guild.favorite
                : this.filter === "unread"
                  ? guild.unread || guild.mentions
                  : this.filter === "recent"
                    ? recent.has(guild.id)
                    : true,
        );
        guilds.splice(0, guilds.length, ...filtered);
        if (this.settings.sort === "recent")
            guilds.sort((a, b) => (recent.get(a.id) ?? 999) - (recent.get(b.id) ?? 999) || a.order - b.order);
        if (this.settings.sort === "name")
            guilds.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
        if (this.settings.sort === "unread")
            guilds.sort(
                (a, b) => b.mentions - a.mentions || Number(b.unread) - Number(a.unread) || a.order - b.order,
            );
        if (this.settings.favoritesFirst) guilds.sort((a, b) => Number(b.favorite) - Number(a.favorite));
        return guilds;
    }

    renderResults(reset = false) {
        if (!this.root) return;
        const focusId = document.activeElement?.dataset.serverOpen || document.activeElement?.dataset.pin;
        this.visibleGuilds = this.getVisibleGuilds();
        this.resultsCount.textContent = `${this.visibleGuilds.length} servers${this.query ? " found" : " in your space"}`;
        this.grid.replaceChildren(...this.visibleGuilds.map((guild, index) => this.guildCard(guild, index)));
        if (!this.visibleGuilds.length) {
            const empty = el("div", "sb-empty");
            empty.append(
                icon("bubbles"),
                el(
                    "h2",
                    "",
                    this.query
                        ? "No bubbles here"
                        : this.filter !== "all"
                          ? "No servers in this view"
                          : "Your next space awaits",
                ),
                el(
                    "p",
                    "",
                    this.query
                        ? "Try another server name or folder."
                        : this.filter !== "all"
                          ? "Right-click empty space and choose All servers to see your other places."
                          : "Join a server to see it float here.",
                ),
            );
            this.grid.append(empty);
        }
        this.layoutBubbles(reset);
        if (focusId && this.visibleGuilds.some((g) => g.id === focusId)) this.focusBubble(focusId);
    }

    layoutBubbles(reset = false) {
        if (!this.grid || !this.visibleGuilds) return;
        const focusedId = document.activeElement?.dataset.serverOpen || document.activeElement?.dataset.pin;
        const previous = new Map((this.nodes || []).map((node) => [node.id, node]));
        const oldWorld = {
            x: Math.max(1, (this.worldWidth || innerWidth) - (this.viewWidth || innerWidth)),
            y: Math.max(1, (this.worldHeight || innerHeight) - (this.viewHeight || innerHeight)),
        };
        const ratio = { x: this.camera.tx / oldWorld.x, y: this.camera.ty / oldWorld.y };
        this.viewWidth = this.previewSize?.width || innerWidth;
        this.viewHeight = this.previewSize?.height || innerHeight;
        const base = this.settings.bubbleSize * (this.isPreview ? 0.85 : this.viewWidth < 500 ? 0.8 : 1);
        const gap = this.settings.spacing,
            edge = this.isPreview ? 24 : 94,
            idleScale = this.settings.idleScale;
        const diameters = this.visibleGuilds.map((guild) => {
            const seed = this.hash(guild.id);
            return (
                base +
                (guild.id === this.selectedId
                    ? 40
                    : guild.favorite
                      ? 28
                      : guild.mentions && this.settings.showUnread
                        ? 18
                        : [0, 8, 16][seed % 3])
            );
        });
        const area = diameters.reduce(
            (sum, diameter) => sum + Math.pow(diameter * idleScale + gap, 2) * 0.91,
            0,
        );
        const aspect = Math.max(0.8, Math.min(1.65, this.viewWidth / this.viewHeight));
        this.worldWidth = Math.max(this.viewWidth, Math.sqrt(area * aspect) + edge * 2);
        const placed = [];
        const cards = [...this.grid.querySelectorAll(".sb-card")];
        for (let index = 0; index < cards.length; index++) {
            const guild = this.visibleGuilds[index],
                card = cards[index],
                r = diameters[index] / 2,
                restingRadius = r * idleScale;
            let best = { x: edge + restingRadius, y: Infinity };
            const right = this.worldWidth - edge - restingRadius;
            for (let x = edge + restingRadius; x <= right + 1; x += 4) {
                let y = edge + restingRadius;
                for (const other of placed) {
                    const dx = Math.abs(x - other.x),
                        distance = restingRadius + other.r * idleScale + gap;
                    if (dx < distance) y = Math.max(y, other.y + Math.sqrt(distance * distance - dx * dx));
                }
                if (y < best.y - 0.01) best = { x, y };
            }
            const old = previous.get(guild.id);
            const node = {
                ...best,
                r,
                id: guild.id,
                card,
                seed: this.hash(guild.id),
                ox: 0,
                oy: 0,
                driftX: old?.driftX || 0,
                driftY: old?.driftY || 0,
                vx: old?.vx || 0,
                vy: old?.vy || 0,
                scale: old?.scale || idleScale,
                sv: old?.sv || 0,
                wobble: 0,
                wv: 0,
                near: false,
            };
            placed.push(node);
            card.style.width = card.style.height = `${r * 2}px`;
            card.style.setProperty("--sb-diameter", `${r * 2}px`);
            card.style.setProperty("--sb-label-size", `${Math.max(11, Math.min(14, r * 0.15))}px`);
            card.style.setProperty("--sb-logo-size", `${Math.max(32, Math.min(49, r * 0.49))}px`);
        }
        const bottom = placed.length
            ? Math.max(...placed.map((node) => node.y + node.r * idleScale)) + edge
            : this.viewHeight;
        this.worldHeight = Math.max(this.viewHeight, bottom);
        // Center a small set of results; leave generous breathing room at every edge.
        const rightmost = placed.length
            ? Math.max(...placed.map((node) => node.x + node.r * idleScale)) + edge
            : this.viewWidth;
        if (rightmost < this.viewWidth) for (const node of placed) node.x += (this.viewWidth - rightmost) / 2;
        if (bottom < this.viewHeight) for (const node of placed) node.y += (this.viewHeight - bottom) / 2;
        this.nodes = this.bubbleLayout = placed;
        // Reserve room for a full-size focus expansion at the edges of overview.
        this.hoverPadding = Math.max(
            0,
            ...placed.map((node) => node.r * (this.settings.hoverScale * 1.94 - idleScale) * 1.12 - edge + 8),
        );
        if (reset) {
            const current = placed.find((node) => node.id === this.selectedId) || placed[0];
            this.camera.tx = current ? current.x - this.viewWidth / 2 : 0;
            this.camera.ty = current ? current.y - this.viewHeight / 2 : 0;
        } else {
            this.camera.tx = ratio.x * Math.max(0, this.worldWidth - this.viewWidth);
            this.camera.ty = ratio.y * Math.max(0, this.worldHeight - this.viewHeight);
        }
        this.clampCamera();
        this.camera.x = this.camera.tx;
        this.camera.y = this.camera.ty;
        if (focusedId && !this.pointer.active) this.centerBubble(focusedId, true);
        this.paintNodes(performance.now(), 0);
    }

    hash(value) {
        return [...value].reduce((result, char) => (result * 31 + char.charCodeAt(0)) >>> 0, 0);
    }

    clampCamera() {
        if (!this.camera) return;
        this.camera.tx = Math.max(0, Math.min(Math.max(0, this.worldWidth - this.viewWidth), this.camera.tx));
        this.camera.ty = Math.max(
            0,
            Math.min(Math.max(0, this.worldHeight - this.viewHeight), this.camera.ty),
        );
    }

    centerBubble(id, immediate = false) {
        const node = this.nodes?.find((item) => item.id === id);
        if (!node) return;
        this.focusedBubble = id;
        this.pointer.active = false;
        this.camera.tx = node.x + node.ox - this.viewWidth / 2;
        this.camera.ty = node.y + node.oy - this.viewHeight / 2;
        this.clampCamera();
        if (immediate || this.reducedMotion) {
            this.camera.x = this.camera.tx;
            this.camera.y = this.camera.ty;
        }
        node.card.style.visibility = "visible";
    }

    focusBubble(id) {
        if (!id) return;
        this.centerBubble(id, true);
        this.paintNodes(performance.now(), 0);
        this.grid.querySelector(`[data-server-open="${id}"]`)?.focus({ preventScroll: true });
    }

    startMotion() {
        if (this.motionFrame || !this.root || this.closing || document.hidden) return;
        if (this.isPreview && (!this.previewVisible || this.sceneCovered)) return;
        this.lastFrame = this.lastUpdate = performance.now();
        const frame = (now) => {
            this.motionFrame = null;
            if (!this.root || this.closing || document.hidden) return;
            if (this.isPreview && !this.root.isConnected) {
                this.onPreviewDetached?.();
                return;
            }
            // Do not run at a 144/240Hz monitor's full refresh rate. Idle water
            // can update less often; interaction still gets a 60Hz budget.
            const interval =
                1000 /
                (this.pointer.active ||
                this.focusedBubble ||
                Math.abs(this.camera.tx - this.camera.x) > 1 ||
                Math.abs(this.camera.ty - this.camera.y) > 1
                    ? this.settings.fps
                    : this.settings.idleFps);
            const elapsed = now - this.lastFrame;
            if (elapsed >= interval - 0.8) {
                const dt = Math.max(0, Math.min(0.04, (now - this.lastUpdate) / 1000));
                this.lastFrame = now - Math.max(0, elapsed % interval);
                this.lastUpdate = now;
                this.paintNodes(now, dt);
            }
            this.motionFrame = requestAnimationFrame(frame);
        };
        this.motionFrame = requestAnimationFrame(frame);
    }

    paintNodes(now, dt) {
        if (!this.nodes || !this.camera || !this.root) return;
        const pointer = this.pointer,
            camera = this.camera;
        const active = pointer.active && !this.context && !this.overControl && this.searchBox.hidden;
        const animated = !this.reducedMotion;
        const topInset = this.isPreview ? 18 : 104;
        const reservedHeight = this.isPreview ? 36 : 144;
        const zoom = this.isPreview
            ? Math.min(1, (this.viewWidth - 24) / this.worldWidth, (this.viewHeight - 36) / this.worldHeight)
            : this.overview
              ? Math.min(
                    1,
                    (this.viewWidth - 44) / (this.worldWidth + this.hoverPadding * 2),
                    (this.viewHeight - reservedHeight) / (this.worldHeight + this.hoverPadding * 2),
                )
              : 1;
        this.renderZoom = zoom;
        const ease = dt ? 1 - Math.exp(-dt * 8) : 1;
        if (active && dt && !this.overview && this.settings.edgePan) {
            // A quiet middle, a continuous glide at the edges: no mouse button required.
            const edge = Math.min(240, this.viewWidth * 0.26, this.viewHeight * 0.28);
            const velocity = (position, length) =>
                position < edge
                    ? -Math.pow(1 - position / edge, 2)
                    : position > length - edge
                      ? Math.pow(1 - (length - position) / edge, 2)
                      : 0;
            const hovered = this.nodes.find((node) => {
                if (node.id !== pointer.intentId) return false;
                const x = node.x + node.ox - camera.x + camera.px,
                    y = node.y + node.oy - camera.y + camera.py;
                return Math.hypot(pointer.x - x, pointer.y - y) < node.r * node.scale * 0.88;
            });
            // Brake over the middle of a bubble so it is easy to click. A deliberate
            // move toward an edge resumes travel immediately; no chasing the target.
            const atOuterEdge =
                Math.min(pointer.x, this.viewWidth - pointer.x, pointer.y, this.viewHeight - pointer.y) < 28;
            const braking =
                hovered &&
                !atOuterEdge &&
                (now - pointer.stamp > 70 || Math.hypot(pointer.vx, pointer.vy) < 220)
                    ? 0
                    : 1;
            camera.tx += velocity(pointer.x, this.viewWidth) * this.settings.panSpeed * dt * braking;
            camera.ty += velocity(pointer.y, this.viewHeight) * this.settings.panSpeed * dt * braking;
            if (!braking) {
                camera.tx = camera.x;
                camera.ty = camera.y;
            }
            this.clampCamera();
        }
        camera.x += (camera.tx - camera.x) * (animated ? ease : 1);
        camera.y += (camera.ty - camera.y) * (animated ? ease : 1);
        const parallaxX =
            active && animated && this.settings.parallax ? (pointer.x / this.viewWidth - 0.5) * -10 : 0;
        const parallaxY =
            active && animated && this.settings.parallax ? (pointer.y / this.viewHeight - 0.5) * -8 : 0;
        camera.px += (parallaxX - camera.px) * ease;
        camera.py += (parallaxY - camera.py) * ease;
        const offsetX = this.overview ? (this.viewWidth - this.worldWidth * zoom) / 2 : -camera.x;
        const offsetY = this.overview
            ? topInset + (this.viewHeight - reservedHeight - this.worldHeight * zoom) / 2
            : -camera.y;
        const motion = animated && this.settings.softMotion;
        // Pick one visual target before changing sizes. Preferring the actual
        // pointer target keeps overlapping, enlarged bubbles from competing.
        let hotId = active ? null : this.focusedBubble;
        if (active) {
            let nearest = Infinity;
            for (const node of this.nodes) {
                const x = (node.x + node.ox) * zoom + offsetX + camera.px,
                    y = (node.y + node.oy) * zoom + offsetY + camera.py;
                const distance = Math.hypot(pointer.x - x, pointer.y - y);
                if (distance > node.r * zoom * node.scale + this.settings.hoverReach) continue;
                if (node.id === pointer.intentId) {
                    hotId = node.id;
                    break;
                }
                const score = distance / node.r;
                if (score < nearest) {
                    nearest = score;
                    hotId = node.id;
                }
            }
        }
        for (const node of this.nodes) {
            const x = (node.x + node.ox) * zoom + offsetX + camera.px,
                y = (node.y + node.oy) * zoom + offsetY + camera.py;
            const dx = pointer.x - x,
                dy = pointer.y - y,
                distance = Math.hypot(dx, dy);
            const proximity = active
                ? Math.max(0, 1 - Math.max(0, distance - node.r * zoom * 0.5) / (node.r * zoom + 85))
                : 0;
            const hot = node.id === hotId;
            const near = hot || (!hotId && proximity > 0.65);
            if (near && !node.near && animated) node.wv += 1.2 * this.settings.wobble;
            if (!near && node.near && animated) node.wv -= 0.65 * this.settings.wobble;
            node.near = near;
            // The compact size is also the resting size; only the focus expands.
            const idleScale = this.settings.idleScale;
            const hoverScale = this.settings.hoverScale;
            const targetScale = !animated
                ? idleScale
                : hot
                  ? this.overview
                      ? Math.min(hoverScale * 1.94, Math.max(hoverScale * 1.15, (hoverScale * 0.94) / zoom))
                      : hoverScale
                  : idleScale;
            if (dt) {
                node.sv +=
                    ((targetScale - node.scale) * 150 * this.settings.responsiveness ** 2 -
                        node.sv * 17 * this.settings.responsiveness) *
                    dt;
                node.scale += node.sv * dt;
                node.wv += (-node.wobble * 150 - node.wv * 9) * dt;
                node.wobble += node.wv * dt;
            }
            if (!animated) {
                node.scale = idleScale;
                node.wobble = 0;
            }
            const phase = (now / 1000) * (0.38 + (node.seed % 5) * 0.025) + (node.seed % 60);
            // Keep ambient drift inside the packing gap. Cursor parallax moves
            // the whole field together, so resting neighbors cannot drift through each other.
            const driftLimit = Math.min(2 * this.settings.drift, this.settings.spacing / 4);
            const targetX = motion && !hot ? Math.sin(phase) * driftLimit * 0.6 : 0;
            const targetY = motion && !hot ? Math.cos(phase * 0.87) * driftLimit * 0.75 : 0;
            if (dt) {
                node.vx += ((targetX - node.driftX) * 20 - node.vx * 7) * dt;
                node.vy += ((targetY - node.driftY) * 20 - node.vy * 7) * dt;
                node.driftX = Math.max(-driftLimit, Math.min(driftLimit, node.driftX + node.vx * dt));
                node.driftY = Math.max(-driftLimit, Math.min(driftLimit, node.driftY + node.vy * dt));
            }
            if (!animated) node.driftX = node.driftY = 0;
            node.hot = hot;
            node.proximity = proximity;
            node.fx = node.x + node.driftX;
            node.fy = node.y + node.driftY;
            // Enclose the squish/stretch ellipse in a circle, including its peak wobble.
            node.radius = node.r * node.scale * Math.max(1 + node.wobble, 1 - node.wobble * 0.8);
        }
        // Expanding a circle adds its exact extra radius to every surrounding
        // center's radial distance. This mapping never shortens any other pair's
        // separation. Composing it for the few still-expanding circles preserves
        // clearance during rapid hover changes, with no iterative collision solver.
        for (const source of this.nodes) {
            const expansion = source.radius - source.r * this.settings.idleScale;
            if (expansion <= 0.001) continue;
            const cx = source.fx,
                cy = source.fy;
            for (const node of this.nodes) {
                if (node === source) continue;
                const dx = node.fx - cx,
                    dy = node.fy - cy;
                const factor = expansion / Math.max(0.001, Math.hypot(dx, dy));
                node.fx += dx * factor;
                node.fy += dy * factor;
            }
        }
        for (const node of this.nodes) {
            node.ox = node.fx - node.x;
            node.oy = node.fy - node.y;
        }
        for (const node of this.nodes) {
            const x = (node.x + node.ox) * zoom + offsetX + camera.px,
                y = (node.y + node.oy) * zoom + offsetY + camera.py;
            const visible =
                x + node.radius * zoom > 0 &&
                y + node.radius * zoom > 0 &&
                x - node.radius * zoom < this.viewWidth &&
                y - node.radius * zoom < this.viewHeight;
            if (visible !== node.paintedVisible) {
                node.card.style.visibility = visible ? "visible" : "hidden";
                node.paintedVisible = visible;
            }
            if (!visible) continue;
            const tilt =
                animated && active
                    ? Math.max(-4, Math.min(4, ((pointer.x - x) / node.r) * node.proximity * 2))
                    : 0;
            const shape = `scale(${(zoom * node.scale * (1 + node.wobble)).toFixed(3)}, ${(zoom * node.scale * (1 - node.wobble * 0.8)).toFixed(3)}) rotate(${tilt.toFixed(1)}deg)`;
            // One cached composited layer handles position, swelling and wobble.
            // Scaling a child of a moving layer would rerasterize its parent.
            if (
                !node.paintedPosition ||
                Math.abs(x - node.paintedPosition.x) > 0.15 ||
                Math.abs(y - node.paintedPosition.y) > 0.15 ||
                shape !== node.paintedShape
            ) {
                node.card.style.transform = `translate3d(${(x - node.r).toFixed(2)}px, ${(y - node.r).toFixed(2)}px, 0) ${shape}`;
                node.paintedPosition = { x, y };
                node.paintedShape = shape;
            }
            const layer = node.hot ? "12" : String(1 + Math.round(node.proximity * 8));
            if (layer !== node.paintedLayer) {
                node.card.style.zIndex = layer;
                node.paintedLayer = layer;
            }
            if (node.near !== node.paintedNear) {
                node.card.classList.toggle("sb-is-near", node.near);
                node.paintedNear = node.near;
            }
        }
        if (this.locationIndicator) {
            this.locationIndicator.style.setProperty(
                "--position-x",
                `${8 + (camera.x / Math.max(1, this.worldWidth - this.viewWidth)) * 40}px`,
            );
            this.locationIndicator.style.setProperty(
                "--position-y",
                `${6 + (camera.y / Math.max(1, this.worldHeight - this.viewHeight)) * 22}px`,
            );
            this.locationIndicator.hidden =
                this.overview || (this.worldWidth <= this.viewWidth && this.worldHeight <= this.viewHeight);
        }
        pointer.vx *= 0.9;
        pointer.vy *= 0.9;
    }

    guildIcon(guild, className) {
        const shell = el("span", className);
        const hash = [...guild.id].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0);
        shell.style.setProperty("--sb-hue", String([208, 218, 230, 245, 188][hash % 5]));
        const initials =
            guild.guild.acronym ||
            guild.name
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => Array.from(word)[0] || "")
                .join("");
        shell.append(el("span", "sb-initials", Array.from(initials).slice(0, 3).join("")));
        const url =
            safe(
                () =>
                    this.iconUtils.getGuildIconURL({
                        id: guild.id,
                        icon: guild.guild.icon,
                        size: 128,
                        canAnimate: false,
                    }),
                null,
            ) ||
            (guild.guild.icon && /^[a-zA-Z0-9_]+$/.test(guild.guild.icon)
                ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.guild.icon}.webp?size=128`
                : null);
        if (url && typeof url === "string" && /^https:\/\/(cdn|media)\.discordapp\.(com|net)\//.test(url)) {
            const image = el("img", "sb-server-image");
            image.src = url;
            image.alt = "";
            image.loading = "lazy";
            image.decoding = "async";
            image.draggable = false;
            image.onerror = () => image.remove();
            shell.append(image);
        }
        return shell;
    }

    guildCard(guild, index) {
        const card = el("article", `sb-card${guild.id === this.selectedId ? " sb-card-current" : ""}`);
        card.dataset.guild = guild.id;
        card.classList.toggle("sb-card-favorite", guild.favorite);
        card.style.setProperty("--sb-index", String(Math.min(index, 16)));
        const palette = [194, 209, 224, 183, 245, 204, 169];
        card.style.setProperty("--sb-hue", String(palette[this.hash(guild.id) % palette.length]));
        const motion = el("div", "sb-bubble-motion");
        const open = button(
            `Open ${guild.name}${guild.mentions && this.settings.showUnread ? `, ${guild.mentions} mentions` : ""}`,
            "sb-server-open",
        );
        open.dataset.serverOpen = guild.id;
        open.removeAttribute("title");
        const orbit = el("span", "sb-orbit");
        orbit.append(this.guildIcon(guild, "sb-server-icon"));
        const name = el("span", "sb-server-name", guild.name);
        const status =
            guild.id === this.selectedId
                ? "You're here"
                : guild.mentions && this.settings.showUnread
                  ? `${guild.mentions} new mentions`
                  : guild.unread && this.settings.showUnread
                    ? "New messages"
                    : guild.favorite
                      ? "Favorite space"
                      : guild.folder?.name || "Your community";
        open.append(orbit, name, el("span", "sb-server-status", status));
        open.onclick = () => this.navigate(guild.id);
        open.oncontextmenu = (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.openContext(guild, event.clientX, event.clientY, open);
        };
        open.onkeydown = (event) => {
            if ((event.shiftKey && event.key === "F10") || event.key === "ContextMenu") {
                event.preventDefault();
                const rect = open.getBoundingClientRect();
                this.openContext(guild, rect.left + rect.width / 2, rect.top + rect.height / 2, open);
            }
        };
        if (guild.id === this.selectedId) {
            const mark = el("span", "sb-active-mark");
            mark.append(icon("check"));
            motion.append(mark);
            open.setAttribute("aria-current", "page");
        }
        if (this.settings.showUnread && (guild.mentions || guild.unread)) {
            const badge = el(
                "span",
                guild.mentions ? "sb-mention" : "sb-unread-dot",
                guild.mentions ? (guild.mentions > 99 ? "99+" : String(guild.mentions)) : undefined,
            );
            badge.setAttribute("aria-hidden", "true");
            motion.append(badge);
            card.classList.add("sb-card-unread");
        }
        const pin = button(
            guild.favorite ? `Unpin ${guild.name}` : `Favorite ${guild.name}`,
            `sb-pin${guild.favorite ? " sb-is-pinned" : ""}`,
            "star",
        );
        pin.dataset.pin = guild.id;
        pin.setAttribute("aria-pressed", String(guild.favorite));
        pin.onclick = () => this.toggleFavorite(guild.id);
        motion.prepend(open);
        motion.append(pin);
        card.append(motion);
        return card;
    }

    openSpaceContext(x, y) {
        this.closeContext(false);
        this.contextOpener = this.dialog;
        this.context = el("div", "sb-context");
        this.context.setAttribute("role", "menu");
        this.context.setAttribute("aria-label", "Bubble space actions");
        const filters = [
            ["all", "All servers"],
            ["favorites", "Favorites only"],
            ["unread", "Unread servers"],
            ["recent", "Recent servers"],
        ];
        const actions = filters.map(([value, label]) => [
            label,
            this.filter === value ? "check" : "bubbles",
            () => {
                this.filter = value;
                this.renderResults(true);
            },
        ]);
        actions.push(["Customize bubbles", "more", () => this.openStudio()]);
        actions.push(
            ["Find a server", "search", () => this.showSearch()],
            ["Direct messages", "home", () => this.navigate("@me")],
            [
                "Discover servers",
                "bubbles",
                () => {
                    try {
                        this.transition("/guild-discovery");
                        this.close(true);
                    } catch {
                        BdApi.UI.showToast("Couldn't open Discover", { type: "error" });
                    }
                },
            ],
            [
                "Add a server",
                "plus",
                () => {
                    const native = document.querySelector(
                        '.guilds__5e434 [aria-label="Add a Server"], .guilds__5e434 [data-list-item-id*="create-join"], nav[aria-label="Servers sidebar"] [aria-label="Add a Server"]',
                    );
                    if (native) {
                        this.close(true);
                        native.click();
                    } else
                        BdApi.UI.showToast(
                            "The Add Server control is unavailable. Enable the normal server list in this plugin's settings to use it.",
                            { type: "info" },
                        );
                },
            ],
        );
        for (const [label, symbol, action] of actions) {
            const item = button(label, "sb-context-item", symbol);
            item.setAttribute("role", "menuitem");
            item.append(el("span", "", label));
            item.onclick = () => {
                this.closeContext(false);
                action();
            };
            this.context.append(item);
        }
        this.root.append(this.context);
        const rect = this.context.getBoundingClientRect();
        this.context.style.left = `${Math.max(8, Math.min(x, innerWidth - rect.width - 8))}px`;
        this.context.style.top = `${Math.max(8, Math.min(y, innerHeight - rect.height - 8))}px`;
        this.context.querySelector("button").focus();
    }

    toggleFavorite(id) {
        if (this.settings.favorites.includes(id))
            this.settings.favorites = this.settings.favorites.filter((item) => item !== id);
        else this.settings.favorites.push(id);
        this.save();
        this.refreshData();
    }

    navigate(id) {
        try {
            const channelId = id === "@me" ? null : safe(() => this.channelStore.getChannelId(id), null);
            const route =
                id === "@me"
                    ? "/channels/@me"
                    : `/channels/${id}${channelId && /^\d+$/.test(channelId) ? `/${channelId}` : ""}`;
            this.transition(route);
            if (id !== "@me") {
                this.settings.recent = [id, ...this.settings.recent.filter((item) => item !== id)].slice(
                    0,
                    20,
                );
                this.save();
            }
            this.close(true);
        } catch (error) {
            this.api.Logger?.error("Server navigation failed", error);
            this.errorLabel.hidden = false;
            this.errorLabel.textContent =
                "Couldn't open this server. Try again, or enable the normal server list in this plugin's settings.";
        }
    }

    openContext(guild, x, y, opener) {
        this.closeContext(false);
        this.contextOpener = opener;
        this.context = el("div", "sb-context");
        this.context.setAttribute("role", "menu");
        this.context.setAttribute("aria-label", `${guild.name} actions`);
        const actions = [
            ["Open server", "arrow", () => this.navigate(guild.id)],
            [
                guild.favorite ? "Remove from favorites" : "Add to favorites",
                "star",
                () => this.toggleFavorite(guild.id),
            ],
            [
                "Copy server ID",
                "copy",
                () => {
                    try {
                        require("electron").clipboard.writeText(guild.id);
                        BdApi.UI.showToast("Server ID copied", { type: "success" });
                    } catch {
                        navigator.clipboard
                            .writeText(guild.id)
                            .catch(() => BdApi.UI.showToast("Couldn't copy server ID", { type: "error" }));
                    }
                },
            ],
        ];
        for (const [label, symbol, action] of actions) {
            const item = button(label, "sb-context-item", symbol);
            item.setAttribute("role", "menuitem");
            item.append(el("span", "", label));
            item.onclick = () => {
                this.closeContext(false);
                action();
            };
            this.context.append(item);
        }
        this.root.append(this.context);
        const rect = this.context.getBoundingClientRect();
        this.context.style.left = `${Math.max(8, Math.min(x, innerWidth - rect.width - 8))}px`;
        this.context.style.top = `${Math.max(8, Math.min(y, innerHeight - rect.height - 8))}px`;
        this.context.querySelector("button").focus();
    }

    closeContext(restoreFocus = true) {
        if (!this.context) return;
        this.context.remove();
        this.context = null;
        if (restoreFocus && this.contextOpener?.isConnected) this.contextOpener.focus();
        this.contextOpener = null;
    }

    onKeyDown(event) {
        if (this.shortcutMatches(event)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.root ? this.close() : this.open();
            return;
        }
        if (!this.root || this.closing) return;
        if (event.key === "Escape") {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (this.context) this.closeContext();
            else if (!this.searchBox.hidden) this.hideSearch();
            else this.close();
            return;
        }
        if (event.isComposing) return;
        const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "");
        if ((!typing && event.key === "/") || (event.ctrlKey && event.key.toLowerCase() === "f")) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.showSearch();
            return;
        }
        if (
            !typing &&
            !this.context &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey &&
            event.key.length === 1 &&
            /[\p{L}\p{N}]/u.test(event.key)
        ) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.showSearch(event.key);
            return;
        }
        if (this.context && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            const items = [...this.context.querySelectorAll("button")],
                index = items.indexOf(document.activeElement);
            const next =
                event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? items.length - 1
                      : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
            event.preventDefault();
            event.stopImmediatePropagation();
            items[next].focus();
            return;
        }
        if (event.key === "Tab") {
            const scope = this.context || this.dialog;
            const focusable = [
                ...scope.querySelectorAll("button:not(:disabled), input, [tabindex='0']"),
            ].filter(
                (item) => item.getClientRects().length && getComputedStyle(item).visibility !== "hidden",
            );
            const index = focusable.indexOf(document.activeElement);
            if (
                index < 0 ||
                (!event.shiftKey && index === focusable.length - 1) ||
                (event.shiftKey && index === 0)
            ) {
                event.preventDefault();
                focusable[event.shiftKey ? focusable.length - 1 : 0]?.focus();
            }
            this.pointer.active = false;
            event.stopPropagation();
            return;
        }
        const cards = [...this.grid.querySelectorAll("[data-server-open]")],
            index = cards.indexOf(document.activeElement);
        if (
            (document.activeElement === this.search || document.activeElement === this.dialog) &&
            event.key === "ArrowDown" &&
            cards.length
        ) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.focusBubble(cards[0].dataset.serverOpen);
            return;
        }
        if (
            index >= 0 &&
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)
        ) {
            let next = index;
            if (event.key === "Home") next = 0;
            else if (event.key === "End") next = cards.length - 1;
            else {
                const current = this.nodes[index],
                    direction = {
                        ArrowLeft: [-1, 0],
                        ArrowRight: [1, 0],
                        ArrowUp: [0, -1],
                        ArrowDown: [0, 1],
                    }[event.key];
                let best = Infinity;
                for (let candidate = 0; candidate < this.nodes.length; candidate++) {
                    if (candidate === index) continue;
                    const target = this.nodes[candidate],
                        dx = target.x - current.x,
                        dy = target.y - current.y;
                    const forward = dx * direction[0] + dy * direction[1];
                    if (forward < 8) continue;
                    const cross = Math.abs(dx * direction[1] - dy * direction[0]);
                    const score = Math.hypot(dx, dy) * (1 + cross / forward);
                    if (score < best) {
                        best = score;
                        next = candidate;
                    }
                }
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            this.focusBubble(cards[next].dataset.serverOpen);
        }
    }

    close(immediate = false) {
        if (!this.root) return;
        if (immediate) {
            this.finishClose();
            return;
        }
        if (this.closing) return;
        this.closing = true;
        this.root.classList.add("sb-is-closing");
        cancelAnimationFrame(this.motionFrame || 0);
        this.motionFrame = null;
        this.closeTimer = setTimeout(() => this.finishClose(), this.reducedMotion ? 0 : 220);
    }

    finishClose() {
        clearTimeout(this.closeTimer);
        cancelAnimationFrame(this.openFrame || 0);
        cancelAnimationFrame(this.layoutFrame || 0);
        cancelAnimationFrame(this.motionFrame || 0);
        this.layoutFrame = this.motionFrame = this.openFrame = null;
        this.nodes = this.bubbleLayout = [];
        this.visibleGuilds = null;
        this.closeContext(false);
        this.modalAbort?.abort();
        this.root?.remove();
        this.root = null;
        this.closing = false;
        for (const studio of this.studios) {
            studio.preview.sceneCovered = false;
            if (!studio.paused) studio.preview.startMotion();
        }
        if (this.backgroundMount && !this.wasInert) this.backgroundMount.inert = false;
        this.backgroundMount = null;
        this.launcher?.setAttribute("aria-expanded", "false");
        if (this.previousFocus?.isConnected) this.previousFocus.focus({ preventScroll: true });
        this.previousFocus =
            this.focusedBubble =
            this.touchPan =
            this.pointer =
            this.camera =
            this.motionPreference =
                null;
        this.overControl = false;
        this.dialog =
            this.search =
            this.searchBox =
            this.grid =
            this.resultsCount =
            this.errorLabel =
            this.hint =
            this.locationIndicator =
            this.overviewButton =
                null;
    }

    getSettingsPanel() {
        for (const studio of [...this.studios]) {
            if (!studio.panel.isConnected) this.disposeStudioFor(studio.panel);
        }
        BdApi.DOM.addStyle("ServerBubblesStyles", this.getStyles());
        const panel = el("div", "sb-studio");
        const serial = (this.studioSerial = (this.studioSerial || 0) + 1);
        const studio = {
            panel,
            serial,
            abort: new AbortController(),
            active: "style",
            disposed: false,
            paused: false,
        };

        const header = el("header", "sb-studio-header");
        const identity = el("div", "sb-identity");
        const mark = el("span", "sb-brand-mark");
        mark.append(icon("bubbles"));
        mark.setAttribute("aria-hidden", "true");
        const heading = el("div");
        const title = el("h2", "", "bubbles.");
        title.setAttribute("aria-label", "Server Bubbles");
        heading.append(title, el("span", "sb-brand-caption", "Your servers, in motion."));
        identity.append(mark, heading);
        const open = button("Open server bubbles", "sb-studio-button sb-primary");
        open.append(el("span", "", "Launch space"), icon("arrow"));
        open.disabled = !this.started;
        open.onclick = () => this.open();
        header.append(identity, open);

        const playground = el("section", "sb-studio-hero");
        playground.setAttribute("aria-label", "Bubble playground");
        const toolbar = el("div", "sb-preview-bar");
        const playgroundTitle = el("span", "sb-playground-title", "Playground");
        playgroundTitle.append(el("span", "sb-playground-hint", "Hover to try it"));
        const live = el("span", "sb-playground-live", "Interactive");
        live.prepend(el("i", "sb-live-dot"));
        const pause = button("Pause preview", "sb-preview-pause", "pause");
        pause.setAttribute("aria-pressed", "false");
        pause.onclick = () => {
            studio.paused = !studio.paused;
            pause.setAttribute("aria-pressed", String(studio.paused));
            pause.setAttribute("aria-label", studio.paused ? "Resume preview" : "Pause preview");
            pause.title = studio.paused ? "Resume preview" : "Pause preview";
            pause.replaceChildren(icon(studio.paused ? "play" : "pause"));
            if (studio.paused) {
                cancelAnimationFrame(studio.preview.motionFrame || 0);
                studio.preview.motionFrame = null;
            } else studio.preview.startMotion();
        };
        toolbar.append(playgroundTitle, live, pause);

        const canvas = (studio.canvas = el("div", "sb-preview-canvas"));
        canvas.setAttribute("aria-label", "Interactive sample server bubbles");
        const atmosphere = el("div", "sb-atmosphere");
        atmosphere.setAttribute("aria-hidden", "true");
        for (let index = 0; index < 5; index++) {
            const light = el("i", "sb-bokeh");
            light.style.setProperty("--i", String(index));
            atmosphere.append(light);
        }
        const grid = el("div", "sb-world");
        canvas.append(atmosphere, grid);
        const meters = el("div", "sb-playground-meters");
        const meterValues = ["Resting size", "Focused size", "Frame limit"].map((label) => {
            const meter = el("div", "sb-meter"),
                value = el("strong", "sb-meter-value");
            meter.append(el("span", "sb-meter-label", label), value);
            meters.append(meter);
            return value;
        });
        playground.append(toolbar, canvas, meters);

        const looks = el("section", "sb-preset-section");
        looks.setAttribute("aria-label", "Style presets");
        const lookLabel = el("div", "sb-look-label");
        const currentLook = el("span", "sb-current-look");
        lookLabel.append(el("h3", "", "Quick looks"), currentLook);
        const presetGrid = el("div", "sb-preset-grid");
        for (const [id, preset] of Object.entries(PRESETS)) {
            const card = button(preset.name, "sb-preset");
            card.dataset.preset = id;
            card.title = `${preset.name} · ${preset.note}`;
            card.style.setProperty("--preset-a", preset.colors[0]);
            card.style.setProperty("--preset-b", preset.colors[1]);
            const orb = el("span", "sb-preset-orb");
            orb.setAttribute("aria-hidden", "true");
            card.append(orb, el("span", "sb-sr-only", preset.name));
            card.onclick = () => {
                this.rememberLook();
                this.updateSettings({ ...preset.settings, preset: id });
            };
            presetGrid.append(card);
        }
        looks.append(lookLabel, presetGrid);

        const workbench = el("div", "sb-workbench");
        const tabs = el("div", "sb-studio-tabs");
        tabs.setAttribute("role", "tablist");
        tabs.setAttribute("aria-label", "Customization sections");
        tabs.setAttribute("aria-orientation", "vertical");
        const body = el("div", "sb-studio-body");
        body.id = `sb-studio-body-${serial}`;
        body.setAttribute("role", "tabpanel");
        const names = {
            style: "Style",
            bubbles: "Bubbles",
            motion: "Motion",
            controls: "Controls",
            share: "Share",
        };
        const symbols = {
            style: "bubbles",
            bubbles: "grid",
            motion: "recent",
            controls: "more",
            share: "copy",
        };
        const selectTab = (id) => {
            studio.active = id;
            for (const tab of tabs.children) {
                const selected = tab.dataset.tab === id;
                tab.setAttribute("aria-selected", String(selected));
                tab.tabIndex = selected ? 0 : -1;
            }
            body.setAttribute("aria-labelledby", `sb-tab-${serial}-${id}`);
            body.replaceChildren();
            this.renderStudioSection(studio, body, id);
            studio.sync();
        };
        for (const [id, name] of Object.entries(names)) {
            const tab = button(name, "sb-studio-tab", symbols[id]);
            tab.append(el("span", "", name));
            tab.id = `sb-tab-${serial}-${id}`;
            tab.dataset.tab = id;
            tab.setAttribute("role", "tab");
            tab.setAttribute("aria-controls", body.id);
            tab.onclick = () => selectTab(id);
            tab.onkeydown = (event) => {
                if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
                    return;
                event.preventDefault();
                const order = Object.keys(names),
                    index = order.indexOf(studio.active);
                const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
                const next =
                    event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? order.length - 1
                          : (index + (forward ? 1 : -1) + order.length) % order.length;
                selectTab(order[next]);
                tabs.children[next].focus();
            };
            tabs.append(tab);
        }
        workbench.append(tabs, body);

        const footer = el("footer", "sb-studio-footer");
        const undo = button("Undo last look change", "sb-studio-button sb-quiet");
        undo.prepend(icon("recent"));
        undo.append(el("span", "", "Undo look"));
        undo.onclick = () => {
            if (this.previousLook) {
                const previous = this.previousLook;
                this.rememberLook();
                this.updateSettings(previous);
            }
        };
        footer.append(undo, el("span", "sb-studio-signature", "Server Bubbles / 4.1"));
        panel.append(header, playground, looks, workbench, footer);
        studio.sync = () => {
            for (const card of presetGrid.children)
                card.setAttribute("aria-pressed", String(card.dataset.preset === this.settings.preset));
            const name = PRESETS[this.settings.preset]?.name || "Custom mix";
            if (currentLook.textContent !== name) currentLook.textContent = name;
            const values = [
                `${Math.round(this.settings.idleScale * 100)}%`,
                `${Math.round(this.settings.hoverScale * 100)}%`,
                `${this.settings.fps} fps`,
            ];
            for (let index = 0; index < values.length; index++)
                if (meterValues[index].textContent !== values[index])
                    meterValues[index].textContent = values[index];
            for (const input of panel.querySelectorAll("[data-setting]")) {
                const value = this.settings[input.dataset.setting];
                if (input.type === "checkbox") input.checked = value;
                else if (document.activeElement !== input) input.value = String(value);
                input.updateOutput?.();
            }
            undo.disabled = !this.previousLook;
        };
        this.studios.add(studio);
        this.createStudioPreview(studio, grid);
        selectTab("style");
        return panel;
    }

    createStudioPreview(studio, grid) {
        const preview = (studio.preview = Object.create(Object.getPrototypeOf(this)));
        Object.assign(preview, {
            isPreview: true,
            root: studio.canvas,
            grid,
            settings: this.settings,
            camera: { x: 0, y: 0, tx: 0, ty: 0, px: 0, py: 0 },
            pointer: { x: 0, y: 0, active: false, vx: 0, vy: 0, stamp: 0 },
            searchBox: { hidden: true },
            overview: true,
            iconUtils: null,
            previewVisible: false,
            visibleGuilds: [],
            selectedId: "1",
            onPreviewDetached: () => this.disposeStudioFor(studio.panel),
        });
        preview.visibleGuilds = [
            "Orbit",
            "After Hours",
            "The Workshop",
            "Northstar",
            "Night Drive",
            "The Lounge",
            "Basecamp",
        ].map((name, index) => ({
            id: String(index + 1),
            name,
            mentions: index === 2 ? 3 : 0,
            unread: index === 2,
            favorite: index === 4,
            guild: {
                acronym: name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2),
            },
        }));
        preview.navigate = (id) => {
            preview.focusedBubble = id;
            preview.pointer.active = false;
            preview.grid.querySelector(`[data-server-open="${id}"]`)?.focus({ preventScroll: true });
        };
        preview.toggleFavorite = (id) => {
            const guild = preview.visibleGuilds.find((item) => item.id === id);
            guild.favorite = !guild.favorite;
            const card = preview.grid.querySelector(`[data-guild="${id}"]`);
            card.classList.toggle("sb-card-favorite", guild.favorite);
            const pin = card.querySelector(".sb-pin");
            pin.classList.toggle("sb-is-pinned", guild.favorite);
            pin.setAttribute("aria-pressed", String(guild.favorite));
        };
        preview.openContext = () => {};
        preview.grid.replaceChildren(
            ...preview.visibleGuilds.map((guild, index) => preview.guildCard(guild, index)),
        );
        studio.media = matchMedia("(prefers-reduced-motion: reduce)");
        preview.reducedMotion = this.settings.respectReducedMotion && studio.media.matches;
        this.applyAppearance(studio.canvas);
        studio.canvas.dataset.reduced = String(preview.reducedMotion);
        const signal = studio.abort.signal;
        studio.canvas.addEventListener(
            "pointermove",
            (event) => {
                const rect = studio.canvas.getBoundingClientRect();
                Object.assign(preview.pointer, {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                    active: true,
                    stamp: performance.now(),
                });
                preview.pointer.intentId =
                    event.target.closest("[data-server-open]")?.dataset.serverOpen ||
                    event.target.closest("[data-pin]")?.dataset.pin;
                preview.focusedBubble = null;
            },
            { signal },
        );
        studio.canvas.addEventListener(
            "pointerleave",
            () => {
                preview.pointer.active = false;
                preview.focusedBubble = null;
            },
            { signal },
        );
        studio.canvas.addEventListener(
            "focusin",
            (event) => {
                preview.pointer.active = false;
                preview.focusedBubble = event.target.dataset.serverOpen || event.target.dataset.pin;
            },
            { signal },
        );
        studio.media.addEventListener(
            "change",
            () => {
                preview.reducedMotion = this.settings.respectReducedMotion && studio.media.matches;
                studio.canvas.dataset.reduced = String(preview.reducedMotion);
            },
            { signal },
        );
        studio.resize = () => {
            if (studio.disposed) return;
            const rect = studio.canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            preview.previewSize = { width: rect.width, height: rect.height };
            preview.layoutBubbles(false);
            if (!studio.paused && !document.hidden) preview.startMotion();
        };
        studio.observer = new ResizeObserver(() => {
            if (!studio.panel.isConnected && studio.wasConnected) {
                this.disposeStudioFor(studio.panel);
                return;
            }
            if (studio.panel.isConnected) studio.wasConnected = true;
            cancelAnimationFrame(studio.resizeFrame || 0);
            studio.resizeFrame = requestAnimationFrame(studio.resize);
        });
        studio.observer.observe(studio.canvas);
        studio.intersection = new IntersectionObserver((entries) => {
            const visible = entries[0]?.isIntersecting;
            preview.previewVisible = Boolean(visible);
            if (!visible) {
                cancelAnimationFrame(preview.motionFrame || 0);
                preview.motionFrame = null;
            } else if (!studio.paused) preview.startMotion();
        });
        studio.intersection.observe(studio.canvas);
        document.addEventListener(
            "visibilitychange",
            () => {
                cancelAnimationFrame(preview.motionFrame || 0);
                preview.motionFrame = null;
                if (!document.hidden && !studio.paused) preview.startMotion();
            },
            { signal },
        );
    }

    renderStudioSection(studio, body, section) {
        const group = (title, description) => {
            const card = el("section", "sb-studio-card");
            card.append(el("h3", "", title));
            if (description) card.append(el("p", "sb-card-description", description));
            const fields = el("div", "sb-field-grid");
            card.append(fields);
            body.append(card);
            return fields;
        };
        const field = (parent, id, title, description, full = false) => {
            const label = el("label", `sb-field${full ? " sb-field-wide" : ""}`);
            const heading = el("span", "sb-field-title", title);
            label.append(heading);
            parent.append(label);
            return {
                label,
                heading,
                finish: (input) => {
                    input.dataset.setting = id;
                    input.setAttribute("aria-label", title);
                    label.append(input);
                    if (description) label.append(el("small", "sb-field-description", description));
                    return input;
                },
            };
        };
        const range = (
            parent,
            id,
            title,
            min,
            max,
            step,
            description,
            format = (value) => `${Math.round(value)}%`,
        ) => {
            const item = field(parent, id, title, description);
            const output = el("output", "sb-field-value");
            item.heading.append(output);
            const input = el("input", "sb-range");
            input.type = "range";
            input.min = String(min);
            input.max = String(max);
            input.step = String(step);
            input.value = String(this.settings[id]);
            input.updateOutput = () => {
                output.value = format(Number(input.value));
                output.textContent = output.value;
                input.style.setProperty("--fill", `${((Number(input.value) - min) / (max - min)) * 100}%`);
                input.setAttribute("aria-valuetext", output.value);
            };
            input.oninput = () => {
                input.updateOutput();
                this.updateSettings({ [id]: Number(input.value) });
            };
            item.finish(input);
            input.updateOutput();
        };
        const toggle = (parent, id, title, description) => {
            const item = field(parent, id, title, description, true);
            item.label.classList.add("sb-switch-row");
            const input = el("input", "sb-switch");
            input.type = "checkbox";
            input.checked = this.settings[id];
            input.onchange = () => this.updateSettings({ [id]: input.checked });
            item.finish(input);
        };
        const select = (parent, id, title, options, description) => {
            const item = field(parent, id, title, description);
            const input = el("select", "sb-select");
            for (const [value, label] of options) {
                const option = el("option", "", label);
                option.value = String(value);
                input.append(option);
            }
            input.value = String(this.settings[id]);
            input.onchange = () => {
                const value = typeof DEFAULTS[id] === "number" ? Number(input.value) : input.value;
                this.updateSettings(
                    id === "launcherCorner" ? { [id]: value, position: null } : { [id]: value },
                );
            };
            item.finish(input);
        };
        const color = (parent, id, title) => {
            const item = field(parent, id, title);
            const row = el("span", "sb-color-row");
            const input = el("input", "sb-color");
            input.type = "color";
            input.value = this.settings[id];
            input.dataset.setting = id;
            input.setAttribute("aria-label", title);
            const code = el("span", "sb-color-code", input.value.toUpperCase());
            input.updateOutput = () => {
                code.textContent = input.value.toUpperCase();
            };
            input.oninput = () => {
                input.updateOutput();
                this.updateSettings({ [id]: input.value });
            };
            row.append(input, code);
            item.label.append(row);
        };
        const percent = (value) => `${Math.round(value * 100)}%`;
        const pixels = (value) => `${Math.round(value)} px`;
        const multiplier = (value) => `${value.toFixed(2)}×`;

        if (section === "style") {
            const glass = group("Glass & color", "Choose a surface, then tune its light and color.");
            color(glass, "accent", "Accent color");
            color(glass, "secondary", "Atmosphere color");
            select(glass, "material", "Surface", [
                ["glass", "Liquid glass"],
                ["frost", "Frosted glass"],
                ["solid", "Solid"],
            ]);
            range(
                glass,
                "glassTint",
                "Glass tint",
                15,
                100,
                1,
                "Lower values let more of the scene through.",
            );
            range(glass, "sheen", "Reflections", 0, 100, 1, "The bright highlights along the glass.");
            range(glass, "glow", "Glow", 0, 150, 1, "A soft halo around each bubble.");
            toggle(
                glass,
                "multicolor",
                "Individual bubble colors",
                "Give servers their own hues, or use your accent on every bubble.",
            );
            const scene = group("Backdrop");
            select(
                scene,
                "background",
                "Background",
                [
                    ["theme", "Use my theme"],
                    ["cosmos", "Deep space"],
                    ["aero", "Aero gradient"],
                    ["midnight", "Midnight"],
                    ["custom", "My wallpaper"],
                ],
                "Built-in backgrounds work with any Discord theme.",
            );
            range(
                scene,
                "backgroundDim",
                "Background dimming",
                0,
                85,
                1,
                "Keep bright wallpapers comfortable to look at.",
            );
            toggle(
                scene,
                "ambientLights",
                "Atmosphere details",
                "Distant stars and faint glass orbs in built-in scenes.",
            );
            const wallpaper = el("div", "sb-field-wide sb-wallpaper-tools");
            const upload = el("label", "sb-studio-button");
            upload.append(el("span", "", "Choose wallpaper"));
            const file = el("input", "sb-file");
            file.type = "file";
            file.accept = "image/png,image/jpeg,image/webp";
            file.setAttribute("aria-label", "Choose wallpaper image");
            upload.append(file);
            const clear = button("Remove custom wallpaper", "sb-studio-button sb-quiet");
            clear.textContent = "Remove image";
            clear.onclick = () =>
                this.updateSettings({
                    wallpaper: "",
                    background: this.settings.background === "custom" ? "cosmos" : this.settings.background,
                });
            const status = el("span", "sb-field-description");
            status.setAttribute("role", "status");
            file.onchange = () => {
                const chosen = file.files?.[0];
                if (!chosen) return;
                if (
                    !["image/png", "image/jpeg", "image/webp"].includes(chosen.type) ||
                    chosen.size > 4 * 1024 * 1024
                ) {
                    status.textContent = "Choose a PNG, JPEG or WebP under 4 MB.";
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    if (!studio.disposed && this.validWallpaper(reader.result)) {
                        this.updateSettings({ wallpaper: reader.result, background: "custom" });
                        status.textContent = "Wallpaper saved on this computer.";
                    }
                };
                reader.onerror = () => {
                    status.textContent = "Could not read that image. Try another file.";
                };
                reader.readAsDataURL(chosen);
            };
            wallpaper.append(upload, clear, status);
            scene.append(wallpaper);
        }
        if (section === "bubbles") {
            const size = group(
                "Size & space",
                "Only the bubble you approach grows. Its neighbors make room.",
            );
            range(
                size,
                "bubbleSize",
                "Base diameter",
                80,
                210,
                2,
                "The starting size before idle and hover scaling.",
                pixels,
            );
            range(
                size,
                "spacing",
                "Space between bubbles",
                4,
                48,
                1,
                "Resting gaps stay clear even with drifting enabled.",
                pixels,
            );
            range(size, "idleScale", "Idle size", 0.4, 1, 0.01, "Every bubble rests at this size.", percent);
            range(
                size,
                "hoverScale",
                "Hover size",
                1.1,
                2.4,
                0.01,
                "How large the focused bubble becomes.",
                percent,
            );
            range(
                size,
                "iconScale",
                "Server icon size",
                0.7,
                1.5,
                0.05,
                "Scale the icon inside the glass.",
                percent,
            );
            select(size, "labelMode", "Server names", [
                ["always", "Always visible"],
                ["focus", "On hover or focus"],
                ["never", "Icons only"],
            ]);
            toggle(
                size,
                "showStatus",
                "Server details",
                "Show the current server, folder, favorite or unread status.",
            );
            const order = group("Order & activity");
            select(order, "sort", "Server order", [
                ["native", "Discord order"],
                ["name", "Alphabetical"],
                ["unread", "Unread first"],
                ["recent", "Recently visited"],
            ]);
            select(
                order,
                "defaultFilter",
                "Open with",
                [
                    ["all", "All servers"],
                    ["favorites", "Favorites"],
                    ["unread", "Unread servers"],
                    ["recent", "Recent servers"],
                ],
                "Right-click empty space to change the view while exploring.",
            );
            toggle(
                order,
                "favoritesFirst",
                "Favorites first",
                "Keep pinned servers at the front of your chosen order.",
            );
            toggle(
                order,
                "showUnread",
                "Unread and mention badges",
                "Show activity on server bubbles and the launcher.",
            );
            toggle(
                order,
                "overview",
                "Fit all bubbles when opening",
                "Start with every server in view. The grid control switches to free exploration.",
            );
        }
        if (section === "motion") {
            const feel = group("Movement");
            range(
                feel,
                "responsiveness",
                "Response",
                0.5,
                1.5,
                0.05,
                "Slow and fluid to quick and snappy.",
                multiplier,
            );
            range(
                feel,
                "wobble",
                "Bubble wobble",
                0,
                1.5,
                0.05,
                "The soft squash and stretch when you approach.",
                percent,
            );
            range(
                feel,
                "drift",
                "Idle drift",
                0,
                2,
                0.05,
                "Small movements within each bubble’s resting gap.",
                percent,
            );
            range(
                feel,
                "hoverReach",
                "Hover reach",
                0,
                50,
                1,
                "React a little before the pointer touches the glass.",
                pixels,
            );
            toggle(feel, "softMotion", "Ambient drifting", "Let resting bubbles float gently.");
            toggle(feel, "parallax", "Cursor parallax", "A slight shift in the whole field as you move.");
            toggle(feel, "clickRipples", "Click ripples", "Send a small ripple through empty space.");
            const navigation = group("Exploration");
            toggle(
                navigation,
                "edgePan",
                "Move at the edges",
                "Glide through the field without holding a mouse button.",
            );
            range(
                navigation,
                "panSpeed",
                "Edge travel speed",
                150,
                1400,
                25,
                "The maximum speed at the edge of the screen.",
                (value) => `${Math.round(value)} px/s`,
            );
            range(
                navigation,
                "wheelSpeed",
                "Wheel sensitivity",
                0.25,
                2,
                0.05,
                "Scroll to move; Shift + scroll moves sideways.",
                multiplier,
            );
            const performance = group(
                "Performance",
                "Hidden windows pause automatically. Only visible bubbles are painted.",
            );
            select(performance, "fps", "Interaction frame limit", [
                [30, "30 fps · lighter"],
                [60, "60 fps · balanced"],
                [90, "90 fps · high refresh"],
            ]);
            select(performance, "idleFps", "Idle frame limit", [
                [15, "15 fps · lighter"],
                [30, "30 fps · smooth"],
            ]);
            toggle(
                performance,
                "respectReducedMotion",
                "Follow reduced motion",
                "Use a still scene when your operating system requests less animation.",
            );
        }
        if (section === "controls") {
            const launcher = group("Launcher", "Drag the launcher anywhere, or choose a corner below.");
            range(
                launcher,
                "launcherSize",
                "Launcher size",
                42,
                84,
                2,
                "A small orb or a larger target.",
                pixels,
            );
            range(
                launcher,
                "launcherOpacity",
                "Launcher opacity",
                35,
                100,
                1,
                "Keep it visible without drawing too much attention.",
            );
            select(
                launcher,
                "launcherCorner",
                "Launcher corner",
                [
                    ["bottom-right", "Bottom right"],
                    ["bottom-left", "Bottom left"],
                    ["top-right", "Top right"],
                    ["top-left", "Top left"],
                ],
                "Choosing a corner resets its dragged position.",
            );
            select(launcher, "shortcut", "Open / close shortcut", [
                ["ctrl-shift-space", "Ctrl + Shift + Space"],
                ["alt-b", "Alt + B"],
                ["ctrl-alt-b", "Ctrl + Alt + B"],
                ["none", "Launcher only"],
            ]);
            const reset = button("Reset launcher position", "sb-studio-button sb-field-wide");
            reset.textContent = "Reset launcher position";
            reset.onclick = () => this.updateSettings({ position: null });
            launcher.append(reset);
            const navigation = group("Navigation");
            toggle(
                navigation,
                "hideNative",
                "Replace the server list",
                "Use the floating launcher for navigation. Disabling this plugin restores the regular list.",
            );
            toggle(
                navigation,
                "showHints",
                "Exploration hints",
                "Show the small navigation hint at the bottom of the bubble field.",
            );
            const help = el(
                "p",
                "sb-shortcut-note",
                "Arrow keys move between servers · Enter opens · / searches · Escape closes · right-click for actions",
            );
            body.append(help);
        }
        if (section === "share") {
            const share = group(
                "Share a look",
                "Looks contain appearance and motion settings. Your server IDs, favorites, recent servers and uploaded wallpaper stay on this computer.",
            );
            const exportText = el("textarea", "sb-look-text sb-field-wide");
            exportText.readOnly = true;
            exportText.value = this.sharedLook();
            exportText.setAttribute("aria-label", "Your shareable look");
            exportText.rows = 5;
            const buttons = el("div", "sb-button-row sb-field-wide");
            const copy = button("Copy look", "sb-studio-button sb-primary");
            copy.textContent = "Copy look";
            const download = button("Download look", "sb-studio-button");
            download.textContent = "Download look";
            const status = el("p", "sb-share-status sb-field-wide");
            status.setAttribute("role", "status");
            copy.onclick = async () => {
                try {
                    if (navigator.clipboard?.writeText)
                        await navigator.clipboard.writeText(this.sharedLook());
                    else require("electron").clipboard.writeText(this.sharedLook());
                    status.textContent = "Look copied. Your friend can paste it below in their studio.";
                } catch {
                    exportText.focus();
                    exportText.select();
                    status.textContent = "Select and copy the look above.";
                }
            };
            download.onclick = () => {
                const url = URL.createObjectURL(new Blob([this.sharedLook()], { type: "application/json" }));
                const link = el("a");
                link.href = url;
                link.download = "ServerBubbles.look.json";
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            };
            buttons.append(copy, download);
            share.append(exportText, buttons, status);
            const incoming = group("Import a look");
            const input = el("textarea", "sb-look-text sb-field-wide");
            input.rows = 5;
            input.spellcheck = false;
            input.placeholder = "Paste a Server Bubbles look here…";
            input.setAttribute("aria-label", "Import a shared look");
            const apply = button("Apply shared look", "sb-studio-button sb-primary");
            apply.textContent = "Apply look";
            const message = el("span", "sb-share-status sb-field-wide");
            message.setAttribute("role", "status");
            apply.onclick = () => {
                try {
                    this.importLook(input.value);
                    message.textContent = "Look applied. You can undo it below.";
                    exportText.value = this.sharedLook();
                } catch (error) {
                    message.textContent = error.message;
                }
            };
            incoming.append(input, apply, message);
            const reset = button("Restore the default look", "sb-studio-button sb-quiet");
            reset.textContent = "Restore default look";
            reset.onclick = () => {
                this.rememberLook();
                this.updateSettings({
                    ...Object.fromEntries(LOOK_KEYS.map((key) => [key, DEFAULTS[key]])),
                    preset: "aero",
                });
                message.textContent =
                    "Default look restored. Your favorites and launcher position are unchanged.";
            };
            incoming.append(reset);
        }
    }

    getStyles() {
        return `
/* Navigation is restored as soon as the plugin stops. */
body.sb-native-hidden { --top-bar-button-position: off; --top-bar-height: 32px; }
body.sb-native-hidden #app-mount { --custom-guild-list-width: 0px; --serverlist-offset: 0px; }
body.sb-native-hidden #app-mount :is(.guilds__5e434, nav[aria-label="Servers sidebar"]) { display: none !important; }
body.sb-native-hidden #app-mount .base__5e434[data-fullscreen="false"] .content__5e434 { margin-top: 0 !important; }
body.sb-native-hidden #app-mount .sidebar__5e434 { --custom-guild-list-width: 0px; }
body.sb-dragging { user-select: none !important; cursor: grabbing !important; }
#sb-launcher, #sb-overlay, .sb-settings { font-family: var(--font-primary, 'Segoe UI Variable Text', 'Segoe UI', sans-serif); color-scheme: dark; }
#sb-launcher, #sb-overlay *, .sb-settings * { box-sizing: border-box; }
#sb-overlay [hidden], #sb-launcher [hidden] { display: none !important; }
#sb-launcher {
    position: fixed; width: 62px; height: 62px; z-index: 2147482000; display: grid; place-items: center;
    border: 1px solid #d8f5ff8c; border-radius: 50%; padding: 0; color: #effcff; cursor: pointer; touch-action: none;
    background: radial-gradient(ellipse at 33% 12%, #ffffff99, transparent 40%), radial-gradient(ellipse at 60% 115%, #46ecf0a8, transparent 68%), linear-gradient(150deg, #2e7ca973, #061328c4);
    box-shadow: inset 0 2px 3px #ffffffe0, inset 0 -4px 10px #31bdd959, 0 9px 28px #0009, 0 0 30px #18bafa26;
    backdrop-filter: blur(22px) saturate(170%); transition: box-shadow .2s, filter .2s, scale .25s; isolation: isolate;
}
#sb-launcher:hover { scale: 1.08; filter: brightness(1.18); box-shadow: inset 0 2px 3px #fff, inset 0 -4px 10px #31bdd980, 0 12px 38px #0009, 0 0 40px #18bafa55; }
#sb-launcher > svg { width: 27px; height: 27px; filter: drop-shadow(0 2px 2px #001427); }
#sb-launcher[aria-expanded="true"] { opacity: 0; pointer-events: none; }
.sb-launcher-badge { position: absolute; right: -3px; top: -3px; min-width: 21px; height: 21px; padding: 0 5px; border-radius: 20px; background: #f15885; color: white; font: 700 10px/19px sans-serif; border: 1px solid #ffc0d4; box-shadow: 0 2px 8px #0008; }
.sb-launcher-tip { position: absolute; right: 72px; padding: 8px 12px; white-space: nowrap; font-size: 12px; border: 1px solid #cceeff30; border-radius: 12px; background: #091729e8; opacity: 0; pointer-events: none; transition: opacity .18s; }
#sb-launcher:hover .sb-launcher-tip { opacity: 1; }
#sb-overlay {
    --pointer-x: 50vw; --pointer-y: 50vh; position: fixed; inset: 0; z-index: 2147482100; overflow: hidden;
    color: #f2fbff; opacity: 0; transition: opacity .28s ease; isolation: isolate; user-select: none; overscroll-behavior: none;
    background: #020711; touch-action: none;
}
#sb-overlay.sb-is-open { opacity: 1; }
#sb-overlay.sb-is-closing { opacity: 0; pointer-events: none; transition-duration: .22s; }
#sb-overlay button { font-family: inherit; }
.sb-atmosphere { position: absolute; inset: 0; overflow: hidden; pointer-events: none;
    background: radial-gradient(ellipse at 16% 91%, #0064836b, transparent 45%), radial-gradient(ellipse at 84% 13%, #16497970, transparent 54%), radial-gradient(ellipse at 48% 42%, #08243f99, transparent 65%), linear-gradient(155deg, #020610 8%, #061329 61%, #01060e); }
.sb-atmosphere::before { content: ''; position: absolute; inset: -50%; opacity: .37; transform: rotate(-24deg); background: repeating-linear-gradient(90deg, transparent 0 13%, #a5f8ff06 16%, #a5f8ff12 18%, transparent 21% 34%); filter: blur(16px); }
.sb-atmosphere::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, transparent 35%, #00000057); }
.sb-bokeh { position: absolute; width: calc(52px + var(--i) * 29px); aspect-ratio: 1; left: calc(4% + var(--i) * 15%); top: calc(6% + mod(var(--i) * 23%, 78%)); border-radius: 50%; border: 1px solid #95ebff10; background: radial-gradient(circle at 30% 28%, #a9f8ff17, #2d9cb811 55%, transparent 70%); box-shadow: inset 0 0 18px #72e5ff08; }
.sb-caustics { position: absolute; width: 1050px; height: 800px; left: -350px; bottom: -590px; border-radius: 50%; border: 2px solid #56e6fd26; box-shadow: 0 0 80px 25px #40dfff0f, inset 0 0 70px #20ccff16; transform: rotate(-25deg); }
.sb-cursor-aura { display: none; }
.sb-universe { position: absolute; inset: 0; overflow: hidden; outline: none; }
.sb-world { position: absolute; inset: 0; overflow: visible; pointer-events: none; }
.sb-card { position: absolute; top: 0; left: 0; pointer-events: none; contain: layout style; will-change: transform; }
.sb-bubble-motion { position: relative; width: 100%; height: 100%; transform-origin: center; }
.sb-server-open {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: clamp(4px, calc(var(--sb-diameter) * .043), 8px);
    width: 100%; height: 100%; padding: 14% 13% 17%; border-radius: 50%; border: 1px solid hsl(var(--sb-hue) 82% 88% / .48);
    color: #f3fbff; cursor: pointer; pointer-events: auto; overflow: hidden; isolation: isolate;
    background: radial-gradient(ellipse at 33% 18%, #e9faff3b, transparent 42%), radial-gradient(ellipse at 52% 112%, hsl(var(--sb-hue) 85% 66% / .54), transparent 60%), linear-gradient(145deg, hsl(var(--sb-hue) 58% 52% / .27), hsl(var(--sb-hue) 57% 15% / .88) 65%, hsl(var(--sb-hue) 68% 40% / .4));
    box-shadow: inset 0 1.5px 2px #ffffffb3, inset 1px 0 2px #c9f3ff4d, inset -1px -2px 3px #59dcf047, inset 0 -10px 24px hsl(var(--sb-hue) 93% 61% / .12), 0 16px 34px #0005, 0 0 24px hsl(var(--sb-hue) 92% 58% / .05);
    -webkit-tap-highlight-color: transparent;
}
.sb-server-open::before { content: ''; position: absolute; width: 76%; height: 42%; left: 12%; top: 5%; border-radius: 50%; background: linear-gradient(180deg, #f4ffff4a, #edffff0c 72%, transparent); border-top: 1px solid #e6ffff94; transform: rotate(-14deg); pointer-events: none; z-index: -1; }
.sb-server-open::after { content: ''; position: absolute; inset: 5px; border-radius: 50%; border-bottom: 1px solid hsl(var(--sb-hue) 98% 82% / .62); border-right: 1px solid #d9f8ff20; box-shadow: inset 0 -4px 7px hsl(var(--sb-hue) 93% 69% / .09); pointer-events: none; }
.sb-is-near .sb-server-open { border-color: hsl(var(--sb-hue) 97% 90% / .85); }
.sb-card-current .sb-server-open { border-color: #a7efffbd; box-shadow: inset 0 2px 3px #ffffffe0, inset 0 -12px 28px #42e3f044, 0 0 0 4px #9befff0b, 0 18px 40px #0005, 0 0 38px #25c8ff1a; }
.sb-card-favorite .sb-server-open::after { border-bottom-color: #ffe6a380; }
.sb-orbit { display: grid; place-items: center; flex-shrink: 0; }
.sb-server-icon { position: relative; display: grid; place-items: center; width: var(--sb-logo-size); height: var(--sb-logo-size); flex-shrink: 0; border-radius: 35%; overflow: hidden; background: linear-gradient(140deg, hsl(var(--sb-hue) 66% 68% / .5), hsl(var(--sb-hue) 60% 30% / .55)); box-shadow: inset 0 1px 2px #ffffff8c, 0 4px 9px #0004; border: 1px solid #efffff38; }
.sb-initials { color: #f0fbff; font-size: calc(var(--sb-logo-size) * .31); font-weight: 750; text-shadow: 0 1px 3px #001a36; }
.sb-server-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.sb-server-name { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; flex-shrink: 0; overflow: hidden; width: 100%; color: #f4fbff; font-weight: 650; font-size: var(--sb-label-size); line-height: 1.25; text-align: center; text-wrap: balance; overflow-wrap: anywhere; text-shadow: 0 1px 7px #00132ccc; letter-spacing: .04px; }
.sb-server-status { display: block; width: 88%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: #cfebffb3; font-size: clamp(8px, calc(var(--sb-diameter) * .054), 10px); font-weight: 500; line-height: 1.3; text-align: center; }
.sb-active-mark { position: absolute; top: 10%; right: 14%; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; color: #dcffff; background: #80eaff24; border: 1px solid #bafaff75; pointer-events: none; z-index: 2; }
.sb-active-mark svg { width: 12px; height: 12px; }
.sb-mention { position: absolute; top: 11%; right: 11%; min-width: 25px; height: 25px; padding: 0 5px; display: grid; place-items: center; border: 1px solid #ffe8f0b3; border-radius: 50px; color: white; background: linear-gradient(#fa9fbd, #d74878); box-shadow: inset 0 2px 3px #fff5, 0 4px 9px #0005; font-size: 11px; font-weight: 750; z-index: 4; pointer-events: none; }
.sb-card-current .sb-mention { right: auto; left: 12%; }
.sb-unread-dot { position: absolute; right: 14%; top: 16%; width: 9px; height: 9px; border: 1px solid #e6ffff; background: #a1efff; box-shadow: 0 0 12px #74e6ff80; border-radius: 50%; z-index: 3; pointer-events: none; }
.sb-pin { position: absolute; left: calc(50% - 13px); bottom: 5%; width: 26px; height: 26px; padding: 6px; border: none; border-radius: 50%; color: #ddf7ffcc; background: transparent; z-index: 5; cursor: pointer; pointer-events: auto; opacity: 0; transition: opacity .2s, color .2s, background .2s; }
.sb-pin svg { width: 100%; height: 100%; }
.sb-card:hover .sb-pin, .sb-card:focus-within .sb-pin, .sb-is-near .sb-pin, .sb-pin.sb-is-pinned { opacity: 1; }
.sb-pin.sb-is-pinned { color: #ffdf99; }
.sb-pin.sb-is-pinned svg { fill: #ffdf9940; }
.sb-pin:hover { background: #efffff24; color: #fff0ba; }
.sb-corner-controls { position: absolute; left: 26px; top: 48px; display: flex; gap: 10px; z-index: 30; }
.sb-glass-control { display: grid; place-items: center; width: 43px; height: 43px; padding: 11px; border: 1px solid #d9f7ff40; border-radius: 50%; color: #def7ffe0; background: radial-gradient(ellipse at 35% 10%, #eaffff38, transparent 58%), #18446147; box-shadow: inset 0 1px 2px #ffffff75, 0 6px 18px #0004; backdrop-filter: blur(18px); cursor: pointer; transition: scale .25s cubic-bezier(.2,1.6,.5,1), background .2s; }
.sb-glass-control svg { width: 100%; height: 100%; }
.sb-glass-control:hover { scale: 1.1; background-color: #397b9561; }
.sb-overview[aria-pressed="true"] { border-color: #c9faff99; background-color: #388a9f70; }
.sb-close { position: absolute; right: 26px; top: 48px; z-index: 31; }
.sb-search-island { position: absolute; top: 48px; left: 50%; transform: translateX(-50%); width: min(400px, calc(100% - 32px)); height: 48px; padding: 0 10px 0 16px; display: flex; gap: 10px; align-items: center; z-index: 35; border-radius: 28px; border: 1px solid #daffff66; background: linear-gradient(160deg, #5fabc449, #05172dde); box-shadow: inset 0 1px 2px #ffffff78, 0 14px 42px #0007; backdrop-filter: blur(35px) saturate(150%); }
.sb-search-island > svg { width: 19px; height: 19px; color: #d4efff; flex-shrink: 0; }
.sb-search { min-width: 0; width: 100%; height: 100%; padding: 0; border: none; border-radius: 0; background: transparent !important; color: white; font: inherit; font-size: 14px; outline: none; box-shadow: none; }
.sb-search::placeholder { color: #c1d9e9a6; }
.sb-search::-webkit-search-cancel-button { display: none; }
.sb-search-close { width: 29px; height: 29px; padding: 7px; display: grid; place-items: center; flex-shrink: 0; border: none; border-radius: 50%; color: #d5ecff; background: #c4f5ff14; cursor: pointer; }
.sb-search-close svg { width: 100%; height: 100%; }
.sb-explore-hint { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; align-items: center; pointer-events: none; white-space: nowrap; font-size: 11px; letter-spacing: .3px; color: #a8d1e799; opacity: .82; z-index: 25; text-shadow: 0 2px 7px #000; animation: sb-hint-fade 1s 9s forwards; }
.sb-hint-dot { width: 5px; height: 5px; border-radius: 50%; background: #a9efff; box-shadow: 0 0 9px #67e8ffb3; }
.sb-hint-separator { opacity: .5; }
.sb-position { position: absolute; width: 60px; height: 42px; bottom: 24px; right: 27px; border: 1px solid #d0f5ff20; border-radius: 14px; background: #183c4d26; backdrop-filter: blur(5px); pointer-events: none; z-index: 25; }
.sb-position-dot { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #b3f4ffba; box-shadow: 0 0 6px #a0eaff70; left: var(--position-x, 8px); top: var(--position-y, 6px); }
.sb-water-ripple { position: absolute; left: 0; top: 0; width: 50px; height: 50px; margin: -25px; border: 1px solid #b1f5ff61; border-radius: 50%; box-shadow: inset 0 0 12px #a6f4ff14, 0 0 15px #a6f4ff0c; z-index: 24; pointer-events: none; animation: sb-ripple 1.1s ease-out forwards; }
.sb-empty { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center; width: min(320px, 80vw); color: #d4edff; }
.sb-empty > svg { width: 52px; height: 52px; color: #abe5ff80; margin-bottom: 16px; }
.sb-empty h2 { margin: 0 0 8px; font-size: 20px; font-weight: 500; }
.sb-empty p { margin: 0; font-size: 13px; color: #aacaddb3; }
.sb-context { position: fixed; min-width: 218px; max-width: calc(100vw - 16px); z-index: 80; padding: 7px; border: 1px solid #dafaff52; border-radius: 20px; background: linear-gradient(145deg, #35627aab, #071326ed); backdrop-filter: blur(32px) saturate(160%); box-shadow: inset 0 1px 1px #ffffff50, 0 18px 48px #0008; }
.sb-context-item { display: flex; gap: 11px; align-items: center; padding: 11px 12px; width: 100%; border: none; border-radius: 13px; color: #e4f5ff; background: transparent; font: inherit; font-size: 12px; text-align: left; cursor: pointer; }
.sb-context-item svg { width: 17px; height: 17px; color: #bbe7ff; flex-shrink: 0; }
.sb-context-item:hover, .sb-context-item:focus-visible { background: #c4f6ff1f; outline: none; }
.sb-error { position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%); padding: 14px 20px; max-width: 80%; background: #4c163ddd; border: 1px solid #ff9bba70; border-radius: 18px; color: #ffe4eb; z-index: 60; font-size: 13px; }
#sb-overlay button:focus-visible, #sb-launcher:focus-visible { outline: 2px solid #e7fdff; outline-offset: 5px; }
.sb-sr-only { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.sb-settings { padding: 16px; color: var(--text-normal, #e5f0ff); }
.sb-settings h2 { margin: 0 0 10px; font-size: 20px; }
.sb-settings p { font-size: 13px; line-height: 1.6; opacity: .8; margin-bottom: 18px; }
.sb-settings-button { padding: 10px 16px; margin: 0 8px 20px 0; border: 1px solid #d0f1ff38; border-radius: 16px; color: #e1f5ff; background: #70cfff19; cursor: pointer; }
.sb-setting-row { display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 16px 0; border-top: 1px solid #a1cfff1a; }
.sb-setting-row strong { display: block; font-size: 14px; margin-bottom: 5px; }
.sb-setting-row small { display: block; font-size: 12px; opacity: .7; line-height: 1.4; }
.sb-setting-row input { width: 18px; height: 18px; accent-color: #74dcff; }
.sb-setting-row select { padding: 8px; border-radius: 10px; color: #e1f5ff; background: #102339; border: 1px solid #d0f1ff38; }
/* An installed theme may provide a wallpaper; every scene has a built-in fallback. */
.sb-atmosphere { background: var(--lg-photo, var(--lg-wallpaper, #020711)); background-size: cover; background-position: center; }
.sb-atmosphere::before { display: none; }
.sb-atmosphere::after { background: rgba(0, 7, 20, .16); }
.sb-bokeh, .sb-caustics { display: none; }
@keyframes sb-waterlight { to { transform: translate(28px, -36px) scale(1.12); opacity: .55; } }
@keyframes sb-ripple { from { transform: scale(.3); opacity: .8; } to { transform: scale(6); opacity: 0; } }
@keyframes sb-hint-fade { to { opacity: .28; } }
@media (max-width: 620px) { .sb-corner-controls { left: 16px; gap: 8px; } .sb-close { right: 16px; } .sb-search-island { top: 104px; } .sb-explore-hint { font-size: 10px; bottom: 24px; gap: 7px; } .sb-position { bottom: 55px; right: 17px; scale: .8; transform-origin: right bottom; } }
@media (prefers-reduced-motion: reduce) { #sb-launcher, #sb-overlay, #sb-overlay * { animation: none !important; transition: none !important; } #sb-launcher:hover, .sb-glass-control:hover { scale: 1; } .sb-cursor-aura { display: none; } }
#sb-overlay[data-reduced="true"] * { animation: none !important; transition: none !important; }

/* Scene preferences are inherited by both the server field and its preview. */
#sb-launcher {
    width: var(--sb-launcher-size, 62px); height: var(--sb-launcher-size, 62px);
    opacity: var(--sb-launcher-opacity, 1);
    background: radial-gradient(ellipse at 33% 12%, #ffffff8c, transparent 40%), radial-gradient(ellipse at 60% 115%, rgb(var(--sb-accent-rgb, 133 220 255) / .6), transparent 68%), linear-gradient(150deg, #2e7ca973, #061328e8);
}
.sb-launcher-tip { right: calc(var(--sb-launcher-size, 62px) + 10px); }
#sb-launcher[data-side="left"] .sb-launcher-tip { right: auto; left: calc(var(--sb-launcher-size, 62px) + 10px); }
#sb-overlay .sb-atmosphere, .sb-preview-canvas .sb-atmosphere {
    background-image: var(--sb-background); background-color: #030b18; background-size: cover; background-position: center;
}
#sb-overlay .sb-atmosphere::after, .sb-preview-canvas .sb-atmosphere::after { background: rgb(0 3 12 / var(--sb-dim, .16)); }
[data-background="cosmos"][data-ambient="true"] .sb-atmosphere::before,
[data-background="theme"][data-ambient="true"] .sb-atmosphere::before {
    display: block; inset: 0; filter: none; transform: none; opacity: .55;
    background-image: radial-gradient(circle at 12% 25%, #c9eaff 0 1px, transparent 1.5px), radial-gradient(circle at 78% 17%, #8bafff 0 .7px, transparent 1.2px), radial-gradient(circle at 42% 81%, #fff 0 .7px, transparent 1.3px), radial-gradient(circle at 89% 62%, #b7e9ff 0 1px, transparent 1.5px), radial-gradient(circle at 29% 56%, #9bc8ff 0 .5px, transparent 1px);
    background-size: 293px 271px, 337px 239px, 211px 317px, 433px 353px, 167px 223px;
}
[data-background="aero"][data-ambient="true"] .sb-bokeh { display: block; }
[data-multicolor="false"] .sb-card, [data-multicolor="false"] .sb-server-icon { --sb-hue: var(--sb-accent-hue, 199) !important; }
#sb-overlay .sb-server-open, .sb-preview-canvas .sb-server-open {
    background: radial-gradient(ellipse at 33% 18%, rgb(233 250 255 / calc(var(--sb-sheen, .7) * .36)), transparent 42%), radial-gradient(ellipse at 52% 112%, hsl(var(--sb-hue) 80% 66% / calc(var(--sb-sheen, .7) * .55)), transparent 60%), linear-gradient(145deg, hsl(var(--sb-hue) 58% 52% / calc(var(--sb-tint, .62) * .45)), hsl(var(--sb-hue) 57% 15% / var(--sb-tint, .62)) 65%, hsl(var(--sb-hue) 68% 40% / calc(var(--sb-tint, .62) * .6)));
    box-shadow: inset 0 1.5px 2px rgb(255 255 255 / calc(var(--sb-sheen, .7) * .95)), inset 1px 0 2px #c9f3ff35, inset -1px -2px 3px #59dcf035, 0 12px 25px #0005, 0 0 calc(30px * var(--sb-glow, .65)) hsl(var(--sb-hue) 92% 65% / calc(var(--sb-glow, .65) * .2));
}
#sb-overlay .sb-server-open::before, .sb-preview-canvas .sb-server-open::before { opacity: var(--sb-sheen, .7); }
[data-material="frost"] .sb-server-open { background: linear-gradient(145deg, hsl(var(--sb-hue) 34% 41% / .85), hsl(var(--sb-hue) 35% 12% / .95)) !important; }
[data-material="solid"] .sb-server-open { background: linear-gradient(145deg, hsl(var(--sb-hue) 27% 24%), hsl(var(--sb-hue) 30% 12%)) !important; }
[data-labels="focus"] .sb-card:not(.sb-is-near):not(:focus-within) :is(.sb-server-name, .sb-server-status) { visibility: hidden; }
[data-labels="never"] :is(.sb-server-name, .sb-server-status), [data-status="false"] .sb-server-status { display: none; }
[data-labels="never"] .sb-server-open { padding: 14%; }
.sb-server-icon { width: calc(var(--sb-logo-size) * var(--sb-icon-scale, 1)); height: calc(var(--sb-logo-size) * var(--sb-icon-scale, 1)); }
[data-hints="false"] .sb-explore-hint { display: none; }

/* Studio chrome stays neutral; the playground shows the chosen server style. */
.sb-studio {
    --studio-text: #e4ede7; --studio-muted: #8faaa0; --studio-line: #b3d2bd20; --studio-accent: #b6f1cc;
    container: bubble-studio / inline-size; color-scheme: dark; color: var(--studio-text);
    font: 13px/1.5 var(--font-primary, 'Segoe UI Variable', 'Segoe UI', sans-serif);
    width: 100%; max-width: 800px; min-width: 0; margin: 0 auto; padding: 19px;
    border: 1px solid #bbd5c51c; border-radius: 18px; background: #101817;
}
.sb-studio, .sb-studio * { box-sizing: border-box; }
.sb-studio h2, .sb-studio h3, .sb-studio p { margin: 0; color: inherit; }
.sb-studio button, .sb-studio input, .sb-studio select, .sb-studio textarea { font: inherit; }
.sb-studio button { cursor: pointer; }
.sb-studio button:disabled { cursor: default; opacity: .35; }
.sb-studio :is(button, input, select, textarea):focus-visible { outline: 2px solid #b6f1cc; outline-offset: 3px; }
.sb-studio [hidden] { display: none !important; }
.sb-studio-header { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding: 0 0 22px; }
.sb-identity { display: flex; align-items: center; gap: 11px; min-width: 0; }
.sb-brand-mark { display: grid; place-items: center; width: 39px; height: 39px; flex-shrink: 0; border: 1px solid #d6ffe247; border-radius: 15px 15px 15px 5px; background: linear-gradient(150deg, #b6f1cc, #7bbd9d); color: #173a2b; box-shadow: inset 0 1px 0 #e7fff6b3; }
.sb-brand-mark svg { width: 25px; height: 25px; }
.sb-studio h2 { font-size: 34px; line-height: 1.02; font-weight: 650; letter-spacing: -1.9px; color: #eef5ef; }
.sb-brand-caption { display: block; color: #8ba297; font-size: 10px; margin-top: 5px; letter-spacing: .05px; }
.sb-studio .sb-studio-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 35px; padding: 8px 12px; border-radius: 9px; border: 1px solid #bdd5c632; color: #dbeae0; background: #24312c66; font-size: 10px; font-weight: 650; line-height: 1.2; white-space: nowrap; text-decoration: none; box-shadow: none; }
.sb-studio .sb-studio-button svg { width: 15px; height: 15px; flex-shrink: 0; }
.sb-studio .sb-studio-button:hover:not(:disabled) { border-color: #c8ecd385; background-color: #bfd9c315; }
.sb-studio .sb-primary { color: #14291d; background: #b6f1cc; border-color: #ceffdf; }
.sb-studio .sb-primary:hover:not(:disabled) { color: #102217; background: #ccffdf; }
.sb-studio .sb-quiet { background: transparent; border-color: transparent; padding-left: 0; color: #a7c4b3; }

.sb-studio-hero { border: 1px solid #bbd5c528; border-radius: 14px; background: #121e1a; overflow: hidden; }
.sb-preview-bar { display: flex; align-items: center; gap: 10px; min-height: 43px; padding: 8px 12px 8px 15px; border-bottom: 1px solid #b3d2bd16; background: #19241f; }
.sb-playground-title { font-size: 11px; font-weight: 650; color: #d9e8df; }
.sb-playground-hint { margin-left: 9px; color: #829b8d; font-size: 9px; font-weight: 400; }
.sb-playground-live { display: inline-flex; align-items: center; gap: 5px; margin-left: auto; color: #b6dbc3; font-size: 8px; white-space: nowrap; }
.sb-live-dot { width: 4px; height: 4px; border-radius: 50%; background: #b6f1cc; }
.sb-preview-pause { display: grid; place-items: center; width: 26px; height: 26px; flex-shrink: 0; padding: 6px; border: 1px solid #c8e0d126; border-radius: 7px; background: #d2ffe008; color: #bdd4c6; }
.sb-preview-pause svg { width: 100%; height: 100%; }
.sb-preview-pause[aria-pressed="true"] { border-color: #b6f1cc88; background: #b6f1cc17; }
.sb-preview-canvas { position: relative; height: 218px; width: 100%; overflow: hidden; isolation: isolate; contain: layout style; touch-action: none; color: #e8f6ff; }
.sb-preview-canvas .sb-atmosphere { pointer-events: none; }
.sb-preview-canvas .sb-card { will-change: transform; }
.sb-playground-meters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 12px 0; border-top: 1px solid #c8dfd11a; }
.sb-meter { display: flex; flex-direction: column; gap: 2px; padding: 0 15px; border-right: 1px solid #b3d2bd20; }
.sb-meter:last-child { border-right: none; }
.sb-meter-label { color: #7e9c8c; font-size: 8px; line-height: 1.2; }
.sb-meter-value { color: #c7e7d4; font: 500 16px/1.4 Consolas, 'SFMono-Regular', monospace; letter-spacing: -.5px; }

.sb-preset-section { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 17px 2px 20px; }
.sb-look-label { flex-shrink: 0; }
.sb-studio .sb-look-label h3 { font-size: 11px; font-weight: 650; }
.sb-current-look { display: block; color: #829f8e; font-size: 9px; margin-top: 2px; }
.sb-preset-grid { display: flex; align-items: center; gap: 6px; }
.sb-preset { display: grid; place-items: center; width: 37px; height: 37px; flex-shrink: 0; padding: 4px; border: 1px solid transparent; border-radius: 50%; background: transparent; }
.sb-preset:hover { background: #d5ffe217; border-color: #b8d9c34d; }
.sb-preset[aria-pressed="true"] { border-color: #c9ffdc; background: #cdf5da0d; }
.sb-preset-orb { display: block; width: 27px; height: 27px; border: 1px solid #e9fff366; border-radius: 50%; background: radial-gradient(ellipse at 30% 18%, #ffffffad, transparent 48%), linear-gradient(150deg, var(--preset-a), var(--preset-b)); box-shadow: inset 0 1px 1px #ffffffe0, 0 2px 5px #0005; }

.sb-workbench { display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 14px; align-items: start; padding-top: 18px; border-top: 1px solid var(--studio-line); }
.sb-studio-tabs { position: sticky; top: 12px; display: flex; flex-direction: column; gap: 5px; margin: 0; padding: 0; }
.sb-studio-tab { position: relative; display: flex; align-items: center; gap: 7px; width: 100%; min-height: 39px; padding: 9px 7px; border: 1px solid transparent; border-radius: 9px; background: transparent; color: #7d9a8a; font-size: 9px !important; font-weight: 600 !important; line-height: 1.2; text-align: left; }
.sb-studio-tab svg { width: 15px; height: 15px; flex-shrink: 0; }
.sb-studio-tab:hover { color: #d9eee1; background: #d6ffe308; }
.sb-studio-tab[aria-selected="true"] { color: #c8f4d8; border-color: #c0ecd125; background: #b7ecc814; }
.sb-studio-tab[aria-selected="true"]::before { content: ''; position: absolute; left: -1px; top: 12px; bottom: 12px; width: 2px; border-radius: 2px; background: #b6f1cc; }
.sb-studio-body { min-width: 0; display: grid; gap: 0; }
.sb-studio-card { padding: 0 0 22px; border: none; border-radius: 0; background: transparent; }
.sb-studio-card + .sb-studio-card { padding-top: 21px; border-top: 1px solid var(--studio-line); }
.sb-studio-card > h3 { font-size: 17px; font-weight: 600; letter-spacing: -.4px; color: #e0ece5; }
.sb-studio .sb-card-description { color: #809e8d; font-size: 10px; line-height: 1.6; margin-top: 5px; }
.sb-field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 21px 18px; margin-top: 20px; }
.sb-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; margin: 0; }
.sb-field-wide { grid-column: 1 / -1; }
.sb-field-title { display: flex; align-items: center; justify-content: space-between; gap: 5px; color: #ccdcd2; font-size: 10px; font-weight: 600; line-height: 1.4; }
.sb-field-value { display: inline; flex-shrink: 0; color: #afd4be; padding: 0; background: none; border-radius: 0; font: 10px/1.4 Consolas, monospace; }
.sb-studio .sb-field-description { display: block; color: #73927e; font-size: 9px; line-height: 1.65; font-weight: 400; }
.sb-studio input.sb-range { appearance: none; -webkit-appearance: none; display: block; width: 100%; height: 3px; min-height: 3px; margin: 7px 0 4px; padding: 0; border: 0; border-radius: 3px; background: linear-gradient(90deg, #b6f1cc var(--fill, 50%), #8ba99638 var(--fill, 50%)); box-shadow: none; cursor: pointer; }
.sb-studio input.sb-range::-webkit-slider-thumb { appearance: none; width: 8px; height: 14px; border: 1px solid #d5ffe1; border-radius: 3px; background: #cfedda; box-shadow: 0 1px 4px #0005; }
.sb-studio input.sb-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px #b6f1cc15; }
.sb-studio .sb-select { display: block; width: 100%; min-width: 0; height: 34px; padding: 6px 7px; border: 1px solid #b2d5c12a; border-radius: 7px; background: #1a2720; color: #bfd7c8; font-size: 10px; outline-offset: 2px; }
.sb-switch-row { display: grid; grid-template-columns: 1fr 34px; gap: 4px 14px; padding-top: 13px; border-top: 1px solid #b1d3bd12; }
.sb-switch-row .sb-field-title { grid-column: 1; }
.sb-switch-row .sb-field-description { grid-column: 1; grid-row: 2; }
.sb-studio input.sb-switch { appearance: none; -webkit-appearance: none; position: relative; grid-column: 2; grid-row: 1 / 3; align-self: center; width: 31px; height: 18px; min-height: 18px; margin: 0; padding: 0; border: 1px solid #a8c3b136; border-radius: 10px; background: #68837438; box-shadow: none; cursor: pointer; }
.sb-studio input.sb-switch::before { content: ''; position: absolute; left: 3px; top: 3px; width: 10px; height: 10px; border-radius: 50%; background: #a7b8ac; transition: transform .16s; }
.sb-studio input.sb-switch:checked { background: #b6f1cc; border-color: #ceffe0; }
.sb-studio input.sb-switch:checked::before { transform: translateX(13px); background: #264733; }
.sb-color-row { display: flex; align-items: center; gap: 8px; }
.sb-studio input.sb-color { appearance: none; width: 34px; height: 25px; margin: 0; padding: 2px; background: #d6ffe316; border: 1px solid #c7e6d12b; border-radius: 6px; cursor: pointer; }
.sb-color::-webkit-color-swatch-wrapper { padding: 0; }
.sb-color::-webkit-color-swatch { border: none; border-radius: 3px; }
.sb-color-code { color: #86a693; font: 9px/1.2 Consolas, monospace; }
.sb-wallpaper-tools { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }
.sb-wallpaper-tools > label { position: relative; cursor: pointer; overflow: hidden; }
.sb-file { position: absolute; inset: 0; opacity: 0; width: 100%; height: 100%; cursor: pointer; }
.sb-wallpaper-tools > .sb-field-description { width: 100%; }
.sb-wallpaper-tools > label:focus-within { outline: 2px solid #b6f1cc; outline-offset: 3px; }
.sb-studio textarea.sb-look-text { width: 100%; min-width: 0; max-width: 100%; min-height: 100px; max-height: 230px; resize: vertical; border: 1px solid #a6cdb731; border-radius: 8px; background: #090f0c; color: #afceba; padding: 10px; font: 9px/1.7 Consolas, monospace; box-shadow: none; }
.sb-button-row { display: flex; flex-wrap: wrap; gap: 7px; }
.sb-studio .sb-share-status { color: #add5ba; font-size: 10px; line-height: 1.6; }
.sb-studio .sb-share-status:empty { display: none; }
.sb-studio .sb-shortcut-note { padding: 0 0 12px; color: #799b87; font-size: 10px; line-height: 1.8; }
.sb-studio-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 13px 0 0; border-top: 1px solid var(--studio-line); }
.sb-studio-signature { color: #5d7a68; font: 8px/1.4 Consolas, monospace; }
@container bubble-studio (max-width: 420px) {
    .sb-workbench { grid-template-columns: 56px minmax(0, 1fr); gap: 14px; }
    .sb-studio-tab { flex-direction: column; justify-content: center; gap: 6px; min-height: 52px; padding: 8px 3px; text-align: center; font-size: 8px !important; }
    .sb-field-grid { grid-template-columns: 1fr; }
    .sb-studio h2 { font-size: 29px; }
    .sb-brand-mark { width: 33px; height: 33px; border-radius: 12px 12px 12px 4px; }
    .sb-identity { gap: 8px; }
    .sb-preset-grid { gap: 3px; }
    .sb-preset { width: 32px; height: 32px; }
    .sb-preset-orb { width: 23px; height: 23px; }
    .sb-playground-hint { display: none; }
}
@container bubble-studio (max-width: 300px) {
    .sb-studio-header { flex-wrap: wrap; gap: 12px; }
    .sb-studio-header > .sb-studio-button { margin-left: auto; }
    .sb-preset-section { flex-wrap: wrap; gap: 8px; }
    .sb-preset-grid { margin-left: auto; }
    .sb-meter { padding: 0 8px; }
    .sb-meter-label { font-size: 7px; }
    .sb-meter-value { font-size: 14px; }
    .sb-studio-signature { font-size: 7px; }
}
@media (prefers-reduced-motion: reduce) { .sb-studio *, .sb-preview-canvas * { transition: none !important; animation: none !important; } }


`;
    }
};
