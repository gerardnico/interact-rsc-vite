// don't use the relative path (not resolved)
import {PageModule} from "src/interact/types/pageModule.js"

/**
 * The props of a layout/partials component
 */
export type TemplateProps = {
    pageModule: PageModule,
    request: Request,
};