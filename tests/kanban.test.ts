import {describe,it,expect} from 'vitest';
import {seed} from '../src/domain';
import {boardCards,boardColumn,moveBoardIssue,wipCount} from '../src/kanban';
import {appendImportedCards,parseCardFile} from '../src/kanbanImport';

describe('one-board Kanban rules',()=>{
 it('starts at 3/4 and rejects the fifth card across swimlanes without changing data',()=>{const issues=seed();expect(wipCount(issues)).toBe(3);const fourth=moveBoardIssue(issues,{id:'demo-issue-102',area:'web',column:'in_progress',index:1},4);expect(wipCount(fourth.issues)).toBe(4);const fifth=moveBoardIssue(fourth.issues,{id:'demo-issue-106',area:'mobile',column:'in_progress',index:1},4);expect(fifth.reason).toBe('wip');expect(fifth.issues).toBe(fourth.issues);expect(boardColumn(fifth.issues.find(i=>i.id==='demo-issue-106')!)).toBe('todo')});
 it('reorders inside a column and moves one issue to another swimlane',()=>{const original=seed();const reorder=moveBoardIssue(original,{id:'demo-issue-104',area:'web',column:'todo',index:0},4).issues;expect(boardCards(reorder,'web','todo').map(i=>i.semanticKey)).toEqual(['EMP-104','EMP-102']);const moved=moveBoardIssue(reorder,{id:'demo-issue-104',area:'mobile',column:'todo',index:0},4).issues;expect(boardCards(moved,'mobile','todo')[0].semanticKey).toBe('EMP-104');expect(moved.filter(i=>i.id==='demo-issue-104')).toHaveLength(1);expect(moved.find(i=>i.id==='demo-issue-102')?.area).toBe('web')});
 it('parses uploads and applies WIP before importing any card',()=>{const cards=parseCardFile('title,area,status,priority\n"Retry, then pay",mobile,todo,high','cards.csv');expect(cards[0].title).toBe('Retry, then pay');const next=appendImportedCards(seed(),cards,4);expect(next.at(-1)?.area).toBe('mobile');expect(next.at(-1)?.semanticKey).toBe('EMP-115');const inProgress=parseCardFile('[{"title":"One","status":"in_progress"},{"title":"Two","status":"in_progress"}]','cards.json');expect(()=>appendImportedCards(seed(),inProgress,4)).toThrow('WIP limit reached')});
});
