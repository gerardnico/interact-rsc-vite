import {z} from 'zod';

/**
 * It's not in a .d.ts file as they contain only TypeScript types (no runtime code)
 * and are deleted at build time
 */

const colorsSchema = z.object({
    defaultMode: z.enum(['light', 'dark']).default('light'),
    primary: z.string().default("#906296"),
})

const image = z.object({
    href: z.string().optional(),
    type: z.string().describe("The type (ie image/png or image/svg+xml)").optional(),
    width: z.number().optional(),
    height: z.number().optional(),
}).describe("An image")
const favicon = z.object({
    rel: z.enum(['shortcut icon', 'icon', 'apple-touch-icon']).describe("The link rel (ie the type)"),
    image: image.describe("The image").optional()
}).describe("A favicon image")
export type FaviconType = z.infer<typeof favicon>;
const FaviconSetSchema = z.record(z.string().describe("The path"), favicon.nullable())
export type FaviconSetSchemaType = z.infer<typeof FaviconSetSchema>;

const siteSchema = z.object({
    url: z.string().describe("The URL (Used in the sitemap)").optional(),
    base: z.string().describe("Path added to the site URL (Example: /docs)").default(""),
    name: z.string().describe("The short name (used in the app manifest)").default("Website"),
    title: z.string().describe("The title (used on the logo description, as index page title, in the app manifest as name)").default("Website"),
    masterFavicon: z.string().describe("The master svg favicon (used to generate the derived favicons)").default("public/favicon.svg"),
    favicons: FaviconSetSchema.describe("The favicons (logos)").optional(),
}).describe("The site/app data")

let logoSchema = z.object({
    src: z.string().default("/favicon.svg"),
    alt: z.string().optional(),
    width: z.number().default(24),
    height: z.number().default(24)
});
let navBarSchema = z.object({
    brandName: z.string().default("Brand").nullable(),
    logo: logoSchema.default(logoSchema.parse({})),
});
let tocSchema = z.object({
    minItems: z.number().default(2),
    maxDepth: z.number().default(3),
});
let pageSchema = z.object({
    // https://getbootstrap.com/docs/5.3/layout/containers/
    containerClass: z.enum(['container', 'container-fluid', 'container-sm', 'container-md', 'container-lg', 'container-xl', 'container-xxl']).default('container'),
    // with the unit please
    containerMaxWidth: z.string().optional()
});
let layoutSchema = z.object({
    navBar: navBarSchema.default(navBarSchema.parse({})),
    toc: tocSchema.default(tocSchema.parse({})),
    page: pageSchema.default(pageSchema.parse({}))
});

/**
 * Theme configuration type
 */
let ThemeConfigSchema = z.object({
    colors: colorsSchema.default(colorsSchema.parse({})),
    site: siteSchema.default(siteSchema.parse({})),
    layouts: layoutSchema.default(layoutSchema.parse({})),
});

/**
 * Components
 */
const ComponentsConfigSchema = z.object({
    // Physique path does not work well: ie with ./node_modules/`${interactPackageJson.name}/src/components`
    // we get: could not resolve "./node_modules/@gerardnico/interact-astro/src/components/H2/H2.tsx"
    // path below should be set in the exports of package.json
    // We derived them with import.meta.resolve
    importPath: z.string(),
});
const ComponentsConfigSetSchema = z.record(z.string(), ComponentsConfigSchema.nullable());
export type ComponentsConfigSetSchemaType = z.infer<typeof ComponentsConfigSetSchema>;


// No file system path, it's derived thanks to import, and it does not work well with vite and import
// as they don't handle symlink well
const interactComponentBaseDirectory = `@gerardnico/interact-astro/components`
const components: ComponentsConfigSetSchemaType = {
    "Avatar": {
        importPath: `${interactComponentBaseDirectory}/Avatar`
    },
    "Block": {
        importPath: `${interactComponentBaseDirectory}/Block`
    },
    "a": {
        importPath: `${interactComponentBaseDirectory}/Anchor`
    },
    "h2": {
        importPath: `${interactComponentBaseDirectory}/H2`
    },
    "h3": {
        importPath: `${interactComponentBaseDirectory}/H3`
    },
    "Grid": {
        importPath: `${interactComponentBaseDirectory}/Grid`
    },
    "GridCell": {
        importPath: `${interactComponentBaseDirectory}/GridCell`
    },
    "Text": {
        importPath: `${interactComponentBaseDirectory}/Text`
    },
    "Para": {
        importPath: `${interactComponentBaseDirectory}/Para`
    },
    "RufflePlayer": {
        importPath: `${interactComponentBaseDirectory}/RufflePlayer`
    },
    "StarRating": {
        importPath: `${interactComponentBaseDirectory}/StarRating`
    }
}

/**
 * Plugins
 */
const PluginConfigSchema = z.object({
    path: z.string().optional(),
    props: z.record(z.string(), z.any()).optional(),
    type: z.enum(['remark', 'rehype']).optional(),
});

export type PluginConfig = z.infer<typeof PluginConfigSchema>;
const PluginConfigSetSchema = z.record(z.string(), PluginConfigSchema.nullable());
export type PluginConfigSetSchemaType = z.infer<typeof PluginConfigSetSchema>;
const plugins: PluginConfigSetSchemaType = {
    "rehype-github-alerts": {},
    "rehype-href-rewrite": {},
    "remark-link-checker": {
        props: {strict: true}
    },
    "remark-layout": {},
    "remark-frontmatter-modified-time": {}
}

/**
 * Deep merge two objects
 */
function deepMerge(target: any, source: any) {
    const output = {...target};
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            output[key] = deepMerge(target[key], source[key]);
        } else {
            output[key] = source[key];
        }
    }
    return output;
}


// Infer the TypeScript type from the schema
export type Config = z.infer<typeof ConfigSchema>;

export const ConfigSchema = z.object({
    $schema: z.string().optional(),
    theme: ThemeConfigSchema.default(ThemeConfigSchema.parse({})),
    plugins: PluginConfigSetSchema.default(PluginConfigSetSchema.parse({})).transform(data => deepMerge(plugins, data)),
    components: ComponentsConfigSetSchema.default(ComponentsConfigSetSchema.parse({})).transform(data => deepMerge(components, data))
})