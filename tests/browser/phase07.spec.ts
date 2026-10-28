import {test,expect} from '@playwright/test';

test('Prompt-to-View changes the main workset, calendar and drawer with Back',async({page})=>{
 await page.goto('/o/demo/p/empire/planning');
 const command=page.getByRole('textbox',{name:'Command'});
 async function ask(value:string){await command.fill(value);await command.press('Enter')}
 await ask('Show remaining issues');await expect(page.getByTestId('result-count')).toHaveText('8');await expect(page.locator('[data-issue]')).toHaveCount(8);
 await ask('Only blocked');await expect(page.getByTestId('result-count')).toHaveText('2');await expect(page.locator('[data-issue]')).toHaveCount(2);
 await ask('Show them on the calendar');await expect(page.getByTestId('result-count')).toHaveText('2');await expect(page.locator('.calendar-view')).toBeVisible();
 await ask('Open EMP-104');await expect(page.getByRole('dialog')).toContainText('EMP-104');
 await ask('Back');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByTestId('result-count')).toHaveText('2');
 await ask('Back');await expect(page.locator('[data-issue]')).toHaveCount(2);
 await page.screenshot({path:'docs/screenshots/phase07-prompt-to-view.png'});
});

test('AI assignment needs a proposal approval and valid receipts',async({page})=>{
 await page.goto('/?design=current');const command=page.getByRole('textbox',{name:'Command'});await command.fill('Assign remaining tasks to Sara');await command.press('Enter');
 const card=page.getByTestId('clarification-card');await card.getByRole('button',{name:/Sara Moradi/}).click();await card.getByRole('button',{name:'Skip'}).click();const proposal=page.getByRole('region',{name:'Action proposal'});await expect(proposal).toContainText('8 issues');await expect(page.getByLabel('EMP-103 assignee')).not.toHaveValue('u-sara-moradi');
 await proposal.getByRole('button',{name:'Approve and apply'}).click();await expect(page.locator('.ai-response')).toContainText('valid Demo receipts');await expect(page.getByLabel('EMP-103 assignee')).toHaveValue('u-sara-moradi');await expect(page.getByTestId('result-count')).toHaveText('14');
 await page.screenshot({path:'docs/screenshots/phase07-proposal-outcome.png'});
});

test('relative deadline asks for an exact date and keeps it date-only',async({page})=>{
 await page.goto('/?design=current');const command=page.getByRole('textbox',{name:'Command'});await command.fill('Set EMP-101 due on Tuesday');await command.press('Enter');const card=page.getByTestId('clarification-card');await expect(card).toContainText('What exact due date');await card.getByRole('textbox',{name:'Or reply directly…'}).fill('Tuesday');await card.getByRole('button',{name:'Send clarification answer'}).click();await expect(card.getByRole('alert')).toContainText('unambiguous date');await card.getByRole('textbox',{name:'Or reply directly…'}).fill('2026-11-03');await card.getByRole('button',{name:'Send clarification answer'}).click();const proposal=page.getByRole('region',{name:'Action proposal'});await expect(proposal).toContainText('date only');await expect(proposal).toContainText('2026-11-03');await proposal.getByRole('button',{name:'Approve and apply'}).click();await expect(page.locator('.ai-response')).toContainText('valid Demo receipts');await expect(page.locator('[data-issue="EMP-101"]')).toContainText('Nov 3');
});
