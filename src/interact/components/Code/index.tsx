"use client"

import React, {useState, useEffect, useRef, useCallback} from "react";
import clsx from "clsx";


declare global {
    interface Window {
        Prism: {
            highlightElement: (el: Element) => void;
            highlightAll: () => void;
            languages: Record<string, unknown>;
        };
    }
}

type PrismTheme =
    | "default"
    | "okaidia"
    | "tomorrow"
    | "solarizedlight"
    | "dracula"
    | "nord"
    | "oneDark"
    | "vsDark"
    | "coy"
    | "funky"
    | "twilight";


export type CodeProps = React.HTMLAttributes<HTMLElement>
    & {
    lang: string,
    children: React.ReactElement<React.HTMLAttributes<HTMLPreElement>, 'pre'>;
    lineNumbers?: boolean
    lineHighlight?: string; // e.g. "1,3-5"
    commandLine?: boolean;
    showLanguage?: boolean;
    copyButton?: boolean;
    toolbar?: boolean;
    normalize?: boolean;
    wordWrap?: boolean;
}


const LIGHT_THEMES: PrismTheme[] = [
    "default",
    "solarizedlight",
    "coy",
    "funky",
    "twilight",
];

const DARK_THEMES: PrismTheme[] = [
    "okaidia",
    "tomorrow",
    "dracula",
    "nord",
    "oneDark",
    "vsDark",
];

let cdnBase = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0";

const THEME_CDN: Record<PrismTheme, string> = {
    default: "prism.min.css",
    okaidia: "prism-okaidia.min.css",
    tomorrow: "prism-tomorrow.min.css",
    solarizedlight: "prism-solarizedlight.min.css",
    dracula: "prism-twilight.min.css",
    nord: "prism-tomorrow.min.css",
    oneDark: "prism-okaidia.min.css",
    vsDark: "prism-tomorrow.min.css",
    coy: "prism-coy.min.css",
    funky: "prism-funky.min.css",
    twilight: "prism-twilight.min.css",
};

const SUPPORTED_LANGUAGES = [
    "javascript",
    "typescript",
    "jsx",
    "tsx",
    "python",
    "rust",
    "go",
    "java",
    "cpp",
    "c",
    "csharp",
    "css",
    "html",
    "bash",
    "json",
    "yaml",
    "markdown",
    "sql",
    "graphql",
    "swift",
    "kotlin",
];


