import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
let html = await readFile(new URL('dist/index.html', root), 'utf8');
const script = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const style = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
if (!script || !style) throw new Error('Expected one bundled script and stylesheet');
const js = await readFile(new URL(script[1], new URL('dist/', root)), 'utf8');
const css = await readFile(new URL(style[1], new URL('dist/', root)), 'utf8');
const favicon = await readFile(new URL('public/favicon.svg', root), 'utf8');
html = html.replace(script[0], `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`);
html = html.replace(style[0], `<style>${css}</style>`);
html = html.replace('href="./favicon.svg"', `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`);
await mkdir(new URL('release/', root), { recursive: true });
await writeFile(new URL('release/心动放映室.html', root), html);
console.log('Created release/心动放映室.html — open directly in a browser, no server needed.');
