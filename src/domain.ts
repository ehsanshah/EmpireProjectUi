import fixture from '../fixtures/sprint12.json';
export type Status = 'backlog'|'todo'|'in_progress'|'review'|'completed'|'cancelled';
export type Area = 'web'|'mobile';
export type Issue = Omit<typeof fixture.issues[number],'status'|'dependencies'|'area'> & {status:Status;area:Area;dependencies:string[];manualOrder?:number;boardOrder?:number;agentId?:string};
export type Composition = 'work'|'risk'|'unblock'|'workflow';
export type View = 'list'|'board'|'timeline';
export interface UIState {composition:Composition;contextIssueId:string|null;flowFocus:'none'|'why'|'paths'|'blockers';projectId:string;sprintId:string;filter:{remaining?:boolean;blocked?:boolean;search?:string};sort:'manual'|'key'|'priority'|'due';groupBy:'none'|'assignee';view:View;selectedIssueId:string|null;revision:number}
export const initialState:UIState={composition:'work',contextIssueId:null,flowFocus:'none',projectId:'empire',sprintId:'sprint-12',filter:{},sort:'manual',groupBy:'none',view:'list',selectedIssueId:null,revision:0};
export type UIIntent = {type:'investigateRisk'}|{type:'helpUnblock';id:string|null}|{type:'showWorkflow'}|{type:'whyWorkflow'}|{type:'workflowPath'}|{type:'workflowBlockers'}| {type:'showIssues';remaining:boolean}|{type:'refineFilter';blocked:boolean}|{type:'groupBy';value:UIState['groupBy']}|{type:'switchView';view:View}|{type:'openIssue';id:string}|{type:'goBack'}|{type:'explain'}|{type:'unsupported'}|{type:'patch';value:Partial<UIState>};
export const seed=()=>structuredClone(fixture.issues) as Issue[];
export const users=fixture.users;
export const remaining=(i:Issue)=>!['completed','cancelled'].includes(i.status);
export function evaluate(issues:Issue[],q:UIState){return issues.filter(i=>i.projectId===q.projectId&&i.sprintId===q.sprintId&&(!q.filter.remaining||remaining(i))&&(!q.filter.blocked||i.blocked)&&(!q.filter.search||`${i.title} ${i.titleEn} ${i.semanticKey}`.toLowerCase().includes(q.filter.search.toLowerCase()))).sort((a,b)=>q.sort==='manual'?orderOf(a)-orderOf(b):q.sort==='priority'?Number(b.priority==='high')-Number(a.priority==='high'):q.sort==='due'?(a.dueDate??'9999').localeCompare(b.dueDate??'9999'):a.semanticKey.localeCompare(b.semanticKey));}
export interface Navigation {current:UIState;history:UIState[]}
export function navigate(nav:Navigation,intent:UIIntent):Navigation{
 const s=nav.current;
 if(intent.type==='explain'||intent.type==='unsupported')return nav;
 if(intent.type==='goBack')return nav.history.length?{current:{...nav.history.at(-1)!,...(s.selectedIssueId&&!s.selectedIssueId.startsWith('pay-')?{contextIssueId:s.contextIssueId}:{}),revision:s.revision+1},history:nav.history.slice(0,-1)}:nav;
 let next:UIState={...s,revision:s.revision+1};
 switch(intent.type){case 'investigateRisk':next={...next,composition:'risk',filter:{remaining:true,blocked:true},selectedIssueId:null,contextIssueId:null};break;case 'helpUnblock':if(!intent.id)return nav;next={...next,composition:'unblock',contextIssueId:intent.id,selectedIssueId:null};break;case 'showWorkflow':next={...next,composition:'workflow',flowFocus:'none',contextIssueId:null,selectedIssueId:null};break;case 'whyWorkflow':next={...next,composition:'workflow',flowFocus:'why',contextIssueId:'pay-51',selectedIssueId:null};break;case 'workflowPath':next={...next,composition:'workflow',flowFocus:'paths',contextIssueId:null,selectedIssueId:null};break;case 'workflowBlockers':next={...next,composition:'workflow',flowFocus:'blockers',contextIssueId:'pay-51',selectedIssueId:null};break;case 'showIssues':next={...next,composition:'work',contextIssueId:null,filter:intent.remaining?{remaining:true}:{},view:'list',selectedIssueId:null};break;case 'refineFilter':next.filter={...s.filter,blocked:intent.blocked};break;case 'groupBy':next.groupBy=intent.value;break;case 'switchView':next.view=intent.view;next.composition='work';break;case 'openIssue':next.selectedIssueId=intent.id;next.contextIssueId=intent.id;if(intent.id.startsWith('pay-'))next.composition='workflow';break;case 'patch':next={...next,...intent.value};}
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
