import {evaluate,users,type Issue,type UIIntent,type UIState} from './domain';
import {MockIntentAdapter,normalize} from './intent';
import type {ClarificationAnswer,ClarificationOption} from './ClarificationCard';
import type {Receipt} from './core/contracts';

export interface AIContext {projectId:string;page:UIState['composition'];query:UIState;selectionIds:string[];locale:'en'|'fa'|'ar';timezone:string;revision:number;mode:'query'|'propose'|'extract';inputRefs:{kind:'link';value:string}[]}
export interface AIQuestion {id:string;fieldPath:string;title:string;whyNeeded:string;options:ClarificationOption[];required:boolean}
export interface AIProposal {id:string;version:number;interactionId:string;interactionVersion:number;projectId:string;contextRevision:number;contextFingerprint:string;commandType:'work_item.assign'|'work_item.change_due';targets:{id:string;key:string;version:number;before:string;after:string}[];assigneeId?:string;dueDate?:string;reason:string;evidenceRefs:string[];requiredPermissions:string[];missingFields:string[];expiresAt:string;approvalRef:string|null}
export type AIOutput=
 |{kind:'answer';interactionId:string;version:number;text:string;intent:UIIntent|null;queryRunRef:string|null;count:number|null}
 |{kind:'clarifying_question';interactionId:string;version:number;questions:AIQuestion[];questionIndex:number;continuationToken:string;originalPrompt:string;scope:AIContext}
 |{kind:'insight_case';interactionId:string;version:number;observation:string;interpretation:string;hypothesis:string;evidenceRefs:string[]}
 |{kind:'action_proposal';interactionId:string;version:number;proposal:AIProposal}
 |{kind:'execution_progress';interactionId:string;version:number;text:string;completed:number;total:number}
 |{kind:'outcome_review';interactionId:string;version:number;text:string;receipts:Receipt[];failed:{key:string;reason:string}[]}
 |{kind:'unsupported_output';rawKind:string};

interface Pending {id:string;version:number;token:string;prompt:string;scope:AIContext;questions:AIQuestion[];answers:Record<string,ClarificationAnswer>;targets:Issue[];action:'assign'|'due'}
const intentAdapter=new MockIntentAdapter();
const sri=()=>crypto.randomUUID();
const validDateOnly=(value:string)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const [year,month,day]=value.split('-').map(Number);const date=new Date(Date.UTC(year,month-1,day,12));return date.getUTCFullYear()===year&&date.getUTCMonth()+1===month&&date.getUTCDate()===day};
const fingerprint=(context:AIContext)=>JSON.stringify({projectId:context.projectId,page:context.page,query:context.query,selectionIds:[...context.selectionIds].sort(),mode:context.mode,inputRefs:context.inputRefs});
const sameScope=(a:AIContext,b:AIContext)=>fingerprint(a)===fingerprint(b);
export function safeAIOutput(value:unknown):AIOutput {if(!value||typeof value!=='object')return {kind:'unsupported_output',rawKind:'missing'};const record=value as Record<string,unknown>,rawKind=String(record.kind??'missing'),kind=rawKind==='question'?'clarifying_question':rawKind==='proposed_action'?'action_proposal':rawKind;const valid=typeof record.interactionId==='string'&&typeof record.version==='number'&&(
 kind==='answer'?typeof record.text==='string':
 kind==='clarifying_question'?Array.isArray(record.questions)&&typeof record.continuationToken==='string':
 kind==='insight_case'?typeof record.observation==='string'&&typeof record.interpretation==='string'&&typeof record.hypothesis==='string':
 kind==='action_proposal'?!!record.proposal&&typeof record.proposal==='object'&&Array.isArray((record.proposal as Record<string,unknown>).targets):
 kind==='execution_progress'?typeof record.text==='string'&&typeof record.completed==='number'&&typeof record.total==='number':
 kind==='outcome_review'?typeof record.text==='string'&&Array.isArray(record.receipts)&&Array.isArray(record.failed):false);
 return valid?{...record,kind} as AIOutput:{kind:'unsupported_output',rawKind};}
export function proposalIsCurrent(proposal:AIProposal,context:AIContext,issues:Issue[],now=Date.now()){if(proposal.projectId!==context.projectId||proposal.contextRevision!==context.revision||proposal.contextFingerprint!==fingerprint(context))return 'context_changed';if(Date.parse(proposal.expiresAt)<=now)return 'expired';for(const target of proposal.targets){const issue=issues.find(item=>item.id===target.id&&item.projectId===proposal.projectId);if(!issue||issue.version!==target.version)return 'version_changed'}return null}

