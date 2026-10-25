import {test,expect,type Page} from '@playwright/test';

async function startBoard(page:Page){await page.goto('/?design=glass');await page.getByRole('button',{name:'Board',exact:true}).click();await expect(page.getByTestId('kanban-board')).toBeVisible()}
async function dragTo(page:Page,key:string,selector:string,ratio=.15,hold=false){
 const source=page.locator(`.kb-card[data-issue="${key}"] .kb-grip`);const target=page.locator(selector);await source.scrollIntoViewIfNeeded();
 const a=await source.boundingBox();if(!a)throw Error('Missing drag source');
 await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();
 await target.scrollIntoViewIfNeeded();const b=await target.boundingBox();if(!b)throw Error('Missing drag target');
 await page.mouse.move(b.x+b.width/2,b.y+b.height*ratio,{steps:12});
 if(!hold)await page.mouse.up();
}
const webTodo='[data-lane="web"] [data-column="todo"]';
const webProgress='[data-lane="web"] [data-column="in_progress"]';

test('A–G: reorder, sized placeholder, shared WIP, collapse, lane move, keyboard/menu, refresh/reset and upload',async({page})=>{
 await startBoard(page);
 await expect(page.getByTestId('wip-summary')).toContainText('3/4');
 await page.screenshot({path:'docs/screenshots/kanban-01-desktop.png'});
 // A: lift and reorder the multiline card inside To Do.
 const before=await page.locator(`${webTodo} .kb-card`).evaluateAll(cards=>cards.map(card=>card.getAttribute('data-issue')));
 expect(before).toEqual(['EMP-102','EMP-104']);
 await dragTo(page,'EMP-104',`${webTodo} .kb-card[data-issue="EMP-102"]`,.2,true);
 await expect(page.locator('.kb-drag-preview')).toBeVisible();
 const heights=await page.evaluate(()=>({source:document.querySelector('.kb-card[data-issue="EMP-104"]')!.getBoundingClientRect().height,placeholder:document.querySelector('.kb-placeholder')!.getBoundingClientRect().height,opacity:getComputedStyle(document.querySelector('.kb-card[data-issue="EMP-104"]')!).opacity,transform:getComputedStyle(document.querySelector('.kb-drag-preview')!).transform}));
 expect(Math.abs(heights.source-heights.placeholder)).toBeLessThan(1);expect(Number(heights.opacity)).toBeLessThan(.4);expect(heights.transform).not.toBe('none');
 await page.screenshot({path:'docs/screenshots/kanban-02-drag.png'});await page.mouse.up();
 await expect.poll(()=>page.locator(`${webTodo} .kb-card`).evaluateAll(cards=>cards.map(card=>card.getAttribute('data-issue')))).toEqual(['EMP-104','EMP-102']);
 // B: a fourth card is allowed.
 await dragTo(page,'EMP-102',`${webProgress} .kb-list`,.3);
 await expect(page.getByTestId('wip-summary')).toContainText('4/4');
 await expect(page.getByTestId('wip-summary')).toContainText('WIP limit reached');
 await expect(page.locator(`${webProgress} .kb-card[data-issue="EMP-102"]`)).toBeAttached();
 await page.screenshot({path:'docs/screenshots/kanban-03-wip-full.png'});
 // C: a fifth card returns to its previous column.
 await dragTo(page,'EMP-104',`${webProgress} .kb-list`,.3);
 await expect(page.locator('.kb-notice')).toContainText('WIP limit reached');
 await expect(page.locator(`${webTodo} .kb-card[data-issue="EMP-104"]`)).toBeAttached();
 await expect(page.getByTestId('wip-summary')).toContainText('4/4');
 // D: collapsing Done changes only presentation and preserves counts.
 await page.getByRole('button',{name:'Expand Done'}).first().click();
 await expect(page.locator('[data-lane="web"] [data-column="done"] .kb-card')).toHaveCount(3);
 await page.getByRole('button',{name:'Collapse Done'}).first().click();
 await expect(page.locator('[data-lane="web"] [data-column="done"] .kb-card')).toHaveCount(0);
 await expect(page.locator('[data-lane="web"] [data-column="done"] .kb-column-head')).toContainText('3');
 await page.getByRole('button',{name:'Collapse Backlog'}).first().click();
 await expect(page.locator('[data-lane="mobile"] .kb-column[data-column="backlog"]')).toHaveClass(/is-collapsed/);
 await page.getByRole('button',{name:'Expand Backlog'}).first().click();
 await expect(page.locator('[data-lane="mobile"] [data-column="backlog"] .kb-card')).toHaveCount(1);
 await page.screenshot({path:'docs/screenshots/kanban-04-collapsed.png'});
 // E: move one Web card to the Mobile swimlane while preserving WIP count.
 await page.locator('.kb-card[data-issue="EMP-102"]').getByRole('button',{name:'Move to… EMP-102'}).click();
 await page.locator('.kb-card[data-issue="EMP-102"] .kb-menu-area').nth(1).getByRole('button',{name:'In Progress'}).click();
 await expect(page.locator('[data-lane="mobile"] [data-column="in_progress"] .kb-card[data-issue="EMP-102"]')).toBeAttached();
 await expect(page.locator('[data-lane="web"] .kb-card[data-issue="EMP-102"]')).toHaveCount(0);
 await expect(page.getByTestId('wip-summary')).toContainText('4/4');
 await page.locator('.kb-lane[data-lane="mobile"]').scrollIntoViewIfNeeded();
 await page.screenshot({path:'docs/screenshots/kanban-05-swimlanes.png'});
 // F: menu and keyboard share the same WIP rejection.
 await page.locator('.kb-card[data-issue="EMP-104"]').getByRole('button',{name:'Move to… EMP-104'}).click();
 await page.locator('.kb-card[data-issue="EMP-104"] .kb-menu-area').first().getByRole('button',{name:'In Progress'}).click();
 await expect(page.locator(`${webTodo} .kb-card[data-issue="EMP-104"]`)).toBeAttached();
 await page.locator('.kb-card[data-issue="EMP-104"] .kb-grip').focus();await page.keyboard.press('Alt+ArrowRight');
 await expect(page.locator(`${webTodo} .kb-card[data-issue="EMP-104"]`)).toBeAttached();
 // G: changes survive refresh and Reset demo restores seed and policy.
 await page.reload();await expect(page.getByTestId('wip-summary')).toContainText('4/4');
 await expect(page.locator('[data-lane="mobile"] [data-column="in_progress"] .kb-card[data-issue="EMP-102"]')).toBeAttached();
 await page.getByRole('button',{name:'Upload cards'}).click();
 await page.getByLabel('Choose card file').setInputFiles('docs/kanban-import-sample.csv');
 await expect(page.locator('.kb-import-preview')).toContainText('1 cards ready');await page.screenshot({path:'docs/screenshots/kanban-10-upload.png'});await page.getByRole('button',{name:'Import locally'}).click();
 await expect(page.locator('[data-lane="mobile"] [data-column="backlog"] .kb-card')).toHaveCount(2);
 await page.getByRole('button',{name:'List',exact:true}).click();await expect(page.getByTestId('result-count')).toHaveText('15');await expect(page.getByText('Uploaded demo card')).toBeVisible();await page.getByRole('button',{name:'Board',exact:true}).click();
 await page.getByRole('button',{name:'Reset demo',exact:true}).click();await page.getByRole('button',{name:'Board',exact:true}).click();
 await expect(page.getByTestId('wip-summary')).toContainText('3/4');await expect(page.getByTestId('result-count')).toHaveText('14');
 await page.getByRole('button',{name:'Board settings'}).click();await page.getByLabel('WIP limit').fill('5');await expect(page.getByTestId('wip-summary')).toContainText('3/5');
 await page.reload();await expect(page.getByTestId('wip-summary')).toContainText('3/5');
 await page.getByRole('button',{name:'Reset demo',exact:true}).click();await page.getByRole('button',{name:'Board',exact:true}).click();await expect(page.getByTestId('wip-summary')).toContainText('3/4');
});

