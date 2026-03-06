/**
 * All Schema
 *
 * They are all here because
 * this file is initialized first
 * Otherwise you get: Cannot access 'ImageFitSet' before initialization
 */
import {z} from 'zod';

import {ImageCompressionSchema} from "../images/imageCompressionType";


export const ImageFitSet = z.enum(['cover', 'contain', 'fill', 'inside', 'outside']);
export const ImageFitSchema = ImageFitSet.default('cover').describe("How the image is fitted in the box defined by width and height");
export type ImageFitType = z.output<typeof ImageFitSchema>;

const faviconImage = z.object({
    href: z.coerce.string<string>().describe("The href (by default, the name given in the key)").optional(),
    type: z.coerce.string<string>().describe("The type (ie image/png or image/svg+xml)").optional(),
    width: z.coerce.number<number>().describe("The intrinsic width of the image").optional(),
    height: z.coerce.number<number>().describe("The intrinsic height of the image").optional(),
}).describe("An image")
type faviconImageType = z.output<typeof faviconImage>
let relSchema = z.enum(['shortcut icon', 'icon', 'apple-touch-icon']).describe("The link rel (ie the type)");
type RelType = z.output<typeof relSchema>
type FaviconType = {
    rel: RelType,
    image?: faviconImageType,
}
const favicon: z.ZodType<FaviconType> = z.object({
    rel: relSchema,
    image: faviconImage.describe("The image").optional()
}).describe("A favicon image")


export type FaviconSetSchemaType = Record<string, FaviconType | null>;
const FaviconSetSchema: z.ZodType<FaviconSetSchemaType> = z.record(
    z.coerce.string<string>().describe("The path from the public directory"),
    favicon.nullable()
);


let colorMode = z.enum(['light', 'dark']).describe("The color mode").default('light');


/**
 * Site Section in JSON
 */
const jsonSiteSchema = z.object({
    url: z.coerce.string().describe("The URL (Used in the sitemap)").optional(),
    base: z.coerce.string().describe("The base path added to the site URL (Example: /docs)").default(""),
    name: z.coerce.string().describe("The short name (used in the app manifest)").default("Website"),
    title: z.coerce.string().describe("The title (used on the logo description, as index page title, in the app manifest as name)").default("Website"),
    faviconMaster: z.coerce.string().describe("The master svg file used to generate the favicons relative to the image path").default("favicon.svg"),
    favicons: FaviconSetSchema.describe("The favicons (logos)").optional(),
    colorMode: colorMode,
    colorPrimary: z.coerce.string().describe("The primary color (known also as the theme color)").default("#906296"),
}).describe("The site properties")


/**
 * Public Section in JSON
 */
const jsonPublicSchema = z.object({
    // https://vite.dev/guide/assets#the-public-directory
    publicDirectory: z.coerce.string<string>().describe("The path of the public directory").default("public"),
})
// fluid - scale down to fit the container, maintaining the aspect ratio (https://getbootstrap.com/docs/5.3/content/images/#responsive-images)
// none - not responsive (No srcset or sizes generated, no styles applied)
const imageTypeSchema = z.enum(['fluid']).describe("The type of image to apply a specific style").default('fluid').optional();
export type ImageType = z.output<typeof imageTypeSchema>

let defaultImagePropertyValues = z.object({
    type: imageTypeSchema,
    responsiveBreakpoints: z.array(z.number().int().positive()).describe("The responsive breakpoints corresponding to a screen size. For each screen, a passing image is provided").default([375, 576, 768, 992, 1200, 1400]),
    dpiCorrection: z.boolean().describe("Enable DPI correction by screen size for responsive images").optional().default(false),
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#loading
    loading: z.enum(['lazy', 'eager']).describe("Lazy loading (should be false for images above the fold)").default('lazy'),
    decoding: z.enum(['async', 'sync', 'auto']).describe("Tell if the browser process the images on or off the main thread (sync - on, async - off, auto - the browser chooses)").default("async"),
    compression: ImageCompressionSchema,
    fit: ImageFitSchema
});

/**
 * Image Service Section
 */
const ImageSchema = z.object({
    imagesDirectory: z.coerce.string<string>().describe("The path of the image directory").default("images"),
    defaultValues: defaultImagePropertyValues.describe("The default values").default(defaultImagePropertyValues.parse({}))
})

