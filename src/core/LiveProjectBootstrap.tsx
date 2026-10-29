import {useEffect,useMemo,useState} from 'react';
import {ProjectBootstrapClient,type ProjectBootstrapState} from './i01bProjectClient';

/** Limited I01-B view. WorkItem, transition and event features remain unavailable. */
export function LiveProjectBootstrap(){
 const client=useMemo(()=>new ProjectBootstrapClient(),[]);
 const [state,setState]=useState<ProjectBootstrapState>(client.snapshot());
 useEffect(()=>{const unsubscribe=client.subscribe(setState);void client.bootstrap();return()=>{unsubscribe();client.clear()}},[client]);
 useEffect(()=>{const restore=()=>{const id=decodeURIComponent(window.location.pathname.split('/i01b/projects/')[1]??'');if(id&&client.snapshot().session)void client.switchProject(id);else client.clearActive()};window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore)},[client]);
 useEffect(()=>{const id=decodeURIComponent(window.location.pathname.split('/i01b/projects/')[1]??'');if(state.session&&id)void client.switchProject(id)},[client,state.session]);
 function open(id:string){void client.switchProject(id).then(ok=>{if(ok)window.history.pushState({i01bProject:id},'',`/i01b/projects/${encodeURIComponent(id)}`)})}
 async function logout(){try{await client.logout()}catch{/* client displays the unconfirmed logout */}finally{window.history.replaceState({},'','/i01b/projects')}}
 return <main className="live-unavailable" aria-label="Live project bootstrap"><h1>Project bootstrap</h1><p>Limited I01-B integration capability. Work items and other Live features are unavailable.</p>
  {state.loading&&<p role="status">Loading authorized projects…</p>}{state.error&&<p role="alert">{state.error}</p>}
  {state.session?<><p>Organization <bdi>{state.session.orgId}</bdi> · user <bdi>{state.session.userId}</bdi></p><button onClick={()=>void logout()}>Log out</button><h2>Authorized projects</h2><p>{state.page?.count.relation==='exact'?`${state.page.count.value} authorized projects`:'Count unavailable'}</p><ul>{state.projects.map(project=><li key={project.id}><button onClick={()=>open(project.id)} aria-current={state.active?.id===project.id?'page':undefined}>{project.name} <bdi>({project.key})</bdi></button></li>)}</ul>{state.page?.nextCursor&&<button disabled={state.loading} onClick={()=>void client.nextPage()}>Load more projects</button>}{state.active&&<section aria-label="Project detail"><h2>{state.active.name}</h2><p><bdi>{state.active.key}</bdi> · {state.active.method} · {state.active.state}</p><p>Timezone: {state.active.timezone}</p><p>Version {state.active.version} · permission revision {state.active.permissionRevision}</p><p>WorkItem views remain unavailable in this slice.</p></section>}</>:<button disabled={state.loading} onClick={()=>void client.bootstrap()}>Retry session</button>}
 </main>
}
