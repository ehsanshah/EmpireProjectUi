import {describe,expect,it} from 'vitest';
import {accessibleProjects} from '../src/projects';
import {applyProposals,editField,emptyProjectForm,extractProjectFields,undoVoice,validateProject} from '../src/voiceFormDomain';

describe('Voice-to-Form project draft',()=>{
 it('extracts a multi-field utterance and applies it to the visible draft model',()=>{
  const extracted=extractProjectFields('Call it Merchant Portal, key MERCH, use the Core Platform team.');
  const applied=applyProposals(emptyProjectForm(),extracted.proposals,emptyProjectForm().revisions);
  expect(applied.state.values).toMatchObject({name:'Merchant Portal',key:'MERCH',teamId:'core-platform'});
  expect(applied.changed).toEqual(['name','key','teamId']);
  expect(validateProject(applied.state.values,accessibleProjects)).toEqual({});
 });
 it('corrects only a named field and keeps newer manual edits safe',()=>{
  const initial=emptyProjectForm();const old=extractProjectFields('Call it Old Name, key OLD').proposals;
  const manual=editField(initial,'name','Typed name');const applied=applyProposals(manual,old,initial.revisions);
  expect(applied.state.values.name).toBe('Typed name');expect(applied.state.values.key).toBe('OLD');expect(applied.stale).toEqual(['name']);
  const revised=applyProposals(applied.state,extractProjectFields('Actually, change the name to New Name.').proposals,applied.state.revisions);
  expect(revised.state.values).toMatchObject({name:'New Name',key:'OLD'});
  expect(undoVoice(editField(revised.state,'name','My edit'),revised.undo).values.name).toBe('My edit');
  expect(undoVoice(revised.state,revised.undo).values.name).toBe('Typed name');
 });
 it('keeps ambiguous people unresolved and requires a valid unique key',()=>{
  const result=extractProjectFields('Lead is Sara.');expect(result.proposals.find(p=>p.field==='leadId')).toMatchObject({resolution:'ambiguous'});
  const form=emptyProjectForm();expect(validateProject(form.values,accessibleProjects)).toHaveProperty('name');
  expect(validateProject({...form.values,name:'Demo',key:'PAY',teamId:'core-platform'},accessibleProjects)).toHaveProperty('key');
  expect(extractProjectFields('Create it if all required information is complete.').submitWhenComplete).toBe(true);
 });
 it('handles the required incomplete-command follow-up without clearing earlier fields',()=>{
  const initial=emptyProjectForm();const first=applyProposals(initial,extractProjectFields('Create a project called Payment Platform for the Core Platform team.').proposals,initial.revisions).state;
  expect(first.values).toMatchObject({name:'Payment Platform',teamId:'core-platform',key:''});
  const next=applyProposals(first,extractProjectFields('Use PAY as the key.').proposals,first.revisions).state;
  expect(next.values).toMatchObject({name:'Payment Platform',teamId:'core-platform',key:'PAY'});
 });
});
