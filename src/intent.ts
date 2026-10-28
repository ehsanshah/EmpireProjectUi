import {type UIIntent,type UIState} from './domain';
export function normalize(text:string){return text.toLowerCase().replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[\u200c\u200f]/g,'').replace(/\s+/g,' ').trim();}
export class MockIntentAdapter {
 async resolve(prompt:string,_context:UIState):Promise<UIIntent>{
 const p=normalize(prompt).replace(/[?؟.!]+$/, '');
 const arabic=(...phrases:string[])=>phrases.some(phrase=>p===normalize(phrase));
 if(/^(show (the )?(flow|sprint) report|گزارش (جریان|اسپرینت) را نشان بده|أظهر تقرير (التدفق|السبرنت))$/.test(p))return {type:'showReport',reportType:/sprint|اسپرینت|السبرنت/.test(p)?'sprint':'flow'};
 if(arabic('رجوع','ارجع'))return {type:'goBack'};
 if(arabic('أظهر المهام المتبقية','إظهار العمل المتبقي','أظهر العمل المتبقي'))return {type:'showIssues',remaining:true};
 if(arabic('أظهر كل المهام','إظهار كل المهام'))return {type:'showIssues',remaining:false};
 if(arabic('المعطّل فقط','المعطل فقط','المهام المعطّلة فقط'))return {type:'refineFilter',blocked:true};
 if(arabic('تجميع حسب المسؤول'))return {type:'groupBy',value:'assignee'};
 if(arabic('إظهار الجدول الزمني','الجدول الزمني'))return {type:'switchView',view:'timeline'};
 if(arabic('إظهار اللوحة','اللوحة'))return {type:'switchView',view:'board'};
 if(arabic('إظهار القائمة','القائمة'))return {type:'switchView',view:'list'};
 if(arabic('إظهار التقويم','افتح التقويم'))return {type:'showCalendar'};
 if(arabic('إظهار سير عمل إصدار الدفع'))return {type:'showWorkflow'};
 if(arabic('لماذا التسليم معرض للخطر؟','لماذا التسليم معرض للخطر'))return {type:'investigateRisk'};
 if(arabic('ساعدني في إزالة هذا العائق'))return {type:'helpUnblock',id:_context.selectedIssueId??_context.contextIssueId};
 if(arabic('اشرح فقط'))return {type:'explain'};
 const arabicKey=p.match(/^افتح (emp|pay)[- ]?(\d+)$/);if(arabicKey)return {type:'openIssue',id:arabicKey[1]==='emp'?`demo-issue-${arabicKey[2]}`:`pay-${arabicKey[2]}`};
 if(/^(back to the previous project|برگرد به پروژه قبلی|به پروژه قبلی برگرد)$/.test(p))return {type:'backProject'};
 const switchMatch=p.match(/^(?:switch to|برو به پروژه|پروژه) (.+)$/);if(switchMatch)return {type:'switchProjectQuery',query:switchMatch[1],remaining:false};
 const remainingIn=p.match(/^(?:show remaining issues in|ایشوهای مانده در پروژه) (.+)$/);if(remainingIn)return {type:'switchProjectQuery',query:remainingIn[1],remaining:true};
 if(/^(show my remaining tasks this week on the calendar|کارهای مانده من در این هفته را در تقویم نشان بده)$/.test(p))return {type:'showMyCalendarWeek'};
 if(/^(show next week|هفته بعد را نشان بده)$/.test(p))return {type:'calendarNextWeek'};
 if(/^(show calendar|open calendar|تقویم را نشان بده)$/.test(p))return {type:'showCalendar'};
 if(/^(only blocked tasks|فقط کارهای مسدود)$/.test(p))return {type:'refineFilter',blocked:true};
 if(/^(show the payment release workflow|show payment workflow|نمایش جریان کار پرداخت)$/.test(p))return {type:'showWorkflow'};
 if(/^(why is pay-51 waiting|چرا pay-51 منتظر است)$/.test(p))return {type:'whyWorkflow'};
 if(/^(show the path from pay-38 to pay-51|مسیر pay-38 تا pay-51 را نشان بده)$/.test(p))return {type:'workflowPath'};
 if(/^(why is delivery at risk|چرا تحویل در خطر است)$/.test(p))return {type:'investigateRisk'};
 if(/^(help me unblock this|کمک کن این مانع را رفع کنم)$/.test(p))return {type:'helpUnblock',id:_context.selectedIssueId??_context.contextIssueId};
 if(/^(فقط توضیح بده و صفحه را عوض نکن|explain only|explain without changing the view)$/.test(p))return {type:'explain'};
 if(/^(برگرد|back|go back)$/.test(p))return {type:'goBack'};
 const key=p.match(/^(?:open )?emp[- ]?(\d+)(?: را باز کن)?$/);if(key)return {type:'openIssue',id:`demo-issue-${key[1]}`};
 const flowKey=p.match(/^(?:open )?pay[- ]?(38|42|46|51)(?: را باز کن)?$/);if(flowKey)return {type:'openIssue',id:`pay-${flowKey[1]}`};
 if(/^(فقط مسدودها|only blocked|blocked only)$/.test(p))return {type:'refineFilter',blocked:true};
 if(/^(بر اساس مسئول گروهبندی کن|group by assignee)$/.test(p))return {type:'groupBy',value:'assignee'};
 if(/^(تایملاینش کن|روی تایملاین نشان بده|show timeline|timeline)$/.test(p))return {type:'switchView',view:'timeline'};
 if(/^(برد|show board|board)$/.test(p))return {type:'switchView',view:'board'};
 if(/^(فهرست|show list|list)$/.test(p))return {type:'switchView',view:'list'};
 if(/^(ایشوهای مانده این اسپرینت را نشان بده|issueهای باقیمانده این اسپرینت را نشان بده|ماندههای sprint را نشان بده|show remaining work|show remaining issues|show remaining sprint issues)$/.test(p))return {type:'showIssues',remaining:true};
 if(/^(همه کارهای اسپرینت را نشان بده|show all sprint issues|show all issues)$/.test(p))return {type:'showIssues',remaining:false};
 return {type:'unsupported'};
 }
}
// Every direct navigation invalidates pending commands as well.
export class LatestRequest {private id=0;invalidate(){return ++this.id}async run<T>(task:()=>Promise<T>,apply:(value:T)=>void){const id=this.invalidate();const value=await task();if(id===this.id)apply(value);}}
