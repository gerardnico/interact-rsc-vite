import type {SearchOptions, SearchProviderInterface, SearchResponse, SearchResult} from "interact:search-provider";


export default class ComboSearch implements SearchProviderInterface {

    async onOpen() {
        return
    }

    search = async (query: string, opts?: SearchOptions): Promise<SearchResponse> => {
        const {limit = 10, abortSignal} = opts ?? {};
        
        if (abortSignal?.aborted) {
            throw new DOMException("Search aborted", "AbortError");
        }

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            return {results: []};
        }
        const url = new URL('http://localhost/search');
        url.searchParams.set('q', query);
        url.searchParams.set('limit', String(limit));

        const response = await fetch(url.toString(), {
            method: 'GET',
            signal: abortSignal,
        });

        if (!response.ok) {
            throw new Error(`Search request failed: ${response.status} ${response.statusText}`);
        }
        const items: SearchResult[] = await response.json()
        return {results: items}
    }


}