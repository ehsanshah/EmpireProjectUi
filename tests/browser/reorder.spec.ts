import {test,expect} from '@playwright/test';
test('mouse row reorder persists, Undo restores, and priority labels stay unchanged',async({page})=>{
 await page.goto('/');await expect(page.locator('html')).toHaveAttribute('data-design','glass');
 await expect(page.locator('.reorder-hint')).toHaveCount(0);
 await expect(page.locator('.drag-handle')).toHaveCount(14);
 await expect(page.getByLabel('EMP-103 assignee')).toHaveValue('agent-hermes');
 const keys=()=>page.locator('tr[data-issue]').evaluateAll(rows=>rows.map(r=>r.getAttribute('data-issue')));
 const before=await keys();
 await page.getByRole('button',{name:'Reorder EMP-103',exact:true}).dragTo(page.locator('tr[data-issue="EMP-101"]'),{targetPosition:{x:100,y:5}});
 await expect.poll(keys).toEqual(['EMP-103','EMP-101','EMP-102',...before.slice(3)]);
 await expect(page.locator('tr[data-issue="EMP-103"] .priority')).toContainText('High');
 await expect(page.locator('tr[data-issue="EMP-101"] .priority')).toContainText('Normal');
 await page.screenshot({path:'docs/screenshots/glass-preview/04-reordered.png'});
 await page.getByRole('button',{name:'Undo',exact:true}).click();await expect.poll(keys).toEqual(before);
 await page.getByRole('button',{name:'Reorder EMP-103',exact:true}).dragTo(page.locator('tr[data-issue="EMP-101"]'),{targetPosition:{x:100,y:5}});
 await page.reload();await expect.poll(keys).toEqual(['EMP-103','EMP-101','EMP-102',...before.slice(3)]);
 await page.getByLabel('Sort by').selectOption('due');await expect(page.getByRole('button',{name:'Reorder EMP-103',exact:true})).toBeDisabled();
 await page.getByLabel('Sort by').selectOption('manual');
 await page.getByRole('button',{name:'Reorder EMP-103',exact:true}).click();await page.getByRole('button',{name:'Move down',exact:true}).click();
 await expect.poll(async()=>(await keys()).slice(0,2)).toEqual(['EMP-101','EMP-103']);
 await page.getByRole('button',{name:'Reorder EMP-103',exact:true}).focus();await page.keyboard.press('Alt+ArrowUp');
 await expect.poll(async()=>(await keys())[0]).toBe('EMP-103');
});

test('visible drag handles remain in the previous design too',async({page})=>{
 await page.goto('/?design=current');
 await expect(page.locator('.drag-handle')).toHaveCount(14);
 await expect(page.locator('.reorder-hint')).toHaveCount(0);
 await expect(page.getByLabel('EMP-103 assignee')).toHaveValue('agent-hermes');
});
