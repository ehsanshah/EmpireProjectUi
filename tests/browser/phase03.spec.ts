import {test,expect} from '@playwright/test';

test('cursor pages keep the workset total and saved views restore scoped filters',async({page})=>{
 await page.goto('/?design=glass');
 await expect(page.getByTestId('result-count')).toHaveText('14');
 await page.getByRole('combobox',{name:'Page size'}).selectOption('5');
 await expect(page.getByTestId('workset-meta')).toContainText('5 loaded · 14 matching');
 await expect(page.locator('[data-issue]')).toHaveCount(5);
 await page.getByRole('button',{name:'Next page'}).click();
 await expect(page.getByTestId('workset-meta')).toContainText('Page 2 · 5 loaded · 14 matching');
 await expect(page.getByTestId('result-count')).toHaveText('14');
 await page.getByRole('button',{name:'Previous page'}).click();
 await expect(page.getByTestId('workset-meta')).toContainText('Page 1');
 await page.getByText('Filters, columns and saved views').click();
 await page.getByRole('combobox',{name:'Filter priority'}).selectOption('high');
 await expect(page.getByTestId('result-count')).toHaveText('2');
 await page.getByRole('textbox',{name:'View name'}).fill('High priority review');
 await page.getByRole('button',{name:'Save view'}).click();
 await page.getByRole('combobox',{name:'Filter priority'}).selectOption('');
 await expect(page.getByTestId('result-count')).toHaveText('14');
 await page.getByRole('combobox',{name:'Apply saved view'}).selectOption({label:'High priority review · personal'});
 await expect(page.getByTestId('result-count')).toHaveText('2');
 await expect(page.getByRole('combobox',{name:'Filter priority'})).toHaveValue('high');
});

test('full-page deep link refreshes and schema validation retains the draft',async({page})=>{
 await page.goto('/?design=glass');
 await page.locator('[data-issue="EMP-102"] .issue-link').click();
 const drawer=page.getByRole('dialog',{name:'EMP-102'});
 await drawer.getByRole('button',{name:'Full page'}).click();
 await expect(page).toHaveURL(/issue=demo-issue-102.*mode=full/i);
 await expect(drawer).toHaveClass(/full-page-drawer/);
 await page.reload();
 const full=page.getByRole('dialog',{name:'EMP-102'});
 await expect(full).toHaveClass(/full-page-drawer/);
 await full.getByRole('button',{name:'Edit all fields'}).click();
 await full.locator('#wi-summary').fill('');
 await full.getByRole('button',{name:'Save changes'}).click();
 await expect(full.locator('#wi-summary')).toHaveValue('');
 await expect(full.getByRole('alert')).toContainText('A summary is required.');
 await full.locator('#wi-summary').fill('Checkout confirmation with schema fields');
 await full.locator('#wi-customData-riskScore').fill('9');
 await full.getByRole('button',{name:'Save changes'}).click();
 await expect(full.locator('#wi-summary')).toHaveValue('Checkout confirmation with schema fields');
 await full.locator('#wi-customData-riskScore').fill('3');
 await full.getByRole('button',{name:'Save changes'}).click();
 await expect(full.getByRole('button',{name:'Edit all fields'})).toBeVisible();
 await expect(full).toContainText('Checkout confirmation with schema fields');
 await page.screenshot({path:'evidence/phase03-full-page-form.png'});
});

test('bulk selection previews exact scope and reports each item',async({page})=>{
 await page.goto('/?design=glass');
 await page.getByRole('combobox',{name:'Page size'}).selectOption('5');
 await page.getByText('Bulk selection and preview').click();
 await page.getByRole('button',{name:'Select loaded page'}).click();
 await expect(page.locator('.list-bulk-select')).toContainText('5 explicit loaded IDs');
 await page.getByRole('combobox',{name:'Bulk target status'}).selectOption('completed');
 await page.getByRole('button',{name:'Preview bulk change'}).click();
 await expect(page.locator('.list-bulk-preview')).toContainText('Explicit loaded IDs · 5 selected');
 await page.getByRole('button',{name:'Apply reviewed bulk change'}).click();
 await expect(page.locator('.list-bulk-result li')).toHaveCount(5);
 await expect(page.getByTestId('result-count')).toHaveText('14');
});

