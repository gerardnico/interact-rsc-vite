import type {TemplateProps} from "../../types/index.js";


export function Header(layoutProps: TemplateProps) {

    let title = layoutProps.page?.frontmatter?.title;
    if (!title) {
        title = new URL(layoutProps.request.url).pathname.slice(1);
    }
    return (
        <header id="main-header">
            {title &&
                <h1 className="h1 outline-heading-cs heading-cs heading-h1-cs">{title}</h1>
            }
        </header>
    )
}