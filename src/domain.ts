import fixture from '../fixtures/sprint12.json';
export type Status = 'backlog'|'todo'|'in_progress'|'review'|'completed'|'cancelled';
export type Area = 'web'|'mobile';
export type Issue = Omit<typeof fixture.issues[number],'status'|'dependencies'|'area'> & {status:Status;area:Area;dependencies:string[];manualOrder?:number;boardOrder?:number;agentId?:string;typeId?:string;parentId?:string|null;labels?:string[];componentIds?:string[];estimate?:{value:number;unit:'points'|'hours'}|null;customData?:Record<string,unknown>;archived?:boolean;worklogs?:{id:string;authorId:string;minutes:number;note:string;at:string}[];links?:{id:string;targetId:string;kind:'relates_to'|'blocks'}[]};
export type Composition = 'work'|'risk'|'unblock'|'workflow'|'calendar'|'planning'|'datacart'|'intake'|'agents'|'gallery'|'knowledge'|'overview'|'reports'|'releases'|'people'|'settings'|'orgProjects'|'myWork'|'inbox'|'globalSearch'|'orgActivity';
export type View = 'list'|'board'|'timeline';
export interface UIState {composition:Composition;orgQuery?:string;orgProjectFilter?:string;inboxItemId?:string;adminTab?:'people'|'settings'|'workflow'|'connections'|'organization';reportType?:'flow'|'sprint';releaseId?:string;datacartId?:string;intakeId?:string;agentTab?:'readiness'|'runs'|'reviews';runId?:string;reviewId?:string;galleryArtifactId?:string;knowledgeSourceId?:string;knowledgeVersion?:number;knowledgeQuery?:string;contextIssueId:string|null;issuePresentation?:'drawer'|'full';flowFocus:'none'|'why'|'paths'|'blockers';calendarMode:'day'|'week'|'month';calendarAnchor:string;calendarAssignee:string;calendarProject:string;calendarStatus:string;calendarFirstDay:0|1;calendarTimezone:string;sprintId:string;projectId:string;filter:{remaining?:boolean;blocked?:boolean;archived?:boolean;search?:string;typeId?:string;priority?:string;assigneeId?:string;statusId?:Status;label?:string};sort:'manual'|'key'|'priority'|'due';groupBy:'none'|'assignee';view:View;selectedIssueId:string|null;revision:number}
export const initialState:UIState={composition:'work',contextIssueId:null,flowFocus:'none',calendarMode:'week',calendarAnchor:'2026-10-27',calendarAssignee:'all',calendarProject:'all',calendarStatus:'all',calendarFirstDay:1,calendarTimezone:'Europe/Istanbul',projectId:'empire',sprintId:'sprint-12',filter:{},sort:'manual',groupBy:'none',view:'list',selectedIssueId:null,revision:0};
export type UIIntent = {type:'switchProjectQuery';query:string;remaining:boolean}|{type:'backProject'}|{type:'investigateRisk'}|{type:'helpUnblock';id:string|null}|{type:'showWorkflow'}|{type:'whyWorkflow'}|{type:'workflowPath'}|{type:'workflowBlockers'}|{type:'showCalendar'}|{type:'showPlanning'}|{type:'showReport';reportType:'flow'|'sprint'}|{type:'showMyCalendarWeek'}|{type:'calendarNextWeek'}| {type:'showIssues';remaining:boolean}|{type:'refineFilter';blocked:boolean}|{type:'groupBy';value:UIState['groupBy']}|{type:'switchView';view:View}|{type:'openIssue';id:string}|{type:'goBack'}|{type:'explain'}|{type:'unsupported'}|{type:'patch';value:Partial<UIState>};
export const seed=()=>structuredClone(fixture.issues) as Issue[];
// Additional Demo memberships for the Phase 07 ambiguous-name review; issue records stay untouched.
export const users=[...fixture.users,{id:'u-sara-farahani',name:'سارا فراهانی',nameEn:'Sara Farahani'},{id:'u-sara-moradi',name:'سارا مرادی',nameEn:'Sara Moradi'}];
export const remaining=(i:Issue)=>!['completed','cancelled'].includes(i.status);
export function evaluate(issues:Issue[],q:UIState){return issues.filter(i=>i.projectId===q.projectId&&!!i.archived===!!q.filter.archived&&i.sprintId===q.sprintId&&(!q.filter.remaining||remaining(i))&&(!q.filter.blocked||i.blocked)&&(!q.filter.typeId||(i.typeId??'task')===q.filter.typeId)&&(!q.filter.priority||i.priority===q.filter.priority)&&(!q.filter.assigneeId||i.assigneeId===q.filter.assigneeId)&&(!q.filter.statusId||i.status===q.filter.statusId)&&(!q.filter.label||i.labels?.includes(q.filter.label))&&(!q.filter.search||`${i.title} ${i.titleEn} ${i.semanticKey} ${i.description} ${i.descriptionEn} ${(i.labels??[]).join(' ')}`.toLowerCase().includes(q.filter.search.toLowerCase()))).sort((a,b)=>{const value=q.sort==='manual'?orderOf(a)-orderOf(b):q.sort==='priority'?Number(b.priority==='high')-Number(a.priority==='high'):q.sort==='due'?(a.dueDate??'9999').localeCompare(b.dueDate??'9999'):a.semanticKey.localeCompare(b.semanticKey);return value||a.id.localeCompare(b.id)});}
export interface Navigation {current:UIState;history:UIState[]}
export function navigate(nav:Navigation,intent:UIIntent):Navigation{
 const s=nav.current;
 if(intent.type==='explain'||intent.type==='unsupported'||intent.type==='switchProjectQuery'||intent.type==='backProject')return nav;
 if(intent.type==='goBack')return nav.history.length?{current:{...nav.history.at(-1)!,...(s.selectedIssueId&&!s.selectedIssueId.startsWith('pay-')?{contextIssueId:s.contextIssueId}:{}),revision:s.revision+1},history:nav.history.slice(0,-1)}:nav;
 let next:UIState={...s,revision:s.revision+1};
 switch(intent.type){case 'showReport':next={...next,composition:'reports',reportType:intent.reportType,selectedIssueId:null};break;case 'showPlanning':next={...next,composition:'planning',selectedIssueId:null};break;case 'investigateRisk':next={...next,composition:'risk',filter:{remaining:true,blocked:true},selectedIssueId:null,contextIssueId:null};break;case 'helpUnblock':if(!intent.id)return nav;next={...next,composition:'unblock',contextIssueId:intent.id,selectedIssueId:null};break;case 'showWorkflow':next={...next,composition:'workflow',flowFocus:'none',contextIssueId:null,selectedIssueId:null};break;case 'whyWorkflow':next={...next,composition:'workflow',flowFocus:'why',contextIssueId:'pay-51',selectedIssueId:null};break;case 'workflowPath':next={...next,composition:'workflow',flowFocus:'paths',contextIssueId:null,selectedIssueId:null};break;case 'workflowBlockers':next={...next,composition:'workflow',flowFocus:'blockers',contextIssueId:'pay-51',selectedIssueId:null};break;case 'showCalendar':next={...next,composition:'calendar',selectedIssueId:null};break;case 'showMyCalendarWeek':next={...next,composition:'calendar',calendarMode:'week',calendarAnchor:'2026-10-27',calendarAssignee:'Sara',filter:{remaining:true},selectedIssueId:null};break;case 'calendarNextWeek':{const [y,m,d]=s.calendarAnchor.split('-').map(Number);const shifted=new Date(Date.UTC(y,m-1,d+7));next={...next,composition:'calendar',calendarMode:'week',calendarAnchor:`${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth()+1).padStart(2,'0')}-${String(shifted.getUTCDate()).padStart(2,'0')}`,selectedIssueId:null};break}case 'showIssues':next={...next,composition:'work',contextIssueId:null,filter:intent.remaining?{remaining:true}:{},view:'list',selectedIssueId:null};break;case 'refineFilter':next.filter={...s.filter,blocked:intent.blocked};break;case 'groupBy':next.groupBy=intent.value;break;case 'switchView':next.view=intent.view;next.composition='work';break;case 'openIssue':next.selectedIssueId=intent.id;next.contextIssueId=intent.id;next.issuePresentation='drawer';if(intent.id.startsWith('pay-')&&s.composition==='workflow')next.composition='workflow';break;case 'patch':next={...next,...intent.value};}
 return {current:next,history:[...nav.history,s]};
}
export function dateLabel(date:string|null,locale:string,calendar:string){return date?new Intl.DateTimeFormat(locale,{calendar,month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z')):'—';}

export const orderOf=(issue:Issue)=>issue.manualOrder??Number(issue.semanticKey.split('-').at(-1));
// Reorder only the visible slots. Hidden rows keep their positions and fields.
export function reorderIssues(issues:Issue[], visibleIds:string[], sourceId:string, targetId:string, edge:'before'|'after'):Issue[]{
 if(sourceId===targetId||!visibleIds.includes(sourceId)||!visibleIds.includes(targetId))return issues;
 const visible=new Set(visibleIds);
 const all=[...issues].sort((a,b)=>orderOf(a)-orderOf(b));
 const ordered=all.filter(i=>visible.has(i.id));
 const moved=ordered.find(i=>i.id===sourceId);
 if(!moved||ordered.length!==visible.size)return issues;
 const next=ordered.filter(i=>i.id!==sourceId);
 const at=next.findIndex(i=>i.id===targetId)+(edge==='after'?1:0);
 next.splice(at,0,moved);
 if(next.every((i,n)=>i.id===ordered[n].id))return issues;
 let index=0;
 const sequence=all.map(i=>visible.has(i.id)?next[index++]:i);
 const ranks=new Map(sequence.map((i,n)=>[i.id,n]));
 return issues.map(i=>({...i,manualOrder:ranks.get(i.id)!}));
}
