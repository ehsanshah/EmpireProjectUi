import {test,expect} from '@playwright/test';

test('project and view deep link load, and browser Back restores prior Demo view',async({page})=>{
 await page.goto('/o/demo/p/payment/work?view=board&design=glass');
 await expect(page.locator('.project-switch-trigger')).toContainText('Payment Platform');
 await expect(page.getByRole('button',{name:'Board',exact:true}).last()).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Timeline',exact:true}).last().click();await expect(page).toHaveURL(/view=timeline/);
 await page.goBack();await expect(page.getByRole('button',{name:'Board',exact:true}).last()).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.results')).toContainText('PAY-42');
});
