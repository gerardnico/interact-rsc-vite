// scripts/build.ts
import {execSync} from 'child_process';
import {globSync} from 'glob';
import {copyFileSync, mkdirSync} from 'fs';
import {dirname} from 'path';

/**
 * We don't bundle with tsup or the like
 */
console.log('Running Tsc')
execSync('tsc', {stdio: 'inherit'});

/**
 * Copy the resources (svg, css)
 * default svg (ie src/interact/images/broken-heart.svg)
 * The client calls the compiled tsc files in dist so the resources (image) should also be in dist
 * Note that we could skip this step if we compile in place (ie the default outDir is not set in tsconfig.json)
 */
console.log('Copying Resources')
for (const src of globSync(['src/interact/images/*.svg', 'src/interact/styling/*.css'])) {
    const dest = src.replace(/^src\//, 'dist/');
    mkdirSync(dirname(dest), {recursive: true});
    console.log(`  * Copying ${src} to ${dest}`);
    copyFileSync(src, dest);
}
