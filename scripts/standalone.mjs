import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function inlineBundle(html, { js, css, favicon }) {
  const script = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
  const style = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
  if (!script || !style) throw new Error('Expected one bundled script and stylesheet');
  // Asset contents can contain $&, $` or $' (for example minified `$&&...`).
  // Function replacements preserve those bytes instead of expanding replacement tokens.
  html = html.replace(script[0], () => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`);
  html = html.replace(style[0], () => `<style>${css}</style>`);
  return html.replace('href="./favicon.svg"', () => `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`);
}

async function main() {
  const root = new URL('../', import.meta.url);
  const html = await readFile(new URL('dist/index.html', root), 'utf8');
  const script = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
  const style = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
  if (!script || !style) throw new Error('Expected one bundled script and stylesheet');
  const [js, css, favicon] = await Promise.all([
    readFile(new URL(script[1], new URL('dist/', root)), 'utf8'),
    readFile(new URL(style[1], new URL('dist/', root)), 'utf8'),
    readFile(new URL('public/favicon.svg', root), 'utf8'),
  ]);
  await mkdir(new URL('release/', root), { recursive: true });
  await writeFile(new URL('release/领导使用说明书.html', root), inlineBundle(html, { js, css, favicon }));
  console.log('Created release/领导使用说明书.html — self-contained browser edition.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
