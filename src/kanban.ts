import {orderOf,type Area,type Issue,type Status} from './domain';

export type BoardColumn='backlog'|'todo'|'in_progress'|'review'|'done';
export const boardColumns:BoardColumn[]=['backlog','todo','in_progress','review','done'];
export const boardAreas:Area[]=['web','mobile'];
export const boardColumn=(issue:Issue):BoardColumn=>issue.status==='completed'||issue.status==='cancelled'?'done':issue.status;
export const boardOrder=(issue:Issue)=>issue.boardOrder??orderOf(issue);
export const wipCount=(issues:Issue[])=>issues.filter(issue=>issue.status==='in_progress').length;
export const boardCards=(issues:Issue[],area:Area,column:BoardColumn)=>issues.filter(issue=>issue.area===area&&boardColumn(issue)===column).sort((a,b)=>boardOrder(a)-boardOrder(b));
export type BoardMove={id:string;area:Area;column:BoardColumn;index:number};
export type BoardMoveResult={issues:Issue[];reason?:'wip'|'missing'};

export function moveBoardIssue(issues:Issue[],move:BoardMove,limit:number):BoardMoveResult {
 const source=issues.find(issue=>issue.id===move.id);
 if(!source)return {issues,reason:'missing'};
 if(move.column==='in_progress'&&source.status!=='in_progress'&&wipCount(issues)>=limit)return {issues,reason:'wip'};
 const target=boardCards(issues,move.area,move.column).filter(issue=>issue.id!==source.id);
 const index=Math.min(Math.max(0,move.index),target.length);
 const sourceCards=boardCards(issues,source.area,boardColumn(source));
 if(source.area===move.area&&boardColumn(source)===move.column&&sourceCards.findIndex(issue=>issue.id===source.id)===index)return {issues};
 const updated:Issue={...source,area:move.area,status:move.column==='done'?'completed':move.column,version:source.version+1};
 target.splice(index,0,updated);
 const rank=new Map(target.map((issue,n)=>[issue.id,n]));
 return {issues:issues.map(issue=>issue.id===source.id?{...updated,boardOrder:rank.get(issue.id)}:rank.has(issue.id)?{...issue,boardOrder:rank.get(issue.id)}:issue)};
}
