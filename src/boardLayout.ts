import {boardOrder,type BoardColumn} from './kanban';
import type {Area,Issue,Status} from './domain';
import type {BoardWorkflow} from './core/contracts';

export function columnForStatus(workflow:BoardWorkflow,status:Status):BoardColumn|null {
 return (workflow.columns.find(column=>column.statusIds.includes(status))?.id as BoardColumn|undefined)??null;
}
export function targetStatus(workflow:BoardWorkflow,columnId:string):Status|null {
 return workflow.columns.find(column=>column.id===columnId)?.statusIds[0]??null;
}
export function cardsInColumn(issues:Issue[],area:Area,columnId:string,workflow:BoardWorkflow):Issue[] {
 return issues.filter(issue=>!issue.archived&&issue.area===area&&columnForStatus(workflow,issue.status)===columnId)
  .sort((a,b)=>boardOrder(a)-boardOrder(b)||a.id.localeCompare(b.id));
}
export function wipStatuses(workflow:BoardWorkflow):Status[] {
 return workflow.columns.find(column=>column.id===workflow.wip.columnId)?.statusIds??[];
}
export function fullScopeWip(issues:Issue[],workflow:BoardWorkflow):number {
 const statuses=new Set(wipStatuses(workflow));
 return issues.filter(issue=>!issue.archived&&statuses.has(issue.status)).length;
}
