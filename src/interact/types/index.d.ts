/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />
// ambient virtual declare module file
/// <reference types="../markdown/conf/markdownConfModule.d.ts" />
/// <reference types="../componentsProvider/componentProviderModule.d.ts" />
/// <reference types="../pages/viteVirtualPagesModulesDef.d.ts" />
/// <reference types="../pages/interactPageModules.d.ts" />
/// <reference types="../config/viteVirtualConfModuleDef.d.ts" />


import type {PagesHandler} from "../pagesProviderManager/pagesProvider.d.ts"
import type {Page,Frontmatter,TocNode} from "../pages/interactPage.js";
import type{TemplateProps} from "../componentsProvider/templateComponent.js";

import {type InteractConfig} from "../config/configHandler.js"

export {InteractConfig, PagesHandler, Page,TemplateProps, Frontmatter, TocNode}


