// don't use the relative path (not resolved)
import type {InteractPageType} from "@combostrap/interact/types"

/**
 * The props of a layout/partials component
 */
export type TemplateProps = {
    page: InteractPageType,
    request: Request,
};