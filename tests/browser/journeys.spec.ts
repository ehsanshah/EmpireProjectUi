import {test,expect} from '@playwright/test';

test('risk evidence → selected issue → editable local draft → Back; no external requests',async({page})=>{
 const external:string[]=[];
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:5173')&&!r.url().startsWith('data:'))external.push(r.url());});
 await page.goto('/?design=current');
 const command=page.getByRole('textbox',{name:'Command',exact:true});
 const run=async(p:string)=>{await command.fill(p);await command.press('Enter');};
 await run('Show remaining work');
 await run('Why is delivery at risk?');
 await expect(page.locator('[data-issue]')).toHaveCount(2);
 await expect(page.locator('.evidence-record').nth(0)).toContainText('Hermes');
 await expect(page.locator('.evidence-record').nth(1)).toContainText('Reza');
 await expect(page.locator('.evidence-record').nth(1)).toContainText('gateway team');
 await expect(page.locator('.suggestion-note')).toContainText('Suggested interpretation');
 const record=page.locator('.evidence-record').filter({hasText:'EMP-103'});
 await record.getByRole('button',{name:'Inspect issue'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('.selected-context')).toContainText('EMP-103');
 await run('Help me unblock this');
 await expect(page.getByTestId('unblock-workspace')).toBeVisible();
 await expect(page.locator('.linked-issue')).toContainText('EMP-104');
 await expect(page.locator('.acceptance-line')).toContainText('idempotency');
 await expect(page.locator('.proposed-action')).toContainText('Proposed action');
 const editor=page.getByRole('textbox',{name:'Edit the proposed next step'});
 await editor.fill('Ask Reza to confirm the webhook signature and retry policy. Keep dates unassigned until confirmed.');
 await page.getByRole('button',{name:'Save draft',exact:true}).click();
 await expect(page.locator('.draft-footer')).toContainText('Saved in this browser · not sent');
 await page.screenshot({path:'docs/screenshots/redesign/03-unblock-draft.png'});
 await run('Back');
 await expect(page.getByTestId('risk-investigation')).toBeVisible();
 await run('Back');
 await expect(page.locator('[data-issue]')).toHaveCount(8);
 await page.reload();
 await run('Open EMP-103');
 await page.getByRole('dialog').getByRole('button',{name:'Help me unblock this',exact:true}).click();
 await expect(editor).toHaveValue('Ask Reza to confirm the webhook signature and retry policy. Keep dates unassigned until confirmed.');
 await run('Show all issues');
 await expect(page.getByLabel('EMP-103 status')).toHaveValue('in_progress');
 await expect(page.getByLabel('EMP-104 status')).toHaveValue('todo');
 expect(external).toEqual([]);
});

test('unsupported prompts and missing context never fabricate actions',async({page})=>{
 await page.goto('/?design=current');
 const command=page.getByRole('textbox',{name:'Command',exact:true});
 await command.fill('Help me unblock this');await command.press('Enter');
 await expect(page.locator('.feedback')).toContainText('Select an issue first');
 await expect(page.locator('[data-issue]')).toHaveCount(14);
 for(const p of ['Send Reza a message','Mark these done','invent a delivery deadline']){
  await command.fill(p);await command.press('Enter');
  await expect(page.locator('.feedback')).toContainText('does not support');
  await expect(page.locator('[data-issue]')).toHaveCount(14);
 }
 await expect(page.getByLabel('EMP-104 status')).toHaveValue('todo');
});
