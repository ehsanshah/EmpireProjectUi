import {expect,test} from '@playwright/test';

const base='http://127.0.0.1:5178/o/demo/p/empire';
test('workspace accent is user chosen, persistent and shared by planning, Board, Calendar and Agent',async({page})=>{
 await page.goto(`${base}/planning?design=current`);
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await expect(page.locator('html')).toHaveAttribute('data-accent','ocean');
 await page.locator('.accent-picker summary').focus();
 await page.keyboard.press('Enter');
 await expect(page.getByRole('group',{name:'Choose workspace accent'})).toBeVisible();
 await page.getByRole('button',{name:'Forest'}).click();
 await expect(page.locator('html')).toHaveAttribute('data-accent','forest');
 await expect(page.locator('.accent-picker')).not.toHaveAttribute('open','');
 await expect(page.locator('.accent-picker summary')).toBeFocused();
 const chosen=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
 expect(chosen).toBe('#166d62');
 await page.screenshot({path:'docs/screenshots/color-system-planning-forest.png'});
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-accent','forest');
 await page.getByRole('button',{name:'Team board'}).click();
 await expect(page.locator('.kb-card').first()).toBeVisible();
 const cardColor=await page.locator('.kb-card').first().evaluate(element=>getComputedStyle(element).backgroundColor);
 const boardColor=await page.locator('.kanban-board').evaluate(element=>getComputedStyle(element).backgroundColor);
 expect(cardColor).not.toBe(boardColor);
 await page.screenshot({path:'docs/screenshots/color-system-board-forest.png'});
 await page.getByRole('button',{name:'Calendar',exact:true}).first().click();
 await expect(page.locator('.calendar-view')).toBeVisible();
 await expect(page.locator('html')).toHaveAttribute('data-accent','forest');
 await page.getByRole('button',{name:'Agents, Runs & Reviews'}).click();
 await expect(page.locator('.phase10')).toBeVisible();
 await expect(page.locator('html')).toHaveAttribute('data-accent','forest');
 await page.screenshot({path:'docs/screenshots/color-system-agents-forest.png'});
});

test('color menu and semantic meaning remain usable in Persian RTL mobile and dark theme',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(`${base}/planning?design=current`);
 await page.getByRole('combobox',{name:'Language'}).selectOption('fa');
 await page.locator('.accent-picker summary').click();
 await page.getByRole('button',{name:'زنبقی'}).click();
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await expect(page.locator('html')).toHaveAttribute('data-accent','iris');
 await page.locator('.theme-toggle').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.locator('.accent-picker summary').click();
 const bounds=await page.locator('.accent-menu').boundingBox();
 expect(bounds).not.toBeNull();
 expect(bounds!.x).toBeGreaterThanOrEqual(0);
 expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(390);
 await page.screenshot({path:'docs/screenshots/color-system-mobile-fa-dark.png'});
});

test('the same chosen accent reaches every project workspace without changing the workset',async({page})=>{
 await page.goto(`${base}/work?design=current&view=list`);
 await page.locator('.accent-picker summary').click();
 await page.getByRole('button',{name:'Copper'}).click();
 for(const route of ['work?view=list','work?view=board','work?view=timeline','planning','calendar','workflow','investigation','intake','datacarts/new','agents']){
  await page.goto(`${base}/${route}${route.includes('?')?'&':'?'}design=current`);
  await expect(page.locator('html')).toHaveAttribute('data-accent','copper');
  await expect(page.locator('.workspace-surface')).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('empire-ui-accent-v1'))).toBe('copper');
 }
 await page.goto(`${base}/work?design=current&view=board`);
 await page.locator('.theme-toggle').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.screenshot({path:'docs/screenshots/color-system-board-copper-dark.png'});
});

test('work rows and Board cards visibly carry the selected accent in Light and Dark',async({page})=>{
 await page.goto(`${base}/work?design=current&view=list`);
 await page.locator('.accent-picker summary').click();
 await page.getByRole('button',{name:'Iris'}).click();
 const row=page.locator('.table-scroll tbody tr[data-issue]').first();
 await expect(row).toBeVisible();
 const rowFill=await row.locator('td').first().evaluate(element=>getComputedStyle(element).backgroundColor);
 const surface=await page.locator('.workspace-surface').evaluate(element=>getComputedStyle(element).backgroundColor);
 expect(rowFill).not.toBe(surface);
 await page.screenshot({path:'docs/screenshots/color-system-list-iris-light.png'});
 await page.getByRole('button',{name:'Team board'}).click();
 const card=page.locator('.kb-card').first();
 await expect(card).toBeVisible();
 const cardFill=await card.evaluate(element=>getComputedStyle(element).backgroundColor);
 const columnFill=await page.locator('.kb-column').first().evaluate(element=>getComputedStyle(element).backgroundColor);
 expect(cardFill).not.toBe(columnFill);
 expect(await card.evaluate(element=>[getComputedStyle(element).borderLeftWidth,getComputedStyle(element).borderRightWidth])).toEqual(['5px','5px']);
 await page.screenshot({path:'docs/screenshots/color-system-board-iris-light.png'});
 await page.locator('.theme-toggle').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.waitForTimeout(260);
 const darkColumn=await page.locator('.kb-column').first().evaluate(element=>getComputedStyle(element).backgroundColor);
 expect(darkColumn).not.toBe('rgb(246, 248, 251)');
 await page.screenshot({path:'docs/screenshots/color-system-board-iris-dark.png'});
});

test('stronger work colors remain readable on Persian mobile List and Board',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(`${base}/work?design=current&view=list`);
 await page.getByRole('combobox',{name:'Language'}).selectOption('fa');
 await page.locator('.accent-picker summary').click();
 await page.getByRole('button',{name:'جنگلی'}).click();
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await expect(page.locator('.table-scroll tbody tr[data-issue]').first()).toBeVisible();
 await page.screenshot({path:'docs/screenshots/color-system-list-forest-mobile-fa.png'});
 await page.goto(`${base}/work?design=current&view=board`);
 await page.getByRole('combobox',{name:'Language'}).selectOption('fa');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 const mobileCard=page.locator('.kb-card').first();
 await mobileCard.scrollIntoViewIfNeeded();
 await expect(mobileCard).toBeVisible();
 expect(await mobileCard.evaluate(element=>[getComputedStyle(element).borderLeftWidth,getComputedStyle(element).borderRightWidth])).toEqual(['5px','5px']);
 await page.screenshot({path:'docs/screenshots/color-system-board-forest-mobile-fa.png'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
