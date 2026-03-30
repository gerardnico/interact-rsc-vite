/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />
// Ambient virtual declare module file
/// <reference types="../interact/componentsProvider/componentProviderModule.d.ts" />
/// <reference types="../interact/componentsProvider/layoutProviderModule.d.ts" />
/// <reference types="../interact/pages/viteVirtualPagesModulesDef.d.ts" />
/// <reference types="../interact/pages/interactPageModules.d.ts" />
/// <reference types="../interact/middlewareEngine/viteMiddlewareRegistryDef" />

import type {MiddlewareHandler, Middleware, MiddlewarePageResponse} from "../interact/middlewareEngine/interactMiddleware.d.ts"
import type {Page, Frontmatter, TocNode} from "../interact/pages/interactPage.js";
import type {ContextProps} from "../interact/componentsProvider/contextProps.js";

import {type InteractConfig} from "../interact/config/interactConfig.js"


export {
    InteractConfig,
    MiddlewareHandler,
    Middleware,
    MiddlewarePageResponse,
    Page,
    ContextProps,
    Frontmatter,
    TocNode
}


