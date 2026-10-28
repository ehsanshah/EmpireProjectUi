import {expect,test} from '@playwright/test';

test('final defaults and localized organization navigation survive mobile RTL',async({page})=>{
 await page.goto('/o/demo/p/empire/work?design=current&view=list');
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await expect(page.locator('html')).toHaveAttribute('data-design','current');
 await expect(page.getByRole('button',{name:'Toggle demo agent'})).toHaveAttribute('aria-expanded','false');
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('combobox',{name:'Language'}).selectOption('ar');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 const nav=page.locator('.mobile-section-nav');
 for(const label of ['المشاريع','عملي','صندوق الوارد','بحث','النشاط'])await expect(nav.getByRole('button',{name:label,exact:true})).toBeVisible();
 await expect(page.locator('[data-issue="EMP-101"] bdi').first()).toHaveText('EMP-101');
 await nav.getByRole('button',{name:'المشاريع'}).click();
 await expect(page).toHaveURL(/\/o\/demo\/projects/);
 await page.goBack();
 await expect(page.getByTestId('result-count')).toHaveText('14');
});
