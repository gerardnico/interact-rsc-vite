"use client"

import * as React from "react"
import {Search, X} from "lucide-react"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {useSearchOpenState, useSearchProvider} from "@/components/contexts/SearchContext.tsx";
import type {SearchResult} from "@combostrap/interact/types";

export default function SearchBox() {
    /**
     * Global open state so that we can see if there is already a search box open
     * so that a ctrl+k binding will open the dialogue only once
     */
    const [globalOpen, setGlobalOpen] = useSearchOpenState()
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [loading, setLoading] = React.useState(false)
    const [activeValue, setActiveValue] = React.useState<string>('')
    const inputRef = React.useRef<HTMLInputElement>(null)
    const searchProvider = useSearchProvider();

    React.useEffect(() => {

        if (!query) {
            setResults([])
            return
        }

        const controller = new AbortController();
        setLoading(true)

        /**
         * Debounced run
         */
        const run = async () => {
            if (searchProvider == null) {
                return;
            }
            const items = await searchProvider.search(query, {
                limit: 8,
                abortSignal: controller.signal,
            })

            setResults(items.results)
            setLoading(false)
        }

        const debounce = setTimeout(run, 500)

        // clean up the effect (when the component unmounts or the query value change)
        // current fetch is then stop if the query is empty
        return () => {
            clearTimeout(debounce)
            controller.abort()
        }
    }, [query])

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onOpenChange()
            }
        }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [])

    /**
     * If there is 2 SearchBox in the tree, we avoid
     * to open them twice
     */
    function onOpenChange() {
        /**
         * If the local open is not the same as the global,
         * this is not the component that have opened it,
         * we return
         */
        if (open != globalOpen) {
            return
        }
        setOpen((o) => !o)
        setGlobalOpen((o) => !o)
    }


    const kbdClass = "inline-flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1 font-mono text-xs"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger
                render={
                    <Button
                        variant="outline"
                        className="relative w-full max-w-sm justify-start text-muted-foreground cursor-pointer"
                    >
                        <Search className="mr-2 h-4 w-4"/>
                        Search docs...
                        <kbd
                            className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </Button>
                }
            />
            <DialogContent
                className="fixed top-20 translate-y-0 p-0 gap-0 max-h-[calc(100vh-2rem)] md:max-w-1/2"
                initialFocus={inputRef}
                showCloseButton={false}
            >
                <Command
                    shouldFilter={false}
                    value={activeValue}
                    onValueChange={setActiveValue}
                >
                    <div className="relative">
                        <CommandInput
                            ref={inputRef}
                            placeholder="Search..."
                            value={query}
                            onValueChange={setQuery}
                            className={"bg-none pr-8"}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                            >
                                <X className="h-4 w-4"/>
                            </button>
                        )}
                    </div>
                    <CommandList>
                        {loading && query && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Searching...
                            </div>
                        )}
                        {!loading && query && (
                            <CommandEmpty>
                                {results.length === 0
                                    ? "No results found."
                                    : `${results.length} results found.`}
                            </CommandEmpty>
                        )}
                        {results.length > 0 && (
                            <CommandGroup heading="Results">
                                {results.map((r) => {
                                    return (
                                        <CommandItem
                                            key={r.id}
                                            value={r.url}
                                            onSelect={() => {
                                                history.pushState(null, '', r.url)
                                                setOpen(false)
                                            }}
                                            className="flex flex-col items-start gap-1"
                                        >
                                            <span className="font-medium">{r.title}</span>
                                            <span
                                                className="line-clamp-1 text-xs text-muted-foreground"
                                                dangerouslySetInnerHTML={{__html: r.excerpt}}
                                            />
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
                {/* fake status bar */}
                {activeValue && (
                    <div className="truncate border-t bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                        {activeValue}
                    </div>
                )}
                <div
                    className="flex items-center justify-between border-t border-border px-3 py-1.5 text-xs text-muted-foreground pt-3">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className={kbdClass}>↑</kbd>
                            <kbd className={kbdClass}>↓</kbd>
                            <span className="ml-0.5">Navigate</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className={kbdClass}>↵</kbd>
                            <span className="ml-0.5">Select</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className={kbdClass}>esc</kbd>
                            <span className="ml-0.5">Close</span>
                        </span>
                    </div>

                    <span className="flex items-center gap-1">
                        <kbd
                            className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1 font-mono text-xs">⌘</kbd>
                        <kbd
                            className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1 font-mono text-xs">K</kbd>
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    )
}