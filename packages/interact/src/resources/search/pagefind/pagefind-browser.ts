"use client"


import type {PagefindInstance} from "./pagefind-search";
import type {
    SearchOptions, SearchProvider, SearchResponse,
    SearchResult
} from "interact:search-provider";


let pagefindBrowser: PagefindInstance | null = null

// ie .interact/search
declare const __SEARCH_RELATIVE_BASE_URL__: string;

// noinspection JSUnusedGlobalSymbols
export default class PageFind implements SearchProvider {

    private pagefindUrl: string;
    private baseurl: string;
    private highlightParam: string | undefined;


    constructor(options?: { baseUrl?: string, highlightParam?: string | undefined }) {
        const {baseUrl = import.meta.env.BASE_URL, highlightParam = "highlight"} = options || {};
        const relativeBasePath = `${__SEARCH_RELATIVE_BASE_URL__}/pagefind.js`;
        this.baseurl = baseUrl;
        this.highlightParam = highlightParam;
        if (this.baseurl != "/") {
            this.pagefindUrl = `${baseUrl}/${relativeBasePath}`
        } else {
            this.pagefindUrl = `${baseUrl}${relativeBasePath}`
        }
    }

    async loadPagefind(): Promise<PagefindInstance> {

        if (pagefindBrowser == null) {
            pagefindBrowser = await import(/* @vite-ignore */ this.pagefindUrl) as PagefindInstance;
            await pagefindBrowser.options({
                highlightParam: this.highlightParam,
                baseUrl: this.baseurl,
            });
        }
        return pagefindBrowser
    }

    onOpen() {
        return this.loadPagefind();
    }

    search = async (query: string, opts?: SearchOptions): Promise<SearchResponse> => {
        const {limit = 10, abortSignal} = opts ?? {};

        if (abortSignal?.aborted) {
            return {
                ok: false,
                error: "Search aborted",
                status: 400,
            }
        }

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            return {ok: true, data: []};
        }
        const pagefind = await this.loadPagefind()
        const search = await pagefind.search(query)

        const items = await Promise.all(
            search.results.slice(0, limit).map(async (r) => {
                const data = await r.data()

                function removeHtmlExtension(input: string) {
                    const [pathAndQuery = '', hash] = input.split('#');
                    const [path = '', query] = pathAndQuery.split('?');
                    const newPath = path.replace(/\.html$/i, '');
                    return newPath + (query ? '?' + query : '') + (hash ? '#' + hash : '');
                }

                const url = removeHtmlExtension(data.url);
                return {
                    id: r.id,
                    url: url,
                    title: data.meta?.["title"] ?? data.url,
                    excerpt: data.excerpt,
                    score: r.score,
                } as SearchResult;
            })
        );
        return {ok: true, data: items}
    };

}
