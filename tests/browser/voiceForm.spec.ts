import {test,expect} from '@playwright/test';

async function openForm(page:import('@playwright/test').Page){await page.locator('.project-switch-trigger').click();await page.getByRole('dialog',{name:'Project browser'}).getByRole('button',{name:'New project'}).click();return page.getByTestId('new-project-form')}

test('typed transcript updates real fields, correction and undo preserve other values, then creates one local project',async({page})=>{
 await page.goto('/?design=glass');const form=await openForm(page);
 await form.getByRole('button',{name:'Create project'}).click();await expect(form.getByRole('alert').first()).toContainText('Please fix these fields');await expect(form.locator('#project-name')).toBeFocused();
 await form.getByRole('button',{name:'Typed transcript · test mode'}).click();const transcript=form.locator('#typed-project-transcript');
 await transcript.fill('Call it Merchant Portal, key MERCH, use the Core Platform team.');await form.getByRole('button',{name:'Extract into form'}).click();
 await expect(form.locator('#project-name')).toHaveValue('Merchant Portal');await expect(form.locator('#project-key')).toHaveValue('MERCH');await expect(form.locator('#project-teamId')).toHaveValue('core-platform');await page.screenshot({path:'docs/screenshots/voice-to-form-filled.png'});
 await transcript.fill('Actually, change the name to Merchant Hub.');await form.getByRole('button',{name:'Extract into form'}).click();await expect(form.locator('#project-name')).toHaveValue('Merchant Hub');await expect(form.locator('#project-key')).toHaveValue('MERCH');
 await form.getByRole('button',{name:'Undo voice changes'}).click();await expect(form.locator('#project-name')).toHaveValue('Merchant Portal');
 await form.getByRole('button',{name:'Create project'}).click();await expect(form.getByText('Project created locally')).toBeVisible();await expect(form.getByText('MERCH · Merchant Portal')).toBeVisible();
 await form.getByRole('button',{name:'Open project'}).click();await expect(page.locator('.project-switch-trigger')).toContainText('Merchant Portal');await expect(page.getByTestId('result-count')).toHaveText('0');
 const createdUrl=page.url();await page.reload();await expect(page.locator('.project-switch-trigger')).toContainText('Merchant Portal');
 await page.locator('.project-switch-trigger').click();await page.getByRole('dialog',{name:'Project browser'}).getByRole('button',{name:/Store checkout · EMP/}).first().click();
 await page.goto(createdUrl);await expect(page.locator('.project-switch-trigger')).toContainText('Merchant Portal');
});

test('ambiguous lead needs a visible choice; failed local save is retryable',async({page})=>{
 await page.goto('/?design=glass&projectCreateDemo=error-once');const form=await openForm(page);await form.getByRole('button',{name:'Typed transcript · test mode'}).click();const transcript=form.locator('#typed-project-transcript');
 await transcript.fill('Call it Revenue Lab, key REVLAB, use the Commerce team. Lead is Sara.');await form.getByRole('button',{name:'Extract into form'}).click();await expect(form.getByText('Which person?')).toBeVisible();await expect(form.locator('#project-leadId')).toHaveValue('');
 await form.getByRole('button',{name:/Sara Moradi/}).click();await expect(form.locator('#project-leadId')).toHaveValue('sara-moradi');
 await form.getByRole('button',{name:'Create project'}).click();await expect(form.getByRole('alert').last()).toContainText('Simulated local save failure');await form.getByRole('button',{name:'Retry'}).click();await expect(form.getByText('Project created locally')).toBeVisible();
});

test('unsupported microphone reports failure honestly and Persian RTL stays usable',async({page})=>{
 await page.goto('/?design=glass');await page.getByRole('combobox',{name:'Language'}).selectOption('fa');await page.locator('.project-switch-trigger').click();await page.getByRole('dialog',{name:'مرورگر پروژه'}).getByRole('button',{name:'پروژهٔ جدید'}).click();const form=page.getByTestId('new-project-form');await expect(page.locator('html')).toHaveAttribute('dir','rtl');await form.getByRole('button',{name:'شروع ضبط'}).click();await expect(form.getByRole('alert')).toBeVisible();await form.getByRole('button',{name:'متن تایپ‌شده · حالت تست'}).click();await form.locator('#typed-project-transcript').fill('نام پروژه آزمایش باشد، کلید AZM، تیم پلتفرم مرکزی.');await form.getByRole('button',{name:'استخراج و پرکردن فرم'}).click();await expect(form.locator('#project-name')).toHaveValue('آزمایش');await expect(form.locator('#project-key')).toHaveValue('AZM');
});

