
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import rehypeRemoveNoPrint from "../../interact/markdown/plugins/rehype-remove-no-print";
import {getMarkdownConfig} from "../../interact/markdown/conf/markdownConfig";

export default function htmlToMarkdown(html: string) {

    const markdown = unified()
        .use(rehypeParse)       // HTML string → hast
        .use(getMarkdownConfig().getMdConfig().rehypePlugins || [])
        .use(rehypeRemoveNoPrint) // Delete element with print:hidden
        .use(rehypeRemark)      // hast → mdast
        .use(getMarkdownConfig().getMdConfig().remarkPlugins || [])
        .use(remarkStringify)   // mdast → markdown string
        .processSync(html)

    return String(markdown);
}