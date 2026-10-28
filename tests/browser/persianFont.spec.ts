import {expect,test} from '@playwright/test';

test('Persian UI loads the bundled Vazir font while English keeps its existing stack',async({page})=>{
 await page.goto('http://127.0.0.1:5178/o/demo/p/empire/intake?design=current');
 const language=page.getByRole('combobox',{name:'Language'});
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontFamily)).toMatch(/^Inter/);
 await language.selectOption('fa');
 await expect(page.locator('html')).toHaveAttribute('lang','fa');
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontFamily)).toMatch(/^"?Vazir/);
 expect(await page.evaluate(()=>getComputedStyle(document.querySelector('input')!).fontFamily)).toMatch(/^"?Vazir/);
 const loaded=await page.evaluate(async()=>{
  const faces=await document.fonts.load('400 16px Vazir','فضای کار');
  return faces.some(face=>face.status==='loaded'&&face.family==='Vazir');
 });
 expect(loaded).toBe(true);
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:'docs/screenshots/persian-font-intake-mobile.png'});
 await page.getByRole('combobox',{name:'زبان'}).selectOption('en');
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontFamily)).toMatch(/^Inter/);
});
