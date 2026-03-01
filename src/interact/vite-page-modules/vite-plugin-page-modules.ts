import type {Plugin} from 'vite';
import { glob } from 'glob';
import path from 'path';

export function generatePageModulesCode(pagesDir: string, files: string[]): string {
    const imports = files.map((file, i) =>
        `import * as Page${i} from ${JSON.stringify(path.join(pagesDir, file))};`
    ).join('\n');

    const entries = files.flatMap((file, i) => {
        const base = file.replace(/\.mdx$|\.tsx$/, '');
        const route = base === 'index' ? '/' : `/${base}`;
        const entries = [`  ${JSON.stringify(route)}: Page${i}`];
        if (base === 'index') entries.push(`  "/index": Page${i}`);
        return entries;
    }).join(',\n');

    return `
${imports}

export const modulePages = {
${entries}
};

export function getModulePage({ path, notFoundPath }) {
    let module = modulePages[path]
    if (module) {
        return module;
    }
    if (!notFoundPath) {
        return;
    }
    return modulePages[notFoundPath]
}

export default getModulePage;
  `.trim();
}

export function pageModulesPlugin(pagesDir: string): Plugin {
    const virtualModuleId = 'virtual:page-modules';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    return {
        name: 'vite-plugin-page-modules',
        resolveId(id) {
            if (id === virtualModuleId) return resolvedVirtualModuleId;
        },
        async load(id) {
            if (id !== resolvedVirtualModuleId) return;
            const files = glob.sync('**/*.{mdx,tsx}', { cwd: pagesDir });
            return generatePageModulesCode(pagesDir, files);
        },
    };
}