test('scoped key lookup does not reveal another project and archived work can be restored',async({page})=>{
 await page.goto('/?design=glass');
 const search=page.getByRole('textbox',{name:'Search issues'});
 await search.fill('PAY-42');await search.press('Enter');
 await expect(page.getByRole('dialog',{name:'PAY-42'})).toHaveCount(0);
 await search.fill('EMP-102');await search.press('Enter');
 const drawer=page.getByRole('dialog',{name:'EMP-102'});
 await expect(drawer).toBeVisible();
 await drawer.getByRole('button',{name:'Preview action'}).click();
 await expect(drawer.locator('.wi-action-preview')).toContainText('archive EMP-102');
 await drawer.getByRole('button',{name:'Apply reviewed action'}).click();
 await expect(drawer.getByRole('combobox',{name:'Action'})).toHaveValue('restore');
 await drawer.getByRole('tab',{name:'Comments'}).click();
 await expect(drawer).toContainText('Archived work is read-only');
 await expect(page.getByTestId('result-count')).toHaveText('0');
 await drawer.getByRole('button',{name:'Preview action'}).click();
 await expect(drawer.locator('.wi-action-preview')).toContainText('restore EMP-102');
 await drawer.getByRole('button',{name:'Apply reviewed action'}).click();
 await expect(drawer).not.toContainText('Archived work is read-only');
});

test('schema edit preserves a draft across version conflict and retries with latest ETag',async({page})=>{
 await page.goto('/?design=glass');
 await page.locator('[data-issue="EMP-102"] .issue-link').click();
 const drawer=page.getByRole('dialog',{name:'EMP-102'});
 await drawer.getByRole('button',{name:'Edit all fields'}).click();
 await drawer.locator('#wi-summary').fill('Review-safe draft after conflict');
 await drawer.getByRole('button',{name:'Simulate concurrent version'}).click();
 await drawer.getByRole('button',{name:'Save changes'}).click();
 await expect(drawer.getByText('Your draft is preserved')).toBeVisible();
 await expect(drawer.locator('#wi-summary')).toHaveValue('Review-safe draft after conflict');
 await drawer.getByRole('button',{name:'Retry with latest version'}).click();
 await expect(drawer).toContainText('Review-safe draft after conflict');
 await expect(drawer.getByRole('button',{name:'Edit all fields'})).toBeVisible();
});

test('snapshot selection is explicit and distinct from the loaded page',async({page})=>{
 await page.goto('/?design=glass');
 await page.getByRole('combobox',{name:'Page size'}).selectOption('5');
 await page.getByText('Bulk selection and preview').click();
 await page.getByRole('button',{name:/Select all 14 matching in snapshot/}).click();
 await expect(page.locator('.list-bulk-select')).toContainText('Snapshot token: 14 matching');
 await page.getByRole('button',{name:'Preview bulk change'}).click();
 await expect(page.locator('.list-bulk-preview')).toContainText('Explicit snapshot token · 14 selected');
 await expect(page.locator('.list-bulk-preview li')).toHaveCount(14);
});

test('Phase 03 desktop and mobile review captures',async({page})=>{
 await page.goto('/?design=glass');
 await page.getByText('Filters, columns and saved views').click();
 await page.screenshot({path:'evidence/phase03-list-desktop.png'});
 await page.locator('[data-issue="EMP-102"] .issue-link').click();
 await page.getByRole('dialog',{name:'EMP-102'}).getByRole('button',{name:'Full page'}).click();
 await page.locator('.full-page-drawer').evaluate(element=>element.scrollTop=0);
 await page.screenshot({path:'evidence/phase03-full-page-top.png'});
 await page.getByRole('dialog',{name:'EMP-102'}).getByRole('button',{name:'Close issue'}).click();
 await page.getByText('Filters, columns and saved views').click();
 await page.getByRole('combobox',{name:'Language'}).selectOption('fa');
 await page.getByRole('button',{name:'تغییر تم'}).click();
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'evidence/phase03-mobile-fa-light.png'});
});
