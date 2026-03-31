"use client"

import React, {useState, useEffect, useRef, useCallback} from "react";
import clsx from "clsx";
import styles from "./code.module.css"

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
    children: React.ReactElement<React.HTMLAttributes<HTMLPreElement>, 'mark'> | string;
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

let cdnBase = "https://cdn.jsdelivr.net/npm/prismjs@1.30.0";

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

function loadStylesheet(href: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const existing = document.getElementById(id);
        if (existing) {
            (existing as HTMLLinkElement).href = href;
            return;
        }
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load: ${href}`));
        document.head.appendChild(link);
    });
}

async function loadPrismCore(): Promise<void> {
    if (prismCoreLoaded) return;
    if (prismCorePromise) return prismCorePromise;

    prismCorePromise = loadScript(`${cdnBase}/components/prism-core.min.js`
    ).then(() => {
        prismCoreLoaded = true;
    });

    return prismCorePromise;
}

async function loadPrismPlugin(plugin: string, withStyleSheet: boolean = true): Promise<void> {
    if (loadedPlugins.has(plugin)) return;
    const base = `${cdnBase}/plugins/`;
    await loadScript(`${base}${plugin}/prism-${plugin}.min.js`);
    if (withStyleSheet) {
        await loadStylesheet(
            `${base}${plugin}/prism-${plugin}.min.css`,
            `prism-plugin-${plugin}`
        );
    }
    loadedPlugins.add(plugin);
}


type colorMode = "light" | "dark";

function getLanguageFromChildren(children: React.ReactElement<React.HTMLAttributes<HTMLPreElement>, 'mark'> | string) {
    let lang = "txt"
    if (typeof children == "string") {
        // should not
        // code wraps directly
        return null
    }
    if (children?.props == null) {
        return null;
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

function isLazyComponent(child: unknown): child is React.LazyExoticComponent<React.ComponentType<any>> {
    return (
        typeof child === 'object' &&
        child !== null &&
        '$$typeof' in child &&
        (child as any).$$typeof === Symbol.for('react.lazy')
    );
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


    // When there is a bad syntax between Markdown Block element and inline element
    // We may get this
    if (isLazyComponent(children)) {
        if (import.meta.env.MODE !== "production") {
            return "Lazy element detected. Possible errors: A Block element in markdown is not on its own line";
        }
        return "";
    }

    let themeProp;
    const [currentMode, setCurrentMode] = useState<colorMode>("light");
    const [currentTheme, setCurrentTheme] = useState<PrismTheme>(
        themeProp ?? (currentMode === "dark" ? "okaidia" : "default")
    );

    const [currentLang, setCurrentLang] = useState(lang ? lang : getLanguageFromChildren(children) || "txt");
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
        // noinspection JSIgnoredPromiseFromCall
        loadStylesheet(`${cdnBase}/themes/${THEME_CDN[currentTheme]}`, "prism-theme");
    }, [currentTheme]);

    // Load Prism + plugins + language, then highlight
    const highlight = useCallback(async () => {
        await loadPrismCore();

        // autoloader is needed to load the language dependencies
        // example: tsx depends on ts
        await loadPrismPlugin("autoloader", false);

        if (lineNums) await loadPrismPlugin("line-numbers");

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


    let code: string | null = null;
    if (typeof children === "string") {
        code = children
    } else {
        if (typeof children.props.children === "string") {
            code = children.props.children
        } else {
            // The parsing should stop, and we don't have implemented that in micromark
            // We get here paragraph and the like element
            code = `Error: Code not detected.\nWe don't support yet the Code element directly in Markdown use backtick instead.`
        }
    }
    {/*  Trim because the IDE default format may add line before and after */
    }
    code = code.trim()

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code || "");
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


    return (
        <>
            {/* Google Font for JetBrains Mono */}
            <link
                href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
                rel="stylesheet"
            />

            <div className={
                clsx("position-relative",
                    styles["shell"]
                )} style={shell} {...rest}>
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
                <div className={
                    clsx(
                        "position-absolute top-0 end-0 p-2",
                        styles["showOnHover"]
                    )}
                >
                    <span style={langBadge}>{currentLang}</span>
                    <button style={copyBtnStyle} onClick={handleCopy}>{copied ? "✓ Copied" : "⎘ Copy"}</button>
                </div>
                {/* ── Code Block ── */}
                <pre
                    className={clsx(
                        lineNums ?? "line-numbers",
                        styles["preStyle"]
                    )}
                >
                      <code
                          ref={codeRef}
                          className={`language-${currentLang}`}
                          style={{opacity: ready ? 1 : 0.4, transition: "opacity 0.2s"}}
                      >
                        {code}
                      </code>
                </pre>
            </div>
        </>
    );
}

