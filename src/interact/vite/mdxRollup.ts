import type {Plugin} from 'vite';
import mdx from "@mdx-js/rollup";
import {getMarkdownConfig} from "../markdown/conf/markdownConfig.js";
import type {InteractCommand} from "../cli/shared/vite.config.js";

export default function mdxRollup({command}: { command: InteractCommand|undefined }): Plugin {
    // https://mdxjs.com/packages/mdx/#processoroptions
    return mdx(getMarkdownConfig().getMdxRollupConfig(command))
}