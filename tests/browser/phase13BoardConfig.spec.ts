import {expect,test} from '@playwright/test';
const base='/o/demo/p/empire';

test('published Board mapping and layout survives reload without changing issue status',async({page})=>{
 await page.goto(`${base}/work?design=current&view=board`);
 await expect(page.locator('[data-lane]').first()).toHaveAttribute('data-lane','web');
 await expect(page.locator('[data-column="todo"]').first()).toContainText('To Do');
 await page.goto(`${base}/settings?design=current&section=settings`);
 await page.getByRole('button',{name:'Create draft'}).click();
 await page.getByRole('textbox',{name:'English name for todo'}).fill('Ready next');
 await page.getByRole('button',{name:'Move column earlier todo'}).click();
 await page.getByRole('combobox',{name:'Board mapping for review'}).selectOption('');
 await page.getByRole('button',{name:'Move mobile swimlane earlier'}).click();
 await page.getByRole('button',{name:'Save draft revision'}).click();
 await page.getByRole('button',{name:'Validate & preview migration'}).click();
 await expect(page.locator('.p13-preview')).toContainText('Ready next');
 await expect(page.locator('.p13-preview')).toContainText('review → unmapped');
 await page.getByRole('button',{name:'Approve current revision'}).click();
 await page.getByRole('button',{name:'Publish with receipt'}).click();
 await page.getByRole('button',{name:'Team board'}).click();
 await expect(page.locator('[data-lane]').first()).toHaveAttribute('data-lane','mobile');
 await expect(page.locator('[data-lane="mobile"] [data-column]').first()).toHaveAttribute('data-column','todo');
 await expect(page.locator('[data-column="todo"]').first()).toContainText('Ready next');
 await expect(page.getByTestId('unmapped-tray')).toContainText('review');
 await page.reload();
 await expect(page.locator('[data-lane]').first()).toHaveAttribute('data-lane','mobile');
 await expect(page.locator('[data-column="todo"]').first()).toContainText('Ready next');
 await page.screenshot({path:'docs/screenshots/phase13-board-configured-en-light.png'});
 const grip=page.locator('[data-lane="web"] [data-column="todo"] .kb-grip').first();
 await grip.focus();await expect(grip).toBeFocused();await page.keyboard.press('Alt+ArrowDown');
 await expect(page.locator('.kb-notice')).toContainText('Demo receipt');
});

test('Board editor remains usable at mobile widths in Persian and Arabic',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(`${base}/settings?design=current&section=settings`);
 await page.getByRole('combobox',{name:'Language'}).selectOption('fa');
 await page.getByRole('button',{name:'ساخت پیش‌نویس'}).click();
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontFamily)).toContain('Vazir');
 await page.getByRole('textbox',{name:'English name for todo'}).focus();
 await expect(page.getByRole('textbox',{name:'English name for todo'})).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:'docs/screenshots/phase13-board-editor-fa-mobile.png'});
 await page.getByRole('combobox',{name:'زبان'}).selectOption('ar');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontFamily)).toContain('Empire Arabic');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('material Board edits invalidate approval until a new saved revision is validated',async({page})=>{
 await page.goto(`${base}/settings?design=current&section=settings`);
 await page.getByRole('button',{name:'Create draft'}).click();
 await page.getByRole('button',{name:'Save draft revision'}).click();
 await page.getByRole('button',{name:'Validate & preview migration'}).click();
 await page.getByRole('button',{name:'Approve current revision'}).click();
 await page.getByRole('textbox',{name:'English name for backlog'}).fill('Incoming');
 await expect(page.locator('.p13-error')).toContainText('Unsaved edits invalidate');
 await expect(page.getByRole('button',{name:'Publish with receipt'})).toBeDisabled();
 await page.getByRole('button',{name:'Save draft revision'}).click();
 await expect(page.locator('.p13-preview')).toHaveCount(0);
 await page.getByRole('button',{name:'Validate & preview migration'}).click();
 await expect(page.getByRole('button',{name:'Approve current revision'})).toBeEnabled();
});
