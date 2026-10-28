import {expect,test} from '@playwright/test';

test('selected Classic sidebar item remains inside the menu bounds',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/planning?design=current');
 const sidebar=page.locator('.sidebar'),active=sidebar.getByRole('button',{name:'Backlog & Sprints'});
 await expect(active).toHaveClass(/active/);
 const bounds=await page.evaluate(()=>{const s=document.querySelector('.sidebar')!.getBoundingClientRect(),b=document.querySelector('.sidebar nav button.active')!.getBoundingClientRect();return {sidebarLeft:s.left,sidebarRight:s.right,buttonLeft:b.left,buttonRight:b.right}});
 expect(bounds.buttonLeft).toBeGreaterThanOrEqual(bounds.sidebarLeft);
 expect(bounds.buttonRight).toBeLessThanOrEqual(bounds.sidebarRight);
 await page.screenshot({path:'docs/screenshots/phase10-sidebar-active-classic.png'});
});
