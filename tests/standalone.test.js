import test from 'node:test';
import assert from 'node:assert/strict';
import { inlineBundle, loadIconData } from '../scripts/standalone.mjs';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const template = '<link rel="icon" href="./favicon.svg"><link rel="stylesheet" crossorigin href="./assets/app.css"><script type="module" crossorigin src="./assets/app.js"></script>';
const favicon = '<svg xmlns="http://www.w3.org/2000/svg"/>';

test('standalone packaging preserves minified dollar variables and literal replacement tokens', () => {
  const js = 'const $=true; if($&&1) console.log("$&", "$`", "$\'", "$$");';
  const result = inlineBundle(template, { js, css: 'body{color:pink}', favicon });
  assert.ok(result.includes(`<script type="module">${js}</script>`));
  assert.ok(!result.includes('src="./assets/app.js"'));
  assert.equal((result.match(/<script /g) || []).length, 1);
});

test('standalone packaging preserves stylesheet text and inlines its favicon', () => {
  const css = '.sample::after{content:"$& $` $$"}';
  const result = inlineBundle(template, { js: 'console.log("ready")', css, favicon });
  assert.ok(result.includes(`<style>${css}</style>`));
  assert.ok(result.includes('href="data:image/svg+xml,'));
  assert.ok(!result.includes('href="./favicon.svg"'));
});

test('inline scripts cannot be cut short by a closing script token in asset strings', () => {
  const result = inlineBundle(template, { js: 'const text="</script><b>still a string</b>";', css: '', favicon });
  assert.equal((result.match(/<\/script>/g) || []).length, 1);
  assert.ok(result.includes('<\\/script><b>still a string</b>'));
  assert.throws(() => inlineBundle('<main/>', { js: '', css: '', favicon }), /Expected one bundled script/);
});


test('standalone packaging inlines every icon and Apple icon while preserving binary PNG contents and other link types', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'crush-icons-'));
  try {
    await mkdir(join(dir, 'assets'));
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><text>$& 新图标</text></svg>';
    const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 255, 128, 36]);
    await writeFile(join(dir, 'assets', 'crush-unique-hash.svg'), svg);
    await writeFile(join(dir, 'assets', 'crush-32-hash.png'), png);
    await writeFile(join(dir, 'assets', 'crush-180-hash.png'), png);
    const iconTags = '<link type="image/png" href="./assets/crush-32-hash.png" rel="icon" sizes="32x32">'
      + '<link rel="icon" type="image/svg+xml" href="./assets/crush-unique-hash.svg">'
      + "<link href='./assets/crush-180-hash.png' sizes='180x180' rel='apple-touch-icon'>"
      + '<link rel="canonical" href="https://example.com/">';
    const html = template.replace('<link rel="icon" href="./favicon.svg">', iconTags);
    const icons = await loadIconData(html, pathToFileURL(join(dir, 'index.html')));
    const result = inlineBundle(html, { js: 'console.log("ready")', css: '', icons });
    assert.equal(icons.size, 3);
    assert.equal((result.match(/href=["']data:image\//g) || []).length, 3);
    assert.ok(result.includes(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`));
    assert.ok(result.includes(`data:image/png;base64,${png.toString('base64')}`));
    assert.ok(!result.includes('href="./assets/'));
    assert.ok(!result.includes("href='./assets/"));
    assert.ok(result.includes('sizes="32x32"'));
    assert.ok(result.includes("sizes='180x180'"));
    assert.ok(result.includes('<link rel="canonical" href="https://example.com/">'));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('nested Boss entries resolve their own hashed relative icons and preserve icons already embedded', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'boss-icons-'));
  try {
    await mkdir(join(dir, 'assets'));
    await mkdir(join(dir, 'boss'));
    const boss = '<svg xmlns="http://www.w3.org/2000/svg"><circle r="8"/></svg>';
    await writeFile(join(dir, 'assets', 'boss-distinct-hash.svg'), boss);
    const embedded = 'data:image/png;base64,iVBORw0KGgo=';
    const html = template.replace('<link rel="icon" href="./favicon.svg">',
      '<link rel="shortcut icon" href="../assets/boss-distinct-hash.svg">'
      + `<link rel="apple-touch-icon" href="${embedded}">`);
    const icons = await loadIconData(html, pathToFileURL(join(dir, 'boss', 'index.html')));
    const result = inlineBundle(html, { js: 'console.log("boss")', css: '', icons });
    assert.equal(icons.size, 2);
    assert.ok(result.includes(`data:image/svg+xml;base64,${Buffer.from(boss).toString('base64')}`));
    assert.ok(result.includes(`href="${embedded}"`));
    assert.ok(!result.includes('../assets/boss-distinct-hash.svg'));
    await assert.rejects(loadIconData('<link rel="icon" href="../assets/missing.png">', pathToFileURL(join(dir, 'boss', 'index.html'))), /ENOENT/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
