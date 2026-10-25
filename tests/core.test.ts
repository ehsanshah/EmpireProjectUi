import {describe,it,expect} from 'vitest';
import {evaluate,seed,initialState,navigate,dateLabel,type Navigation} from '../src/domain';
import {MockIntentAdapter,LatestRequest,normalize} from '../src/intent';
const adapter=new MockIntentAdapter();
describe('Stage 1 core flows',()=>{
 it('runs 14 → 8 → 2 → grouping → timeline → drawer → back without mutating issues',async()=>{const issues=seed();const original=JSON.stringify(issues);let nav:Navigation={current:initialState,history:[]};const run=async(p:string)=>{nav=navigate(nav,await adapter.resolve(p,nav.current))};expect(evaluate(issues,nav.current)).toHaveLength(14);await run('ایشوهای مانده این اسپرینت را نشان بده');expect(evaluate(issues,nav.current)).toHaveLength(8);await run('فقط مسدودها');expect(evaluate(issues,nav.current).map(i=>i.semanticKey)).toEqual(['EMP-103','EMP-104']);await run('بر اساس مسئول گروه‌بندی کن');expect(nav.current.groupBy).toBe('assignee');await run('تایم‌لاینش کن');expect(nav.current.view).toBe('timeline');expect(evaluate(issues,nav.current).filter(i=>!i.dueDate).map(i=>i.semanticKey)).toEqual(['EMP-104']);await run('EMP-۱۰۴ را باز کن');expect(nav.current.selectedIssueId).toBe('demo-issue-104');await run('برگرد');expect(nav.current.selectedIssueId).toBeNull();expect(nav.current.view).toBe('timeline');await run('برگرد');expect(nav.current.view).toBe('list');expect(evaluate(issues,nav.current)).toHaveLength(2);await run('همه کارهای اسپرینت را نشان بده');expect(evaluate(issues,nav.current)).toHaveLength(14);expect(JSON.stringify(issues)).toBe(original)});
 it('unknown, bulk writes and explanation keep navigation identical',async()=>{const nav={current:initialState,history:[]};for(const p of ['این دو تا را Done کن','delete everything','فقط توضیح بده و صفحه را عوض نکن'])expect(navigate(nav,await adapter.resolve(p,initialState))).toBe(nav)});
 it('keeps filter scope across all renderers',()=>{let nav:Navigation={current:initialState,history:[]};nav=navigate(nav,{type:'refineFilter',blocked:true});for(const view of ['list','board','timeline'] as const){nav=navigate(nav,{type:'switchView',view});expect(evaluate(seed(),nav.current).map(i=>i.semanticKey)).toEqual(['EMP-103','EMP-104'])}});
 it('ignores a late older result and pending result after direct navigation',async()=>{const latest=new LatestRequest();const applied:string[]=[];let resolve!:(s:string)=>void;const old=latest.run(()=>new Promise<string>(r=>resolve=r),s=>applied.push(s));await latest.run(()=>Promise.resolve('new'),s=>applied.push(s));resolve('old');await old;expect(applied).toEqual(['new']);let finish!:(s:string)=>void;const pending=latest.run(()=>new Promise<string>(r=>finish=r),s=>applied.push(s));latest.invalidate();finish('stale');await pending;expect(applied).toEqual(['new'])});
 it('normalizes Arabic characters, whitespace and Persian digits',()=>{expect(normalize('  EMP-۱۰۴   را باز كن ')).toBe('emp-104 را باز کن')});
 it('evaluates sort and search without modifying canonical input',()=>{const data=seed();const result=evaluate(data,{...initialState,filter:{search:'EMP-104'},sort:'due'});expect(result).toHaveLength(1);expect(data[0].semanticKey).toBe('EMP-101');expect(evaluate(data,{...initialState,filter:{remaining:true}}).every(i=>!['cancelled','completed'].includes(i.status))).toBe(true)});
 it('formats date-only consistently in both calendars',()=>{expect(dateLabel('2026-10-22','en','gregory')).toBe('Oct 22');expect(dateLabel('2026-10-22','en','persian')).toContain('30');expect(dateLabel(null,'fa','persian')).toBe('—')});
});

describe('bounded investigation compositions',()=>{
 it('opens the actual risk scope and restores preceding query and renderer',async()=>{
  let nav:Navigation={current:{...initialState,view:'board',filter:{remaining:true}},history:[]};
  nav=navigate(nav,await adapter.resolve('Why is delivery at risk?',nav.current));
  expect(nav.current.composition).toBe('risk');
  const rows=evaluate(seed(),nav.current);
  expect(rows.map(i=>i.semanticKey)).toEqual(['EMP-103','EMP-104']);
  expect(rows[0].dependencies).toEqual([rows[1].id]);
  expect(rows[1].dueDate).toBeNull();
  nav=navigate(nav,{type:'goBack'});
  expect(nav.current.composition).toBe('work');expect(nav.current.view).toBe('board');
  expect(evaluate(seed(),nav.current)).toHaveLength(8);
 });
 it('requires selected context for unblock and preserves it after closing details',async()=>{
  let nav:Navigation={current:initialState,history:[]};
  const missing=await adapter.resolve('Help me unblock this',nav.current);
  expect(navigate(nav,missing)).toBe(nav);
  nav=navigate(nav,{type:'openIssue',id:'demo-issue-103'});
  nav=navigate(nav,{type:'goBack'});
  expect(nav.current.selectedIssueId).toBeNull();
  expect(nav.current.contextIssueId).toBe('demo-issue-103');
  nav=navigate(nav,await adapter.resolve('Help me unblock this',nav.current));
  expect(nav.current.composition).toBe('unblock');expect(nav.current.contextIssueId).toBe('demo-issue-103');
 });
 it('normalizes the three English and Persian journey prompts',async()=>{
  expect(await adapter.resolve('Show remaining work',initialState)).toEqual({type:'showIssues',remaining:true});
  expect(await adapter.resolve('چرا تحویل در خطر است؟',initialState)).toEqual({type:'investigateRisk'});
  expect(await adapter.resolve('کمک کن این مانع را رفع کنم',initialState)).toEqual({type:'helpUnblock',id:null});
 });
});