export class DemoAIClient {
 private pending=new Map<string,Pending>();
 private proposals=new Map<string,AIProposal>();
 revokeProject(projectId:string){for(const [id,item] of this.pending)if(item.scope.projectId===projectId)this.pending.delete(id);for(const [id,item] of this.proposals)if(item.projectId===projectId)this.proposals.delete(id)}
 async submit(prompt:string,context:AIContext,issues:Issue[]):Promise<AIOutput>{
  const p=normalize(prompt).replace(/[?؟.!]+$/,'');const id=`demo-ai-${sri()}`;
  if(/^(assign (?:the )?(?:remaining )?(?:tasks|issues|work) to sara|کارهای مانده را به سارا بسپار)$/.test(p)){
   const targets=evaluate(issues,{...context.query,filter:{...context.query.filter,remaining:true}});
   const options=users.filter(person=>person.nameEn.startsWith('Sara ')&&person.id.startsWith('u-')).map(person=>({id:person.id,label:context.locale==='fa'?person.name:person.nameEn,detail:person.id==='u-sara-moradi'?'Commerce':'Core Platform'}));
   const questions:AIQuestion[]=[{id:'assignee',fieldPath:'/assignee_membership_id',title:context.locale==='fa'?'منظورتان کدام سارا است؟':'Which Sara do you mean?',whyNeeded:context.locale==='fa'?'دو عضو نمونه با این نام مطابقت دارند.':'Two Demo members match this name.',options,required:true},{id:'reason',fieldPath:'/reason',title:context.locale==='fa'?'دلیل این تغییر چیست؟':'Why make this change?',whyNeeded:context.locale==='fa'?'این پرسش اختیاری است.':'Optional context for the proposal.',options:[],required:false}];
   const pending:Pending={id,version:1,token:`demo-cont-${sri()}`,prompt,scope:structuredClone(context),questions,answers:{},targets:targets.map(item=>({...item})),action:'assign'};this.pending.set(id,pending);
   return this.questionOutput(pending,0);
  }
  const relativeDate=p.match(/^(?:set|move) (emp-\d+) (?:due|deadline) (?:on|to) tuesday$/);if(relativeDate){const target=issues.find(issue=>issue.projectId===context.projectId&&issue.semanticKey.toLowerCase()===relativeDate[1]);if(!target)return {kind:'answer',interactionId:id,version:1,text:'That issue is not available in this project.',intent:null,queryRunRef:null,count:null};const question:AIQuestion={id:'due_date',fieldPath:'/due_date',title:context.locale==='fa'?'تاریخ دقیق موعد چیست؟':'What exact due date do you mean?',whyNeeded:context.locale==='fa'?'سه‌شنبه بدون تاریخ دقیق مبهم است. تاریخ را به‌شکل YYYY-MM-DD وارد کنید.':'Tuesday is ambiguous without a calendar date. Enter YYYY-MM-DD; no time is assumed.',options:[],required:true};const pending:Pending={id,version:1,token:`demo-cont-${sri()}`,prompt,scope:structuredClone(context),questions:[question],answers:{},targets:[{...target}],action:'due'};this.pending.set(id,pending);return this.questionOutput(pending,0)}
  if(/^(why are we behind|چرا عقب افتادیم)$/.test(p))return {kind:'insight_case',interactionId:id,version:1,observation:context.locale==='fa'?'موانع ثبت‌شده در دادهٔ نمونه دیده می‌شوند.':'Recorded blockers are visible in the Demo workset.',interpretation:context.locale==='fa'?'تأثیر بر زمان‌بندی هنوز تأیید نشده است.':'Schedule impact has not been verified.',hypothesis:context.locale==='fa'?'وابستگی‌ها ممکن است اثرگذار باشند؛ این فرضیه است.':'Dependencies may contribute; this is a hypothesis.',evidenceRefs:[]};
  const intent=/^(show them on (?:the )?calendar|آنها را در تقویم نشان بده|آن‌ها را در تقویم نشان بده)$/.test(p)?{type:'showCalendar'} as UIIntent:await intentAdapter.resolve(prompt,context.query);
  const projected=intent.type==='showIssues'?evaluate(issues,{...context.query,filter:intent.remaining?{remaining:true}:{}}).length:intent.type==='refineFilter'?evaluate(issues,{...context.query,filter:{...context.query.filter,blocked:intent.blocked}}).length:null;
  return {kind:'answer',interactionId:id,version:1,text:intent.type==='unsupported'?(context.locale==='fa'?'این فرمان در نمونه پشتیبانی نمی‌شود؛ داده‌ای تغییر نکرد.':'This Demo prompt is unsupported; no data changed.'):(context.locale==='fa'?'درخواست در فضای کار اعمال می‌شود.':'The workspace will follow this request.'),intent,queryRunRef:projected===null?null:`demo-query-${sri()}`,count:projected};
 }
 private questionOutput(item:Pending,index:number):AIOutput{return {kind:'clarifying_question',interactionId:item.id,version:item.version,questions:item.questions,questionIndex:index,continuationToken:item.token,originalPrompt:item.prompt,scope:item.scope}}
 answer(interactionId:string,token:string,version:number,questionId:string,answer:ClarificationAnswer,context:AIContext):AIOutput{
  const item=this.pending.get(interactionId);if(!item||item.token!==token||item.version!==version)throw Error('This clarification is stale. Refresh the question before continuing.');
  if(!sameScope(item.scope,context))throw Error('The project or query changed. The old answer was not applied.');
  const index=item.questions.findIndex(q=>q.id===questionId);if(index<0)throw Error('Unknown question ID.');const question=item.questions[index];
  if(answer.kind==='skip'&&question.required)throw Error('This question requires an answer.');
  if(answer.kind==='option'&&!question.options.some(option=>option.id===answer.value))throw Error('That option is no longer available.');
  if(answer.kind==='text'&&!answer.value.trim()&&question.required)throw Error('Enter an answer first.');
  if(question.id==='assignee'&&answer.kind==='text'){
   const term=normalize(answer.value);const matches=users.filter(person=>normalize(person.nameEn)===term||normalize(person.name)===term);
   if(matches.length!==1||!question.options.some(option=>option.id===matches[0].id))throw Error('Choose one listed person; the typed name is not unique.');
   answer={...answer,kind:'option',value:matches[0].id};
  }
  if(question.id==='due_date'&&(answer.kind!=='text'||!validDateOnly(answer.value)))throw Error('Enter an unambiguous date as YYYY-MM-DD. No appointment time will be inferred.');
  item.answers[questionId]={...answer,revision:item.version+1};item.version++;item.token=`demo-cont-${sri()}`;
  if(index+1<item.questions.length)return this.questionOutput(item,index+1);
  const selected=item.answers.assignee?.value,dueDate=item.answers.due_date?.value;if(item.action==='assign'&&(!selected||item.questions[0].options.every(option=>option.id!==selected)))throw Error('A valid assignee is required.');
  const proposal:AIProposal={id:`demo-proposal-${sri()}`,version:1,interactionId:item.id,interactionVersion:item.version,projectId:item.scope.projectId,contextRevision:item.scope.revision,contextFingerprint:fingerprint(item.scope),commandType:item.action==='assign'?'work_item.assign':'work_item.change_due',targets:item.targets.map(issue=>({id:issue.id,key:issue.semanticKey,version:issue.version,before:item.action==='assign'?issue.assigneeId??'':issue.dueDate??'',after:item.action==='assign'?selected!:dueDate!})),...(item.action==='assign'?{assigneeId:selected!}:{dueDate:dueDate!}),reason:item.answers.reason?.kind==='text'?item.answers.reason.value:'',evidenceRefs:[],requiredPermissions:['work_item.edit'],missingFields:[],expiresAt:new Date(Date.now()+5*60_000).toISOString(),approvalRef:null};this.proposals.set(proposal.id,proposal);return {kind:'action_proposal',interactionId:item.id,version:item.version,proposal};
 }
 back(interactionId:string,context:AIContext):AIOutput{const item=this.pending.get(interactionId);if(!item||!sameScope(item.scope,context))throw Error('The original context is no longer current.');item.version++;item.token=`demo-cont-${sri()}`;item.answers={};for(const [id,proposal] of this.proposals)if(proposal.interactionId===interactionId)this.proposals.delete(id);return this.questionOutput(item,0)}
 approve(proposal:AIProposal,context:AIContext,issues:Issue[]):AIProposal{const saved=this.proposals.get(proposal.id);if(!saved||saved.version!==proposal.version||saved.interactionVersion!==proposal.interactionVersion)throw Error('Proposal revision changed. Revalidate before applying.');const stale=proposalIsCurrent(saved,context,issues);if(stale)throw Error(stale==='expired'?'Proposal expired. Request a fresh one.':stale==='version_changed'?'A target changed. Revalidate before applying.':'The project or query changed. Request a fresh proposal.');if(saved.approvalRef)throw Error('This proposal was already approved. Check its result before retrying.');saved.approvalRef=`demo-approval-${sri()}`;return {...saved}}
}
