// don't use the relative path (not resolved)
import type { PageModule } from "interact:page-modules";

/**
 * The props of a layout component
 */
export type LayoutProps = {
    pageModule: PageModule,
    request: Request,
};