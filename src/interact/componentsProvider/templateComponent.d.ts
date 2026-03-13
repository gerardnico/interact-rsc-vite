// don't use the relative path (not resolved)
import type {Page} from "@combostrap/interact/types"

/**
 * The props of a layout/partials component
 */
export type TemplateProps = {
    page: Page,
    request: Request,
};