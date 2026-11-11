import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname } from 'node:path';
import { pathToFileURL } from 'node:url';

function iconMetadata(tag) {
  const rel = tag.match(/\brel\s*=\s*(["'])(.*?)\1/i);
  const href = tag.match(/\bhref\s*=\s*(["'])(.*?)\1/i);
  if (!rel || !href) return null;
  const relations = rel[2].toLowerCase().trim().split(/\s+/);
  if (!relations.some(value => ['icon', 'apple-touch-icon', 'apple-touch-icon-precomposed'].includes(value))) return null;
  return { href: href[2], attribute: href[0], quote: href[1], relations };
}

export async function loadIconData(html, entryURL) {
  const icons = new Map();
  const mimeTypes = { '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webp': 'image/webp', '.gif': 'image/gif' };
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    const icon = iconMetadata(tag);
    if (!icon || icons.has(icon.href)) continue;
    if (icon.href.startsWith('data:')) {
      icons.set(icon.href, icon.href);
      continue;
    }
    const url = new URL(icon.href, entryURL);
    if (url.protocol !== 'file:') throw new Error(`Cannot inline a non-local icon: ${icon.href}`);
    const mime = mimeTypes[extname(url.pathname).toLowerCase()];
    if (!mime) throw new Error(`Unsupported standalone icon format: ${icon.href}`);
    const bytes = await readFile(url);
    icons.set(icon.href, `data:${mime};base64,${bytes.toString('base64')}`);
  }
  return icons;
}

export function inlineBundle(html, { js, css, favicon, icons }) {
  const script = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
  const style = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
  if (!script || !style) throw new Error('Expected one bundled script and stylesheet');
  // Asset contents can contain $&, $` or $' (for example minified `$&&...`).
  // Function replacements preserve those bytes instead of expanding replacement tokens.
  html = html.replace(script[0], () => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`);
  html = html.replace(style[0], () => `<style>${css}</style>`);
  return html.replace(/<link\b[^>]*>/gi, tag => {
    const icon = iconMetadata(tag);
    if (!icon) return tag;
    // Keep the existing single-SVG API for callers using the original template.
    const data = (icons instanceof Map ? icons.get(icon.href) : icons?.[icon.href])
      ?? (favicon !== undefined && icon.relations.includes('icon') ? `data:image/svg+xml,${encodeURIComponent(favicon)}` : undefined);
    return data === undefined ? tag : tag.replace(icon.attribute, () => `href=${icon.quote}${data}${icon.quote}`);
  });
}

async function main() {
  const root = new URL('../', import.meta.url);
  await mkdir(new URL('release/', root), { recursive: true });
  for (const [entry, filename] of [
    ['index.html', '心动放映室.html'],
    ['boss/index.html', '领导使用说明书.html'],
  ]) {
    const entryURL = new URL(`dist/${entry}`, root);
    const html = await readFile(entryURL, 'utf8');
    const script = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
    const style = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
    if (!script || !style) throw new Error('Expected one bundled script and stylesheet');
    const [js, css, icons] = await Promise.all([
      readFile(new URL(script[1], entryURL), 'utf8'),
      readFile(new URL(style[1], entryURL), 'utf8'),
      loadIconData(html, entryURL),
    ]);
    await writeFile(new URL(`release/${filename}`, root), inlineBundle(html, { js, css, icons }));
    console.log(`Created release/${filename} — self-contained browser edition.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
