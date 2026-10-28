import {expect,test} from '@playwright/test';

test('Arabic switches the shared workspace to RTL, loads its font and keeps navigation context',async({page})=>{
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/work?design=current&view=list');
 await page.getByRole('combobox',{name:'Language'}).selectOption('ar');
 await expect(page.locator('html')).toHaveAttribute('lang','ar');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await expect(page.getByRole('heading',{name:'عمل السبرنت'})).toBeVisible();
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontFamily)).toMatch(/^"?Empire Arabic/);
 expect(await page.evaluate(async()=>{
  const faces=await document.fonts.load('400 16px "Empire Arabic"','المهام');
  return faces.some(face=>face.status==='loaded'&&face.family==='Empire Arabic');
 })).toBe(true);
 await expect(page.getByRole('columnheader',{name:'المهمة / العنوان'})).toBeVisible();
 await page.getByRole('button',{name:'لوحة الفريق'}).click();
 await expect(page.getByRole('button',{name:'لوحة',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByTestId('kanban-board')).toBeVisible();
 await page.getByRole('button',{name:'المعرفة'}).click();
 await expect(page.getByRole('heading',{name:'المعرفة'}).first()).toBeVisible();
 await page.goBack();
 await expect(page.getByTestId('kanban-board')).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:'docs/screenshots/arabic-board-mobile.png'});
 await page.getByRole('combobox',{name:'اللغة'}).selectOption('en');
 await expect(page.locator('html')).toHaveAttribute('dir','ltr');
 await expect(page.getByRole('button',{name:'Board',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('Arabic controls remain usable across planning, calendar, intake, agents and DataCart',async({page})=>{
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/work?design=current&view=list');
 await page.getByRole('combobox',{name:'Language'}).selectOption('ar');
 const paths:[string,string][]=[
  ['المهام المؤجلة والسبرنتات','المهام المؤجلة والسبرنتات'],
  ['التقويم','التقويم'],
  ['الاستقبال والخطة','الاستقبال والخطة'],
  ['الوكلاء والتنفيذات والمراجعات','الوكلاء والتنفيذات والمراجعات'],
  ['استيراد سلة البيانات','استيراد سلة البيانات'],
  ['المعرض','المعرض'],
  ['المعرفة','المعرفة'],
 ];
 for(const [button,heading] of paths){
  await page.getByRole('button',{name:button,exact:true}).first().click();
  await expect(page.getByRole('heading',{name:heading,exact:true}).first()).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 }
 await page.getByRole('combobox',{name:'اللغة'}).selectOption('fa');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await page.getByRole('combobox',{name:'زبان'}).selectOption('en');
 await expect(page.locator('html')).toHaveAttribute('dir','ltr');
});

test('Arabic Demo commands change the main workset and preserve Back',async({page})=>{
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/work?design=current&view=list');
 await page.getByRole('combobox',{name:'Language'}).selectOption('ar');
 const command=page.getByRole('textbox',{name:'أمر'});
 await command.fill('إظهار العمل المتبقي');
 await command.press('Enter');
 await expect(page.getByRole('heading',{name:'العمل المتبقي'})).toBeVisible();
 await command.fill('المعطّل فقط');
 await command.press('Enter');
 await expect(page.getByRole('heading',{name:'العمل المعطّل'})).toBeVisible();
 await command.fill('إظهار الجدول الزمني');
 await command.press('Enter');
 await expect(page.getByTestId('phase05-timeline')).toBeVisible();
 await command.fill('رجوع');
 await command.press('Enter');
 await expect(page.getByTestId('phase05-timeline')).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'العمل المعطّل'})).toBeVisible();
});
