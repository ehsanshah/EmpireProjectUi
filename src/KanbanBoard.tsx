import {uiText,isRtl} from './i18n';
import {useEffect,useRef,useState,type PointerEvent as ReactPointerEvent} from 'react';
import {createPortal} from 'react-dom';
import {ChevronDown,ChevronRight,GripVertical,LockKeyhole,MoreHorizontal,Settings2,ArrowUp,Upload} from 'lucide-react';
import {users,type Area,type Issue} from './domain';
import {boardAreas,boardCards,boardColumns,mappedBoardColumn,wipCount,type BoardColumn,type BoardMove} from './kanban';
import {cardsInColumn,columnForStatus,targetStatus,wipStatuses} from './boardLayout';
import {issueTitle,type ViewProps} from './Views';
import {parseCardFile,type ImportedCard} from './kanbanImport';
import {demoScanText} from './dataCartDomain';
import {countLabel} from './ListWorkspaceControls';
import './kanban.css';

const titles:Record<BoardColumn,{en:string;fa:string;ar:string}>={backlog:{en:'Backlog',fa:'بک‌لاگ',ar:'قائمة الانتظار'},todo:{en:'To Do',fa:'آماده انجام',ar:'للتنفيذ'},in_progress:{en:'In Progress',fa:'در حال انجام',ar:'قيد التنفيذ'},review:{en:'Review',fa:'بازبینی',ar:'مراجعة'},done:{en:'Done',fa:'انجام‌شده',ar:'منجز'}};
type Target={area:Area;column:BoardColumn;index:number};
type Drag={id:string;x:number;y:number;originX:number;originY:number;offsetX:number;offsetY:number;width:number;height:number;target:Target|null;settling:boolean};
const collapseKey='empire-kanban-collapsed-v1';
function initialCollapsed(){try{const value=JSON.parse(localStorage.getItem(collapseKey)||'{}');return {backlog:!!value.backlog,done:value.done!==false}}catch{return {backlog:false,done:true}}}
function nameOf(issue:Issue,locale:'en'|'fa'|'ar'){return users.find(user=>user.id===issue.assigneeId)?.[locale==='fa'?'name':'nameEn']??uiText(locale,'Unassigned','بدون مسئول')}
function CardFace({issue,locale,preview=false}:{issue:Issue;locale:'en'|'fa'|'ar';preview?:boolean}){
 const t=(en:string,fa:string,ar?:string)=>uiText(locale,en,fa,ar);
 return <><div className="kb-card-top"><bdi>{issue.semanticKey}</bdi>{preview&&<GripVertical size={13}/>}</div><strong>{issueTitle(issue,locale)}</strong><div className="kb-card-meta"><span className="kb-area-pill">{issue.area==='web'?t('Web','وب'):t('Mobile','موبایل')}</span><span className={'kb-priority '+issue.priority}>{issue.priority==='high'?<ArrowUp size={11}/>:null}{issue.priority==='high'?t('High','بالا'):t('Normal','عادی')}</span>{issue.blocked&&<span className="kb-blocked"><LockKeyhole size={10}/>{t('Blocked','مسدود')}</span>}<span className={'kb-avatar '+issue.assigneeId} title={nameOf(issue,locale)}>{issue.assigneeId==='agent-hermes'?'🤖':nameOf(issue,locale)[0]}</span></div></>;
}
export function KanbanBoard(p:ViewProps){
 const {locale:l}=p;const t=(en:string,fa:string,ar?:string)=>uiText(l,en,fa,ar);
 const [collapsed,setCollapsed]=useState(initialCollapsed);
 const [settings,setSettings]=useState(false);
 const [uploadOpen,setUploadOpen]=useState(false);
 const [pendingImport,setPendingImport]=useState<ImportedCard[]|null>(null);
 const [uploadError,setUploadError]=useState('');
 const uploadInput=useRef<HTMLInputElement>(null);
 const [menu,setMenu]=useState<string|null>(null);
 const [drag,setDrag]=useState<Drag|null>(null);
 const dragRef=useRef<Drag|null>(null);
 const listeners=useRef<(()=>void)|null>(null);
 const workflow=p.boardSnapshot?.workflow;
 const cards=(issues:Issue[],area:Area,column:BoardColumn)=>workflow?cardsInColumn(issues,area,column,workflow):boardCards(issues,area,column);
 const mapped=(issue:Issue)=>workflow?columnForStatus(workflow,issue.status):mappedBoardColumn(issue);
 const canDrop=(column:BoardColumn)=>!workflow||!!targetStatus(workflow,column);
 const wipLimit=workflow?.wip.limit??p.wipLimit;
 const inProgress=workflow?.wip.current??wipCount(p.allIssues);
 const workflowColumns=p.boardSnapshot?.workflow.columns.map(column=>column.id as BoardColumn)??boardColumns;
 const swimlanes=p.boardSnapshot?.workflow.swimlanes.map(lane=>lane.id)??boardAreas;
 const columnLabel=(column:BoardColumn)=>{const mapped=p.boardSnapshot?.workflow.columns.find(item=>item.id===column);return mapped?uiText(l,mapped.labelEn,mapped.labelFa):titles[column][l]};
 const unmapped=p.rows.filter(issue=>!mapped(issue));
 const mappedCount=p.rows.length-unmapped.length;
 const limitReached=inProgress>=wipLimit;
 useEffect(()=>()=>listeners.current?.(),[]);
 function toggle(column:'backlog'|'done'){const next={...collapsed,[column]:!collapsed[column]};setCollapsed(next);try{localStorage.setItem(collapseKey,JSON.stringify(next))}catch{/* session state remains usable */}}
 function fileError(error:unknown){const message=error instanceof Error?error.message:'Could not read this file.';if(l!=='fa')return message;if(message.includes('256 KB'))return 'فایل CSV یا JSON کوچک‌تر از ۲۵۶ کیلوبایت انتخاب کنید.';if(message.includes('WIP'))return 'سقف مشترک کار هم‌زمان پر است.';if(message.includes('Unclosed quote'))return 'نقل‌قول در فایل CSV بسته نشده است.';if(message.includes('JSON must'))return 'فایل JSON باید آرایه‌ای از کارت‌ها داشته باشد.';if(message.includes('CSV needs'))return 'فایل CSV باید سربرگ و دست‌کم یک کارت داشته باشد.';if(message.includes('.csv or .json'))return 'فایل با پسوند CSV یا JSON انتخاب کنید.';if(message.includes('1 to 20'))return 'هر بار بین ۱ تا ۲۰ کارت وارد کنید.';if(message.includes('needs a title'))return 'عنوان کارت اجباری است و باید حداکثر ۱۸۰ نویسه باشد.';if(message.includes('area must'))return 'حوزهٔ کارت باید web یا mobile باشد.';if(message.includes('status must'))return 'وضعیت کارت معتبر نیست.';if(message.includes('priority must'))return 'اولویت کارت باید normal یا high باشد.';return 'فایل خوانده نشد یا ساختار آن معتبر نیست.'}
 async function prepareFile(file:File){setUploadError('');setPendingImport(null);try{if(file.size>256*1024)throw Error('Choose a CSV or JSON file smaller than 256 KB.');const text=await file.text();if(!demoScanText(text))throw Error('Demo scan blocked suspicious content; no cards were parsed.');setPendingImport(parseCardFile(text,file.name))}catch(error){setUploadError(fileError(error))}if(uploadInput.current)uploadInput.current.value=''}
 function setDragging(next:Drag|null){dragRef.current=next;setDrag(next)}
 function locate(x:number,y:number):Target|null{
  const element=document.elementFromPoint(x,y) as HTMLElement|null;
  const zone=element?.closest<HTMLElement>('[data-drop-zone]');
  if(!zone||!canDrop(zone.dataset.column as BoardColumn))return null;
  const area=zone.dataset.area as Area;const column=zone.dataset.column as BoardColumn;
  const cards=[...zone.querySelectorAll<HTMLElement>('[data-card-id]')].filter(el=>el.dataset.cardId!==dragRef.current?.id);
  const index=cards.findIndex(card=>y<card.getBoundingClientRect().top+card.getBoundingClientRect().height/2);
  return {area,column,index:index<0?cards.length:index};
 }
 function beginDrag(event:ReactPointerEvent<HTMLButtonElement>,issue:Issue){
  if(event.button!==0)return;
  event.preventDefault();setMenu(null);
  const card=event.currentTarget.closest<HTMLElement>('[data-card-id]');if(!card)return;
  const rect=card.getBoundingClientRect();
  const start:Drag={id:issue.id,x:rect.x,y:rect.y,originX:rect.x,originY:rect.y,offsetX:event.clientX-rect.x,offsetY:event.clientY-rect.y,width:rect.width,height:rect.height,target:null,settling:false};
  setDragging(start);
  const move=(e:PointerEvent)=>{const current=dragRef.current;if(!current||current.settling)return;const next={...current,x:e.clientX-current.offsetX,y:e.clientY-current.offsetY,target:locate(e.clientX,e.clientY)};setDragging(next)};
  const up=()=>{listeners.current?.();listeners.current=null;const current=dragRef.current;if(!current)return;const source=p.allIssues.find(item=>item.id===current.id);const target=current.target;
   const denied=!!(source&&target&&workflow&&targetStatus(workflow,target.column)&&new Set(wipStatuses(workflow)).has(targetStatus(workflow,target.column)!)&&!new Set(wipStatuses(workflow)).has(source.status)&&inProgress>=wipLimit);
   const placeholder=document.querySelector<HTMLElement>('.kb-placeholder');const rect=target&&!denied?placeholder?.getBoundingClientRect():null;
   setDragging({...current,x:rect?.x??current.originX,y:rect?.y??current.originY,settling:true});
   window.setTimeout(()=>{if(target)p.moveBoard({id:current.id,...target});setDragging(null)},170);
  };
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up,{once:true});
  listeners.current=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};
 }
 function keyboardMove(event:React.KeyboardEvent<HTMLButtonElement>,issue:Issue){
  if(!event.altKey)return;
  const column=mapped(issue);if(!column)return;const siblings=cards(p.rows,issue.area,column);const index=siblings.findIndex(item=>item.id===issue.id);
  let target:BoardMove|null=null;
  if(event.shiftKey&&(event.key==='ArrowUp'||event.key==='ArrowDown'))target={id:issue.id,area:issue.area==='web'?'mobile':'web',column,index:cards(p.rows,issue.area==='web'?'mobile':'web',column).length};
  else if(event.key==='ArrowUp'||event.key==='ArrowDown')target={id:issue.id,area:issue.area,column,index:Math.max(0,Math.min(siblings.length-1,index+(event.key==='ArrowUp'?-1:1)))};
  else if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
   const dir=(event.key==='ArrowRight'?1:-1)*(isRtl(l)?-1:1);const next=workflowColumns[workflowColumns.indexOf(column)+dir];if(next&&canDrop(next))target={id:issue.id,area:issue.area,column:next,index:cards(p.rows,issue.area,next).length};
  }
  if(target){event.preventDefault();p.moveBoard(target)}
 }
 function placeholder(area:Area,column:BoardColumn,index:number){return drag&&!drag.settling&&drag.target?.area===area&&drag.target.column===column&&drag.target.index===index?<div className="kb-placeholder" data-testid="card-placeholder" style={{height:drag.height}}/>:null}
 const gridColumns=workflowColumns.map(column=>collapsed[column as 'backlog'|'done']?'38px':'minmax(0,1fr)').join(' ');
 const draggedIssue=p.allIssues.find(issue=>issue.id===drag?.id);
 return <div className="kanban-board" data-testid="kanban-board">
  <div className="kb-toolbar"><div><strong>{t(`One board · ${swimlanes.length} swimlanes`,`یک برد · ${swimlanes.length} مسیر`)}</strong><span>{t('Drag cards or use Move to… / Alt + arrows','کارت‌ها را بکشید یا از منو / Alt + جهت‌ها استفاده کنید')}</span></div><div className={'kb-wip-summary '+(limitReached?'at-limit':'')} data-testid="wip-summary"><span>{columnLabel((workflow?.wip.columnId??'in_progress') as BoardColumn)}</span><strong>{inProgress}/{wipLimit}</strong><small>{t('Project-wide · all filters','کل پروژه · همهٔ فیلترها')}</small>{limitReached&&<em>{t('WIP limit reached','سقف کار هم‌زمان پر شده')}</em>}</div><div className="kb-toolbar-actions"><button className="kb-settings-toggle" aria-expanded={uploadOpen} onClick={()=>setUploadOpen(!uploadOpen)}><Upload size={14}/>{t('Upload cards','آپلود کارت‌ها')}</button><button className="kb-settings-toggle" aria-expanded={settings} onClick={()=>setSettings(!settings)}><Settings2 size={14}/>{t('Board settings','تنظیمات برد')}</button></div></div>
  {uploadOpen&&<section className="kb-upload"><div><strong>{t('Upload cards from CSV or JSON','آپلود کارت از CSV یا JSON')}</strong><small>{t('Local prototype only · no file is sent. Up to 20 cards, 256 KB.','فقط در نمونه محلی · فایلی ارسال نمی‌شود. حداکثر ۲۰ کارت و ۲۵۶ کیلوبایت.')}</small></div><label className="kb-upload-zone" onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();const file=event.dataTransfer.files[0];if(file)void prepareFile(file)}}><Upload size={16}/>{t('Drop a file here or choose one','فایل را اینجا رها کنید یا انتخاب کنید')}<input ref={uploadInput} aria-label={t('Choose card file','انتخاب فایل کارت‌ها')} type="file" accept=".csv,.json,text/csv,application/json" onChange={event=>{const file=event.target.files?.[0];if(file)void prepareFile(file)}}/></label>{uploadError&&<p className="kb-upload-error" role="alert">{uploadError}</p>}{pendingImport&&<div className="kb-import-preview"><span>{pendingImport.length} {t('cards ready','کارت آماده')} · {pendingImport.slice(0,3).map(card=>card.titleEn).join(' · ')}{pendingImport.length>3?'…':''}</span><button onClick={()=>{if(p.importCards(pendingImport)){setPendingImport(null);setUploadOpen(false)}}}>{t('Import locally','ورود به نمونه')}</button><button onClick={()=>setPendingImport(null)}>{t('Cancel','لغو')}</button></div>}</section>}
  {settings&&<div className="kb-settings"><label>{t('Demo WIP limit · across both swimlanes','سقف آزمایشی کار هم‌زمان · مجموع هر دو مسیر')}<input aria-label={t('WIP limit','سقف کار هم‌زمان')} type="number" min="1" max="12" value={p.wipLimit} onChange={e=>p.setWipLimit(Math.max(1,Math.min(12,Number(e.target.value)||1)))}/></label><p>{t('Demo test override for the WIP column, across the full project. Published policy changes use Versioned settings.','تغییر آزمایشی سقف ستون کار هم‌زمان در کل پروژه. تغییر سیاست منتشرشده از تنظیمات نسخه‌دار انجام می‌شود.')}</p><button type="button" onClick={p.prepareBoardRequiredFixture}>{t('Load required-field review scenario for EMP-102','بارگذاری سناریوی بازبینی فیلد لازم برای EMP-102')}</button></div>}
  {p.boardNotice&&<div className="kb-notice" role="status">{p.boardNotice}</div>}
  {p.boardDraft&&<section className="kb-required" role="alert"><strong>{t('Review pending board move','بررسی جابه‌جایی معلق برد')}</strong><p>{p.boardDraft.error}</p>{p.boardDraft.requiresResolution&&<label>{t('Resolution note','یادداشت حل مسئله')}<textarea value={p.boardDraft.resolutionNote} maxLength={500} onChange={event=>p.onBoardDraftText?.(event.target.value)}/></label>}<div><button onClick={p.onBoardDraftSubmit}>{t('Retry validated move','تلاش دوباره برای جابه‌جایی معتبر')}</button><button onClick={p.onBoardDraftCancel}>{t('Cancel move','لغو جابه‌جایی')}</button></div></section>}
  <div className="kb-scroll"><div className="kb-reconcile" role="status">{t('Board workset','مجموعهٔ برد')}: {mappedCount} {t('rendered','نمایش‌داده‌شده')} + {unmapped.length} {t('unmapped','بدون ستون')} = {countLabel(p.boardWorksetCount??null)} {t('matching','مورد مطابق')}</div>{swimlanes.map(area=><section className="kb-lane" key={area} data-lane={area}><header className="kb-lane-header"><span className="kb-lane-mark"/ ><strong>{area==='web'?t('Web','وب'):t('Mobile','موبایل')}</strong><span>{p.rows.filter(issue=>issue.area===area).length} {t('cards','کارت')}</span><small>{t('Same workflow · shared WIP policy','یک جریان کار · سقف مشترک')}</small></header><div className="kb-grid" style={{gridTemplateColumns:gridColumns}}>{workflowColumns.map(column=>{const columnCards=cards(p.rows,area,column);const isCollapsed=(column==='backlog'||column==='done')&&collapsed[column];return <section className={'kb-column '+(isCollapsed?'is-collapsed ':'')+(column==='in_progress'&&limitReached?'at-limit':'')} key={column} data-column={column} data-area={area}><header className="kb-column-head">{column==='backlog'||column==='done'?<button aria-label={`${isCollapsed?t('Expand','بازکردن'):t('Collapse','جمع‌کردن')} ${columnLabel(column)}`} aria-expanded={!isCollapsed} onClick={()=>toggle(column)}>{isCollapsed?<ChevronRight size={14}/>:<ChevronDown size={14}/>}<span>{columnLabel(column)}</span><b>{columnCards.length}</b></button>:<><span>{columnLabel(column)}</span><b>{column==='in_progress'?`${inProgress}/${wipLimit}`:columnCards.length}</b></>}</header>{isCollapsed?<div className="kb-collapsed-label">{columnLabel(column)} · {columnCards.length}</div>:<div className="kb-list" data-drop-zone={canDrop(column)?'true':undefined} data-area={area} data-column={column}>{columnCards.map((issue,index)=><div key={issue.id}>{placeholder(area,column,index)}<article className={'kb-card '+(drag?.id===issue.id?'drag-source':'')} data-card-id={issue.id} data-issue={issue.semanticKey}><div className="kb-card-top"><bdi>{issue.semanticKey}</bdi><div className="kb-card-actions"><button className="kb-grip" aria-label={`${t('Drag','کشیدن')} ${issue.semanticKey}`} title={t('Drag · Alt + arrows to move · Alt + Shift + up/down to change swimlane','کشیدن · Alt + جهت برای جابه‌جایی · Alt + Shift + بالا/پایین برای تغییر مسیر')} onPointerDown={event=>beginDrag(event,issue)} onKeyDown={event=>keyboardMove(event,issue)}><GripVertical size={13}/></button><button aria-label={`${t('Move to…','انتقال به…')} ${issue.semanticKey}`} aria-expanded={menu===issue.id} onClick={()=>setMenu(menu===issue.id?null:issue.id)}><MoreHorizontal size={13}/></button></div></div><button className="kb-card-title" onClick={()=>p.open(issue)}>{issueTitle(issue,l)}</button><div className="kb-card-meta"><span className="kb-area-pill">{area==='web'?t('Web','وب'):t('Mobile','موبایل')}</span><span className={'kb-priority '+issue.priority}>{issue.priority==='high'?<ArrowUp size={11}/>:null}{issue.priority==='high'?t('High','بالا'):t('Normal','عادی')}</span>{issue.blocked&&<span className="kb-blocked"><LockKeyhole size={10}/>{t('Blocked','مسدود')}</span>}{p.runByIssue?.[issue.id]&&<span className="kb-run-badge" title={t('Demo Run projection; issue status unchanged','نمای Run نمونه؛ وضعیت ایشو تغییر نکرده است')}>{t('Run','اجرا')}: {p.runByIssue[issue.id]?.state.replaceAll('_',' ')}</span>}<span className={'kb-avatar '+issue.assigneeId} title={nameOf(issue,l)}>{issue.assigneeId==='agent-hermes'?'🤖':nameOf(issue,l)[0]}</span></div>{menu===issue.id&&<div className="kb-move-menu"><div>{t('Move to…','انتقال به…')} <button onClick={()=>setMenu(null)} aria-label={t('Close menu','بستن منو')}>×</button></div>{swimlanes.map(destArea=><div className="kb-menu-area" key={destArea}><span>{destArea==='web'?t('Web','وب'):t('Mobile','موبایل')}</span>{workflowColumns.map(destColumn=><button key={destColumn} disabled={!canDrop(destColumn)||(destArea===area&&destColumn===column)} onClick={()=>{p.moveBoard({id:issue.id,area:destArea,column:destColumn,index:cards(p.rows,destArea,destColumn).length});setMenu(null)}}>{columnLabel(destColumn)}</button>)}</div>)}</div>}</article></div>)}{placeholder(area,column,columnCards.length)}{!columnCards.length&&!drag&&<p className="kb-empty">{canDrop(column)?t('Drop a card here','کارت را اینجا رها کنید'):t('No mapped drop status','وضعیت مقصد نگاشت نشده است')}</p>}</div>}</section>})}</div></section>)}{unmapped.length>0&&<section className="kb-unmapped" data-testid="unmapped-tray"><h3>{t('Unmapped statuses','وضعیت‌های بدون ستون')} · {unmapped.length}</h3><p>{t('These cards remain in the workset. Choose a mapped workflow column to recover one.','این کارت‌ها در مجموعهٔ کار باقی می‌مانند؛ برای بازیابی، یک ستون جریان کار انتخاب کنید.')}</p><div>{unmapped.map(issue=><article key={issue.id} data-issue={issue.semanticKey}><button onClick={()=>p.open(issue)}><bdi>{issue.semanticKey}</bdi> · {issueTitle(issue,l)}</button><span>{issue.status}</span>{workflowColumns.filter(canDrop).slice(0,1).map(target=><button key={target} onClick={()=>p.moveBoard({id:issue.id,area:issue.area,column:target,index:cards(p.rows,issue.area,target).length})}>{t('Move to','انتقال به')} {columnLabel(target)}</button>)}</article>)}</div></section>}</div>
  {drag&&draggedIssue&&createPortal(<div className={'kb-drag-preview '+(drag.settling?'settling':'')} style={{left:drag.x,top:drag.y,width:drag.width,minHeight:drag.height}}><CardFace issue={draggedIssue} locale={l} preview/></div>,document.body)}
 </div>;
}
