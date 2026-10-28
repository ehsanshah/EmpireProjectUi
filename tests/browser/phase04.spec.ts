import {test,expect} from '@playwright/test';

test('Board keeps full-scope WIP, reconciles the filtered workset and retains unmapped status',async({page})=>{
 await page.goto('/?design=glass');
 await page.getByText('Filters, columns and saved views').click();
 await page.getByRole('combobox',{name:'Filter priority'}).selectOption('high');
 await page.getByRole('button',{name:'Board',exact:true}).click();
 await expect(page.getByTestId('result-count')).toHaveText('2');
 await expect(page.getByTestId('wip-summary')).toContainText('3/4');
 await expect(page.locator('.kb-reconcile')).toContainText('2 matching');
 await page.getByRole('button',{name:'Reset demo',exact:true}).click();
 await page.getByRole('button',{name:'Board',exact:true}).click();
 await expect(page.getByTestId('unmapped-tray')).toContainText('EMP-112');
 await expect(page.locator('.kb-reconcile')).toContainText('13 rendered + 1 unmapped = 14 matching');
});

test('Board requires a transition field, then records a receipt; concurrent change preserves the move draft',async({page})=>{
 await page.goto('/?design=glass');
 await page.getByRole('button',{name:'Board',exact:true}).click();
 // A versioned move also gives us a second card for the conflict journey.
 await page.locator('.kb-card[data-issue="EMP-104"]').getByRole('button',{name:'Move to… EMP-104'}).click();
 await page.locator('.kb-card[data-issue="EMP-104"] .kb-menu-area').first().getByRole('button',{name:'Review'}).click();
 await expect(page.locator('[data-column="review"] .kb-card[data-issue="EMP-104"]')).toBeVisible();
 await page.getByRole('button',{name:'Board settings'}).click();
 await page.getByRole('button',{name:'Load required-field review scenario for EMP-102'}).click();
 await page.getByRole('button',{name:'Board settings'}).click();
 await page.locator('.kb-card[data-issue="EMP-102"]').getByRole('button',{name:'Move to… EMP-102'}).click();
 await page.locator('.kb-card[data-issue="EMP-102"] .kb-menu-area').first().getByRole('button',{name:'Done'}).click();
 await expect(page.locator('.kb-required')).toContainText('Resolution note is required');
 await expect(page.locator('[data-column="todo"] .kb-card[data-issue="EMP-102"]')).toBeVisible();
 await page.screenshot({path:'evidence/phase04-required-field.png'});
 await page.locator('.kb-required textarea').fill('Acceptance evidence checked');
 await page.getByRole('button',{name:'Retry validated move'}).click();
 await expect(page.locator('.kb-required')).toHaveCount(0);
 await expect(page.locator('.kb-notice')).toContainText('Demo receipt');
 await page.getByRole('button',{name:'Expand Done'}).first().click();
 await expect(page.locator('[data-column="done"] .kb-card[data-issue="EMP-102"]')).toBeVisible();
 await page.locator('.kb-card[data-issue="EMP-104"] .kb-card-title').click();
 const drawer=page.getByRole('dialog',{name:'EMP-104'});
 await drawer.getByRole('button',{name:'Simulate concurrent version'}).click();
 await drawer.getByRole('button',{name:'Close issue'}).click();
 await page.locator('.kb-card[data-issue="EMP-104"]').getByRole('button',{name:'Move to… EMP-104'}).click();
 await page.locator('.kb-card[data-issue="EMP-104"] .kb-menu-area').first().getByRole('button',{name:'In Progress'}).click();
 await expect(page.locator('.kb-required')).toContainText('card or rank changed');
 await expect(page.locator('[data-column="review"] .kb-card[data-issue="EMP-104"]')).toBeVisible();
 await page.screenshot({path:'evidence/phase04-conflict-draft.png'});
 await expect(page.locator('.kb-required textarea')).toHaveCount(0);
 await page.getByRole('button',{name:'Retry validated move'}).click();
 await expect(page.locator('[data-column="in_progress"] .kb-card[data-issue="EMP-104"]')).toBeVisible();
 await expect(page.locator('.kb-required')).toHaveCount(0);
});

test('keyboard Board move uses the same versioned command and updates policy-wide WIP',async({page})=>{
 await page.goto('/?design=glass');
 await page.getByRole('button',{name:'Board',exact:true}).click();
 await page.locator('.kb-card[data-issue="EMP-104"] .kb-grip').focus();
 await page.keyboard.press('Alt+ArrowRight');
 await expect(page.locator('[data-column="in_progress"] .kb-card[data-issue="EMP-104"]')).toBeVisible();
 await expect(page.getByTestId('wip-summary')).toContainText('4/4');
 await expect(page.locator('.kb-notice')).toContainText('Demo receipt');
});
