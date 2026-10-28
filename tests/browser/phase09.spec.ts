import {test,expect} from '@playwright/test';

test('Phase 09 Demo intake, clarification, plan, approval and simulated request',async({page})=>{
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/intake?design=current');
 await expect(page.locator('.app')).toHaveClass(/composition-intake/);
 await expect(page.locator('.work-controls')).toBeHidden();
 await expect(page.locator('.filterbar')).toBeHidden();
 await expect(page.getByRole('heading',{name:'Intake',exact:true})).toBeVisible();
 await page.getByRole('button',{name:/Improve checkout release readiness/}).click();
 await expect(page.getByTestId('clarification-card')).toBeVisible();
 await page.getByRole('button',{name:/Checkout web and mobile/}).click();
 await page.getByRole('button',{name:'Create execution plan'}).click();
 await expect(page.getByText('VERSIONED EXECUTION PLAN',{exact:true})).toBeVisible();
 await expect(page.getByText('budget ceiling',{exact:false}).first()).toBeVisible();
 await page.getByLabel('I acknowledge the budget ceiling and task costs are unknown in this Demo.').check();
 await page.getByRole('button',{name:'Approve plan'}).click();
 await expect(page.getByText(/Human plan approval recorded/)).toBeVisible();
 await page.getByRole('button',{name:'Request execution · Demo simulation'}).click();
 await expect(page.getByText(/No agent was dispatched/)).toBeVisible();
 await expect(page.getByText(/simulated_accepted/)).toBeVisible();
 await page.screenshot({path:'docs/screenshots/phase09-plan-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Request execution · Demo simulation'}).click();
 await expect(page.getByText(/simulated_accepted/)).toHaveCount(1);
 await page.reload();
 await expect(page.getByText(/simulated_accepted/)).toBeVisible();
 await page.getByRole('button',{name:'← Intake list'}).click();
 await page.goBack();
 await expect(page.getByText('VERSIONED EXECUTION PLAN',{exact:true})).toBeVisible();
});

test('Phase 09 Persian mobile remains usable with initially closed Agent panel',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/intake?design=current');
 await page.getByRole('combobox',{name:'Language'}).selectOption('fa');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await expect(page.getByRole('heading',{name:'ورودی‌ها'})).toBeVisible();
 await expect(page.getByRole('button',{name:/Agent|ایجنت/}).first()).toBeVisible();
 await expect(page.locator('.assistant-panel')).toHaveCount(0);
 await page.screenshot({path:'docs/screenshots/phase09-intake-mobile-fa.png',fullPage:true});
});

test('Phase 09 keyboard path, cycle warning and stale draft recovery',async({page})=>{
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/intake?design=current');
 const item=page.getByRole('button',{name:/Improve checkout release readiness/});await item.focus();await page.keyboard.press('Enter');
 const option=page.getByRole('button',{name:/Checkout web and mobile/});await option.focus();await page.keyboard.press('Enter');
 const create=page.getByRole('button',{name:'Create execution plan'});await create.focus();await page.keyboard.press('Enter');
 await page.getByLabel('Depends on task IDs, comma separated').first().fill('task-2');
 await expect(page.getByText(/Dependency cycle/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Approve plan'})).toBeDisabled();
 await page.getByRole('button',{name:'Save new revision'}).click();
 await page.getByRole('button',{name:'Simulate concurrent edit'}).click();
 await page.getByLabel('Plan scope').fill('My preserved draft');
 await page.getByRole('button',{name:'Save new revision'}).click();
 await expect(page.getByText('Version conflict · draft preserved')).toBeVisible();
 await expect(page.getByLabel('Plan scope')).toHaveValue('My preserved draft');
 await page.getByRole('button',{name:'Load latest for comparison'}).click();
 await expect(page.getByLabel('Plan scope')).toHaveValue('My preserved draft');
});

test('Phase 09 clarification correction invalidates approval while preserving draft',async({page})=>{
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/intake?design=current');
 await page.getByRole('button',{name:/Improve checkout release readiness/}).click();
 await page.getByRole('button',{name:/Checkout web and mobile/}).click();
 await page.getByRole('button',{name:'Create execution plan'}).click();
 await page.getByLabel('I acknowledge the budget ceiling and task costs are unknown in this Demo.').check();
 await page.getByRole('button',{name:'Approve plan'}).click();
 await expect(page.getByText(/Approval: approval-plan/)).toBeVisible();
 await page.getByRole('button',{name:'Correct clarification'}).click();
 await page.getByRole('button',{name:/Checkout web only/}).click();
 await expect(page.getByText(/Source correction saved/)).toBeVisible();
 await expect(page.getByText(/Approval: approval-plan/)).toHaveCount(0);
 await expect(page.getByLabel('Plan scope')).toHaveValue('Checkout web only');
 await expect(page.getByRole('button',{name:'Save new revision'})).toBeEnabled();
 await page.reload();
 await expect(page.getByText(/The intake source changed/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Approve plan'})).toBeDisabled();
});
