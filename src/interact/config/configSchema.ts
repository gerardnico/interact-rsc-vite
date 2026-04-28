import 'server-only';
/**
 * All Schema
 *
 * They are all here because
 * this file is initialized first
 * Otherwise you get: Cannot access 'ImageFitSet' before initialization
 */
import {z} from 'zod';

import {ImageCompressionSchema} from "../images/imageCompressionType.js";


export const ImageFitSet = z.enum(['cover', 'contain', 'fill', 'inside', 'outside']);
export const ImageFitSchema = ImageFitSet.default('cover').describe("How the image is fitted in the box defined by width and height").default('cover');
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

/**
 *
 */
const colorValue = z.union([
    z.coerce.string<string>().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    z.literal("inherit"),
    z.coerce.string<string>().regex(/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/),
]);

export type FaviconSetSchemaType = Record<string, FaviconType | null>;
const FaviconSetSchema: z.ZodType<FaviconSetSchemaType> = z.record(
    z.coerce.string<string>().describe("The path from the public directory"),
    favicon.nullable()
);


/**
 * Site Section in JSON
 */
const SiteSchema = z.object({
    url: z.coerce.string().describe("The URL (used for external service such as sitemap or open in ai component)").optional(),
    // `/` in base is mandatory as default, this is the root
    base: z.coerce.string().describe("The base path added to the site URL (Example: /docs)").default("/"),
    name: z.coerce.string().describe("The short name (used in the app manifest)").default("Website"),
    title: z.coerce.string().describe("The title (used on the logo description, as index page title, in the app manifest as name)").default("Website"),
    favicon: z.coerce.string().describe("A svg file used as logo or to generate the favicons").default("favicon.svg"),
    favicons: FaviconSetSchema.describe("The favicons (logos)").optional(),
    manifest: z.string().describe("The manifest file path from the public directory (Example: /site.webmanifest)").optional(),
    colorMode: z.enum(['light', 'dark']).describe("The color mode").default('light'),
    colorPrimary: colorValue.describe("The primary color (known also as the theme color)").default("#906296"),
}).describe("The site properties")


// fluid - scale down to fit the container, maintaining the aspect ratio (https://getbootstrap.com/docs/5.3/content/images/#responsive-images)
// none - not responsive (No srcset or sizes generated, no styles applied)
const imageTypeSchema = z.enum(['fluid']).describe("The type of image to apply a specific style").default('fluid');
export type ImageType = z.output<typeof imageTypeSchema>

let defaultImagePropertyValues = z.object({
    type: imageTypeSchema,
    responsiveBreakpoints: z.array(z.number().int().positive()).describe("The responsive breakpoints corresponding to a screen size. For each screen, a passing image is provided").default([375, 576, 768, 992, 1200, 1400]),
    dpiCorrection: z.boolean().describe("Enable DPI correction by screen size for responsive images").default(false),
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
    defaultValues: defaultImagePropertyValues.describe("The default values").default(defaultImagePropertyValues.parse({}))
})

/**
 * Path Schema
 */
const PathsSchema = z.object({
    rootDirectory: z.coerce.string<string>().describe("The path of the project root directory").optional(),
    pagesDirectory: z.coerce.string<string>().describe("The path of the pages directory").default("src/pages"),
    // https://vite.dev/guide/assets#the-public-directory
    publicDirectory: z.coerce.string<string>().describe("The path of the public directory").default("public"),
    layoutsDirectory: z.coerce.string<string>().describe("The path of the layout directory").default("src/components/layouts"),
    mdComponentsDirectory: z.coerce.string<string>().describe("The path of the markdown components directory").default("src/components/markdowns"),
    middlewaresDirectory: z.coerce.string<string>().describe("The path of the middlewares directory").default("src/middlewares"),
    configDirectory: z.coerce.string<string>().describe("The path of the config directory").default("config"),
    imagesDirectory: z.coerce.string<string>().describe("The path of the image directory").default("src/images"),
    // https://vite.dev/config/build-options#build-outdir
    buildDirectory: z.coerce.string<string>().describe("The path of the output directory relative to the project root").default("dist"),
    cssFile: z.coerce.string<string>().describe("The path to the global.css file").default("src/styles/global.css"),
    atDirectory: z.coerce.string<string>().describe("The path of the at alias directory (@)").default("src"),
})

/**
 * Aliases Schema
 */
const AliasesSchema = z.object({
    resolution: z.enum(['cascade', 'standard']).describe("Resolution mode: resolve the alias with cascade or not (with cascade, the resolution check the project directory then interact)").default('standard')
})


let container = z.object({
    // https://getbootstrap.com/docs/5.3/layout/containers/
    containerClass: z.string().describe("The classes applied to contained the layout").default('container mx-auto px-4'),
    // with the unit please
    containerMaxWidth: z.coerce.string<string>().optional()
});


