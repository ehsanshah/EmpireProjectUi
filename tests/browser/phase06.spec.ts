import {test,expect} from '@playwright/test';

test('planning tabs remain readable and the default is light Classic',async({page})=>{
 await page.goto('/o/demo/p/empire/planning');
 const root=page.locator('html');
 const plan=page.getByTestId('phase06-planning');
 const tabs=plan.locator('.plan-tabs');
 const sprint=plan.getByRole('tab',{name:/Sprint 12/});
 await expect(root).toHaveAttribute('data-design','current');
 await expect(root).toHaveAttribute('data-theme','light');
 await expect(page.getByRole('button',{name:'Classic',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(sprint).toBeVisible();
 const strip=await tabs.boundingBox();
 const button=await sprint.boundingBox();
 expect(strip?.height).toBeGreaterThanOrEqual(44);
 expect(button!.y).toBeGreaterThanOrEqual(strip!.y);
 expect(button!.y+button!.height).toBeLessThanOrEqual(strip!.y+strip!.height);
 await page.setViewportSize({width:680,height:720});
 expect((await tabs.boundingBox())!.height).toBeGreaterThanOrEqual(44);
 await expect(sprint).toBeVisible();
 await plan.screenshot({path:'docs/screenshots/phase06-tabs-classic-light.png'});
 await page.getByRole('button',{name:'Glass',exact:true}).click();
 await expect(root).toHaveAttribute('data-design','glass');
 await expect(sprint).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('combobox',{name:'Language'}).selectOption('fa');
 await expect(root).toHaveAttribute('dir','rtl');
 expect((await tabs.boundingBox())!.height).toBeGreaterThanOrEqual(44);
 await expect(plan.getByRole('tab',{name:/Sprint 12/})).toBeVisible();
});

test('planning view shows honest unknowns, settings preview, scope receipt and hierarchy controls',async({page})=>{await page.goto('/o/demo/p/empire/planning?design=glass');const plan=page.getByTestId('phase06-planning');await expect(plan).toBeVisible();await expect(plan).toContainText('Points unknown');await expect(plan).toContainText('Not recorded; no baseline inferred');await plan.getByRole('button',{name:'Simulate fit'}).click();await expect(plan.locator('.plan-fit')).toContainText('fit_unknown');await plan.getByRole('button',{name:'Preview settings'}).click();const preview=page.getByRole('dialog',{name:'Sprint action preview'});await expect(preview).toContainText('Demo preview');await preview.getByRole('button',{name:'Apply validated action'}).click();await expect(plan.getByRole('status')).toContainText('Demo receipt');const first=plan.locator('.plan-row').first();await first.getByRole('combobox',{name:/Destination/}).selectOption('sprint-13');await expect(preview).toContainText('scope');await preview.getByRole('button',{name:'Apply validated action'}).click();await expect(plan.getByRole('status')).toContainText('Demo receipt');await plan.getByRole('tab',{name:/Sprint 13/}).click();await expect(plan.locator('.plan-row')).toHaveCount(1);await plan.screenshot({path:'docs/screenshots/phase06-planning-desktop.png'});await plan.getByRole('textbox',{name:'Goal'}).fill('Validate next checkout iteration');await plan.getByRole('button',{name:'Preview settings'}).click();await preview.getByRole('button',{name:'Apply validated action'}).click();await plan.getByRole('button',{name:'Preview start'}).click();await expect(preview).toContainText('start');await preview.getByRole('button',{name:'Apply validated action'}).click();await expect(plan).toContainText('Commitment baseline');await expect(plan).toContainText('1 issues');});

test('completion requires explicit dispositions; deferred reason and mobile RTL remain visible',async({page})=>{await page.goto('/o/demo/p/empire/planning?design=glass');const plan=page.getByTestId('phase06-planning');await plan.getByRole('button',{name:'Preview completion'}).click();const preview=page.getByRole('dialog',{name:'Sprint action preview'});await expect(preview.locator('.plan-dispositions select').count()).resolves.toBeGreaterThan(0);await preview.locator('.plan-dispositions select').first().selectOption('deferred');await preview.getByRole('textbox',{name:/Deferred reason/}).fill('Needs policy decision');await preview.getByRole('button',{name:'Apply validated action'}).click();await expect(plan.getByRole('status')).toContainText('Demo receipt');await expect(plan).toContainText('Scope changes');await plan.getByRole('button',{name:'Preview reopen'}).click();await preview.getByRole('button',{name:'Apply validated action'}).click();await expect(plan.getByRole('status')).toContainText('Demo receipt');await page.setViewportSize({width:390,height:844});await page.getByRole('combobox',{name:'Language'}).selectOption('fa');await expect(page.locator('html')).toHaveAttribute('dir','rtl');await expect(plan).toBeVisible();await plan.screenshot({path:'docs/screenshots/phase06-planning-mobile-fa.png'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);});

test('Epic and child can be created through typed commands without changing the starting fixture',async({page})=>{await page.goto('/o/demo/p/empire/planning?design=glass');const plan=page.getByTestId('phase06-planning');await expect(plan.getByRole('tab',{name:/Sprint 12/})).toContainText('14');await plan.getByRole('button',{name:'New Epic'}).click();let form=page.getByRole('dialog',{name:'Create hierarchy item'});await form.getByRole('textbox',{name:'Title'}).fill('Checkout resilience Epic');await form.getByRole('button',{name:'Create with receipt'}).click();await expect(plan.getByRole('status')).toContainText('Demo receipt');const epic=plan.locator('.plan-row').filter({hasText:'Checkout resilience Epic'});await expect(epic).toBeVisible();await epic.getByRole('button',{name:'Add child'}).click();form=page.getByRole('dialog',{name:'Create hierarchy item'});await form.getByRole('textbox',{name:'Title'}).fill('Child acceptance test');await form.getByRole('button',{name:'Create with receipt'}).click();await expect(plan.locator('.plan-tree-node').filter({hasText:'Checkout resilience Epic'})).toContainText('Child acceptance test');await expect(plan).toContainText('Parent excluded from capacity');await plan.locator('.plan-tree').screenshot({path:'docs/screenshots/phase06-hierarchy.png'});});