test('recognition API path uses finalized speech, releases media, and never creates without explicit intent',async({page})=>{
 await page.addInitScript(()=>{
  (window as unknown as {speechTest:{stops:number;recognition:unknown}}).speechTest={stops:0,recognition:null};
  Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>({getTracks:()=>[{stop:()=>{(window as unknown as {speechTest:{stops:number}}).speechTest.stops++}}]})}});
  class FakeRecognition{lang='';interimResults=false;continuous=false;onresult:((event:unknown)=>void)|null=null;onerror:null=null;onend:(()=>void)|null=null;start(){(window as unknown as {speechTest:{recognition:unknown}}).speechTest.recognition=this}stop(){this.onresult?.({resultIndex:0,results:[{isFinal:true,0:{transcript:'Call it Voice Project, key VOICE, use the Core Platform team.'}}]});this.onend?.()}abort(){this.onend?.()}}
  Object.defineProperty(window,'SpeechRecognition',{configurable:true,value:FakeRecognition});
 });
 await page.goto('/?design=glass');const form=await openForm(page);await form.getByRole('button',{name:'Start recording'}).click();await expect(form.getByRole('button',{name:'Stop'})).toBeEnabled();await form.getByRole('button',{name:'Stop'}).click();await expect(form.locator('#project-name')).toHaveValue('Voice Project');await expect(form.locator('#project-teamId')).toHaveValue('core-platform');expect(await page.evaluate(()=>(window as unknown as {speechTest:{stops:number}}).speechTest.stops)).toBe(1);await expect(form.getByText('Project created locally')).toHaveCount(0);
});

test('spoken create wording fills a draft and still needs the normal Create action',async({page})=>{
 await page.goto('/?design=glass');const form=await openForm(page);await form.getByRole('button',{name:'Typed transcript · test mode'}).click();const transcript=form.locator('#typed-project-transcript');await transcript.fill('Call it Auto Voice, key AUTOV, use the Core Platform team. Create it if all required information is complete.');await form.getByRole('button',{name:'Extract into form'}).click();await expect(form.getByText('Project created locally')).toHaveCount(0);await expect(form.locator('#project-name')).toHaveValue('Auto Voice');await form.getByRole('button',{name:'Create project'}).click();await expect(form.getByText('Project created locally')).toBeVisible();const count=await page.evaluate(()=>JSON.parse(localStorage.getItem('empire-created-projects-v1:local-demo:workspace')||'[]').length);expect(count).toBe(1);
});

test('Cancel and navigation release microphone tracks without filling or creating',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>({getTracks:()=>[{stop:()=>sessionStorage.setItem('phase07-track-stops',String(Number(sessionStorage.getItem('phase07-track-stops')||0)+1))}]})}});class FakeRecognition{lang='';interimResults=false;continuous=false;onresult=null;onerror=null;onend=null;start(){}stop(){}abort(){}}Object.defineProperty(window,'SpeechRecognition',{configurable:true,value:FakeRecognition})});
 await page.goto('/?design=glass');const form=await openForm(page);await form.getByRole('button',{name:'Start recording'}).click();await expect(form.getByRole('button',{name:'Cancel'})).toBeVisible();await form.getByRole('button',{name:'Cancel'}).click();expect(await page.evaluate(()=>sessionStorage.getItem('phase07-track-stops'))).toBe('1');await expect(form.locator('#project-name')).toHaveValue('');
 await form.getByRole('button',{name:'Start recording'}).click();await page.goto('/o/demo/p/empire/planning?design=glass');expect(await page.evaluate(()=>sessionStorage.getItem('phase07-track-stops'))).toBe('2');await expect(page.getByText('Project created locally')).toHaveCount(0);
});
