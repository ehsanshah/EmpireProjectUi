import {test,expect} from '@playwright/test';

test('remaining work stays consistent across views, drawer, history and edits',async({page})=>{
 await page.goto('/?design=current');
 await expect(page.locator('[data-issue]')).toHaveCount(14);
 const eighth=await page.locator('[data-issue]').nth(7).boundingBox();
 const surface=await page.locator('.table-scroll').boundingBox();
 expect(eighth!.y+eighth!.height).toBeLessThanOrEqual(surface!.y+surface!.height+1);
 const command=page.getByRole('textbox',{name:'Command',exact:true});
 await expect(command).toBeInViewport();
 async function run(p:string){await command.fill(p);await command.press('Enter');}
 await run('Show remaining work');
 await expect(page.locator('[data-issue]')).toHaveCount(8);
 await run('Only blocked');
 await expect(page.locator('[data-issue]')).toHaveCount(2);
 for(const view of ['Board','Timeline','List']){
  await page.getByRole('button',{name:view,exact:true}).click();
  await expect(page.locator('[data-issue]')).toHaveCount(2);
  await expect(page.locator('[data-issue="EMP-103"]')).toBeAttached();
  await expect(page.locator('[data-issue="EMP-104"]')).toBeAttached();
 }
 await run('Group by assignee');
 await run('Show timeline');
 await expect(page.locator('.unscheduled').filter({hasText:'EMP-104'})).toBeVisible();
 await page.screenshot({path:'docs/screenshots/redesign/04-timeline.png'});
 await run('Open EMP-104');
 await expect(page.getByRole('dialog')).toContainText('event payload, signature and retry policy');
 await expect(page.getByRole('dialog')).not.toContainText(/[\u0600-\u06ff]/);
 await page.keyboard.press('Escape');
 await expect(command).toBeFocused();
 await expect(page.locator('.selected-context')).toContainText('EMP-104');
 await run('Back');
 await expect(page.locator('table')).toBeVisible();
 await expect(page.locator('[data-issue]')).toHaveCount(2);
 await run('Explain only');
 await expect(page.locator('[data-issue]')).toHaveCount(2);
 await run('Show all issues');
 await expect(page.locator('[data-issue]')).toHaveCount(14);
 await page.getByLabel('EMP-101 status').selectOption('completed');
 await page.getByRole('button',{name:'Undo',exact:true}).click();
 await expect(page.getByLabel('EMP-101 status')).toHaveValue('in_progress');
 await page.getByLabel('EMP-101 assignee').selectOption('u-reza');
 await page.reload();
 await expect(page.getByLabel('EMP-101 assignee')).toHaveValue('u-reza');
});

test('local create, error/retry, responsive layouts, Persian and light theme',async({page})=>{
 await page.goto('/?design=current');
 for(const width of [390,768]){
  await page.setViewportSize({width,height:900});
  await expect(page.getByRole('textbox',{name:'Command',exact:true})).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`docs/screenshots/redesign/06-width-${width}.png`});
 }
 await page.getByRole('button',{name:'New issue',exact:true}).click();
 await page.getByLabel('Title',{exact:true}).fill('Verify local creation');
 await page.getByRole('button',{name:'Save locally'}).click();
 await expect(page.locator('[data-issue]')).toHaveCount(15);
 await page.reload();
 await expect(page.locator('[data-issue]')).toHaveCount(15);
 await page.setViewportSize({width:1440,height:900});
 await page.getByRole('button',{name:'Reset demo',exact:true}).click();
 await expect(page.locator('[data-issue]')).toHaveCount(14);
 await page.getByLabel('Demo scenarios').selectOption('error');
 await expect(page.getByRole('alert')).toBeVisible();
 await page.getByRole('button',{name:'Retry',exact:true}).click();
 await expect(page.locator('[data-issue]')).toHaveCount(14);
 await page.getByLabel('Demo scenarios').selectOption('empty');
 await expect(page.locator('[data-issue]')).toHaveCount(0);
 await page.getByRole('button',{name:'Show all issues',exact:true}).click();
 await expect(page.locator('[data-issue]')).toHaveCount(14);
 await page.keyboard.press('Control+k');
 await expect(page.getByRole('textbox',{name:'Command',exact:true})).toBeFocused();
 await page.getByLabel('Language').selectOption('fa');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await page.getByRole('textbox',{name:'فرمان',exact:true}).fill('چرا تحویل در خطر است؟');
 await page.getByRole('textbox',{name:'فرمان',exact:true}).press('Enter');
 await expect(page.getByTestId('risk-investigation')).toContainText('منتظر تأیید ساختار امضا');
 await page.screenshot({path:'docs/screenshots/redesign/07-persian-risk.png'});
 await page.getByLabel('زبان',{exact:true}).selectOption('en');
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.screenshot({path:'docs/screenshots/redesign/08-light-risk.png'});
});
