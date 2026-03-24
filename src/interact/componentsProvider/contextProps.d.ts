// don't use the relative path (not resolved)
import type {Page} from "@combostrap/interact/types"

/**
 * These props are passed to layout and partials component
 */
export type ContextProps = {
    page: Page,
    request: Request,
};