'use client'
import OpenAiIcon from "bootstrap-icons/icons/openai.svg"
import PdfIcon from "bootstrap-icons/icons/filetype-pdf.svg"
import MarkdownIcon from "bootstrap-icons/icons/filetype-md.svg"
import ClaudeIcon from "bootstrap-icons/icons/claude.svg"
import ChatIcon from "bootstrap-icons/icons/chat.svg"
import GitHubIcon from "bootstrap-icons/icons/github.svg"
import ChevronDown from "bootstrap-icons/icons/chevron-down.svg"


import React, {
    type ComponentProps,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";


type OpenUiElement = {
    hideSvg?: boolean
}
type OpenUiAnchorElement = React.AnchorHTMLAttributes<HTMLAnchorElement> & OpenUiElement
export type OpenUiInExternalAnchor = OpenUiAnchorElement & {
    query?: string
}
export type OpenInContentProps = ComponentProps<typeof DropdownMenuContent>
    & ComponentProps<typeof DropdownMenuTrigger>
export const OpenInContent = ({className, ...props}: OpenInContentProps) => {
    if (className == null) {
        className = "w-full"
    }
    return (<DropdownMenuContent
        align="start"
        className={className}
        {...props}
    />);
};
const OpenInContext = createContext<{ query: string | undefined }>({query: undefined});

const useOpenInContext = () => {
    const context = useContext(OpenInContext);
    if (!context) {
        throw new Error("OpenIn components must be used within an OpenIn provider");
    }
    return context;
};

export type OpenContextProps = {
    query?: string,
    children: React.ReactNode,
};

export const PageButtonContext = ({query: localQuery, children}: OpenContextProps) => {
    const [query, setQuery] = useState(localQuery);

    const currentHref = typeof window !== "undefined" ? window.location.href : undefined
    // Client component runs also on the server
    // windows is not known
    useEffect(() => {
        if (currentHref == null) {
            return;
        }
        // Window location href change for each page
        // so use effect run each time
        let actualPageLocation = new URL(currentHref);
        actualPageLocation.search = ''
        actualPageLocation.hash = ''
        if (actualPageLocation.pathname.endsWith("/")) {
            actualPageLocation.pathname = actualPageLocation.pathname + "index.md"
        } else {
            actualPageLocation.pathname = actualPageLocation.pathname + ".md"
        }
        setQuery(`Read this markdown page, I want to ask questions about it. ${actualPageLocation.toString()}`);
    }, [currentHref]);

    const contextValue = useMemo(() => ({query}), [query]);

    return (
        <OpenInContext.Provider value={contextValue}>
            {children}
        </OpenInContext.Provider>
    );
};

export const OpenInGitHubAnchor = ({href, children, hideSvg = false, ...props}: OpenUiAnchorElement) => {

    return (
        <a
            href={href}
            rel="noopener"
            target="_blank"
            {...props}
        >
            {!hideSvg && <GitHubIcon/>}
            <span>{children}</span>
        </a>
    );
};

export const OpenInChatGPTAnchor = ({
                                        query: localQuery,
                                        hideSvg = false,
                                        children,
                                        ...props
                                    }: OpenUiInExternalAnchor) => {
    const {query} = useOpenInContext();
    let finalQuery = query;
    if (!finalQuery) {
        finalQuery = localQuery;
    }
    if (finalQuery == null) {
        return <></>
    }
    let createUrl = (prompt: string) =>
        `https://chatgpt.com/?${new URLSearchParams({
            hints: "search",
            prompt,
        })}`;
    return (
        <a
            href={createUrl(finalQuery)}
            rel="noopener"
            target="_blank"
            {...props}
        >
            {!hideSvg && <OpenAiIcon fill={"#000000"}/>}
            <span>{children}</span>
        </a>
    );
};
export const OpenInSciraAnchor = ({query: localQuery, hideSvg = false, children, ...props}: OpenUiInExternalAnchor) => {
    const {query} = useOpenInContext();
    let finalQuery = query;
    if (!finalQuery) {
        finalQuery = localQuery;
    }
    if (finalQuery == null) {
        return <></>
    }
    let createUrl = (q: string) =>
        `https://scira.ai/?${new URLSearchParams({
            q,
        })}`;
    let sciraIcon = (
        <svg
            fill="none"
            stroke="#000000"
            height="934"
            viewBox="0 0 910 934"
            width="910"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>Scira AI</title>
            <path
                d="M647.664 197.775C569.13 189.049 525.5 145.419 516.774 66.8849C508.048 145.419 464.418 189.049 385.884 197.775C464.418 206.501 508.048 250.131 516.774 328.665C525.5 250.131 569.13 206.501 647.664 197.775Z"
                strokeLinejoin="round"
                strokeWidth="8"
            />
            <path
                d="M516.774 304.217C510.299 275.491 498.208 252.087 480.335 234.214C462.462 216.341 439.058 204.251 410.333 197.775C439.059 191.3 462.462 179.209 480.335 161.336C498.208 143.463 510.299 120.06 516.774 91.334C523.25 120.059 535.34 143.463 553.213 161.336C571.086 179.209 594.49 191.3 623.216 197.775C594.49 204.251 571.086 216.341 553.213 234.214C535.34 252.087 523.25 275.491 516.774 304.217Z"
                strokeLinejoin="round"
                strokeWidth="8"
            />
            <path
                d="M857.5 508.116C763.259 497.644 710.903 445.288 700.432 351.047C689.961 445.288 637.605 497.644 543.364 508.116C637.605 518.587 689.961 570.943 700.432 665.184C710.903 570.943 763.259 518.587 857.5 508.116Z"
                strokeLinejoin="round"
                strokeWidth="20"
            />
            <path
                d="M700.432 615.957C691.848 589.05 678.575 566.357 660.383 548.165C642.191 529.973 619.499 516.7 592.593 508.116C619.499 499.533 642.191 486.258 660.383 468.066C678.575 449.874 691.848 427.181 700.432 400.274C709.015 427.181 722.289 449.874 740.481 468.066C758.673 486.258 781.365 499.533 808.271 508.116C781.365 516.7 758.673 529.973 740.481 548.165C722.289 566.357 709.015 589.05 700.432 615.957Z"
                strokeLinejoin="round"
                strokeWidth="20"
            />
            <path
                d="M889.949 121.237C831.049 114.692 798.326 81.9698 791.782 23.0692C785.237 81.9698 752.515 114.692 693.614 121.237C752.515 127.781 785.237 160.504 791.782 219.404C798.326 160.504 831.049 127.781 889.949 121.237Z"
                strokeLinejoin="round"
                strokeWidth="8"
            />
            <path
                d="M791.782 196.795C786.697 176.937 777.869 160.567 765.16 147.858C752.452 135.15 736.082 126.322 716.226 121.237C736.082 116.152 752.452 107.324 765.16 94.6152C777.869 81.9065 786.697 65.5368 791.782 45.6797C796.867 65.5367 805.695 81.9066 818.403 94.6152C831.112 107.324 847.481 116.152 867.338 121.237C847.481 126.322 831.112 135.15 818.403 147.858C805.694 160.567 796.867 176.937 791.782 196.795Z"
                strokeLinejoin="round"
                strokeWidth="8"
            />
            <path
                d="M760.632 764.337C720.719 814.616 669.835 855.1 611.872 882.692C553.91 910.285 490.404 924.255 426.213 923.533C362.022 922.812 298.846 907.419 241.518 878.531C184.19 849.643 134.228 808.026 95.4548 756.863C56.6815 705.7 30.1238 646.346 17.8129 583.343C5.50207 520.339 7.76433 455.354 24.4266 393.359C41.089 331.364 71.7099 274.001 113.947 225.658C156.184 177.315 208.919 139.273 268.117 114.442"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="30"
            />
        </svg>
    );
    return (
        <a
            href={createUrl(finalQuery)}
            {...props}>
            {!hideSvg && sciraIcon}
            <span>{children}</span>
        </a>
    );
};

export const OpenInVoAnchor = ({query: localQuery, hideSvg = false, children, ...props}: OpenUiInExternalAnchor) => {
    const {query} = useOpenInContext();
    let finalQuery = query;
    if (!finalQuery) {
        finalQuery = localQuery;
    }
    if (finalQuery == null) {
        return <></>
    }
    let createUrl = (q: string) =>
        `https://v0.app?${new URLSearchParams({
            q,
        })}`;
    let voIcon = (
        <svg
            fill="#000000"
            viewBox="0 0 147 70"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>v0</title>
            <path
                d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z"/>
            <path
                d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z"/>
        </svg>
    );
    return (
        <a
            href={createUrl(finalQuery)}
            rel="noopener"
            target="_blank"
            {...props}
        >
            {!hideSvg && voIcon}
            <span>{children}</span>
        </a>
    );
};
export const OpenInT3Anchor = ({query: localQuery, hideSvg = false, children, ...props}: OpenUiInExternalAnchor) => {
    const {query} = useOpenInContext();
    let finalQuery = query;
    if (!finalQuery) {
        finalQuery = localQuery;
    }
    if (finalQuery == null) {
        return <></>
    }
    let createUrl = (q: string) =>
        `https://t3.chat/new?${new URLSearchParams({
            q,
        })}`;
    return (
        <a
            href={createUrl(finalQuery)}
            target="_blank"
            rel="noopener"
            {...props}>
            {!hideSvg && <ChatIcon fill={"#000000"}/>}
            <span>{children}</span>
        </a>
    );
};
export const OpenInCursorAnchor = ({
                                       query: localQuery,
                                       hideSvg = false,
                                       children,
                                       ...props
                                   }: OpenUiInExternalAnchor) => {
    const {query} = useOpenInContext();
    let finalQuery = query;
    if (!finalQuery) {
        finalQuery = localQuery;
    }
    if (finalQuery == null) {
        return <></>
    }
    let createUrl = (text: string) => {
        const url = new URL("https://cursor.com/link/prompt");
        url.searchParams.set("text", text);
        return url.toString();
    };
    let cursorIcon = (
        <svg
            version="1.1"
            viewBox="0 0 466.73 532.09"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
        >
            <title>Cursor</title>
            <path
                d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z"
            />
        </svg>
    );

    return (
        <a
            href={createUrl(finalQuery)}
            rel="noopener"
            target="_blank"
            {...props}
        >
            {!hideSvg && cursorIcon}
            <span>{children}</span>
        </a>
    );
};
export const OpenAsMarkdownAnchor = ({children, href: hrefLocal, hideSvg = false, ...props}: OpenUiInExternalAnchor & {
    href?: string
}) => {
    const [href, setHref] = useState(hrefLocal);

    // Client component runs also on the server in SSR mode
    // where window is not known
    useEffect(() => {
        let url = new URL(window.location.href)
        if (url.pathname.endsWith("/")) {
            url.pathname = url.pathname + "index.md";
        } else {
            url.pathname = url.pathname + ".md";
        }
        setHref(url.toString());
    });

    return (
        <a
            href={href}
            rel="noopener"
            target="_blank"
            {...props}
        >
            {!hideSvg && <MarkdownIcon fill={"#000000"}/>}
            <span>{children}</span>
        </a>
    );

}
export const OpenInClaudeAnchor = ({query: localQuery, hideSvg, children, ...props}: OpenUiInExternalAnchor) => {
    const {query} = useOpenInContext();
    let finalQuery = query;
    if (!finalQuery) {
        finalQuery = localQuery;
    }
    if (finalQuery == null) {
        return <></>
    }
    let createUrl = (q: string) =>
        `https://claude.ai/new?${new URLSearchParams({
            q,
        })}`
    return (
        <a
            href={createUrl(finalQuery)}
            rel="noopener"
            target="_blank"
            {...props}
        >
            {!hideSvg && <ClaudeIcon fill={"#d97757"}/>}
            <span>{children || "Open In Claude"}</span>
        </a>
    );
};
export const OpenAsPdfAnchor = ({children, href, hideSvg = false, ...props}: OpenUiInExternalAnchor & {
    href: string
}) => {
    return (
        <a
            href={href}
            rel="noopener"
            target="_blank"
            {...props}
        >
            {!hideSvg && <PdfIcon fill={"#000000"}/>}
            <span>{children || "Open as Pdf"}</span>
        </a>
    );
};


// noinspection JSUnusedGlobalSymbols
export function PageMenuButton({children, variant = "default", query, render, ...props}: OpenInContentProps &
    {
        render?: RenderNodeType,
        variant?: 'default' | 'split',
        query?: string,
    }) {


    if (variant == "default") {
        if (render == null) {
            render = (
                <Button type="button" variant="outline">
                    Copy / Open <ChevronDown className="size-4"/>
                </Button>
            )
        }
        return (
            <PageButtonContext query={query}>
                <PageMenuDropDown render={render as any} {...props}>
                    {children}
                </PageMenuDropDown>
            </PageButtonContext>
        )
    }
    if (render == null) {
        render = <CopyAsMarkdownButton/>
    }

    let styledButton = React.cloneElement(render, {
        className: cn("group/button inline-flex shrink-0 px-2 items-center justify-center rounded-lg no-underline h-8 text-black border rounded-r-none border-r-0", render.props.className),
        hideSvg: true
    } as any)

    let leftRender = (<Button type="button" variant={"outline"} className={"rounded-l-none px-2"}>
        <ChevronDown className="size-4"/>
    </Button>)

    return (
        <PageButtonContext query={query}>
            <div className="flex">
                {styledButton}
                <PageMenuDropDown render={leftRender}>
                    {children}
                </PageMenuDropDown>
            </div>
        </PageButtonContext>
    )
}

const STATES = {IDLE: "Idle", LOADING: "Loading", COPIED: "Copied", SUCCESS: "Success", ERROR: "Error"};

export function CopyAsMarkdownButton({
                                         children,
                                         hideSvg = false,
                                         ...props
                                     }: ComponentProps<typeof Button> & OpenUiElement) {
    const [status, setStatus] = useState(STATES.IDLE);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [markdownUrl, setMarkdownUrl] = useState("");

    useEffect(() => {
        let pageUrl = new URL(window.location.href)
        pageUrl.pathname = pageUrl.pathname + ".md";
        const finalUrl = pageUrl.toString();
        if (finalUrl != markdownUrl) {
            setMarkdownUrl(finalUrl);
            setStatus(STATES.IDLE);
            setContent("");
            setError("");
        }
    });

    const handleCopy = async () => {
        setError("");
        try {
            let fetchedContent: string | undefined;
            if (content == "") {
                setStatus(STATES.LOADING);
                const res = await fetch(markdownUrl);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                fetchedContent = await res.text();
                if (!fetchedContent) throw new Error("Empty response from server");
                setContent(fetchedContent);
                setStatus(STATES.SUCCESS);
            }
            try {
                await navigator.clipboard.writeText(fetchedContent || content);
                setStatus(STATES.COPIED);
            } catch {
                setError("Clipboard access denied.");
            }
        } catch (err) {
            setError((err as Error).message || "Failed to fetch URL");
            setStatus(STATES.ERROR);
        }
    };
    return (
        <Button type="button" variant={"outline"} onClick={handleCopy} {...props}>
            {!hideSvg && <MarkdownIcon fill={"#000000"}/>}
            <span>
                {children || 'Copy as Markdown'}
                {status != STATES.IDLE ? ` (${status.toLowerCase()})` : ""}
                {error != "" ? `Error: ${error}` : ""}
            </span>
        </Button>
    )
}

function PageMenuDropDown({children, render}: {
    children: React.ReactNode,
    render?: RenderNodeType;
}) {
    /**
     * Children are expected to be an anchor or a button with a svg and a span
     * We style them
     */
    let styledChildren = React.Children.map(children, (child) => {
        // Only process valid React elements
        if (!React.isValidElement(child)) return child;

        // Clone the <a> and add flex classes
        const anchorOrButtonChild = child as React.ReactElement<
            React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
        >;

        // Walk the anchor's children and style <svg> + <span>
        const styledAnchorChildren = React.Children.map(
            anchorOrButtonChild.props.children,
            (anchorChild) => {
                if (!React.isValidElement(anchorChild)) return anchorChild;

                const el = anchorChild as React.ReactElement<{ className?: string }>;
                const type = el.type as string;

                if (type === "svg") {
                    return React.cloneElement(el, {
                        className: cn("shrink-0", el.props.className),
                    });
                }

                if (type === "span") {
                    return React.cloneElement(el, {
                        className: cn("flex-1 text-foreground", el.props.className),
                    });
                }

                return anchorChild;
            }
        );
        const childStyled = React.cloneElement(anchorOrButtonChild, {
            className: "flex items-center gap-2 no-underline text-black bg-white border-0 font-normal btn-link px-0 rounded-none h-auto",
            children: styledAnchorChildren,
        })
        return (
            <DropdownMenuItem>
                {childStyled}
            </DropdownMenuItem>
        )
    })
    if (render == null) {
        render = (
            <Button type="button" variant={"outline"}>
                <ChevronDown className="size-4"/>
            </Button>
        );
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={render}/>
            <OpenInContent>
                {styledChildren}
            </OpenInContent>
        </DropdownMenu>
    )
}

type RenderNodeType = React.ReactElement<
    React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
>

