import {demoLeads,demoTeams,type Project,type ProjectCreateInput,type ProjectOption} from './projects';
import {normalize} from './intent';
export type ProjectField=Exclude<keyof ProjectCreateInput,'ownerId'>;
export type Resolution='resolved'|'ambiguous'|'missing'|'invalid';
export interface FieldProposal {field:ProjectField;value:string;excerpt:string;resolution:Resolution;entityId?:string;choices?:ProjectOption[]}
export interface Extraction {proposals:FieldProposal[];submitWhenComplete:boolean}
export interface FormState {values:ProjectCreateInput;revisions:Record<ProjectField,number>}
export interface VoiceUndo {before:Partial<ProjectCreateInput>;appliedRevisions:Partial<Record<ProjectField,number>>}
export const emptyProjectForm=():FormState=>({values:{name:'',key:'',description:'',teamId:'',leadId:''},revisions:{name:0,key:0,description:0,teamId:0,leadId:0}});
const fields:ProjectField[]=['name','key','description','teamId','leadId'];
const clean=(s:string)=>s.trim().replace(/^["'«]+|["'».،]+$/g,'').trim();
const equivalent=(s:string)=>normalize(s).replace(/[.,،؛]/g,'').trim();
function optionsFor(term:string,options:ProjectOption[]){const q=equivalent(term);return options.filter(o=>[o.name,o.nameFa].some(n=>equivalent(n)===q||equivalent(n).startsWith(`${q} `)))}
function entity(field:'teamId'|'leadId',term:string,excerpt:string):FieldProposal{const choices=optionsFor(term,field==='teamId'?demoTeams:demoLeads);return choices.length===1?{field,value:choices[0].id,entityId:choices[0].id,excerpt,resolution:'resolved'}:choices.length>1?{field,value:term,excerpt,resolution:'ambiguous',choices}:{field,value:term,excerpt,resolution:'invalid'}}
function first(text:string,patterns:RegExp[]){for(const pattern of patterns){const match=text.match(pattern);if(match?.[1])return {value:clean(match[1]),excerpt:match[0]}}return null}
export function extractProjectFields(transcript:string):Extraction{
 const text=transcript.trim();const found=new Map<ProjectField,FieldProposal>();
 const name=first(text,[/\b(?:actually,?\s*)?(?:change the name to|rename it to|call it|project called|name (?:it|the project) (?:to|as))\s+(.+?)(?=\s+(?:for|with|key|and use)\b|[,.;!?]|$)/i,/(?:نام(?: پروژه)?|اسم(?:ش| پروژه)?)\s*(?:را)?\s*(.+?)\s*(?:بگذار|بذار|کن|باشه|باشد|است)(?=[،,.]|$)/u]);
 if(name)found.set('name',{field:'name',value:name.value,excerpt:name.excerpt,resolution:name.value?'resolved':'invalid'});
 const key=first(text,[/\bkey\s+(?:is\s+)?([A-Z][A-Z0-9]{1,10})\b/i,/\buse\s+([A-Z][A-Z0-9]{1,10})\s+as\s+the\s+key\b/i,/(?:کلید|کد پروژه)\s*([A-Za-z0-9]{2,10})/u]);
 if(key)found.set('key',{field:'key',value:key.value.toUpperCase(),excerpt:key.excerpt,resolution:/^[A-Z][A-Z0-9]{1,7}$/.test(key.value.toUpperCase())?'resolved':'invalid'});
 const team=first(text,[/\b(?:use|for|with)\s+(?:the\s+)?(.+?)\s+team\b/i,/\bteam\s+(?:is\s+)?(.+?)(?=[,.;!?]|$)/i,/(?:تیم)\s+(.+?)(?=[،,.]|$)/u]);
 if(team)found.set('teamId',entity('teamId',team.value,team.excerpt));
 const lead=first(text,[/\b(?:assign it to|project lead is|lead is|lead)\s+(.+?)(?=[,.;!?]|$)/i,/(?:مسئول پروژه|رهبر پروژه)\s+(.+?)(?=[،,.]|$)/u]);
 if(lead)found.set('leadId',entity('leadId',lead.value,lead.excerpt));
 const description=first(text,[/\b(?:description is|describe it as)\s+(.+?)(?=[.;!?]|$)/i,/(?:توضیح(?:ش| پروژه)?)\s+(.+?)(?=[،,.]|$)/u]);
 if(description)found.set('description',{field:'description',value:description.value,excerpt:description.excerpt,resolution:'resolved'});
 return {proposals:fields.map(field=>found.get(field)??{field,value:'',excerpt:'',resolution:'missing'}),submitWhenComplete:/\bcreate it if all required information is complete\b/i.test(text)||/اگر اطلاعات لازم کامل است (?:آن را )?بساز/u.test(text)};
}
export function editField(state:FormState,field:ProjectField,value:string):FormState{return {values:{...state.values,[field]:value},revisions:{...state.revisions,[field]:state.revisions[field]+1}}}
export function applyProposals(state:FormState,proposals:FieldProposal[],snapshot:FormState['revisions']):{state:FormState;undo:VoiceUndo;changed:ProjectField[];stale:ProjectField[]}{let next=state;const undo:VoiceUndo={before:{},appliedRevisions:{}};const changed:ProjectField[]=[],stale:ProjectField[]=[];for(const p of proposals){if(p.resolution!=='resolved')continue;if(state.revisions[p.field]!==snapshot[p.field]){stale.push(p.field);continue}const value=p.entityId??p.value;if(state.values[p.field]===value)continue;undo.before[p.field]=state.values[p.field];next=editField(next,p.field,value);undo.appliedRevisions[p.field]=next.revisions[p.field];changed.push(p.field)}return {state:next,undo,changed,stale}}
export function undoVoice(state:FormState,undo:VoiceUndo):FormState{let next=state;for(const field of fields){const prior=undo.before[field];if(prior!==undefined&&state.revisions[field]===undo.appliedRevisions[field])next=editField(next,field,prior)}return next}
export function validateProject(values:ProjectCreateInput,projects:Project[]):Partial<Record<ProjectField,string>>{const errors:Partial<Record<ProjectField,string>>={};if(!values.name.trim())errors.name='Project name is required.';else if(values.name.trim().length>100)errors.name='Use at most 100 characters.';if(!values.key.trim())errors.key='Project key is required.';else if(!/^[A-Z][A-Z0-9]{1,7}$/.test(values.key.trim().toUpperCase()))errors.key='Use 2–8 letters or digits, starting with a letter.';else if(projects.some(p=>p.key.toLowerCase()===values.key.trim().toLowerCase()))errors.key='This key is already used.';if(!values.teamId)errors.teamId='Choose a team.';else if(!demoTeams.some(t=>t.id===values.teamId))errors.teamId='Choose an available team.';if(values.leadId&&!demoLeads.some(l=>l.id===values.leadId))errors.leadId='Choose an available lead.';if(values.description.length>500)errors.description='Use at most 500 characters.';return errors}
export function nextQuestion(values:ProjectCreateInput,proposals:FieldProposal[],projects:Project[]):string{const ambiguous=proposals.find(p=>p.resolution==='ambiguous');if(ambiguous)return ambiguous.field==='leadId'?'Which Sara did you mean? Choose a person below.':'Which team did you mean? Choose one below.';const invalid=proposals.find(p=>p.resolution==='invalid');if(invalid)return invalid.field==='teamId'?'That team is not in the sample options. Choose an available team.':invalid.field==='leadId'?'That lead is not in the sample options. Choose an available person.':'Please correct the highlighted value.';const errors=validateProject(values,projects);if(errors.name)return 'What should the project be called?';if(errors.key)return 'What project key should I use?';if(errors.teamId)return 'Which sample team should own it?';return 'The draft is ready. Review it and choose Create project.'}