let prismCoreLoaded = false;
let prismCorePromise: Promise<void> | null = null;
const loadedPlugins = new Set<string>();
const loadedLangs = new Set<string>();

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load: ${src}`));
        document.head.appendChild(s);
    });
}

function loadStylesheet(href: string, id: string): void {
    const existing = document.getElementById(id);
    if (existing) {
        (existing as HTMLLinkElement).href = href;
        return;
    }
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

async function loadPrismCore(): Promise<void> {
    if (prismCoreLoaded) return;
    if (prismCorePromise) return prismCorePromise;

    prismCorePromise = loadScript(`${cdnBase}/prism.min.js`
    ).then(() => {
        prismCoreLoaded = true;
    });

    return prismCorePromise;
}

async function loadPrismLanguage(lang: string): Promise<void> {
    if (loadedLangs.has(lang)) return;
    const base = `${cdnBase}/components/prism-`;
    const map: Record<string, string> = {
        js: "javascript",
        html: "markup",
    };
    const file = map[lang] ?? lang;
    try {
        await loadScript(`${base}${file}.min.js`);
        loadedLangs.add(lang);
    } catch {
        // silently ignore unknown langs
    }
}

async function loadPrismPlugin(plugin: string): Promise<void> {
    if (loadedPlugins.has(plugin)) return;
    const base = `${cdnBase}/plugins/`;
    await loadScript(`${base}${plugin}/${plugin}.min.js`);
    loadStylesheet(
        `${base}${plugin}/prism-${plugin}.min.css`,
        `prism-plugin-${plugin}`
    );
    loadedPlugins.add(plugin);
}


type colorMode = "light" | "dark";

function getLanguage(children: React.ReactElement<React.HTMLAttributes<HTMLPreElement>, 'pre'>) {
    let lang = "txt"
    if (children == null) {
        // code wraps directly
        return null
    }
    lang = children.props['className'] as string; // language-jsx, ...
    if (lang == null) {
        return null
    }
    const sep = lang.lastIndexOf("-")
    if (sep != -1) {
        return lang.slice(sep + 1);
    }
    return lang;
}

export default function Code({
                                 lang,
                                 children,
                                 lineNumbers = false,
                                 wordWrap = false,
                                 lineHighlight,
                                 commandLine = false,
                                 toolbar = false,
                                 normalize = true,
                                 ...rest
                             }: CodeProps) {

    let themeProp;
    const [currentMode, setCurrentMode] = useState<colorMode>("light");
    const [currentTheme, setCurrentTheme] = useState<PrismTheme>(
        themeProp ?? (currentMode === "dark" ? "okaidia" : "default")
    );

    const [currentLang, setCurrentLang] = useState(lang ? lang : getLanguage(children) || "txt");
    const [lineNums, setLineNums] = useState(lineNumbers);
    const [wrap, setWrap] = useState(wordWrap);
    const [copied, setCopied] = useState(false);
    const [ready, setReady] = useState(false);

    const codeRef = useRef<HTMLElement>(null);

    // Sync theme ↔ mode
    useEffect(() => {
        if (themeProp) return;
        const auto = currentMode === "dark" ? "okaidia" : "default";
        setCurrentTheme(auto);
    }, [currentMode, themeProp]);

    // Load CSS theme
    useEffect(() => {
        loadStylesheet(`${cdnBase}/themes/${THEME_CDN[currentTheme]}`, "prism-theme");
    }, [currentTheme]);

    // Load Prism + plugins + language, then highlight
    const highlight = useCallback(async () => {
        await loadPrismCore();
        if (lineNums) await loadPrismPlugin("line-numbers");
        await loadPrismLanguage(currentLang);

        if (codeRef.current && window.Prism) {
            setReady(true);
            // Small tick so DOM is painted with new class
            requestAnimationFrame(() => {
                if (codeRef.current) window.Prism.highlightElement(codeRef.current);
            });
        }
    }, [currentLang, lineNums]);

    useEffect(() => {
        highlight();
    }, [highlight]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(String(children.props.children));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const themeList = currentMode === "dark" ? DARK_THEMES : LIGHT_THEMES;

    // ── Styles ──────────────────────────────────────────────────────────────────

    const isLight = currentMode === "light";

    const shell: React.CSSProperties = {
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        borderRadius: "12px",
        overflow: "hidden",
        border: isLight ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.07)",
        background: isLight ? "#f8fafc" : "#0d1117",
        transition: "all 0.2s ease",
        marginBottom: "1rem"
    };

    const toolbarStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        background: isLight
            ? "linear-gradient(to bottom, #f1f5f9, #e8edf3)"
            : "linear-gradient(to bottom, #1c2128, #161b22)",
        borderBottom: isLight ? "1px solid #d1d9e0" : "1px solid #21262d",
        flexWrap: "wrap" as const,
    };

    const dotStyle = (color: string): React.CSSProperties => ({
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
    });

    const selectStyle: React.CSSProperties = {
        background: isLight ? "#fff" : "#21262d",
        color: isLight ? "#1e293b" : "#cdd9e5",
        border: isLight ? "1px solid #cbd5e1" : "1px solid #30363d",
        borderRadius: "6px",
        padding: "3px 8px",
        fontSize: "11px",
        fontFamily: "inherit",
        cursor: "pointer",
        outline: "none",
        letterSpacing: "0.02em",
    };

    const toggleBtn = (active: boolean): React.CSSProperties => ({
        padding: "3px 10px",
        borderRadius: "6px",
        fontSize: "11px",
        fontFamily: "inherit",
        cursor: "pointer",
        border: active
            ? "1px solid #3b82f6"
            : isLight
                ? "1px solid #cbd5e1"
                : "1px solid #30363d",
        background: active
            ? isLight
                ? "#eff6ff"
                : "#1d3557"
            : isLight
                ? "#fff"
                : "#21262d",
        color: active ? "#3b82f6" : isLight ? "#64748b" : "#8b949e",
        letterSpacing: "0.02em",
        transition: "all 0.15s",
    });
    const modeBtnStyle = (m: "light" | "dark"): React.CSSProperties => ({
        padding: "3px 10px",
        borderRadius: "6px",
        fontSize: "11px",
        fontFamily: "inherit",
        cursor: "pointer",
        border:
            currentMode === m
                ? "1px solid #a78bfa"
                : isLight
                    ? "1px solid #cbd5e1"
                    : "1px solid #30363d",
        background:
            currentMode === m
                ? isLight
                    ? "#f5f3ff"
                    : "#2d1f4e"
                : isLight
                    ? "#fff"
                    : "#21262d",
        color: currentMode === m ? "#7c3aed" : isLight ? "#64748b" : "#8b949e",
        letterSpacing: "0.02em",
        transition: "all 0.15s",
    });

    const langBadge: React.CSSProperties = {
        marginRight: "0.5rem",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: isLight ? "#94a3b8" : "#484f58",
        userSelect: "none" as const,
    };

    const copyBtnStyle: React.CSSProperties = {
        padding: "3px 10px",
        borderRadius: "6px",
        fontSize: "11px",
        fontFamily: "inherit",
        cursor: "pointer",
        border: copied
            ? "1px solid #22c55e"
            : isLight
                ? "1px solid #cbd5e1"
                : "1px solid #30363d",
        background: copied
            ? isLight
                ? "#f0fdf4"
                : "#052e16"
            : isLight
                ? "#fff"
                : "#21262d",
        color: copied ? "#22c55e" : isLight ? "#64748b" : "#8b949e",
        transition: "all 0.15s",
        letterSpacing: "0.02em",
    };

    const preStyle: React.CSSProperties = {
        margin: 0,
        borderRadius: 0,
        fontSize: "13.5px",
        lineHeight: 1.7,
        whiteSpace: wrap ? "pre-wrap" : "pre",
        overflowX: wrap ? "hidden" : "auto",
        maxHeight: "520px",
    };

    return (
        <>
            {/* Google Font for JetBrains Mono */}
            <link
                href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
                rel="stylesheet"
            />

            <div style={shell} {...rest}>
                {/* ── Toolbar ── */}
                {toolbar && (
                    <>
                        <div style={toolbarStyle}>
                            {/* Traffic-light dots */}
                            <div style={dotStyle("#ff5f57")}/>
                            <div style={dotStyle("#febc2e")}/>
                            <div style={dotStyle("#28c840")}/>

                            <div style={{width: 8}}/>

                            {/* Light / Dark mode */}
                            <button style={modeBtnStyle("light")} onClick={() => setCurrentMode("light")}>
                                ☀ Light
                            </button>
                            <button style={modeBtnStyle("dark")} onClick={() => setCurrentMode("dark")}>
                                ◑ Dark
                            </button>

                            {/* Theme picker */}
                            <select
                                style={selectStyle}
                                value={currentTheme}
                                onChange={(e) => setCurrentTheme(e.target.value as PrismTheme)}
                            >
                                {themeList.map((t) => (
                                    <option key={t} value={t}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </option>
                                ))}
                            </select>

                            {/* Language picker */}
                            <select
                                style={selectStyle}
                                value={currentLang}
                                onChange={(e) => setCurrentLang(e.target.value)}
                            >
                                {SUPPORTED_LANGUAGES.map((l) => (
                                    <option key={l} value={l}>
                                        {l}
                                    </option>
                                ))}
                            </select>

                            {/* Options */}
                            <button style={toggleBtn(lineNums)} onClick={() => setLineNums((v) => !v)}>
                                # Lines
                            </button>
                            <button style={toggleBtn(wrap)} onClick={() => setWrap((v) => !v)}>
                                ↵ Wrap
                            </button>

                        </div>
                    </>
                )}
                {/* ── Code Block ── */}
                <pre
                    style={preStyle}
                    className={clsx(
                        "position-relative",
                        lineNums ?? "line-numbers"
                    )}
                >
                    <div className="position-absolute top-0 end-0 p-2">
                        <span style={langBadge}>{currentLang}</span>
                        <button style={copyBtnStyle} onClick={handleCopy}>{copied ? "✓ Copied" : "⎘ Copy"}</button>
                    </div>
                      <code
                          ref={codeRef}
                          className={`language-${currentLang}`}
                          style={{opacity: ready ? 1 : 0.4, transition: "opacity 0.2s"}}
                      >
                        {children.props.children}
                      </code>
                </pre>
            </div>
        </>
    );
}

