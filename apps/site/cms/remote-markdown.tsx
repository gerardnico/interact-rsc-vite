import type {MiddlewarePageResponse} from "@combostrap/interact/types";
import {markdownToPageSync} from "@combostrap/interact/markdown";

// noinspection JSUnusedGlobalSymbols - loaded dynamically
export async function handler({
                                  basePath = "https://raw.githubusercontent.com",
                                  prefix = "/github"
                              }: { basePath: string, prefix: string }) {
    return async (request: Request): Promise<MiddlewarePageResponse | undefined> => {

        const pathname = new URL(request.url).pathname

        // check if you handle the request
        if (!(pathname.startsWith(prefix) && pathname.endsWith(".md"))) {
            return
        }

        // fetch
        let target = pathname.slice(prefix.length + 1);
        const response = await fetch(`${basePath}/${target}`, {});
        const markdown = await response.text();

        // parse and return
        try {
            return {
                page: markdownToPageSync(markdown, {format: 'md'})
            };
        } catch (e) {
            return {
                status: 500,
                page: {
                    default:
                        () => {
                            return (
                                <>
                                    <p>An error has been seen while parsing:</p>
                                    <p>{String(e)}</p>
                                    <p>Content:</p>
                                    <pre dangerouslySetInnerHTML={{__html: markdown}}></pre>
                                </>
                            )
                        }
                }
            }
        }
    }
}