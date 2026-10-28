import {seed,type Issue,type UIState,initialState} from './domain';
export interface Project {id:string;key:string;name:string;nameFa:string;status:string;color:string;pinned?:boolean;description?:string;teamId?:string;leadId?:string;ownerId?:string;clientRequestId?:string}
export interface ProjectOption {id:string;name:string;nameFa:string;context:string}
export const demoTeams:ProjectOption[]=[
 {id:'core-platform',name:'Core Platform',nameFa:'پلتفرم مرکزی',context:'Engineering'},
 {id:'commerce',name:'Commerce',nameFa:'تجارت',context:'Product'},
 {id:'customer-success',name:'Customer Success',nameFa:'موفقیت مشتری',context:'Operations'},
];
export const demoLeads:ProjectOption[]=[
 {id:'sara-farahani',name:'Sara Farahani',nameFa:'سارا فراهانی',context:'Core Platform'},
 {id:'sara-moradi',name:'Sara Moradi',nameFa:'سارا مرادی',context:'Commerce'},
 {id:'ali-rezaei',name:'Ali Rezaei',nameFa:'علی رضایی',context:'Core Platform'},
 {id:'mina-kazemi',name:'Mina Kazemi',nameFa:'مینا کاظمی',context:'Customer Success'},
];
// This is the accessible-project response of the local demo adapter, not an ACL implementation.
export const accessibleProjects:Project[]=[
 {id:'empire',key:'EMP',name:'Store checkout',nameFa:'پرداخت فروشگاه',status:'Active sprint',color:'#547cff',pinned:true},
 {id:'payment',key:'PAY',name:'Payment Platform',nameFa:'پلتفرم پرداخت',status:'In progress',color:'#559cf5',pinned:true},
 {id:'storefront',key:'STORE',name:'Storefront',nameFa:'ویترین فروشگاه',status:'Active',color:'#45bdc8'},
 {id:'support',key:'HELP',name:'Customer Support',nameFa:'پشتیبانی مشتریان',status:'Active',color:'#a389e8'},
 {id:'ops-east',key:'OPS',name:'Operations',nameFa:'عملیات',status:'Planning',color:'#68ad88'},
 {id:'ops-west',key:'OPSW',name:'Operations',nameFa:'عملیات',status:'On hold',color:'#85a8d1'},
 {id:'growth',key:'GROW',name:'Growth Experiments and Customer Lifecycle Optimization',nameFa:'آزمایش‌های رشد و بهینه‌سازی چرخهٔ مشتری',status:'Active',color:'#f0a86b'},
 {id:'design',key:'DSN',name:'Design System',nameFa:'سیستم طراحی',status:'Active',color:'#d48fb5'},
 {id:'mobile',key:'MOB',name:'Mobile Experience',nameFa:'تجربه موبایل',status:'Planning',color:'#91a9f5'},
 {id:'data',key:'DATA',name:'Data Insights',nameFa:'تحلیل داده',status:'Active',color:'#78c2a3'},
];
export type ProjectDemoMode='normal'|'loading'|'empty'|'error'|'unavailable';
const CREATED_KEY='empire-created-projects-v1:local-demo:workspace';
function createdProjects():Project[]{try{const value=JSON.parse(localStorage.getItem(CREATED_KEY)||'[]');return Array.isArray(value)?value.filter((p:Project)=>p&&typeof p.id==='string'&&typeof p.key==='string'&&typeof p.name==='string'&&typeof p.teamId==='string'):[]}catch{return []}}
export function demoProjectSnapshot():Project[]{return [...accessibleProjects,...createdProjects()]}
export interface ProjectCreateInput {name:string;key:string;description:string;teamId:string;leadId:string;ownerId?:string}
export class DemoProjectAdapter {
 async list(mode:ProjectDemoMode='normal',unavailableId?:string){if(mode==='loading')await new Promise(resolve=>setTimeout(resolve,700));if(mode==='error')throw Error('Simulated project load failure');if(mode==='empty')return [];return demoProjectSnapshot().filter(p=>mode!=='unavailable'||p.id!==unavailableId).map(p=>({...p}))}
 async create(input:ProjectCreateInput,clientRequestId:string):Promise<Project>{
  await new Promise(resolve=>setTimeout(resolve,350));
  if(new URLSearchParams(window.location.search).get('projectCreateDemo')==='error-once'&&!sessionStorage.getItem(`empire-create-retried:${clientRequestId}`)){sessionStorage.setItem(`empire-create-retried:${clientRequestId}`,'1');throw Error('Simulated local save failure')}
  const existing=createdProjects();const prior=existing.find(p=>p.clientRequestId===clientRequestId);if(prior)return prior;
  if([...accessibleProjects,...existing].some(p=>p.key.toLowerCase()===input.key.toLowerCase()))throw Error('Project key is already in use');
  if(!demoTeams.some(t=>t.id===input.teamId)||input.leadId&&!demoLeads.some(l=>l.id===input.leadId))throw Error('A selected option is no longer available');
  const project:Project={id:crypto.randomUUID(),key:input.key.toUpperCase(),name:input.name,nameFa:input.name,status:'New · local demo',color:'#4d9be9',description:input.description,teamId:input.teamId,leadId:input.leadId||undefined,ownerId:input.ownerId,clientRequestId};
  localStorage.setItem(CREATED_KEY,JSON.stringify([...existing,project]));return project;
 }
}
const titles:Record<string,[string,string,string][]>={
 payment:[['PAY-38','Design error messages','طراحی پیام‌های خطا'],['PAY-42','Retry payment','تلاش دوباره برای پرداخت'],['PAY-46','Record payment events','ثبت رویدادهای پرداخت'],['PAY-51','Test and prepare release','آزمون و آماده‌سازی انتشار']],
 storefront:[['STORE-11','Improve product discovery','بهبود کشف محصول'],['STORE-12','Review storefront checkout','بررسی پرداخت ویترین'],['STORE-13','Optimize product cards','بهینه‌سازی کارت محصول'],['STORE-14','Publish campaign banner','انتشار بنر کمپین']],
 support:[['HELP-21','Triage billing requests','دسته‌بندی درخواست‌های مالی'],['HELP-22','Update response templates','به‌روزرسانی متن پاسخ‌ها'],['HELP-23','Review escalation queue','بررسی صف ارجاع']],
};
const statuses:Issue['status'][]=['completed','todo','in_progress','review'];
export function projectSeedIssues():Issue[]{const base=seed();return accessibleProjects.filter(p=>p.id!=='empire').flatMap((project,pIndex)=>{const entries=titles[project.id]??[[`${project.key}-1`,`${project.name} planning`,`${project.nameFa} · برنامه‌ریزی`],[`${project.key}-2`,`${project.name} review`,`${project.nameFa} · بررسی`]];return entries.map(([key,titleEn,title],index)=>({...base[(pIndex+index)%base.length],id:project.id==='payment'?`pay-${key.split('-')[1]}`:`${project.id}-${key.split('-')[1]}`,projectId:project.id,semanticKey:key,title,titleEn,description:`Local demo issue for ${project.name}.`,descriptionEn:`Local demo issue for ${project.name}.`,status:project.id==='payment'?(['completed','todo','in_progress','backlog'] as Issue['status'][])[index]:statuses[index%statuses.length],blocked:project.id==='payment'?index===1||index===3:index===1,blockerReason:index===1?'Waiting for review':null,blockerReasonEn:index===1?'Waiting for review':null,dependencies:project.id==='payment'&&index===3?['pay-42','pay-46']:[],comments:[],manualOrder:index+1,boardOrder:index+1,version:1} as Issue))})}
export function projectFor(id:string){return accessibleProjects.find(p=>p.id===id)}
export function matchProjects(projects:Project[],query:string){const q=query.trim().toLocaleLowerCase();return projects.filter(p=>`${p.name} ${p.nameFa} ${p.key}`.toLocaleLowerCase().includes(q))}
export function freshProjectState(id:string):UIState{return {...initialState,projectId:id,filter:{},selectedIssueId:null,contextIssueId:null,calendarProject:'all'}}
export function restoreProjectState(saved:UIState|undefined,id:string):UIState{return {...(saved??freshProjectState(id)),projectId:id,selectedIssueId:null,contextIssueId:null,calendarProject:'all',revision:(saved?.revision??0)+1}}
export const PANEL_MIN=240,PANEL_MAX=640,PANEL_DEFAULT=320,PANEL_COLLAPSE=180,PANEL_REOPEN=260;
export function maxPanelWidth(viewport:number){return Math.max(PANEL_MIN,Math.min(PANEL_MAX,viewport-70-560))}
export function clampPanelWidth(width:number,viewport:number){return Math.max(PANEL_MIN,Math.min(maxPanelWidth(viewport),Number.isFinite(width)?width:PANEL_DEFAULT))}
export function panelWidthFromDrag(start:number,delta:number,viewport:number){const raw=start+delta;return raw<PANEL_COLLAPSE?0:clampPanelWidth(raw,viewport)}
