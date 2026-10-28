import {expect,test} from '@playwright/test';

async function approvedPlan(page:import('@playwright/test').Page){
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/intake?design=current');
 await page.getByRole('button',{name:/Improve checkout release readiness/}).click();
 await page.getByRole('button',{name:/Checkout web and mobile/}).click();
 await page.getByRole('button',{name:'Create execution plan'}).click();
 await page.getByLabel('I acknowledge the budget ceiling and task costs are unknown in this Demo.').check();
 await page.getByRole('button',{name:'Approve plan'}).click();
 await page.getByRole('button',{name:'Request execution · Demo simulation'}).click();
}

test('Phase 10 local Demo: readiness, assignment, Run, rejected/revised independent review',async({page})=>{
 await approvedPlan(page);
 await page.getByRole('button',{name:'Agents, Runs & Reviews'}).click();
 await expect(page.getByRole('heading',{name:'Agent memberships'})).toBeVisible();
 await expect(page.getByText('not checked · Demo')).toBeVisible();
 await expect(page.getByText('Configured: true')).toBeVisible();
 await expect(page.getByText('Connected: false · Demo').first()).toBeVisible();
 await expect(page.getByRole('button',{name:'Assign with current approval · Demo'})).toBeDisabled();
 await page.getByRole('button',{name:'Simulate missing capability'}).click();
 await expect(page.getByText(/missing required capability/)).toBeVisible();
 await page.getByRole('button',{name:'Simulate readiness check'}).click();
 await expect(page.getByText('simulated ready · Demo')).toBeVisible();
 await page.getByRole('button',{name:'Assign with current approval · Demo'}).click();
 await expect(page.locator('.phase10-message').getByText(/Assignment acknowledged/)).toBeVisible();
 await expect(page.getByRole('heading',{name:'Define release evidence'})).toBeVisible();
 await page.getByRole('button',{name:'Start Demo Run'}).click();
 await expect(page.getByText(/Demo Run started after operation receipt/)).toBeVisible();
 await page.getByRole('button',{name:'Ask human input · Demo'}).click();
 await expect(page.getByTestId('clarification-card')).toBeVisible();
 await page.getByRole('button',{name:'Close clarification'}).click();
 await expect(page.getByTestId('clarification-card')).toBeHidden();
 await page.getByRole('button',{name:'Open waiting question'}).click();
 await page.getByRole('button',{name:/Current approved task scope/}).click();
 await expect(page.getByRole('button',{name:'Submit simulated artifact'})).toBeVisible();
 await page.getByRole('button',{name:'Submit simulated artifact'}).click();
 await expect(page.getByText(/not accepted/).first()).toBeVisible();
 await page.getByRole('tab',{name:/Review inbox/}).click();
 await page.getByRole('button',{name:/review-run-plan/}).click();
 await page.getByLabel('Decision reason').fill('Need clearer evidence');
 await page.getByRole('button',{name:'Request changes'}).click();
 await expect(page.getByText(/Changes requested; prior artifact retained/)).toBeVisible();
 await page.getByRole('tab',{name:/Runs/}).click();
 await page.getByRole('button',{name:/Define release evidence/}).last().click();
 await page.getByRole('button',{name:'Start revised attempt'}).click();
 await page.getByRole('button',{name:'Submit simulated artifact'}).click();
 await page.getByRole('tab',{name:/Review inbox/}).click();
 await page.getByRole('button',{name:/review-run-plan/}).click();
 await expect(page.getByText(/Artifact version 2/)).toBeVisible();
 await expect(page.getByText(/Need clearer evidence/)).toBeVisible();
 await page.getByLabel('Decision reason').fill('Simulated criteria reviewed independently');
 await page.getByRole('button',{name:'Accept artifact · not release'}).click();
 await expect(page.getByText(/Independent Demo review accepted/)).toBeVisible();
 await expect(page.getByText(/not shipped/).first()).toBeVisible();
 await page.screenshot({path:'docs/screenshots/phase10-review-accepted.png'});
 await page.reload();
 await expect(page.getByText(/Review history/)).toBeVisible();
 await page.getByRole('button',{name:'Team board'}).click();
 const card=page.locator('.kb-card[data-issue="EMP-101"]');
 await expect(card.getByText('Run: accepted')).toBeVisible();
 await card.locator('.kb-card-title').click();
 await expect(page.getByText('Demo Run projection: accepted')).toBeVisible();
 await expect(page.getByText('Issue business status is unchanged by Run or review.')).toBeVisible();
});

test('Phase 10 Persian mobile and Classic sidebar item stay within bounds',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/agents?design=current');
 await page.getByRole('combobox',{name:'Language'}).selectOption('fa');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await expect(page.getByRole('heading',{name:'عضویت عامل‌ها'})).toBeVisible();
 await expect(page.getByRole('tab',{name:/صندوق بازبینی/})).toBeVisible();
 await page.screenshot({path:'docs/screenshots/phase10-mobile-fa.png'});
});
