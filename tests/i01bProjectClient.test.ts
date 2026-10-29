import {describe,expect,it,vi} from 'vitest';
import {ProjectBootstrapClient,createProjectBootstrapClient,mapAuthorizedProject,mapProjectPage} from '../src/core/i01bProjectClient';

const session={user_id:'u1',org_id:'o1',locale:'en',timezone:'UTC',csrf_token:'csrf-fixture',expires_at:'2099-10-29T13:00:00Z'};
function project(id:string){return {id,org_id:'o1',resource_type:'project',resource_ref:`emp://org/o1/project/${id}@2`,key:id.toUpperCase(),name:`Project ${id}`,method:'scrum',timezone:'UTC',state:'active',version:2,permission_revision:3,owner_principal_id:'u1',allowed_actions:['project.view']}}
function response(body:unknown,status=200,headers:Record<string,string>={}){return new Response(JSON.stringify(body),{status,headers})}
const page1={data:[project('p1')],meta:{request_id:'r1',as_of:'2026-10-29T12:00:00Z',count:{value:2,relation:'exact'},next_cursor:'next1'}};
const page2={data:[project('p2')],meta:{request_id:'r2',as_of:'2026-10-29T12:00:00Z',count:{value:2,relation:'exact'},next_cursor:null}};
function detail(id:string){return {data:project(id),meta:{request_id:'r3',as_of:'2026-10-29T12:00:00Z',permission_revision:'grant-3'}}}

