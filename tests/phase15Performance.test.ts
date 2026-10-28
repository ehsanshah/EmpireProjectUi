import {expect,it} from 'vitest';
import {seed} from '../src/domain';
import {DemoCoreClient} from '../src/core/demoClient';

it('bounds a 5,000-item Demo query to cursor pages while reporting the independent full count',async()=>{
 const base=seed()[0];
 const issues=Array.from({length:5000},(_,index)=>({
  ...base,id:`perf-${index+1}`,semanticKey:`PERF-${index+1}`,
  projectId:'empire',sprintId:'sprint-12',status:index%5===0?'completed' as const:'todo' as const,
  comments:[],dependencies:[],manualOrder:index+1,boardOrder:index+1,
 }));
 const core=new DemoCoreClient(issues);
 const query={projectId:'empire',sprintId:'sprint-12',filter:{remaining:true},sort:'key' as const,groupBy:'none' as const,pageSize:50};
 const start=performance.now();
 const first=await core.queryWorkItems(query);
 const firstMs=performance.now()-start;
 expect(first.meta.count).toEqual({value:4000,relation:'exact'});
 expect(first.data).toHaveLength(50);
 expect(first.meta.nextCursor).toBeTruthy();
 const pageStart=performance.now();
 const second=await core.queryWorkItems({...query,cursor:first.meta.nextCursor});
 const secondMs=performance.now()-pageStart;
 expect(second.meta.count.value).toBe(4000);
 expect(second.data).toHaveLength(50);
 expect(new Set([...first.data,...second.data].map(item=>item.id)).size).toBe(100);
 // Local timings are evidence, not a server throughput or browser virtualization claim.
 const heapUsed=(globalThis as unknown as {process:{memoryUsage():{heapUsed:number}}}).process.memoryUsage().heapUsed;
 console.info(`PHASE15_PERF ${JSON.stringify({fixture:5000,expectedRemaining:4000,pageSize:50,firstMs:Number(firstMs.toFixed(2)),secondMs:Number(secondMs.toFixed(2)),heapMiB:Number((heapUsed/1048576).toFixed(1))})}`);
});
