// don't use the relative path (not resolved)
import {PageModule} from "pageModule.js"

/**
 * The props of a layout component
 */
export type LayoutProps = {
    pageModule: PageModule,
    request: Request,
};