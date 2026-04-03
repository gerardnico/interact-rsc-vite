import type {MiddlewareHandler} from "../../interact/middlewareEngine/interactMiddleware";
import type {ContextProps} from "../../interact/componentsProvider/contextProps";
import type {Page} from "../../interact/pages/interactPage";
import getModuleFromPageProvider from 'interact:page-modules';

/**
 * A middleware that returns the pages modules
 * Get a page module (jsx, tsx, ts, js, mdx)
 */
// noinspection JSUnusedGlobalSymbols - loaded dynamically via alias
export async function handler(): Promise<MiddlewareHandler> {


    return async function (context: ContextProps): Promise<Page | undefined> {

        return getModuleFromPageProvider({path: context.url.pathname});

    }
}