/**
 * Pages Schema
 */
const PagesSchema = z.object({
    pagesDirectory: z.coerce.string<string>().describe("The path of the pages directory").default("pages"),
    // mdx, properties, Markdown will come here
})


let navBarLogoSchema = z.object({
    src: z.coerce.string<string>().default("/favicon.svg"),
    alt: z.coerce.string<string>().optional(),
    width: z.coerce.number<number>().default(24),
    height: z.coerce.number<number>().default(24)
});
let navBarSchema = z.object({
    brandName: z.coerce.string<string>().default("Brand").nullable(),
    logo: navBarLogoSchema.default(navBarLogoSchema.parse({})),
});
let tocSchema = z.object({
    minItems: z.coerce.number<number>().default(2),
    maxDepth: z.coerce.number<number>().default(3),
});
let pageSchema = z.object({
    // https://getbootstrap.com/docs/5.3/layout/containers/
    containerClass: z.enum(['container', 'container-fluid', 'container-sm', 'container-md', 'container-lg', 'container-xl', 'container-xxl']).default('container'),
    // with the unit please
    containerMaxWidth: z.coerce.string<string>().optional()
});
let layoutSchema = z.object({
    navBar: navBarSchema.default(navBarSchema.parse({})),
    toc: tocSchema.default(tocSchema.parse({})),
    page: pageSchema.default(pageSchema.parse({}))
});


/**
 *
 */
const colorValue = z.union([
    z.coerce.string<string>().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    z.literal("inherit"),
    z.coerce.string<string>().regex(/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/),
]);

/**
 * We can't use the enum otherwise all enum value are mandatory
 * So we set the mode manually
 */
let modeColorValue = z.object({
    light: colorValue,
    dark: colorValue
}).partial();


/**
 * All Bootstrap variables
 * based on https://getbootstrap.com/docs/5.3/customize/css-variables/
 */
