import type {SearchOptions, SearchProvider, SearchResponse, SearchResult} from "interact:search-provider";

// noinspection JSUnusedGlobalSymbols - used dynamically in a virtual module
export default class ComboSearch implements SearchProvider {

    async onOpen() {
        return
    }

    search = async (query: string, opts?: SearchOptions): Promise<SearchResponse> => {
        const {limit = 8, abortSignal} = opts ?? {};

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

        const url = new URL('http://localhost/search');
        url.searchParams.set('q', query);
        url.searchParams.set('limit', String(limit));

        const response = await fetch(url.toString(), {
            method: 'GET',
            signal: abortSignal,
        });

        if (!response.ok) {
            return {
                ok: false,
                error: response.statusText,
                status: response.status,
            }
        }
        const items: SearchResult[] = await response.json()
        return {
            ok: true,
            data: items
        }
    }


}