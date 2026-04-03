/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />
// Ambient virtual declare module file
/// <reference types="../interact/vite/mdxComponentProviderModule.d.ts" />
/// <reference types="../interact/vite/layoutProviderModule.d.ts" />
/// <reference types="../interact/vite/pagesProviderModule.d.ts" />
/// <reference types="../interact/pages/interactPageModules.d.ts" />
/// <reference types="../interact/vite/middlewareProviderModule.js" />

import type {InteractMarkdownConfig} from "./markdownConfig.js";
import type {MiddlewareHandler, Middleware, ReactNodeResponse} from "../interact/middlewareEngine/interactMiddleware.d.ts"
import type {Page, Frontmatter, TocNode} from "../interact/pages/interactPage.js";
import type {ContextProps, LayoutProps} from "../interact/componentsProvider/contextProps.js";

import {type InteractConfig} from "../interact/config/interactConfig.js"

import type {InteractCommand} from "../cli/shared/vite.config.js";

export {
    InteractConfig,
    InteractMarkdownConfig,
    InteractCommand,
    MiddlewareHandler,
    Middleware,
    Page,
    ReactNodeResponse,
    ContextProps,
    LayoutProps,
    Frontmatter,
    TocNode
}


