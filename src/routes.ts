import {initialState,type Navigation,type UIState,type View} from './domain';

const views:View[]=['list','board','timeline'];
export const demoNavigationCapabilities={work:true,calendar:true,workflow:true,investigation:true} as const;

export function stateFromRoute(pathname:string,search:string,knownProjects:string[]):UIState|null{
 const organization=pathname.match(/^\/o\/demo\/(projects|my-work|inbox|search|activity)\/?$/i);
 if(organization){const composition=({projects:'orgProjects','my-work':'myWork',inbox:'inbox',search:'globalSearch',activity:'orgActivity'} as const)[organization[1].toLowerCase() as 'projects'|'my-work'|'inbox'|'search'|'activity'];const query=new URLSearchParams(search);return {...initialState,composition,orgQuery:query.get('q')??'',orgProjectFilter:query.get('project')??'',inboxItemId:query.get('item')??undefined};}
 const cart=pathname.match(/^\/o\/demo\/p\/([a-z0-9-]+)\/datacarts\/([a-z0-9-]+)\/?$/i);
 if(cart&&knownProjects.includes(cart[1]))return {...initialState,projectId:cart[1],composition:'datacart',datacartId:cart[2]};
 const match=pathname.match(/^\/o\/demo\/p\/([a-z0-9-]+)\/(work|calendar|workflow|investigation|planning|intake|agents|gallery|knowledge|overview|reports|releases|people|settings)\/?$/i);
 if(!match||!knownProjects.includes(match[1]))return null;
 const query=new URLSearchParams(search);const composition:UIState['composition']=match[2]==='investigation'?'risk':match[2]==='calendar'?'calendar':match[2]==='workflow'?'workflow':match[2]==='planning'?'planning':match[2]==='intake'?'intake':match[2]==='agents'?'agents':match[2]==='gallery'?'gallery':match[2]==='knowledge'?'knowledge':match[2]==='overview'?'overview':match[2]==='reports'?'reports':match[2]==='releases'?'releases':match[2]==='people'?'people':match[2]==='settings'?'settings':'work';
 const view=query.get('view');const issue=query.get('issue');
 const sourceId=query.get('source'),artifactId=query.get('artifact'),version=Number(query.get('version'));
 return {...initialState,projectId:match[1],composition,view:views.includes(view as View)?view as View:'list',selectedIssueId:issue&&/^[a-z0-9-]+$/i.test(issue)?issue:null,issuePresentation:query.get('mode')==='full'?'full':'drawer',intakeId:query.get('intake')??undefined,agentTab:(['readiness','runs','reviews'].includes(query.get('tab')??'')?query.get('tab'):'readiness') as UIState['agentTab'],runId:query.get('run')??undefined,reviewId:query.get('review')??undefined,galleryArtifactId:artifactId&&/^[a-z0-9-]+$/i.test(artifactId)?artifactId:undefined,knowledgeSourceId:sourceId&&/^[a-z0-9-]+$/i.test(sourceId)?sourceId:undefined,knowledgeVersion:Number.isSafeInteger(version)&&version>0?version:undefined,knowledgeQuery:query.get('q')??undefined,reportType:query.get('type')==='sprint'?'sprint':'flow',releaseId:query.get('release')??undefined,adminTab:(['people','settings','workflow','connections','organization'].includes(query.get('section')??'')?query.get('section'):(composition==='settings'?'settings':'people')) as UIState['adminTab']};
}

export function routeForState(state:UIState,currentSearch:string){
 const organization=({orgProjects:'projects',myWork:'my-work',inbox:'inbox',globalSearch:'search',orgActivity:'activity'} as const)[state.composition as 'orgProjects'|'myWork'|'inbox'|'globalSearch'|'orgActivity'];
 if(organization){const query=new URLSearchParams(currentSearch);for(const key of ['view','issue','mode','intake','tab','run','review','artifact','source','version','q','type','release','section','project','item'])query.delete(key);if(state.orgQuery)query.set('q',state.orgQuery);if(state.orgProjectFilter)query.set('project',state.orgProjectFilter);if(state.inboxItemId)query.set('item',state.inboxItemId);return `/o/demo/${organization}${query.size?'?'+query:''}`;}
 if(state.composition==='datacart')return `/o/demo/p/${state.projectId}/datacarts/${state.datacartId??'new'}${currentSearch?currentSearch:''}`;
 const surface=state.composition==='calendar'?'calendar':state.composition==='workflow'?'workflow':state.composition==='risk'?'investigation':state.composition==='planning'?'planning':state.composition==='intake'?'intake':state.composition==='agents'?'agents':state.composition==='gallery'?'gallery':state.composition==='knowledge'?'knowledge':state.composition==='overview'?'overview':state.composition==='reports'?'reports':state.composition==='releases'?'releases':state.composition==='people'?'people':state.composition==='settings'?'settings':'work';
 const query=new URLSearchParams(currentSearch);for(const key of ['view','issue','mode','intake','tab','run','review','artifact','source','version','q','type','release','section'])query.delete(key);
 if(surface==='work')query.set('view',state.view);
 if(state.selectedIssueId)query.set('issue',state.selectedIssueId);if(state.composition==='intake'&&state.intakeId)query.set('intake',state.intakeId);if(state.composition==='agents'){query.set('tab',state.agentTab??'readiness');if(state.runId)query.set('run',state.runId);if(state.reviewId)query.set('review',state.reviewId)}
 if(state.composition==='gallery'&&state.galleryArtifactId)query.set('artifact',state.galleryArtifactId);if(state.composition==='knowledge'){if(state.knowledgeSourceId)query.set('source',state.knowledgeSourceId);if(state.knowledgeVersion)query.set('version',String(state.knowledgeVersion));if(state.knowledgeQuery)query.set('q',state.knowledgeQuery)}
 if((state.composition==='people'||state.composition==='settings')&&state.adminTab)query.set('section',state.adminTab);if(state.composition==='reports')query.set('type',state.reportType??'flow');if(state.composition==='releases'&&state.releaseId)query.set('release',state.releaseId);
 if(state.selectedIssueId&&state.issuePresentation==='full')query.set('mode','full');
 const suffix=query.toString();return `/o/demo/p/${state.projectId}/${surface}${suffix?'?'+suffix:''}`;
}

export interface DemoHistoryState {empireDemoNavigation:Navigation}
export function isDemoHistoryState(value:unknown):value is DemoHistoryState{return !!value&&typeof value==='object'&&'empireDemoNavigation' in value}