let cssVariables = z.object({
    "black": colorValue.describe("The black color"),
    "body-bg": modeColorValue.describe("The body-bg color"),
    "body-color": modeColorValue.describe("The body-color color"),
    "body-font-family": z.coerce.string<string>().describe("The body font family"),
    "body-font-size": z.coerce.string<string>().describe("The body font size (1rem default)"),
    "body-font-weight": z.coerce.number<number>().describe("The body font weight (400)"),
    "body-line-height": z.coerce.number<number>().describe("The body line height"),
    "border-color": modeColorValue.describe("The border color"),
    "border-color-translucent": modeColorValue.describe("The border-color-translucent color"),
    "border-radius": z.coerce.string<string>().describe("The border radius (0.375rem)"),
    "border-radius-2xl": z.coerce.string<string>().describe("The border radius from 2xl (2rem)"),
    "border-radius-lg": z.coerce.string<string>().describe("The border radius from lg (0.5rem)"),
    "border-radius-pill": z.coerce.string<string>().describe("The border radius pill (50rem)"),
    "border-radius-sm": z.coerce.string<string>().describe("The border radius from sm (0.25rem)"),
    "border-radius-xl": z.coerce.string<string>().describe("The border radius from xl (1rem)"),
    "border-radius-xxl": z.coerce.string<string>().describe("The border radius from xxl (2rem)"),
    "border-style": z.coerce.string<string>().describe("The border style (solid)"),
    "border-width": z.coerce.string<string>().describe("The border width (1px)"),
    "box-shadow": z.coerce.string<string>().describe("The box shadow definition (0 0.5rem 1rem rgba(0, 0, 0, 0.15))"),
    "box-shadow-inset": z.coerce.string<string>().describe("The box shadow inset (inset 0 1px 2px rgba(0, 0, 0, 0.075))"),
    "box-shadow-lg": z.coerce.string<string>().describe("The box shadow from lg (0 1rem 3rem rgba(0, 0, 0, 0.175))"),
    "box-shadow-sm": z.coerce.string<string>().describe("The box shadow from sm (0 0.125rem 0.25rem rgba(0, 0, 0, 0.075))"),
    "code-color": modeColorValue.describe("The code color"),
    "cyan": colorValue.describe("The cyan color"),
    "danger": colorValue.describe("The danger color"),
    "danger-bg-subtle": modeColorValue.describe("The danger-bg-subtle color"),
    "danger-border-subtle": modeColorValue.describe("The danger-border-subtle color"),
    "danger-text-emphasis": modeColorValue.describe("The danger-text-emphasis color"),
    "dark": colorValue.describe("The dark color"),
    "dark-bg-subtle": modeColorValue.describe("The dark-bg-subtle color"),
    "dark-border-subtle": modeColorValue.describe("The dark-border-subtle color"),
    "dark-text-emphasis": modeColorValue.describe("The dark-text-emphasis color"),
    "emphasis-color": modeColorValue.describe("The emphasis color"),
    "focus-ring-color": colorValue.describe("The focus-ring color"),
    "focus-ring-opacity": z.coerce.number<number>().describe("The focus-ring opacity (0.25)"),
    "focus-ring-width": z.coerce.string<string>().describe("The focus-ring width (0.25rem)"),
    "font-monospace": z.coerce.string<string>().describe("The font monospace"),
    "font-sans-serif": z.coerce.string<string>().describe("The font sans serif"),
    "form-invalid-border-color": modeColorValue.describe("The form-invalid-border color"),
    "form-invalid-color": modeColorValue.describe("The form-invalid color"),
    "form-valid-border-color": modeColorValue.describe("The form-valid-border color"),
    "form-valid-color": modeColorValue.describe("The form-valid color"),
    "gradient": z.coerce.string<string>().describe("The gradient"),
    "gray": colorValue.describe("The gray color"),
    "gray-100": colorValue.describe("The gray-100 color"),
    "gray-200": colorValue.describe("The gray-200 color"),
    "gray-300": colorValue.describe("The gray-300 color"),
    "gray-400": colorValue.describe("The gray-400 color"),
    "gray-500": colorValue.describe("The gray-500 color"),
    "gray-600": colorValue.describe("The gray-600 color"),
    "gray-700": colorValue.describe("The gray-700 color"),
    "gray-800": colorValue.describe("The gray-800 color"),
    "gray-900": colorValue.describe("The gray-900 color"),
    "gray-dark": colorValue.describe("The gray-dark color"),
    "green": colorValue.describe("The green color"),
    "heading-color": modeColorValue.describe("The heading color"),
    "highlight-bg": modeColorValue.describe("The highlight-bg color"),
    "highlight-color": modeColorValue.describe("The highlight color"),
    "indigo": colorValue.describe("The indigo color"),
    "info": colorValue.describe("The info color"),
    "info-bg-subtle": modeColorValue.describe("The info-bg-subtle color"),
    "info-border-subtle": modeColorValue.describe("The info-border-subtle color"),
    "info-text-emphasis": modeColorValue.describe("The info-text-emphasis color"),
    "light": colorValue.describe("The light color"),
    "light-bg-subtle": modeColorValue.describe("The light-bg-subtle color"),
    "light-border-subtle": modeColorValue.describe("The light-border-subtle color"),
    "light-text-emphasis": modeColorValue.describe("The light-text-emphasis color"),
    "link-color": modeColorValue.describe("The link color"),
    "link-decoration": z.coerce.string<string>().describe("The link decoration (underline)"),
    "link-hover-color": modeColorValue.describe("The link-hover color"),
    "orange": colorValue.describe("The orange color"),
    "pink": colorValue.describe("The pink color"),
    "primary": colorValue.describe("The primary color"),
    "primary-bg-subtle": modeColorValue.describe("The primary-bg-subtle color"),
    "primary-border-subtle": modeColorValue.describe("The primary-border-subtle color"),
    "primary-text-emphasis": modeColorValue.describe("The primary-text-emphasis color"),
    "purple": colorValue.describe("The purple color"),
    "red": colorValue.describe("The red color"),
    "secondary": colorValue.describe("The secondary color"),
    "secondary-bg": modeColorValue.describe("The secondary-bg color"),
    "secondary-bg-subtle": modeColorValue.describe("The secondary-bg-subtle color"),
    "secondary-border-subtle": modeColorValue.describe("The secondary-border-subtle color"),
    "secondary-color": modeColorValue.describe("The secondary color"),
    "secondary-text-emphasis": modeColorValue.describe("The secondary-text-emphasis color"),
    "success": colorValue.describe("The success color"),
    "success-bg-subtle": modeColorValue.describe("The success-bg-subtle color"),
    "success-border-subtle": modeColorValue.describe("The success-border-subtle color"),
    "success-text-emphasis": modeColorValue.describe("The success-text-emphasis color"),
    "teal": colorValue.describe("The teal color"),
    "tertiary-bg": modeColorValue.describe("The tertiary-bg color"),
    "tertiary-color": modeColorValue.describe("The tertiary color"),
    "warning": colorValue.describe("The warning color"),
    "warning-bg-subtle": modeColorValue.describe("The warning-bg-subtle color"),
    "warning-border-subtle": modeColorValue.describe("The warning-border-subtle color"),
    "warning-text-emphasis": modeColorValue.describe("The warning-text-emphasis color"),
    "white": colorValue.describe("The white color"),
    "yellow": colorValue.describe("The yellow color"),
    "blue": colorValue.describe("The blue color"),
}).partial();

