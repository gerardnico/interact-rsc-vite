import type {TemplateProps, TocEntry} from "../../types/index.js";
import "./toc.css"
import interactConfig from "interact:config";
import type {InteractConfigType} from "../../config/configHandler.js";

/**
 * Otherwise we don't get any TypeScript error
 */
let interactConfigTyped = interactConfig as InteractConfigType;

interface TocProps extends TemplateProps {
    maxDepth?: number;
}

function TocItems({entries, maxDepth, currentDepth = 1}: {
    entries: TocEntry[],
    maxDepth: number,
    currentDepth?: number
}) {
    if (currentDepth > maxDepth) return null;

    return (
        <ul>
            {entries.map((heading, i) => (
                <li key={i} className={`toc-entry toc-level-${heading.depth}`}>
                    <a href={`#${heading.id}`}>
                        {heading.value}
                    </a>
                    {heading.children && heading.children.length > 0 && (
                        <TocItems entries={heading.children} maxDepth={maxDepth} currentDepth={currentDepth + 1}/>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default function Toc({maxDepth, ...layoutProps}: TocProps) {
    if (maxDepth == null) {
        maxDepth = interactConfigTyped.components.Toc?.props?.maxDepth;
        if (maxDepth == null) {
            maxDepth = 3
        }
    }
    const toc: TocEntry[] | undefined = layoutProps.pageModule?.toc;
    /**
     * The selector is a class so that we can put more than one
     * for documentation purposes
     */
    return (
        <nav className="toc">
            <p className="toc-header">Table of Contents</p>
            {toc && <TocItems entries={toc} maxDepth={maxDepth}/>}
        </nav>
    );
}