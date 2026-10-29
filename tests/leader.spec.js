import {test,expect} from '@playwright/test';
test('complete observation, download PNG, review, restore and clear private answers',async({page})=>{
 await page.goto('/');await expect(page).toHaveTitle(/领导使用说明书/);
 await page.getByRole('button',{name:'开始观察我的领导'}).click();
 for(let i=0;i<18;i++)await page.locator('[data-answer="0"]').click();
 await expect(page.getByRole('heading',{name:'找到相处的频道。'})).toBeVisible();
 await expect(page.locator('.result-card h2')).toHaveText('会议召唤师');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'下载风格分享卡'}).click();
 const d=await download;expect(d.suggestedFilename()).toContain('会议召唤师');
 const {readFile}=await import('node:fs/promises');const bytes=await readFile(await d.path());
 expect(bytes.readUInt32BE(16)).toBe(1080);expect(bytes.readUInt32BE(20)).toBe(1440);
 await page.getByRole('button',{name:'回看并修改答案'}).click();
 await expect(page.locator('[data-answer="0"]')).toHaveAttribute('aria-pressed','true');
 await page.reload();await page.getByRole('button',{name:'继续上次观察'}).click();
 await expect(page.locator('.result-card')).toBeVisible();
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'清除本次记录'}).click();
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('leader-manual-v1')))).toEqual([]);
});
test('unknown answers produce insufficient observation and browsing preserves answers',async({page})=>{
 await page.goto('/');await page.locator('[data-type="original"]').click();await expect(page.locator('.result-card h2')).toHaveText('第一版守护者');
 await page.getByRole('button',{name:'返回我的观察'}).click();await page.locator('[data-action="start"]').click();
 for(let i=0;i<18;i++)await page.locator('[data-answer="4"]').click();
 await expect(page.getByRole('heading',{name:'目前还不足以判断主要风格'})).toBeVisible();
 await expect(page.locator('[data-action="download"]')).toHaveCount(0);
});
for(const width of [320,390])test(`mobile ${width}px stays within viewport`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto('/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('[data-action="start"]').click();
 for(let i=0;i<18;i++)await page.locator('[data-answer="0"]').click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
