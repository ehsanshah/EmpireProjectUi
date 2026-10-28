import {describe,it,expect} from 'vitest';
import current from '../fixtures/sprint12.json';
import historical from '../fixtures/sprint12-historical-acceptance.json';

const summary=(issues:typeof current.issues)=>{
 const remaining=issues.filter(issue=>!['completed','cancelled'].includes(issue.status));
 return {total:issues.length,remaining:remaining.length,blockedRemaining:remaining.filter(issue=>issue.blocked).length};
};

describe('review fixtures',()=>{
 it('keeps the running Demo and historical acceptance scenario separate',()=>{
  expect(summary(current.issues)).toEqual({total:14,remaining:8,blockedRemaining:2});
  expect(summary(historical.issues)).toEqual({total:12,remaining:6,blockedRemaining:2});
  expect(historical.fixturePurpose).toContain('Historical Stage 1');
  expect(current.issues.map(issue=>issue.semanticKey)).toEqual(expect.arrayContaining(historical.issues.map(issue=>issue.semanticKey)));
  expect(current.expected.total).toBe(current.issues.length);
  expect(current.expected.remaining).toBe(summary(current.issues).remaining);
  expect(historical.expected.total).toBe(historical.issues.length);
 });
});
