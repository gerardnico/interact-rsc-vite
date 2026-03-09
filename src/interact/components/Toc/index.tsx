import type {TemplateProps, TocEntry} from "../../types/index.js";


export function Toc(layoutProps: TemplateProps) {
    let toc: TocEntry[] | undefined = layoutProps.pageModule?.toc;
    return (
        <nav className="toc-cs">
            <h5 className="mb-3">Table of Contents</h5>
            <ul className="list-unstyled">
                {toc && toc.map((heading, i) => (
                    <li key={i} className={`toc-level-${heading.depth} mb-2`}>
                        <a href={`#${heading.slug}`} className="text-decoration-none text-secondary">
                            {heading.value}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}