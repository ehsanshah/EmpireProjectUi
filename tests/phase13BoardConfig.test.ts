import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {DemoCoreClient} from '../src/core/demoClient';
import {CoreProblem} from '../src/core/contracts';
import {columnForStatus,fullScopeWip} from '../src/boardLayout';
import {seed} from '../src/domain';

const project='empire',owner='sara-farahani';
const code=(error:unknown)=>error instanceof CoreProblem?error.problem.code:'unknown';
class MemoryStorage {private values=new Map<string,string>();getItem(key:string){return this.values.get(key)??null}setItem(key:string,value:string){this.values.set(key,value)}removeItem(key:string){this.values.delete(key)}clear(){this.values.clear()}key(index:number){return [...this.values.keys()][index]??null}get length(){return this.values.size}}
beforeEach(()=>vi.stubGlobal('localStorage',new MemoryStorage()));
afterEach(()=>vi.unstubAllGlobals());

function publish(core:DemoCoreClient,edit:(config:ReturnType<typeof core.phase13.snapshot>['config'])=>void){const draft=core.phase13.beginDraft(project,owner),config=structuredClone(draft.config);edit(config);core.phase13.editDraft(project,owner,config,{},draft.revision);const preview=core.phase13.previewWorkflow(project,owner);expect(preview.errors).toEqual([]);core.phase13.approveWorkflow(project,owner,preview,1,`approve-${draft.revision}-${config.board.columns[0].labelEn}`);return core.phase13.publishWorkflow(project,owner,preview,`publish-${draft.revision}-${config.board.columns[0].labelEn}`)}

