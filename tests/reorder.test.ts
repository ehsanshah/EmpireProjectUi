import {it,expect} from 'vitest';
import {seed,reorderIssues,evaluate,initialState} from '../src/domain';
it('moves within visible slots while preserving hidden issues and other fields',()=>{
 const items=seed();const visible=[items[0].id,items[2].id,items[3].id];
 const next=reorderIssues(items,visible,items[3].id,items[0].id,'before');
 const ordered=evaluate(next,initialState);
 expect(ordered.slice(0,5).map(i=>i.semanticKey)).toEqual(['EMP-104','EMP-102','EMP-101','EMP-103','EMP-105']);
 next.forEach((i,n)=>{const {manualOrder,...data}=i;expect(data).toEqual(items[n]);});
 expect(items[0].manualOrder).toBeUndefined();
});
it('handles downward drops, no-op and foreign targets',()=>{
 const items=seed();const ids=items.map(i=>i.id);
 expect(evaluate(reorderIssues(items,ids,ids[0],ids[2],'after'),initialState).slice(0,3).map(i=>i.semanticKey)).toEqual(['EMP-102','EMP-103','EMP-101']);
 expect(reorderIssues(items,ids,ids[0],ids[0],'before')).toBe(items);
 expect(reorderIssues(items,[ids[0]],ids[0],ids[2],'before')).toBe(items);
});
