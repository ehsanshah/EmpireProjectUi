import {users,type Issue} from '../domain';
import type {CustomFieldDefinition,ProjectWorkItemSchema,WorkItemDraft} from './contracts';

export const demoWorkItemSchema:ProjectWorkItemSchema={
 revision:'demo-schema-1',
 types:[{id:'task',labelEn:'Task',labelFa:'کار'},{id:'story',labelEn:'Story',labelFa:'داستان'},{id:'bug',labelEn:'Bug',labelFa:'نقص'},{id:'epic',labelEn:'Epic',labelFa:'حماسه'}],
 priorities:[{id:'normal',labelEn:'Normal',labelFa:'عادی'},{id:'high',labelEn:'High',labelFa:'بالا'},{id:'low',labelEn:'Low',labelFa:'پایین'}],
 statuses:[{id:'backlog',labelEn:'Backlog',labelFa:'بک‌لاگ'},{id:'todo',labelEn:'To do',labelFa:'برای انجام'},{id:'in_progress',labelEn:'In progress',labelFa:'در حال انجام'},{id:'review',labelEn:'In review',labelFa:'در بازبینی'},{id:'completed',labelEn:'Completed',labelFa:'تکمیل‌شده'},{id:'cancelled',labelEn:'Cancelled',labelFa:'لغوشده'}],
 components:[{id:'checkout',labelEn:'Checkout',labelFa:'پرداخت'},{id:'mobile',labelEn:'Mobile',labelFa:'موبایل'}],
 labels:[{id:'payments',labelEn:'Payments',labelFa:'پرداخت‌ها'},{id:'ux',labelEn:'UX',labelFa:'تجربه کاربری'},{id:'risk',labelEn:'Risk',labelFa:'ریسک'}],
 customFields:[{id:'cf-customer-impact',key:'customerImpact',kind:'enum',required:false,editable:true,labelEn:'Customer impact',labelFa:'اثر بر مشتری',options:[{id:'low',labelEn:'Low',labelFa:'کم'},{id:'medium',labelEn:'Medium',labelFa:'متوسط'},{id:'high',labelEn:'High',labelFa:'زیاد'}]},{id:'cf-risk-score',key:'riskScore',kind:'number',required:false,editable:true,labelEn:'Risk score',labelFa:'امتیاز ریسک',min:0,max:5},{id:'cf-external-ref',key:'externalRef',kind:'text',required:false,editable:true,labelEn:'External reference',labelFa:'مرجع بیرونی',maxLength:80}],
 allowedActions:['edit','comment','link','worklog','archive','restore','clone','move']
};
export const permittedAssignees=()=>[...users.map(user=>user.id),'agent-hermes'];
export function draftFromIssue(issue:Issue):WorkItemDraft{return {summary:issue.titleEn||issue.title,description:issue.descriptionEn||issue.description,typeId:issue.typeId??'task',priorityId:issue.priority,assigneeId:issue.assigneeId,parentId:issue.parentId??null,startDate:issue.startDate,dueDate:issue.dueDate,estimate:issue.estimate??null,labels:[...(issue.labels??[])],componentIds:[...(issue.componentIds??[])],customData:structuredClone(issue.customData??{})}}
export function validateDraft(draft:WorkItemDraft,schema:ProjectWorkItemSchema,issues:Issue[],issueId?:string):Record<string,string>{
 const errors:Record<string,string>={};const title=draft.summary.trim();if(!title)errors.summary='A summary is required.';else if(title.length>180)errors.summary='Use at most 180 characters.';
 if(draft.description.length>5000)errors.description='Use at most 5,000 characters.';
 if(!schema.types.some(choice=>choice.id===draft.typeId))errors.typeId='Choose a schema issue type.';
 if(!schema.priorities.some(choice=>choice.id===draft.priorityId))errors.priorityId='Choose a schema priority.';
 if(draft.assigneeId&&!permittedAssignees().includes(draft.assigneeId))errors.assigneeId='Choose an available member or Demo agent.';
 if(draft.parentId){const parent=issues.find(issue=>issue.id===draft.parentId&&!issue.archived);if(!parent)errors.parentId='Choose an available parent in this project.';else if(parent.id===issueId)errors.parentId='An issue cannot be its own parent.';else{let current=parent;const visited=new Set([issueId]);while(current.parentId){if(visited.has(current.parentId)){errors.parentId='The hierarchy would contain a cycle.';break}visited.add(current.id);const next=issues.find(issue=>issue.id===current.parentId);if(!next)break;current=next}}}
 for(const field of ['startDate','dueDate'] as const){const value=draft[field];if(value&&!/^\d{4}-\d{2}-\d{2}$/.test(value))errors[field]='Use a date-only YYYY-MM-DD value.'}
 if(draft.startDate&&draft.dueDate&&draft.startDate>draft.dueDate)errors.dueDate='Due date must be on or after start date.';
 if(draft.estimate&&(!Number.isFinite(draft.estimate.value)||draft.estimate.value<0||!['points','hours'].includes(draft.estimate.unit)))errors.estimate='Enter a non-negative estimate with a unit.';
 for(const id of draft.labels)if(!schema.labels.some(choice=>choice.id===id))errors.labels='Choose schema labels.';
 for(const id of draft.componentIds)if(!schema.components.some(choice=>choice.id===id))errors.componentIds='Choose schema components.';
 for(const field of schema.customFields){const value=draft.customData[field.key];const issueKey=`customData.${field.key}`;if((value===undefined||value===null||value==='')&&!field.required)continue;if(field.required&&(value===undefined||value===null||value==='')){errors[issueKey]='This custom field is required.';continue}if(!validCustom(value,field))errors[issueKey]='Value does not match the project field schema.'}
 return errors;
}
function validCustom(value:unknown,field:CustomFieldDefinition){if(field.kind==='text')return typeof value==='string'&&(!field.maxLength||value.length<=field.maxLength);if(field.kind==='number')return typeof value==='number'&&Number.isFinite(value)&&(field.min===undefined||value>=field.min)&&(field.max===undefined||value<=field.max);if(field.kind==='boolean')return typeof value==='boolean';return typeof value==='string'&&!!field.options?.some(option=>option.id===value)}
