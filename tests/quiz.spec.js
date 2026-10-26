import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as story from '../src/story.js';

const STORAGE_KEY = 'crush-cinema:v2';
const hash = value => createHash('sha256').update(value).digest('hex');

test.use({ reducedMotion: 'reduce' });

async function begin(page) {
  await page.goto('/');
  await page.locator('[data-action="start"]').click();
  await expect(page.locator('main')).toHaveClass('view-setup');
  await page.locator('[data-action="begin"]').click();
  await expect(page.locator('main')).toHaveClass('view-quiz');
}

async function complete(page, choice, checkLayout = false) {
  for (let index = 0; index < story.scenes.length; index++) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(index + 1));
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', String(story.scenes.length));
    if (story.scenes[index].visual) {
      await expect(page.locator('.image-answer')).toHaveCount(4);
      await expect(page.locator('.image-answer .option-art svg')).toHaveCount(4);
      await expect(page.locator('.unknown-answer .option-art')).toHaveCount(0);
    }
    if (checkLayout) await expectNoHorizontalOverflow(page, `scene ${index + 1}`);
    await page.locator(`[data-answer="${choice}"]`).click();
    await expect(page.locator(`[data-answer="${choice}"]`)).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-action="next"]').click();
  }
  await expect(page.locator('main')).toHaveClass('view-result');
}

async function expectNoHorizontalOverflow(page, screen) {
  const layout = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(layout.content, `${screen} should fit the viewport`).toBeLessThanOrEqual(layout.viewport);
}

async function restoreResult(page, fixture) {
  await page.goto('/');
  await page.evaluate(({ key, fixture, count }) => {
    sessionStorage.setItem(key, JSON.stringify({
      screen: 'result', answers: fixture.answers, context: fixture.context, current: count - 1,
    }));
  }, { key: STORAGE_KEY, fixture, count: story.scenes.length });
  await page.reload();
  await page.locator('[data-action="resume"]').click();
  await expect(page.locator('main')).toHaveClass('view-result');
}

async function downloadPoster(page) {
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="download"]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^心动放映室-.*\.png$/);
  const bytes = await readFile(await download.path());
  expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(bytes.readUInt32BE(16)).toBe(1080);
  expect(bytes.readUInt32BE(20)).toBe(1560);
  expect(bytes.length).toBeGreaterThan(10_000);
  return bytes;
}

test('a complete picture story reveals its relationship profile and downloads a real poster', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await begin(page);
  await expect(page.locator('[data-action="next"]')).toBeDisabled();
  await complete(page, 3);
  await expect(page.locator('.result-poster h2')).toHaveText(story.resultTypes.mutual.title);
  await expect(page.locator('.result-poster [data-profile-art]')).toHaveAttribute('data-profile-art', 'mutual');
  await expect(page.locator('.poster-score strong')).toHaveText('100/ 100');
  await expect(page.locator('.poster-score')).toContainText(/线索.*充足/);
  await expect(page.locator('.evidence-list li')).toHaveCount(3);
  await expect(page.locator('.context-note')).toContainText('喜欢概率');
  await downloadPoster(page);
  expect(errors).toEqual([]);
});

test('unknown answers produce pending observations and useful next steps without an invented zero score', async ({ page }) => {
  await begin(page);
  await complete(page, 4);
  await expect(page.locator('.result-poster h2')).toHaveText(story.resultTypes.unknown.title);
  await expect(page.locator('.poster-score strong')).toHaveText('待续');
  await expect(page.locator('.poster-score')).toContainText('线索不足');
  await expect(page.locator('.dimension-list')).toContainText('待观察');
  await expect(page.locator('.evidence-list li')).toHaveCount(0);
  await expect(page.locator('.poster-score strong')).not.toContainText('0');
  await expect(page.locator('.guidance-card')).toHaveCount(6);
  await expect(page.locator('.plan-step')).toHaveCount(3);
});

