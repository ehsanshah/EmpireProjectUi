import type {CoreEvent} from './contracts';

export type EventDecision='duplicate'|'ignored'|'invalidate'|'refetch'|'reset'|'purge';
/** SSE metadata is an invalidation signal. It never turns a command into success. */
export class ScopedEventReducer {
 private seen=new Set<string>();private versions=new Map<string,number>();private permissionRevision:string;
 constructor(private orgId:string,private projectId:string,permissionRevision:string){this.permissionRevision=permissionRevision}
 seed(issueId:string,version:number){this.versions.set(issueId,version)}
 accept(event:CoreEvent):EventDecision{
  if(event.orgId!==this.orgId||event.projectId!==this.projectId)return 'ignored';
  if(event.eventType==='stream_reset'){this.seen.clear();this.versions.clear();return 'reset'}
  if(event.permissionRevision!==this.permissionRevision||event.eventType==='PermissionChanged'){this.permissionRevision=event.permissionRevision;this.seen.clear();this.versions.clear();return 'purge'}
  if(this.seen.has(event.eventId))return 'duplicate';this.seen.add(event.eventId);
  if(this.seen.size>500)this.seen.delete(this.seen.values().next().value!);
  const previous=this.versions.get(event.aggregateId);
  if(previous!==undefined&&event.aggregateVersion<=previous)return 'ignored';
  this.versions.set(event.aggregateId,event.aggregateVersion);
  return previous!==undefined&&event.aggregateVersion>previous+1?'refetch':'invalidate';
 }
}
