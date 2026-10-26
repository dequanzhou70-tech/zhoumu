import test from 'node:test';
import assert from 'node:assert/strict';
import { inlineBundle } from '../scripts/standalone.mjs';

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
