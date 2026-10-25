import {afterEach,describe,it,expect,vi} from 'vitest';
import {seed} from '../src/domain';
import {proposedDraft,readDrafts,writeDraft} from '../src/drafts';
afterEach(()=>vi.unstubAllGlobals());
describe('local follow-up drafts',()=>{
 it('uses documented facts and distinguishes missing upstream dependencies',()=>{
  const issues=seed();
  const dependent=proposedDraft(issues[2],issues,'en');
  expect(dependent).toContain('Depends on: EMP-104 (Reza)');
  expect(dependent).toContain('idempotency key');
  expect(dependent).toContain('Local draft only. Nothing has been sent.');
  const root=proposedDraft(issues[3],issues,'en');
  expect(root).not.toContain('Depends on:');expect(root).toContain('Scheduling is incomplete');
  expect(root).toContain('signature and retry policy');
 });
 it('saves edited drafts by immutable issue id without changing issues',()=>{
  const store=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(k:string)=>store.get(k)??null,setItem:(k:string,v:string)=>store.set(k,v)});
  const issues=seed();const before=JSON.stringify(issues);
  expect(writeDraft({issueId:issues[2].id,body:'Edited follow-up',locale:'en'})).toBe(true);
  expect(readDrafts().drafts[issues[2].id].body).toBe('Edited follow-up');
  expect(JSON.stringify(issues)).toBe(before);
 });
 it('does not claim persistence when storage is unavailable or corrupt',()=>{
  vi.stubGlobal('localStorage',{getItem:()=>{throw Error('denied')},setItem:()=>{throw Error('denied')}});
  expect(readDrafts().error).toBe(true);
  expect(writeDraft({issueId:'x',body:'keep this text',locale:'en'})).toBe(false);
  vi.stubGlobal('localStorage',{getItem:()=>'{invalid',setItem:vi.fn()});
  expect(writeDraft({issueId:'x',body:'keep this text',locale:'en'})).toBe(false);
 });
});
