import {beforeEach,describe,expect,it} from 'vitest';
import {DemoPhase12Adapter} from '../src/phase12Domain';
import {DemoIntakePlanAdapter} from '../src/intakePlanDomain';
import {DemoAgentRunAdapter} from '../src/agentRunDomain';
import {DemoGalleryKnowledgeAdapter} from '../src/phase11Domain';
import {demoSprints} from '../src/sprintDomain';
import {seed,type Issue} from '../src/domain';

const values=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{value:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value)},removeItem:(key:string)=>{values.delete(key)}},configurable:true});
beforeEach(()=>values.clear());
function setup(){
 const issues=seed();let permissionRevision='demo-permission-1';
 const plans=new DemoIntakePlanAdapter(),intake=plans.list('empire')[0];
 plans.answer(intake.id,intake.questionId!,intake.version,'Checkout web and mobile','answer');
 const plan=plans.createPlan(intake.id,'plan').plan;
 const approval=plans.approve(plan.id,{planHash:plan.hash,approvedTaskIds:plan.tasks.map(task=>task.id),unknownBudgetAcknowledged:true,sourceRevisions:plan.sourceRevisions,budgetCeiling:plan.budgetCeiling,budgetCurrency:plan.budgetCurrency,budgetUnit:plan.budgetUnit,policyRevision:plan.policyRevision},plan.etag,'approve');
 plans.requestExecution(plan.id,approval.id,'execute');
 const runs=new DemoAgentRunAdapter(plans,()=>{},()=>1),agent=runs.listAgents('empire')[0];
 runs.probe('empire',agent.id,'ready',agent.version,'probe');
 const adapter=()=>new DemoPhase12Adapter({issues:()=>issues,sprints:demoSprints,runs,plans,authorizeProject:id=>{if(id!=='empire')throw new Error('Project denied')},permissionRevision:()=>permissionRevision});
 return {issues,plans,plan,approval,runs,agent,adapter,setPermission:(value:string)=>{permissionRevision=value}};
}
function accepted(x:ReturnType<typeof setup>,issueId='demo-issue-107'){
 const assigned=x.runs.assign({projectId:'empire',issueId,issueVersion:1,taskId:'task-1',planId:x.plan.id,approvalId:x.approval.id,membershipId:x.agent.id,idempotencyKey:'assign'}).run;
 const op=x.runs.start('empire',assigned.id,assigned.etag,'start');
 const running=x.runs.completeStartOperation('empire',op.id,'complete').run;
 const submission=x.runs.submit('empire',running.id,running.etag,'submit');
 x.runs.reviewDecision('empire',submission.review.id,'accepted','sara-farahani','Independent Demo acceptance',submission.review.etag,1,'review');
 return submission.artifact.id;
}
describe('Phase 12 current evidence and release boundary',()=>{
 it('reconciles report rows to filtered query and marks missing estimates and history',()=>{
  const x=setup(),d=x.adapter();const flow=d.runReport({projectId:'empire',sprintId:'sprint-12',filter:{remaining:true,blocked:true},type:'flow'});
  expect(flow.total).toBe(2);expect(flow.rows.reduce((sum,row)=>sum+(row.value??0),0)).toBe(2);
  expect(flow.rows.flatMap(row=>row.issueIds).sort()).toEqual(['demo-issue-103','demo-issue-104']);
  const sprint=d.runReport({projectId:'empire',sprintId:'sprint-12',filter:{},type:'sprint'});
  expect(sprint.total).toBe(14);expect(sprint.rows.filter(row=>row.unit==='issues').reduce((sum,row)=>sum+(row.value??0),0)).toBe(14);
  expect(sprint.rows.find(row=>row.id==='completed_points')?.value).toBeNull();expect(sprint.completeness).toBe('partial_missing_estimates');expect(sprint.history).toBe('unavailable');
 });
 it('freezes export scope and rechecks current permissions, additions, expiry and project',()=>{
  const x=setup(),d=x.adapter(),report=d.runReport({projectId:'empire',sprintId:'sprint-12',filter:{blocked:true},type:'flow'}),ticket=d.issueTicket('empire',report.id);
  expect(d.readExport(ticket).text).toContain('EMP-103');expect(d.readExport(ticket).text).toContain('EMP-104');
  expect(()=>d.readExport({...ticket,projectId:'payment'})).toThrow();
  x.issues.push({...x.issues[0],id:'new-blocked',semanticKey:'EMP-999',blocked:true,version:1} as Issue);
  expect(()=>d.readExport(ticket)).toThrow();expect(()=>d.issueTicket('empire',report.id)).toThrow();
  const clean=x.adapter(),fresh=clean.runReport({projectId:'empire',sprintId:'sprint-12',filter:{},type:'flow'}),expired=clean.issueTicket('empire',fresh.id);clean.expireTicket(expired.id);expect(()=>clean.readExport(expired)).toThrow();x.setPermission('demo-permission-2');expect(()=>clean.issueTicket('empire',fresh.id)).toThrow();
 });
 it('rejects absent prerequisites, stale scope and stale approval; queued/failed never ship',()=>{
  const x=setup(),d=x.adapter(),artifactId=accepted(x);
  const blocked=d.createRelease('empire','Blocked Demo',['demo-issue-103'],[artifactId],'create-blocked').release;
  const gates=d.previewRelease('empire',blocked.id).gates;expect(gates.find(g=>g.id==='issue_status')?.passed).toBe(false);expect(gates.find(g=>g.id==='blockers')?.passed).toBe(false);
  const release=d.createRelease('empire','Checkout Demo',['demo-issue-107'],[artifactId],'create').release;
  const preview=d.previewRelease('empire',release.id);expect(preview.gates.every(g=>g.passed)).toBe(true);
  const changed=d.updateRelease('empire',release.id,['demo-issue-108'],[artifactId],release.version,'scope');
  expect(changed.release.approval).toBeNull();expect(()=>d.approveRelease('empire',release.id,preview.id,release.version,'stale')).toThrow();
  const revised=d.updateRelease('empire',release.id,['demo-issue-107'],[artifactId],changed.release.version,'restore').release;
  const current=d.previewRelease('empire',revised.id),approval=d.approveRelease('empire',revised.id,current.id,revised.version,'approve');
  const queued=d.requestDelivery('empire',revised.id,approval.approval.id,revised.version,'deliver','failed');expect(queued.state).toBe('queued');expect(d.getRelease('empire',revised.id).status).toBe('delivery_queued');expect(d.isShipped('empire',artifactId)).toBe(false);
  expect(d.requestDelivery('empire',revised.id,approval.approval.id,revised.version,'deliver','failed').id).toBe(queued.id);
  const failed=d.resolveDelivery('empire',queued.id,'resolve');expect(failed.operation.state).toBe('failed');expect(failed.operation.receipt).toBeNull();expect(d.isShipped('empire',artifactId)).toBe(false);
  const retry=d.requestDelivery('empire',revised.id,approval.approval.id,revised.version,'retry','success');x.setPermission('demo-permission-2');const stale=d.resolveDelivery('empire',retry.id,'stale');expect(stale.operation.state).toBe('failed');expect(d.isShipped('empire',artifactId)).toBe(false);
 });
 it('invalidates a release approval when the independent review policy revision changes',()=>{
  const x=setup(),d=x.adapter(),artifactId=accepted(x),release=d.createRelease('empire','Policy-bound Demo',['demo-issue-107'],[artifactId],'create-policy').release;
  const preview=d.previewRelease('empire',release.id),approval=d.approveRelease('empire',release.id,preview.id,release.version,'approve-policy');
  x.runs.simulateReviewerPermissionLoss('empire','sara-farahani');
  expect(()=>d.requestDelivery('empire',release.id,approval.approval.id,release.version,'deliver-policy')).toThrow();
  expect(d.getRelease('empire',release.id).status).toBe('approved');expect(d.isShipped('empire',artifactId)).toBe(false);
 });
 it('ships only on valid simulated receipt and projects the Phase 10 artifact without rewriting review history',()=>{
  const x=setup(),d=x.adapter(),artifactId=accepted(x),gallery=new DemoGalleryKnowledgeAdapter(x.runs,()=>{},(projectId,id)=>d.isShipped(projectId,id));
  const release=d.createRelease('empire','Checkout Demo',['demo-issue-107'],[artifactId],'create').release;
  const preview=d.previewRelease('empire',release.id),approval=d.approveRelease('empire',release.id,preview.id,release.version,'approve');
  const queued=d.requestDelivery('empire',release.id,approval.approval.id,release.version,'deliver');expect(gallery.getGalleryItem('empire',artifactId).status).toBe('accepted');
  const completed=d.resolveDelivery('empire',queued.id,'resolve');expect(completed.operation.receipt?.outcome).toBe('applied');expect(completed.release.status).toBe('simulated_shipped');expect(gallery.getGalleryItem('empire',artifactId)).toMatchObject({status:'shipped',shipping:'simulated_shipped'});
  expect(x.runs.getReview('empire',x.runs.listReviews('empire')[0].id).history).toHaveLength(1);
  expect(d.resolveDelivery('empire',queued.id,'resolve').operation.receipt?.id).toBe(completed.operation.receipt?.id);
 });
});
