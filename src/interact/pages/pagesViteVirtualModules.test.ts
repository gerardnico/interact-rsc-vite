import { describe, it, expect } from 'vitest';
import { generatePageModulesCode } from './viteVirtualPagesModules.js';

describe('generatePageModulesCode', () => {
    it('generates imports and routes for a list of files', () => {
        const code = generatePageModulesCode('/src/pages', [
            'index.mdx',
            'page1.mdx',
            'page2.mdx',
        ]);

        expect(code).toContain('import * as Page0 from "/src/pages/index.mdx"');
        expect(code).toContain('import * as Page1 from "/src/pages/page1.mdx"');
        expect(code).toContain('import * as Page2 from "/src/pages/page2.mdx"');

        expect(code).toContain('"/": Page0');
        expect(code).toContain('"/index": Page0');
        expect(code).toContain('"/page1": Page1');
        expect(code).toContain('"/page2": Page2');
    });

    it('handles nested pages', () => {
        const code = generatePageModulesCode('/src/pages', ['blog/post1.mdx']);

        expect(code).toContain('import * as Page0 from "/src/pages/blog/post1.mdx"');
        expect(code).toContain('"/blog/post1": Page0');
    });

    it('handles an empty pages directory', () => {
        const code = generatePageModulesCode('/src/pages', []);

        expect(code).toContain('const modulePages = {');
        expect(code).toContain('export default getModulePage');
    });
});