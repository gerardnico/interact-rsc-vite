// don't drop the .d.ts extension, ts extension should be js
export * from "../config/viteVirtualConfModuleDef.d.ts"
export * from "../pages/pageModule.d.ts";
export * from "../pages/viteVirtualPagesModulesDef.d.ts"
export * from "../componentsProvider/templateComponent.d.ts"
export * from "../componentsProvider/componentProviderModule.d.ts"
export * from "../markdown/conf/markdownConfModule.js"
import {type InteractConfigType} from "../config/configHandler.js"

export {InteractConfigType}
