import {test,expect} from '@playwright/test';
test('desktop design review: workspace and risk investigation',async({page})=>{
 await page.goto('/?design=current');
 await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page.locator('html')).toHaveAttribute('dir','ltr');
 await expect(page.locator('[data-issue]')).toHaveCount(14);
 const toolbar=await page.locator('.surface-toolbar').boundingBox();
 const table=await page.locator('.table-scroll').boundingBox();
 expect(toolbar?.height).toBeLessThanOrEqual(52);
 expect(Math.abs((toolbar!.y+toolbar!.height)-table!.y)).toBeLessThanOrEqual(2);
 await page.screenshot({path:'docs/screenshots/redesign/01-workspace.png'});
 await page.getByRole('button',{name:'Why is delivery at risk?'}).click();
 await expect(page.getByTestId('risk-investigation')).toBeVisible();
 await expect(page.locator('[data-issue]')).toHaveCount(2);
 await expect(page.locator('.dependency-chain')).toContainText('EMP-103');
 await expect(page.locator('.dependency-chain')).toContainText('EMP-104');
 await expect(page.locator('.schedule-note')).toContainText('Not scheduled');
 await page.screenshot({path:'docs/screenshots/redesign/02-risk-investigation.png'});
});
