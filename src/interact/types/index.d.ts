/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />
// Ambient virtual declare module file
/// <reference types="../componentsProvider/componentProviderModule.d.ts" />
/// <reference types="../pages/viteVirtualPagesModulesDef.d.ts" />
/// <reference types="../pages/interactPageModules.d.ts" />

import type {MiddlewareHandler, Middleware, MiddlewarePageResponse} from "../middlewareEngine/interactMiddleware.d.ts"
import type {Page, Frontmatter, TocNode} from "../pages/interactPage.js";
import type {ContextProps} from "../componentsProvider/contextProps.js";

import {type InteractConfig} from "../config/interactConfig.js"


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


