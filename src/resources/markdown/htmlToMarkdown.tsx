
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'

export default function htmlToMarkdown(html: string) {

    const markdown = unified()
        .use(rehypeParse)       // HTML string → hast
        .use(rehypeRemark)      // hast → mdast
        .use(remarkStringify)   // mdast → markdown string
        .processSync(html)

    return String(markdown);
}