test('going back preserves earlier picture answers and lets the user revise them', async ({ page }) => {
  await begin(page);
  await page.locator('[data-answer="1"]').click();
  await page.locator('[data-action="next"]').click();
  await page.locator('[data-answer="2"]').click();
  await page.locator('[data-action="next"]').click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
  await page.locator('[data-action="back"]').click();
  await expect(page.locator('[data-answer="2"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-action="back"]').click();
  await expect(page.locator('[data-answer="1"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-answer="3"]').click();
  await expect(page.locator('[data-answer="1"]')).toHaveAttribute('aria-pressed', 'false');
  await page.locator('[data-action="next"]').click();
  await expect(page.locator('[data-answer="2"]')).toHaveAttribute('aria-pressed', 'true');
});

test('refresh returns to the landing page and progress resumes only when requested', async ({ page }) => {
  await begin(page);
  await page.locator('[data-answer="2"]').click();
  await page.locator('[data-action="next"]').click();
  await page.locator('[data-answer="3"]').click();
  await page.reload();
  await expect(page.locator('main')).toHaveClass('view-home');
  await page.locator('[data-action="resume"]').click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  await expect(page.locator('[data-answer="3"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-action="next"]')).toBeEnabled();
});

test('starting over asks for confirmation before replacing a saved attempt', async ({ page }) => {
  await begin(page);
  await page.locator('[data-answer="2"]').click();
  await page.locator('[data-action="home"]').click();
  await page.locator('[data-action="start"]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('重新开始会清除');
  await page.getByRole('dialog').locator('[data-action="resume"]').click();
  await expect(page.locator('[data-answer="2"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-action="home"]').click();
  await page.locator('[data-action="start"]').click();
  await page.getByRole('dialog').locator('[data-action="fresh"]').click();
  await expect(page.locator('main')).toHaveClass('view-setup');
  await page.locator('[data-action="begin"]').click();
  await expect(page.locator('[data-action="next"]')).toBeDisabled();
  await expect(page.locator('.answer[aria-pressed="true"]')).toHaveCount(0);
});

test('all twelve illustrated profiles can be explored without overwriting the personal session', async ({ page }) => {
  await begin(page);
  await page.locator('[data-answer="2"]').click();
  const before = await page.evaluate(key => sessionStorage.getItem(key), STORAGE_KEY);
  await page.locator('[data-action="endings"]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.ending-card')).toHaveCount(Object.keys(story.resultTypes).length);
  await expect(page.locator('.ending-card [data-profile-art]')).toHaveCount(12);
  await expect(page.getByRole('dialog')).toContainText(story.resultTypes.mutual.title);
  const last = page.locator('.ending-card').last();
  await last.click();
  await expect(page.getByRole('dialog')).toContainText('画像预告');
  expect(await page.evaluate(key => sessionStorage.getItem(key), STORAGE_KEY)).toBe(before);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.site-header [data-action="endings"]')).toBeFocused();
  await expect(page.locator('[data-answer="2"]')).toHaveAttribute('aria-pressed', 'true');
});

test('six relationship indicators include actionable guidance and transparent academic references', async ({ page }) => {
  await restoreResult(page, story.profileExamples.mutual);
  await expect(page.locator('.guidance-card')).toHaveCount(6);
  await expect(page.locator('.plan-step')).toHaveCount(3);
  for (const card of await page.locator('.guidance-card').all()) {
    await expect(card.locator('h3')).not.toBeEmpty();
    await expect(card.locator('.say-box')).not.toBeEmpty();
    await expect(card).toContainText('可以试试');
    await expect(card).toContainText('留意');
  }
  await page.locator('.research-details summary').click();
  await expect(page.locator('.research-source')).toHaveCount(5);
  const sourceUrls = await page.locator('.research-source a[href^="https://doi.org/"]').evaluateAll(links => links.map(a => a.href));
  expect(new Set(sourceUrls).size).toBe(5);
  await expect(page.locator('.research-section')).toContainText('未经');
});

test('each of the twelve relationship attributes renders and exports a different illustrated PNG', async ({ page }) => {
  test.setTimeout(90_000);
  const errors = [];
  const pngHashes = new Set();
  const artHashes = new Set();
  page.on('pageerror', error => errors.push(error.message));
  expect(Object.keys(story.profileExamples)).toHaveLength(12);
  for (const [id, fixture] of Object.entries(story.profileExamples)) {
    expect(story.getResult(fixture.answers, fixture.context).id, `${id} fixture must actually select its own profile`).toBe(id);
    await restoreResult(page, fixture);
    await expect(page.locator('.result-poster h2')).toHaveText(story.resultTypes[id].title);
    const art = page.locator('.result-poster [data-profile-art]');
    await expect(art).toHaveAttribute('data-profile-art', id);
    artHashes.add(hash(await art.innerHTML()));
    pngHashes.add(hash(await downloadPoster(page)));
  }
  expect(artHashes.size).toBe(12);
  expect(pngHashes.size).toBe(12);
  expect(errors).toEqual([]);
});

test('privacy controls erase answers from the current session', async ({ page }) => {
  await begin(page);
  await page.locator('[data-answer="2"]').click();
  await page.locator('[data-action="privacy"]').click();
  await expect(page.getByRole('dialog')).toContainText('不设置答题数据收集接口');
  await page.locator('[data-action="clear-progress"]').click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('main')).toHaveClass('view-home');
  await expect(page.locator('[data-action="resume"]')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('[data-action="resume"]')).toHaveCount(0);
  expect(await page.evaluate(key => sessionStorage.getItem(key), STORAGE_KEY)).toBeNull();
});

test('interactive controls can use Enter and Space and keep keyboard focus', async ({ page }) => {
  await page.goto('/');
  const sound = page.locator('[data-action="sound"]');
  await sound.focus();
  await page.keyboard.press('Enter');
  await expect(sound).toHaveAttribute('aria-pressed', 'true');
  await expect(sound).toBeFocused();
  await page.keyboard.press('Space');
  await expect(sound).toHaveAttribute('aria-pressed', 'false');
  await expect(sound).toBeFocused();
  await page.locator('[data-action="start"]').click();
  const relation = page.locator('[data-relation="主要在线上"]');
  await relation.focus();
  await page.keyboard.press('Enter');
  await expect(relation).toHaveAttribute('aria-pressed', 'true');
  await expect(relation).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-style="比较主动"]')).toBeFocused();
  const style = page.locator('[data-style="比较慢热"]');
  await style.focus();
  await page.keyboard.press('Enter');
  await expect(style).toHaveAttribute('aria-pressed', 'true');
  await expect(style).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-style="还不确定"]')).toBeFocused();
  await page.locator('[data-action="begin"]').click();
  const first = page.locator('[data-answer="0"]');
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expect(first).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-answer="1"]')).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('[data-answer="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-answer="1"]')).toBeFocused();
  await expect(page.locator('[data-action="next"]')).toBeEnabled();
});

