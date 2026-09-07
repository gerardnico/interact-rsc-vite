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

export interface SearchResponse {
    results: SearchResult[];
}


export interface SearchProvider {

    search: (query: string, opts?: SearchOptions) => Promise<SearchResponse>;

}