test('a one-line placeholder matches the source and pointer drag crosses swimlanes',async({page})=>{
 await page.setViewportSize({width:1600,height:2000});await startBoard(page);
 await dragTo(page,'EMP-106','[data-lane="mobile"] [data-column="todo"] .kb-list',.8,true);
 const sizes=await page.evaluate(()=>({source:document.querySelector('.kb-card[data-issue="EMP-106"]')!.getBoundingClientRect().height,slot:document.querySelector('.kb-placeholder')!.getBoundingClientRect().height}));
 expect(Math.abs(sizes.source-sizes.slot)).toBeLessThan(1);
 await page.screenshot({path:'docs/screenshots/kanban-11-short-card-drag.png'});await page.mouse.up();await expect(page.locator('.kb-drag-preview')).toHaveCount(0);
 await dragTo(page,'EMP-104','[data-lane="mobile"] [data-column="todo"] .kb-list',.8,true);
 await expect(page.locator('[data-lane="mobile"] [data-column="todo"] .kb-placeholder')).toBeAttached();
 await page.screenshot({path:'docs/screenshots/kanban-12-cross-lane-drag.png'});await page.mouse.up();
 await expect(page.locator('[data-lane="mobile"] [data-column="todo"] .kb-card[data-issue="EMP-104"]')).toBeAttached();
 await expect(page.locator('[data-lane="web"] .kb-card[data-issue="EMP-104"]')).toHaveCount(0);
});

test('H: desktop, mobile and RTL order remain usable',async({page})=>{
 await startBoard(page);
 const desktop=await page.locator('[data-lane="web"] .kb-column[data-column="backlog"]').boundingBox();
 const done=await page.locator('[data-lane="web"] .kb-column[data-column="done"]').boundingBox();expect(desktop!.x).toBeLessThan(done!.x);
 expect(await page.evaluate(()=>document.querySelector('.kb-grid')!.scrollWidth<=document.querySelector('.kb-scroll')!.clientWidth)).toBe(true);
 await page.getByLabel('Language').selectOption('fa');await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 const rtlBacklog=await page.locator('[data-lane="web"] .kb-column[data-column="backlog"]').boundingBox();const rtlDone=await page.locator('[data-lane="web"] .kb-column[data-column="done"]').boundingBox();expect(rtlBacklog!.x).toBeGreaterThan(rtlDone!.x);
 await page.screenshot({path:'docs/screenshots/kanban-06-rtl.png'});
 await dragTo(page,'EMP-102','[data-lane="web"] [data-column="in_progress"] .kb-list',.3);
 await expect(page.getByTestId('wip-summary')).toContainText('4/4');
 await page.setViewportSize({width:390,height:900});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'docs/screenshots/kanban-07-mobile-rtl.png'});
 await page.locator('.kb-lane[data-lane="mobile"]').scrollIntoViewIfNeeded();await page.screenshot({path:'docs/screenshots/kanban-08-mobile-swimlane.png'});
 await page.getByLabel('زبان').selectOption('en');await page.screenshot({path:'docs/screenshots/kanban-09-mobile-ltr.png'});
});