for (const width of [390, 320]) {
  test.describe(`phone layout ${width}px`, () => {
    test.use({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });

    test('the full picture journey and guidance fit without horizontal scrolling', async ({ page }) => {
      await page.goto('/');
      await expectNoHorizontalOverflow(page, 'landing');
      await page.locator('[data-action="start"]').click();
      await expectNoHorizontalOverflow(page, 'setup');
      await page.locator('[data-relation="主要在线上"]').click();
      await page.locator('[data-style="比较慢热"]').click();
      await page.locator('[data-action="begin"]').click();
      await complete(page, 3, true);
      await expectNoHorizontalOverflow(page, 'result and guidance');
      await expect(page.locator('.context-note')).toContainText('慢热');
      await expect(page.locator('.context-note')).toContainText('线上');
      await expect(page.locator('.poster-score strong')).toHaveText('100/ 100');
      await page.locator('.research-details summary').click();
      await expectNoHorizontalOverflow(page, 'expanded research references');
      await page.locator('[data-action="endings"]').click();
      await expectNoHorizontalOverflow(page, 'profile gallery');
      const modalWidth = await page.getByRole('dialog').evaluate(dialog => ({ scroll: dialog.scrollWidth, width: dialog.clientWidth }));
      expect(modalWidth.scroll).toBeLessThanOrEqual(modalWidth.width);
    });
  });
}
