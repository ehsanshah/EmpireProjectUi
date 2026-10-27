import {type UIIntent,type UIState} from './domain';
export function normalize(text:string){return text.toLowerCase().replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[\u200c\u200f]/g,'').replace(/\s+/g,' ').trim();}
export class MockIntentAdapter {
 async resolve(prompt:string,_context:UIState):Promise<UIIntent>{
 const p=normalize(prompt).replace(/[?؟.!]+$/, '');
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