/**
 * Theme configuration type
 * (ie all that have a
 */
let ThemeConfigSchema = z.object({
    layoutProps: layoutSchema.describe("Properties used by layout components").default(layoutSchema.parse({})),
    // https://getbootstrap.com/docs/5.3/customize/css-variables/
    cssVariables: cssVariables.describe("Css variables").optional()
});
type ThemeConfigSchemaType = z.output<typeof ThemeConfigSchema>;

/**
 * Components
 */
const ComponentsConfigSchema = z.object({
    // Physique path does not work well: ie with ./node_modules/`${interactPackageJson.name}/src/components`
    // we get: could not resolve "./node_modules/@gerardnico/interact-astro/src/components/H2/H2.tsx"
    // path below should be set in the exports of package.json
    // We derived them with import.meta.resolve
    // No file system path, it's derived thanks to import, and it does not work well with vite and import
    // as they don't handle symlink well
    importPath: z.coerce.string<string>(),
});
const ComponentsConfigSetSchema = z.record(z.coerce.string<string>(), ComponentsConfigSchema.nullable());
export type ComponentsConfigSetSchemaType = z.output<typeof ComponentsConfigSetSchema>;


const interactComponentBaseDirectory = `@combostrap/interact/components`
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
    },
    "Image": {
        importPath: `${interactComponentBaseDirectory}/Image`
    }
}

/**
 * Plugins
 */
const PluginConfigSchema = z.object({
    path: z.coerce.string<string>().optional(),
    props: z.record(z.coerce.string<string>(), z.any()).optional(),
    type: z.enum(['remark', 'rehype']).optional(),
});

const PluginConfigSetSchema = z.record(z.coerce.string<string>(), PluginConfigSchema.nullable());
export type PluginConfigSetSchemaType = z.output<typeof PluginConfigSetSchema>;
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


/**
 * The JSON Schema used to parse the json file
 */
export const JsonConfigSchema = z.object({
    $schema: z.coerce.string().optional(),
    site: jsonSiteSchema.default(jsonSiteSchema.parse({})),
    pages: PagesSchema.default(PagesSchema.parse({})),
    public: jsonPublicSchema.default(jsonPublicSchema.parse({})),
    images: ImageSchema.default(ImageSchema.parse({})),
    theme: ThemeConfigSchema.default(ThemeConfigSchema.parse({})),
    plugins: PluginConfigSetSchema.default(PluginConfigSetSchema.parse({})).transform(data => deepMerge(plugins, data)),
    components: ComponentsConfigSetSchema.default(ComponentsConfigSetSchema.parse({})).transform(data => deepMerge(components, data))
})


type ImageSchemaType = z.output<typeof ImageSchema>;
/**
 * The config passed to client
 */
export type Config = {
    theme: ThemeConfigSchemaType,
    site: z.output<typeof jsonSiteSchema> & {
        // "The root path of the site project"
        rootPath: string
    }
    plugins: PluginConfigSetSchemaType,
    components: ComponentsConfigSetSchemaType,
    pages: z.output<typeof PagesSchema>
    images: ImageSchemaType & {
        // The endpoint of the local service endpoint ("/_images")
        serviceEndpoint: string,
    }
    public: z.output<typeof jsonPublicSchema>
    env: {
        configFilePath: string
    }
}