describe('Phase 13 published Demo Board configuration',()=>{
 it('keeps draft changes isolated, previews layout and affected issues, then renders published order, names, mapping and lanes',async()=>{
  const core=new DemoCoreClient(seed()),before=await core.getBoardSnapshot(project),statuses=core.snapshot().map(issue=>[issue.id,issue.status]);
  const draft=core.phase13.beginDraft(project,owner),config=structuredClone(draft.config);
  config.board.columns.find(column=>column.id==='todo')!.labelEn='Ready next';
  config.board.columns.splice(0,0,config.board.columns.splice(1,1)[0]);
  config.board.columns.find(column=>column.id==='review')!.statusIds=[];
  config.board.swimlaneOrder=['mobile','web'];
  core.phase13.editDraft(project,owner,config,{},draft.revision);
  expect((await core.getBoardSnapshot(project)).workflow).toEqual(before.workflow);
  const preview=core.phase13.previewWorkflow(project,owner);
  expect(preview.boardChanges.some(change=>change.includes('Ready next'))).toBe(true);
  expect(preview.boardChanges.some(change=>change.includes('mobile → web'))).toBe(true);
  expect(preview.boardAffected.some(issue=>issue.status==='review'&&issue.to==='unmapped')).toBe(true);
  expect(preview.unmapped.some(item=>item.status==='review'&&item.count>0)).toBe(true);
  expect(preview.canPublish).toBe(true);
  core.phase13.approveWorkflow(project,owner,preview,1,'approve-layout');
  const result=core.phase13.publishWorkflow(project,owner,preview,'publish-layout');
  expect(result.receipt.outcome).toBe('applied');
  const after=await core.getBoardSnapshot(project);
  expect(after.workflow.columns[0]).toMatchObject({id:'todo',labelEn:'Ready next'});
  expect(after.workflow.swimlanes.map(item=>item.id)).toEqual(['mobile','web']);
  expect(columnForStatus(after.workflow,'review')).toBeNull();
  expect(core.snapshot().map(issue=>[issue.id,issue.status])).toEqual(statuses);
  expect(after.rankRevision).toBe(before.rankRevision+1);
 });
 it('restores the published configuration after a new Demo client is constructed',async()=>{const core=new DemoCoreClient(seed());publish(core,config=>{config.board.columns[1].labelEn='Queue';config.board.swimlaneOrder.reverse();config.board.wip[0].limit=2});const reloaded=new DemoCoreClient(seed()),snapshot=await reloaded.getBoardSnapshot(project);expect(snapshot.workflow.columns[1].labelEn).toBe('Queue');expect(snapshot.workflow.swimlanes[0].id).toBe('mobile');expect(snapshot.workflow.wip.limit).toBe(2);expect((await reloaded.getBoardSnapshot('payment')).workflow.wip.limit).toBe(4)});
 it('invalidates approval after edits, denies restricted publication, and preserves a draft after a revision conflict',()=>{const core=new DemoCoreClient(seed()),adapter=core.phase13,draft=adapter.beginDraft(project,owner),ready=adapter.previewWorkflow(project,owner);adapter.approveWorkflow(project,owner,ready,1,'approve-first');const config=structuredClone(draft.config);config.board.columns[0].labelEn='Waiting';adapter.editDraft(project,owner,config,{},draft.revision);expect(adapter.snapshot(project).draft?.approval).toBeNull();expect(()=>adapter.publishWorkflow(project,owner,ready,'stale-publish')).toThrowError(CoreProblem);const saved=adapter.snapshot(project).draft!;expect(code((()=>{try{adapter.editDraft(project,owner,config,{},draft.revision)}catch(error){return error}})())).toBe('DRAFT_VERSION');expect(adapter.snapshot(project).draft).toEqual(saved);const next=adapter.previewWorkflow(project,owner);expect(code((()=>{try{adapter.approveWorkflow(project,'ali-reviewer',next,1,'viewer-approve')}catch(error){return error}})())).toBe('ACTION_DENIED')});
 it('rejects duplicate and unsupported mappings while preserving the draft',()=>{const core=new DemoCoreClient(seed()),adapter=core.phase13,draft=adapter.beginDraft(project,owner),config=structuredClone(draft.config);config.board.columns[1].statusIds.push('backlog');(config.board as {swimlane:string}).swimlane='assignee';adapter.editDraft(project,owner,config,{},draft.revision);const preview=adapter.previewWorkflow(project,owner);expect(preview.canPublish).toBe(false);expect(preview.errors.some(error=>error.includes('only one Board column'))).toBe(true);expect(preview.errors.some(error=>error.includes('Assignee grouping'))).toBe(true);expect(adapter.snapshot(project).draft?.config.board.columns[1].statusIds).toContain('backlog')});
 it('counts WIP across full project after remapping and blocks a move without changing rank or source',async()=>{const core=new DemoCoreClient(seed());publish(core,config=>{config.board.columns.find(column=>column.id==='review')!.statusIds=[];config.board.columns.find(column=>column.id==='in_progress')!.statusIds.push('review');config.board.wip[0].limit=1});const snapshot=await core.getBoardSnapshot(project),issues=core.snapshot();expect(snapshot.workflow.wip.current).toBe(fullScopeWip(issues,snapshot.workflow));expect(snapshot.workflow.wip.current).toBeGreaterThanOrEqual(1);const source=issues.find(issue=>issue.status==='todo')!,item=await core.getWorkItem(project,source.id),session=(await core.bootstrap()).session;await expect(core.placeBoardCard({orgId:session.orgId,projectId:project,issueId:source.id,targetColumnId:'in_progress',targetArea:source.area,beforeId:null,afterId:null,ifMatch:item.etag,rankRevision:snapshot.rankRevision,fields:{},idempotencyKey:'wip-remap',csrfToken:session.csrfToken,source:'board'})).rejects.toMatchObject({problem:{code:'WIP_LIMIT'}});expect(core.snapshot().find(issue=>issue.id===source.id)).toMatchObject({status:'todo',version:source.version});expect(core.snapshot().find(issue=>issue.id===source.id)?.boardOrder).toBe(source.boardOrder);expect((await core.getBoardSnapshot(project)).rankRevision).toBe(snapshot.rankRevision)});
});
