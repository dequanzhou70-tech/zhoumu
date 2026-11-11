import { test, expect } from '@playwright/test';
import { scenes, resultTypes } from '../src/story.js';
import { questions, evaluate } from '../src/leader/data.js';

test('the root keeps the fourteen-question crush test while /boss/ keeps its separate eighteen-question workflow', async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  expect(scenes).toHaveLength(14);
  expect(questions).toHaveLength(18);
  await page.goto('/');
  await expect(page).toHaveTitle(/心动放映室/);
  await expect(page.locator('.brand')).toContainText('心动放映室');
  await expect(page.locator('main')).toHaveClass('view-home');
  await page.locator('[data-action="start"]').click();
  await page.locator('[data-action="begin"]').click();
  for (const [index, question] of scenes.entries()) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '14');
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(index + 1));
    await expect(page.locator('main h1')).toHaveText(question.prompt);
    await page.locator('[data-answer="3"]').click();
  }
  await expect(page.locator('main')).toHaveClass('view-result');
  await expect(page.locator('.result-poster h2')).toHaveText(resultTypes.mutual.title);
  await expect(page.locator('.result-card')).toHaveCount(0);
  const crushProgress = await page.evaluate(() => sessionStorage.getItem('crush-cinema:v2'));
  expect(JSON.parse(crushProgress).answers).toHaveLength(14);

  await page.goto('/boss/');
  await expect(page).toHaveTitle(/领导使用说明书/);
  await expect(page.locator('.brand')).toContainText('领导使用说明书');
  await expect(page.locator('main h1')).toContainText('Boss');
  await page.locator('[data-action="start"]').click();
  for (const [index, question] of questions.entries()) {
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '18');
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(index + 1));
    await expect(page.locator('main h1')).toHaveText(question.prompt);
    await page.locator('[data-answer="0"]').click();
    // Boss keeps its deliberate Next/swipe workflow; choosing an answer does not advance.
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(index + 1));
    await page.locator('[data-action="next"]').click();
  }
  const expectedBoss = evaluate(Array(18).fill(0)).primary;
  await expect(page.locator('.result-card h2')).toHaveText(expectedBoss.name);
  await expect(page.locator('.result-poster')).toHaveCount(0);
  const bossProgress = await page.evaluate(() => sessionStorage.getItem('leader-manual-v1'));
  expect(JSON.parse(bossProgress)).toHaveLength(18);
  expect(await page.evaluate(() => sessionStorage.getItem('crush-cinema:v2'))).toBe(crushProgress);

  // Revisiting either public entry must restore that app's own completed session.
  await page.goto('/');
  await expect(page).toHaveTitle(/心动放映室/);
  await page.locator('[data-action="resume"]').click();
  await expect(page.locator('.result-poster h2')).toHaveText(resultTypes.mutual.title);
  expect(await page.evaluate(() => sessionStorage.getItem('leader-manual-v1'))).toBe(bossProgress);
  await page.goto('/boss/');
  await expect(page).toHaveTitle(/领导使用说明书/);
  await page.locator('[data-action="resume"]').click();
  await expect(page.locator('.result-card h2')).toHaveText(expectedBoss.name);
  expect(errors).toEqual([]);
});
