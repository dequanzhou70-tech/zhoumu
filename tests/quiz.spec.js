import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function begin(page) {
  await page.goto('/');
  await page.locator('[data-action="start"]').click();
  await expect(page.locator('main')).toHaveClass('view-setup');
  await page.locator('[data-action="begin"]').click();
  await expect(page.locator('main')).toHaveClass('view-quiz');
}

async function complete(page, choice) {
  for (let index = 0; index < 10; index++) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(index + 1));
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

test('a complete high-signal story reveals its evidence and downloads a real poster', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await begin(page);
  await expect(page.locator('[data-action="next"]')).toBeDisabled();
  await complete(page, 3);
  await expect(page.locator('.result-poster h2')).toHaveText('雨停之前，TA 还没走');
  await expect(page.locator('.poster-score strong')).toHaveText('100/ 100');
  await expect(page.locator('.poster-score')).toContainText('线索充足');
  await expect(page.locator('.evidence-list li')).toHaveCount(3);
  await expect(page.locator('.context-note')).toContainText('不是 TA 喜欢你的概率');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="download"]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^心动放映室-.*\.png$/);
  const bytes = await readFile(await download.path());
  expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(bytes.readUInt32BE(16)).toBe(1080);
  expect(bytes.readUInt32BE(20)).toBe(1560);
  expect(bytes.length).toBeGreaterThan(10_000);
  expect(errors).toEqual([]);
});

test('unknown answers produce a pending ending, not an invented zero score', async ({ page }) => {
  await begin(page);
  await complete(page, 4);
  await expect(page.locator('.result-poster h2')).toHaveText('故事还在选角中');
  await expect(page.locator('.poster-score strong')).toHaveText('待续');
  await expect(page.locator('.poster-score')).toContainText('线索不足');
  await expect(page.locator('.dimension-list')).toContainText('待观察');
  await expect(page.locator('.evidence-list li')).toHaveCount(0);
  await expect(page.locator('.poster-score strong')).not.toContainText('0');
});

test('going back preserves earlier answers and lets the user revise them', async ({ page }) => {
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

test('the ending gallery is keyboard dismissible and uses the actual result titles', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-action="endings"]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.ending-card')).toHaveCount(5);
  await expect(page.getByRole('dialog')).toContainText('雨停之前，TA 还没走');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('[data-action="endings"]')).toBeFocused();
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
  expect(await page.evaluate(() => sessionStorage.getItem('crush-cinema:v1'))).toBeNull();
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

test.describe('phone layout', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('the full mobile journey fits its screen without horizontal scrolling', async ({ page }) => {
    await page.goto('/');
    await expectNoHorizontalOverflow(page, 'landing');
    await page.locator('[data-action="start"]').click();
    await expectNoHorizontalOverflow(page, 'setup');
    await page.locator('[data-relation="主要在线上"]').click();
    await page.locator('[data-style="比较慢热"]').click();
    await page.locator('[data-action="begin"]').click();
    await expectNoHorizontalOverflow(page, 'quiz');
    await complete(page, 3);
    await expectNoHorizontalOverflow(page, 'result');
    await expect(page.locator('.context-note')).toContainText('比较慢热');
    await expect(page.locator('.context-note')).toContainText('线上互动');
    await expect(page.locator('.poster-score strong')).toHaveText('100/ 100');
  });
});
