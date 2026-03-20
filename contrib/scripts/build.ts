// scripts/build.ts
import {execSync} from 'child_process';
import {globSync} from 'glob';
import {copyFileSync, mkdirSync} from 'fs';
import {dirname} from 'path';

console.log('Running Tsc')
execSync('tsc', {stdio: 'inherit'});

/**
 * Copy the default svg
 * ie src/interact/images/broken-heart.svg
 * Vite is started with the oclif client that calls the compiled tsc files in dist
 * so the image should also be in dist
 */
console.log('Copying files')
for (const src of globSync('src/interact/images/*.svg')) {
    const dest = src.replace(/^src\//, 'dist/');
    mkdirSync(dirname(dest), {recursive: true});
    console.log(`  * Copying ${src} to ${dest}`);
    copyFileSync(src, dest);
}
