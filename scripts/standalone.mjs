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
  const icon = html.match(/<link\b[^>]*\brel="icon"[^>]*\bhref="([^"]+)"/);
  return icon ? html.replace(`href="${icon[1]}"`, () => `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`) : html;
}

async function main() {
  const root = new URL('../', import.meta.url);
  await mkdir(new URL('release/', root), { recursive: true });
  for (const [entry, filename, icon] of [
    ['index.html', '心动放映室.html', 'favicon.svg'],
    ['boss/index.html', '领导使用说明书.html', 'boss-favicon.svg'],
  ]) {
    const entryURL = new URL(`dist/${entry}`, root);
    const html = await readFile(entryURL, 'utf8');
    const script = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
    const style = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
    if (!script || !style) throw new Error('Expected one bundled script and stylesheet');
    const [js, css, favicon] = await Promise.all([
      readFile(new URL(script[1], entryURL), 'utf8'),
      readFile(new URL(style[1], entryURL), 'utf8'),
      readFile(new URL(`public/${icon}`, root), 'utf8'),
    ]);
    await writeFile(new URL(`release/${filename}`, root), inlineBundle(html, { js, css, favicon }));
    console.log(`Created release/${filename} — self-contained browser edition.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
