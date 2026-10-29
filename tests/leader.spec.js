import {test,expect} from '@playwright/test';
test('complete observation, download PNG, review, restore and clear private answers',async({page})=>{
 await page.goto('/');await expect(page).toHaveTitle(/领导使用说明书/);
 await page.getByRole('button',{name:'看看我摊上了谁'}).click();
 for(let i=0;i<18;i++){await page.locator('[data-answer="0"]').click();await page.locator('[data-action="next"]').click();}
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
test('homepage hides leader types and unknown answers produce insufficient observation',async({page})=>{
 await page.goto('/');await expect(page.locator('.type-grid')).toHaveCount(0);await expect(page.getByRole('heading',{level:1})).toContainText('快来认领');await page.locator('[data-action="start"]').click();
 for(let i=0;i<18;i++){await page.locator('[data-answer="4"]').click();await page.locator('[data-action="next"]').click();}
 await expect(page.getByRole('heading',{name:'目前还不足以判断主要风格'})).toBeVisible();
 await expect(page.locator('[data-action="download"]')).toHaveCount(0);
});
for(const width of [320,390])test(`mobile ${width}px stays within viewport`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto('/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('[data-action="start"]').click();
 for(let i=0;i<18;i++){await page.locator('[data-answer="0"]').click();await page.locator('[data-action="next"]').click();}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('eight leader styles reveal distinct illustrations and export illustrated cards',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const {types,questions}=await import('../src/leader/data.js');
 const hashes=new Set();
 const {readFile}=await import('node:fs/promises');
 const {createHash}=await import('node:crypto');
 await page.goto('/');
 for(const type of types){
  const answers=questions.map(q=>{const i=q.options.findIndex(o=>o.scores.includes(type.id));return i<0?4:i;});
  await page.evaluate(a=>sessionStorage.setItem('leader-manual-v1',JSON.stringify(a)),answers);
  await page.reload();await page.locator('[data-action="resume"]').click();
  await expect(page.locator('.result-card h2')).toHaveText(type.name);
  await expect(page.locator(`.result-card [data-boss-art="${type.id}"]`)).toBeVisible();
  const pending=page.waitForEvent('download');await page.locator('[data-action="download"]').click();
  const download=await pending;const bytes=await readFile(await download.path());
  expect(bytes.length).toBeGreaterThan(30000);hashes.add(createHash('sha256').update(bytes).digest('hex'));
 }
 expect(hashes.size).toBe(8);
});
test('real touch swipes navigate only after a choice and new questions stay blank',async({browser})=>{
 const context=await browser.newContext({hasTouch:true,isMobile:true,viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto('/');
 // Old saved answers cannot silently populate a new attempt.
 await page.evaluate(()=>sessionStorage.setItem('leader-manual-v1',JSON.stringify([0,1,2])));
 await page.reload();await page.locator('[data-action="start"]').tap();
 const client=await context.newCDPSession(page);
 async function swipe(x1,y1,x2,y2){
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x1,y:y1}]});
  for(let i=1;i<=6;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x1+(x2-x1)*i/6,y:y1+(y2-y1)*i/6}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 }
 await expect(page.locator('.option.selected')).toHaveCount(0);
 await expect(page.locator('[data-action="next"]')).toBeDisabled();
 await swipe(300,350,90,350);
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
 await page.waitForTimeout(460);
 await page.locator('[data-answer="1"]').tap();
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
 await expect(page.locator('.option.selected')).toHaveCount(1);
 await swipe(300,350,90,350);
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','2');
 await expect(page.locator('[data-answer="0"]')).toBeEnabled();
 await expect(page.locator('.option.selected')).toHaveCount(0);
 await expect(page.locator('[aria-pressed="true"]')).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('leader-manual-v1')))).toEqual([1]);
 await swipe(180,350,180,260);
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','2');
 await swipe(90,350,300,350);
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
 await expect(page.locator('[data-answer="1"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('[data-answer="0"]')).toBeEnabled();
 await page.waitForTimeout(460);
 await page.locator('[data-answer="2"]').tap();
 await expect(page.locator('.option.selected')).toHaveCount(1);
 await context.close();
});
test('reduced motion skips animations without losing answers',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.locator('[data-action="start"]').click();
 await page.locator('[data-answer="2"]').click();await page.locator('[data-action="next"]').click();
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','2');
 expect(await page.evaluate(()=>document.querySelector('#main').getAnimations().length)).toBe(0);
});
