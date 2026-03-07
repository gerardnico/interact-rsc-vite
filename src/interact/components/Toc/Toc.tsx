import type {LayoutProps, TocEntry} from "../../types/index.js";


export function Toc(layoutProps: LayoutProps) {
    let toc: TocEntry[] | undefined = layoutProps?.pageModule?.toc;
    return (
        <nav className="toc-cs">
            <h5 className="mb-3">Table of Contents</h5>
            <ul className="list-unstyled">
                {toc && toc.map((heading) => (
                    <li className={`toc-level-${heading.depth} mb-2`}>
                        <a href={`#${heading.slug}`} className="text-decoration-none text-secondary">
                            {heading.value}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}