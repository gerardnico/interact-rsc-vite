import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import viteRscSsgPlugin from "./src/interact/vite-rsc-ssg/vite-rsc-ssg-plugin";
import {defineConfig} from "vite";
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
// https://github.com/altano/npm-packages/blob/main/packages/remark-mdx-toc-with-slugs/src/index.ts
import remarkMdxToc from '@altano/remark-mdx-toc-with-slugs';
import {pageModulesPlugin} from "./src/interact/vite-page-modules/vite-plugin-page-modules";
import path from "node:path";


let pagesDir = path.resolve(process.cwd(), 'apps/app/pages');

export default defineConfig({
    publicDir: 'apps/app/public', // default is 'public'
    plugins: [
        // You can use vite-plugin-inspect (https://github.com/antfu-collective/vite-plugin-inspect)
        // to understand how "use client" and "use server" directives are transformed internally.
        // import("vite-plugin-inspect").then(m => m.default()),
        mdx({
            remarkPlugins: [
                remarkFrontmatter,
                remarkMdxFrontmatter, // exports frontmatter as `frontmatter`
                remarkMdxToc, // exports headings as `toc`
            ],
        }),
        react(),
        rsc({
            entries: {
                client: './src/interact/vite-rsc/browser/entry.browser.tsx',
                rsc: './src/interact/vite-rsc/server/entry.rsc.tsx',
                ssr: './src/interact/vite-rsc/server/entry.ssr.tsx',
            },
        }),
        viteRscSsgPlugin(),
        pageModulesPlugin(pagesDir),
    ],
})






