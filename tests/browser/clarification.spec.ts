import {test,expect} from '@playwright/test';

test('Workspace agent starts collapsed and opens on click',async({page})=>{
 await page.goto('/o/demo/p/empire/planning');
 const toggle=page.getByRole('button',{name:'Toggle demo agent'});
 await expect(page.locator('.assistant')).toHaveCount(0);
 await expect(toggle).toHaveAttribute('aria-expanded','false');
 await expect(toggle).toContainText('Agent');
 await toggle.click();
 await expect(page.locator('.assistant')).toBeVisible();
 await expect(page.getByRole('button',{name:'Preview clarification'})).toBeVisible();
 await expect(toggle).toHaveAttribute('aria-expanded','true');
 await page.getByRole('button',{name:'Close agent'}).click();
 await expect(page.locator('.assistant')).toHaveCount(0);
 await expect(toggle).toBeFocused();
});

test('typed clarification keeps scope through two questions, edit, close and proposal',async({page})=>{
 await page.goto('/?design=glass');const count=page.getByTestId('result-count');await expect(count).toHaveText('14');
 const command=page.getByRole('textbox',{name:'Command'});await command.fill('Assign remaining tasks to Sara');await page.getByRole('button',{name:'Run command'}).click();
 const card=page.getByTestId('clarification-card');await expect(card).toContainText('DEMO QUESTION 1 of 2');await expect(card.getByRole('button',{name:'Skip'})).toHaveCount(0);
 await card.getByRole('button',{name:/Sara Moradi/}).click();await expect(card).toContainText('DEMO QUESTION 2 of 2');await expect(card.getByRole('button',{name:'Skip'})).toBeVisible();
 await card.getByRole('button',{name:'Close clarification'}).click();await expect(card).toHaveCount(0);await expect(command).toBeFocused();await page.getByRole('button',{name:'Resume Demo question'}).click();await expect(card).toContainText('DEMO QUESTION 2 of 2');
 await card.getByRole('button',{name:'Skip'}).click();const proposal=page.getByRole('region',{name:'Action proposal'});await expect(proposal).toContainText('8 issues');await expect(count).toHaveText('14');
 await proposal.getByRole('button',{name:'Edit answers'}).click();await expect(card).toContainText('DEMO QUESTION 1 of 2');await card.getByRole('button',{name:/Sara Farahani/}).click();await card.getByRole('textbox',{name:'Or reply directly…'}).fill('Balance the queue');await card.getByRole('button',{name:'Send clarification answer'}).click();await expect(proposal).toContainText('Sara Farahani');
 await proposal.getByRole('button',{name:'Reject'}).click();await expect(page.locator('.ai-response')).toContainText('Proposal rejected');await expect(count).toHaveText('14');
 await page.locator('.project-switch-trigger').click();await page.getByRole('dialog',{name:'Project browser'}).getByRole('button',{name:/Storefront · STORE/}).click();await expect(card).toHaveCount(0);await expect(page.locator('.results')).not.toContainText('EMP-101');
});

test('optional Skip and direct-answer validation work in Persian mobile light mode',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/?design=glass');await page.getByRole('combobox',{name:'Language'}).selectOption('fa');await page.getByRole('button',{name:'نمایش ایجنت آزمایشی'}).click();
 await page.getByRole('button',{name:'پیش‌نمایش پرسش'}).click();const card=page.getByTestId('clarification-card');await expect(card).toBeVisible();await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await card.getByRole('button',{name:'ارسال پاسخ پرسش'}).click();await expect(card.getByRole('alert')).toContainText('ابتدا پاسخ را وارد کنید');
 await page.getByRole('button',{name:'اختیاری'}).click();await card.getByRole('button',{name:'رد کردن'}).click();await expect(card).toContainText('در این پیش‌نمایش رد شد');await expect(page.getByTestId('result-count')).toHaveText('14');
});
