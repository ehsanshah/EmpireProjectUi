import {it,expect} from 'vitest';
import {initialState} from '../src/domain';
import {routeForState,stateFromRoute} from '../src/routes';

it('round-trips only known Demo project routes and keeps unrelated query preferences',()=>{
 const url=routeForState({...initialState,projectId:'payment',view:'board'},'?design=glass');
 expect(url).toBe('/o/demo/p/payment/work?design=glass&view=board');
 expect(stateFromRoute('/o/demo/p/payment/work','?view=board',['empire','payment'])).toMatchObject({projectId:'payment',composition:'work',view:'board'});
 expect(stateFromRoute('/o/demo/p/secret/work','?view=list',['empire','payment'])).toBeNull();
});
it('routes People and Settings to their own versioned admin sections',()=>{
 const path=routeForState({...initialState,projectId:'empire',composition:'settings',adminTab:'workflow'},'?design=current');
 expect(path).toBe('/o/demo/p/empire/settings?design=current&section=workflow');
 expect(stateFromRoute('/o/demo/p/empire/settings','?design=current',['empire'])).toMatchObject({composition:'settings',adminTab:'settings'});
 expect(stateFromRoute('/o/demo/p/empire/people','?design=current&section=connections',['empire'])).toMatchObject({composition:'people',adminTab:'connections'});
});
