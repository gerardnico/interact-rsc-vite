// noinspection JSUnusedGlobalSymbols - it's exported
declare module 'interact:search-provider' {

    export interface SearchOptions {
        /** Max results to return */
        limit?: number;
        /**
         * To cancel old requests on new keystroke
         * (the search provider should pass it to the fetch)
         **/
        abortSignal?: AbortSignal;
    }

    export interface SearchResult {
        /**
         * An id
         */
        id: string;
        /**
         * Page title
         */
        title: string;
        /**
         * Excerpt of why this page was selected
         * (Generally with the mark element to highlight the
         * found words)
         */
        excerpt: string;
        /**
         * Relative URL so that the search can be tested
         * on localhost (May have an anchor to a section)
         */
        url: string;
        /**
         * Relevance score
         */
        score: number;
    }

    // TypeScript discriminated unions to enoce an ok
    export type SearchResponse =
        | { ok: true; data: SearchResult[] }
        | { ok: false; error: string; status: number };

    export interface SearchProviderInterface {
        /**
         * Hook that is executed when the dialogue open
         * (to load a JavaScript module)
         * It must be idempotent to not execute uit each time
         */
        onOpen: () => Promise<Void>;
        /**
         * A search
         */
        search: (query: string, opts?: SearchOptions) => Promise<SearchResponse>;
    }

    // noinspection JSUnusedGlobalSymbols - used
    export default class SearchProvider implements SearchProviderInterface {
        onOpen: () => Promise<Void>;
        search: (query: string, opts?: SearchOptions) => Promise<SearchResponse>;
    }

}