import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { scenes, resultTypes } from '../src/story.js';

const repository = fileURLToPath(new URL('../', import.meta.url));

test('the packaged standalone HTML runs the entire picture story and exports its poster without extra requests', async ({ page, baseURL }) => {
  test.setTimeout(60_000);
  execFileSync('npm', ['run', 'package'], { cwd: repository, stdio: 'pipe', timeout: 30_000 });
  const html = await readFile(new URL('../release/心动放映室.html', import.meta.url), 'utf8');
  const standaloneURL = new URL('/standalone-check', baseURL).href;
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Fulfil the actual packaged bytes: this does not import development assets or use file://.
  await page.route('**/*', route => route.request().url() === standaloneURL
    ? route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html })
    : route.abort());
  await page.goto(standaloneURL);
  await expect(page.locator('main')).toHaveClass('view-home');
  await page.locator('[data-action="start"]').click();
  await page.locator('[data-action="begin"]').click();
  for (let index = 0; index < scenes.length; index++) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(index + 1));
    if (scenes[index].visual) await expect(page.locator('.image-answer .option-art svg')).toHaveCount(4);
    await page.locator('[data-answer="3"]').click();
    await page.locator('[data-action="next"]').click();
  }
  await expect(page.locator('main')).toHaveClass('view-result');
  await expect(page.locator('.result-poster h2')).toHaveText(resultTypes.mutual.title);
  await expect(page.locator('.result-poster [data-profile-art]')).toHaveAttribute('data-profile-art', 'mutual');
  await expect(page.locator('.guidance-card')).toHaveCount(6);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="download"]').click();
  const download = await downloadPromise;
  const png = await readFile(await download.path());
  expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(png.readUInt32BE(16)).toBe(1080);
  expect(png.readUInt32BE(20)).toBe(1560);
  expect(png.length).toBeGreaterThan(10_000);
  expect(requests).toEqual([standaloneURL]);
  expect(errors).toEqual([]);
});