describe('I01-B project-only browser binding (fixture responses, no Engine server)',()=>{
 it('is disabled by default independently of the Demo client',()=>{expect(()=>createProjectBootstrapClient()).toThrow('disabled by default')});
 it('validates canonical project scope and does not infer permissions from names',()=>{
  expect(mapAuthorizedProject(project('p1'),'o1').allowedActions).toEqual(['project.view']);
  expect(()=>mapAuthorizedProject({...project('p1'),org_id:'o2'},'o1')).toThrow('scope mismatch');
  expect(()=>mapProjectPage({...page1,meta:{...page1.meta,count:{value:0,relation:'exact'}}},'o1')).toThrow('count');
 });
 it('keeps authoritative count and cursor across pages, and returns detail ETag',async()=>{
  const fetcher=vi.fn(async (input:RequestInfo|URL)=>{
   const path=String(input);
   if(path==='/api/session')return response(session);
   if(path.includes('cursor=next1'))return response(page2);
   if(path.endsWith('/projects/p1'))return response(detail('p1'),200,{ETag:'"p1:2"'});
   return response(page1);
  }) as unknown as typeof fetch;
  const client=new ProjectBootstrapClient(fetcher);await client.bootstrap();
  expect(client.snapshot().page?.count.value).toBe(2);expect(client.snapshot().projects.map(p=>p.id)).toEqual(['p1']);
  await client.nextPage();expect(client.snapshot().projects.map(p=>p.id)).toEqual(['p1','p2']);expect(client.snapshot().page?.nextCursor).toBeNull();
  expect(await client.switchProject('p1')).toBe(true);expect(client.snapshot().active?.etag).toBe('"p1:2"');
 });
 it('ignores a delayed prior-project response after switching',async()=>{
  let finish!:()=>void;const delayed=new Promise<Response>(resolve=>{finish=()=>resolve(response(detail('p1'),200,{ETag:'"p1:2"'}))});
  const fetcher=vi.fn((input:RequestInfo|URL)=>{const path=String(input);if(path==='/api/session')return Promise.resolve(response(session));if(path.includes('/projects/p1'))return delayed;if(path.includes('/projects/p2'))return Promise.resolve(response(detail('p2'),200,{ETag:'"p2:2"'}));return Promise.resolve(response(page1))}) as unknown as typeof fetch;
  const client=new ProjectBootstrapClient(fetcher);await client.bootstrap();const old=client.switchProject('p1');await client.switchProject('p2');finish();await old;
  expect(client.snapshot().active?.id).toBe('p2');
 });
 it('does not let a stale 401 purge a newer authorized project',async()=>{
  let finish!:()=>void;const delayed=new Promise<Response>(resolve=>{finish=()=>resolve(response({code:'SESSION_EXPIRED'},401))});
  const fetcher=vi.fn((input:RequestInfo|URL)=>{const path=String(input);if(path==='/api/session')return Promise.resolve(response(session));if(path.includes('/projects/p1'))return delayed;if(path.includes('/projects/p2'))return Promise.resolve(response(detail('p2'),200,{ETag:'"p2:2"'}));return Promise.resolve(response(page1))}) as unknown as typeof fetch;
  const client=new ProjectBootstrapClient(fetcher);await client.bootstrap();const old=client.switchProject('p1');await client.switchProject('p2');finish();await old;
  expect(client.snapshot().session?.orgId).toBe('o1');expect(client.snapshot().active?.id).toBe('p2');client.clear();
 });
 it('clears scoped state on session expiry, logout and rejected logout',async()=>{
  let expired=false,logoutStatus=204;
  const fetcher=vi.fn(async (input:RequestInfo|URL,init?:RequestInit)=>{const path=String(input);if(path==='/api/session')return response(session);if(path.endsWith('/logout'))return new Response(null,{status:logoutStatus});if(expired)return response({code:'SESSION_EXPIRED'},401);if(path.endsWith('/projects/p1'))return response(detail('p1'),200,{ETag:'"p1:2"'});return response(page1)}) as unknown as typeof fetch;
  const client=new ProjectBootstrapClient(fetcher);await client.bootstrap();await client.switchProject('p1');expired=true;expect(await client.switchProject('p2')).toBe(false);expect(client.snapshot().session).toBeNull();expect(client.snapshot().active).toBeNull();
  expired=false;await client.bootstrap();await client.logout();expect(client.snapshot().projects).toEqual([]);expect(client.snapshot().session).toBeNull();
  await client.bootstrap();logoutStatus=403;await expect(client.logout()).rejects.toThrow('not confirmed');expect(client.snapshot().session).toBeNull();
 });
 it('never substitutes Demo records after an upstream denial',async()=>{
  const fetcher=vi.fn(async(input:RequestInfo|URL)=>String(input)==='/api/session'?response(session):response({code:'ENGINE_UNAVAILABLE'},503)) as unknown as typeof fetch;
  const client=new ProjectBootstrapClient(fetcher);await client.bootstrap();expect(client.snapshot().projects).toEqual([]);expect(client.snapshot().error).toContain('503');
 });
 it('purges already loaded project data after an upstream authorization outage',async()=>{
  let fail=false;const fetcher=vi.fn(async(input:RequestInfo|URL)=>{const path=String(input);if(path==='/api/session')return response(session);if(fail)return response({code:'ENGINE_AUTH_OR_SERVICE_UNAVAILABLE'},503);return response(page1)}) as unknown as typeof fetch;
  const client=new ProjectBootstrapClient(fetcher);await client.bootstrap();expect(client.snapshot().projects).toHaveLength(1);fail=true;await client.nextPage();expect(client.snapshot().projects).toEqual([]);expect(client.snapshot().session).toBeNull();
 });
 it('clears project scope when the browser session reaches its expiry',async()=>{
  vi.useFakeTimers();vi.setSystemTime(new Date('2030-01-01T00:00:00Z'));
  try{const short={...session,expires_at:'2030-01-01T00:00:01Z'};const fetcher=vi.fn(async(input:RequestInfo|URL)=>String(input)==='/api/session'?response(short):response(page1)) as unknown as typeof fetch;
   const client=new ProjectBootstrapClient(fetcher);await client.bootstrap();expect(client.snapshot().projects).toHaveLength(1);
   await vi.advanceTimersByTimeAsync(1000);expect(client.snapshot().session).toBeNull();expect(client.snapshot().projects).toEqual([]);expect(client.snapshot().error).toContain('expired');
  }finally{vi.useRealTimers()}
 });
 it('clears the old organization before delayed new-scope bootstrap resolves',async()=>{
  let second=false,finish!:()=>void;
  const newPage={data:[{...project('q1'),org_id:'o2',resource_ref:'emp://org/o2/project/q1@2'}],meta:{...page1.meta,count:{value:1,relation:'exact'},next_cursor:null}};
  const delayed=new Promise<Response>(resolve=>{finish=()=>resolve(response(newPage))});
  const fetcher=vi.fn((input:RequestInfo|URL)=>{const path=String(input);if(path==='/api/session')return Promise.resolve(response(second?{...session,org_id:'o2'}:session));if(path.includes('/orgs/o2/'))return delayed;return Promise.resolve(response(page1))}) as unknown as typeof fetch;
  const client=new ProjectBootstrapClient(fetcher);await client.bootstrap();expect(client.snapshot().projects[0].id).toBe('p1');
  second=true;const pending=client.bootstrap();expect(client.snapshot().projects).toEqual([]);expect(client.snapshot().session).toBeNull();finish();await pending;
  expect(client.snapshot().session?.orgId).toBe('o2');expect(client.snapshot().projects.map(p=>p.id)).toEqual(['q1']);client.clear();
 });
});
