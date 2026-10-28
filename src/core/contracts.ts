import type {Area,Issue,Status,UIState} from '../domain';
import type {Project,ProjectCreateInput} from '../projects';
import type {ScheduleBlock} from '../calendarDomain';
import type {SprintAction,SprintActionPreview,SprintFit,SprintPlanningSnapshot,SprintRankCommand,SprintPlan} from '../sprintDomain';

export type CoreMode='demo'|'live';
export type WriteSource='manual'|'board'|'voice'|'ai';
export interface Session {userId:string;orgId:string;locale:string;timezone:string;csrfToken:string;expiresAt:string;mode:CoreMode}
export interface Capabilities {schemaRevision:string;permissionRevision:string;transitions:boolean;activity:boolean;events:boolean;maxPageSize:number;savedViews?:boolean;bulk?:boolean;workItemSchema?:boolean}
export interface Count {value:number;relation:'exact'|'estimated'|'unknown'}
export interface ReadMeta {requestId:string;asOf:string;snapshotId:string;permissionRevision:string;watermark:string;count:Count;nextCursor:string|null}
export interface ReadEnvelope<T> {data:T;meta:ReadMeta}
export interface WorkItem {id:string;key:string;projectId:string;statusId:Status;summary:string;version:number;etag:string;allowedTransitionIds:string[];source:Issue}
export interface TransitionCommand {orgId:string;projectId:string;issueId:string;transitionId:string;fields:Record<string,unknown>;ifMatch:string;idempotencyKey:string;csrfToken:string;source:WriteSource;simulate?:'async'|'outcome_unknown'}
export interface Receipt {id:string;commandId:string;outcome:'applied';resourceId:string;resourceVersion:number;auditRef:string;idempotencyKey:string;mode:CoreMode}
export interface ActivityEntry {id:string;issueId:string;projectId:string;actorId:string;at:string;before:Status;after:Status;receiptId:string;source:WriteSource;resourceVersion?:number;summary?:string}
export interface Operation {id:string;state:'queued'|'running'|'succeeded'|'failed';receipt?:Receipt;resultRef?:string}
export type TransitionResponse={kind:'applied';item:WorkItem;receipt:Receipt}|{kind:'accepted';operation:Operation};
export interface ProblemDetails {type:string;title:string;status:number;code:string;detail:string;currentVersion?:number;fieldErrors?:{path:string;code:string;message:string}[]}
export class CoreProblem extends Error {constructor(public problem:ProblemDetails){super(problem.detail)}}
export class OutcomeUnknown extends Error {constructor(public key:string){super('The command outcome is unknown; reconcile by idempotency key.')}}
export interface CoreEvent {cursor:string;eventId:string;eventType:'WorkItemUpdated'|'PermissionChanged'|'stream_reset';schemaVersion:1;orgId:string;projectId:string;aggregateId:string;aggregateVersion:number;permissionRevision:string;correlationId:string}
export interface CoreBootstrap {session:Session;capabilities:Capabilities;projects:Project[]}
export interface SchemaChoice {id:string;labelEn:string;labelFa:string}
export interface CustomFieldDefinition extends SchemaChoice {key:string;kind:'text'|'number'|'boolean'|'enum';required:boolean;editable:boolean;options?:SchemaChoice[];maxLength?:number;min?:number;max?:number}
export interface ProjectWorkItemSchema {revision:string;types:SchemaChoice[];priorities:SchemaChoice[];statuses:SchemaChoice[];components:SchemaChoice[];labels:SchemaChoice[];customFields:CustomFieldDefinition[];allowedActions:('edit'|'comment'|'link'|'worklog'|'archive'|'restore'|'clone'|'move')[]}
export interface WorkItemQuery {projectId:string;sprintId:string;filter:UIState['filter'];sort:UIState['sort'];groupBy:UIState['groupBy'];pageSize:number;cursor?:string|null}
export interface WorkItemDraft {summary:string;description:string;typeId:string;priorityId:string;assigneeId:string;parentId:string|null;startDate:string|null;dueDate:string|null;estimate:{value:number;unit:'points'|'hours'}|null;labels:string[];componentIds:string[];customData:Record<string,unknown>}
export interface WorkItemWrite {orgId:string;projectId:string;issueId?:string;draft:WorkItemDraft;ifMatch?:string;schemaRevision:string;idempotencyKey:string;csrfToken:string;source:WriteSource}
export interface WorkItemWriteResult {item:WorkItem;receipt:Receipt}
export interface SavedWorkView {id:string;projectId:string;name:string;visibility:'personal'|'shared';query:Omit<WorkItemQuery,'cursor'|'pageSize'>;columns:string[];revision:number}
export interface SelectionToken {token:string;projectId:string;snapshotId:string;count:Count;expiresAt:string}
export type BulkTarget={kind:'visible_ids';items:{id:string;version:number}[]}|{kind:'snapshot_token';token:string};
export interface BulkPreview {id:string;projectId:string;target:BulkTarget;transitionId:string;count:Count;items:{id:string;key:string;status:'ready'|'blocked';reason?:string;version:number}[];expiresAt:string}
export interface BulkResult {previewId:string;items:{id:string;outcome:'applied'|'failed';receipt?:Receipt;problem?:ProblemDetails}[]}
export type SensitiveAction='archive'|'restore'|'clone'|'move';
export interface ActionPreview {id:string;action:SensitiveAction;projectId:string;issueId:string;targetProjectId?:string;version:number;summary:string;expiresAt:string}
export interface WorkItemEntryCommand {orgId:string;projectId:string;issueId:string;kind:'comment'|'link'|'worklog';text:string;targetId?:string;minutes?:number;ifMatch:string;idempotencyKey:string;csrfToken:string}
export interface BoardWorkflow {revision:string;columns:{id:string;labelEn:string;labelFa:string;statusIds:Status[]}[];swimlanes:{id:Area;labelEn:string;labelFa:string}[];wip:{columnId:string;limit:number;scope:'project_all_lanes_all_filters';current:number}}
export interface BoardSnapshot {workflow:BoardWorkflow;rankRevision:number;count:Count}
export interface BoardPlacement {orgId:string;projectId:string;issueId:string;targetColumnId:string;targetArea:Area;beforeId:string|null;afterId:string|null;ifMatch:string;rankRevision:number;fields:Record<string,unknown>;idempotencyKey:string;csrfToken:string;source:'board'}
export interface BoardPlacementResult {item:WorkItem;receipt:Receipt;rankRevision:number}
export interface SchedulePreview {id:string;projectId:string;issueId:string;blockId:string;previousVersion:number|null;next:ScheduleBlock|null;deadline:string|null;summary:string;expiresAt:string}
export interface ScheduleResult {blocks:ScheduleBlock[];receipt:Receipt}
export interface CoreClient {
 readonly mode:CoreMode;
 bootstrap():Promise<CoreBootstrap>;
 createProject(input:ProjectCreateInput,key:string):Promise<{project:Project;receipt:Receipt}>;
 getWorkItemSchema(projectId:string):Promise<ProjectWorkItemSchema>;
 queryWorkItems(query:WorkItemQuery):Promise<ReadEnvelope<WorkItem[]>>;
 resolveWorkItemKey(projectId:string,key:string):Promise<WorkItem|null>;
 writeWorkItem(command:WorkItemWrite):Promise<WorkItemWriteResult>;
 listSavedViews(projectId:string):Promise<SavedWorkView[]>;
 saveView(view:Omit<SavedWorkView,'id'|'revision'>,key:string):Promise<{view:SavedWorkView;receipt:Receipt}>;
 selectionToken(query:Omit<WorkItemQuery,'cursor'>):Promise<SelectionToken>;
 previewBulk(projectId:string,target:BulkTarget,transitionId:string):Promise<BulkPreview>;
 applyBulk(preview:BulkPreview,key:string,csrfToken:string):Promise<BulkResult>;
 previewAction(projectId:string,issueId:string,action:SensitiveAction,targetProjectId?:string):Promise<ActionPreview>;
 applyAction(preview:ActionPreview,key:string,ifMatch:string,csrfToken:string):Promise<WorkItemWriteResult>;
 appendWorkItemEntry(command:WorkItemEntryCommand):Promise<WorkItemWriteResult>;
 getBoardSnapshot(projectId:string):Promise<BoardSnapshot>;
 placeBoardCard(command:BoardPlacement):Promise<BoardPlacementResult>;
 getScheduleBlocks(projectId:string):Promise<ScheduleBlock[]>;
 previewSchedule(projectId:string,issueId:string,blockId:string,next:ScheduleBlock|null,previousVersion:number|null):Promise<SchedulePreview>;
 applySchedule(preview:SchedulePreview,idempotencyKey:string,csrfToken:string):Promise<ScheduleResult>;
 getSprintPlanning(projectId:string):Promise<SprintPlanningSnapshot>;
 simulateSprintFit(projectId:string,sprintId:string):Promise<SprintFit>;
 previewSprintAction(projectId:string,sprintId:string,action:SprintAction,input:Partial<SprintActionPreview>):Promise<SprintActionPreview>;
 applySprintAction(preview:SprintActionPreview,idempotencyKey:string,csrfToken:string):Promise<{sprint:SprintPlan;receipt:Receipt;operation:Operation|null}>;
 rankBacklog(command:SprintRankCommand):Promise<{rankRevision:number;receipt:Receipt}>;
 listWorkItems(projectId:string):Promise<ReadEnvelope<WorkItem[]>>;
 getWorkItem(projectId:string,issueId:string):Promise<WorkItem>;
 listActivity(projectId:string,issueId:string):Promise<ActivityEntry[]>;
 transition(command:TransitionCommand):Promise<TransitionResponse>;
 operation(projectId:string,operationId:string):Promise<Operation>;
 commandByKey(projectId:string,key:string):Promise<Receipt|null>;
 subscribe(projectId:string,listener:(event:CoreEvent)=>void):()=>void;
}