let counterStyleSchema = z.enum(['decimal', 'decimal-leading-zero', 'arabic-indic', 'upper-armenian', 'lower-armenian', 'bengali', 'cambodian/khmer', 'cjk-decimal', 'devanagari', 'georgian', 'gujarati', 'gurmukhi', 'hebrew', 'kannada', 'lao', 'malayalam', 'mongolian', 'myanmar', 'oriya', 'persian', 'lower-roman', 'upper-roman', 'tamil', 'telugu', 'thai', 'tibetan', 'lower-alpha', 'upper-alpha', 'lower-greek', 'hiragana', 'hiragana-iroha', 'katakana', 'katakana-iroha']);
let outlineNumberingSchema = z.object({
    enabled: z.boolean().describe("Is outline numbering enabled").default(true),
    suffix: z.string().describe("The suffix of the numbering").default(" - "),
    counterSeparator: z.string().describe("The separator for each counter").default("."),
    counterStyleLevel2: counterStyleSchema.describe("The style of the level 2 counter").default("decimal"),
    counterStyleLevel3: counterStyleSchema.describe("The style of the level 3 counter").default("decimal"),
    counterStyleLevel4: counterStyleSchema.describe("The style of the level 4 counter").default("decimal"),
    counterStyleLevel5: counterStyleSchema.describe("The style of the level 5 counter").default("decimal"),
    counterStyleLevel6: counterStyleSchema.describe("The style of the level 6 counter").default("decimal"),
});


let header = z.object({
    brandName: z.string().nullable().optional(),
    logoWidth: z.number().optional(),
    logoHeight: z.number().optional(),
    logoSrc: z.coerce.string().default("favicon.svg"),
    logoAlt: z.string().optional(),
});
let toc = z.object({
    maxDepth: z.coerce.number<number>().describe("The maximum level printed").default(3),
});

/**
 * Configuration for layout and partials
 */
let templateType = z.object({
    container: container.default(container.parse({})),
    header: header.default(header.parse({})),
    toc: toc.default(toc.parse({})),
}).describe("Configuration for server component, mostly layout and partials components");
export type templateConfig = z.output<typeof templateType>;


/**
 * Components
 * Base schema shared by all components
 * They are all optional because when the user defines properties
 * for a default component, it does not need to set any properties
 */
const ComponentSchema = z.object({
    // Physique path does not work well: ie with ./node_modules/`${interactPackageJson.name}/src/components`
    // we get: could not resolve "./node_modules/@gerardnico/interact-astro/src/components/H2/H2.tsx"
    // path below should be set in the exports of package.json
    // We derived them with import.meta.resolve
    // No file system path, it's derived thanks to import, and it does not work well with vite and import
    // as they don't handle symlink well
    importPath: z.coerce.string<string>().optional(),
    type: z.enum(["layout", "markdown"]),
    props: z.record(z.string(), z.unknown()).optional(),
});
let ComponentsConfigSetSchema = z.record(
    z.coerce.string<string>().describe("The path from the public directory"),
    ComponentSchema
)

const handlerConfigSchema = z.object({
    name: z.string().optional(),
    importPath: z.coerce.string<string>(),
    props: z.record(z.string(), z.unknown()).optional(),
}).describe("Handler Properties");

const MiddlewaresSchema = z.object({
    pipeline: z.array(handlerConfigSchema).describe("A list of middlewares").default([]),
    // 404 is the default for GitHub
    // https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site
    notFoundPath: z.string().describe("The page returned if no middleware answers the request").default("/404"),
}).describe("Middleware Properties");

const OutlineSchema = z.object({
    numbering: outlineNumberingSchema.default(outlineNumberingSchema.parse({})),
})
let markdownFormat = z.enum(["md", "mdc", "mdx"]);
export type markdownFormat = z.output<typeof markdownFormat>;

let MarkdownConfigSchema = z.object({
    configImportPath: z.string().describe("The import path of the config file. For a local path, the value should start with a point otherwise it's considered a package name").optional(),
    // mdr has a phantom paragraph and lazy problem that mdx has not
    defaultMarkdownFormat: markdownFormat.describe("What is the format of md files").default("mdc"),
});


/**
 * The JSON Schema used to parse the JSON file
 */
export const JsonConfigSchema = z.object({
    $schema: z.coerce.string().optional(),
    site: SiteSchema.default(SiteSchema.parse({})),
    outline: OutlineSchema.default(OutlineSchema.parse({})),
    paths: PathsSchema.default(PathsSchema.parse({})),
    aliases: AliasesSchema.default(AliasesSchema.parse({})),
    middleware: MiddlewaresSchema.default(MiddlewaresSchema.parse({})),
    images: ImageSchema.default(ImageSchema.parse({})),
    template: templateType.default(templateType.parse({})),
    components: ComponentsConfigSetSchema.default(ComponentsConfigSetSchema.parse({})),
    markdown: MarkdownConfigSchema.default(MarkdownConfigSchema.parse({})),
})


export type imageConfigType = z.output<typeof ImageSchema>;
export type pathsConfigType = z.output<typeof PathsSchema>;
export type aliasesConfigType = z.output<typeof AliasesSchema>;
export type siteConfigType = z.output<typeof SiteSchema>;
export type outlineConfigType = z.output<typeof OutlineSchema>;
export type markdownConfigType = z.output<typeof MarkdownConfigSchema>;
export type MiddlewareConfig = z.output<typeof MiddlewaresSchema>;
export type ComponentsSet = z.output<typeof ComponentsConfigSetSchema>;
