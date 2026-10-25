import {Fragment,useState,useRef,type DragEvent} from 'react';
import {GripVertical,LockKeyhole,ArrowUp,ArrowDown,Minus,X} from 'lucide-react';
import {users,dateLabel} from './domain';
import {Editors,issueTitle,type ViewProps} from './Views';
export function WorkList(p:ViewProps){
 const {rows,state,locale:l}=p;
 const [dragged,setDragged]=useState<string|null>(null);
 const [over,setOver]=useState<{id:string;edge:'before'|'after'}|null>(null);
 const [menu,setMenu]=useState<string|null>(null);
 const scroll=useRef<HTMLDivElement>(null);
 const enabled=state.sort==='manual';
 const groups=state.groupBy==='assignee'?[...new Set(rows.map(i=>i.assigneeId))]:['all'];
 const t=(en:string,fa:string)=>l==='en'?en:fa;
 function end(){setDragged(null);setOver(null)}
 function dragOver(e:DragEvent<HTMLTableRowElement>,id:string,ids:string[]){
  if(!dragged||!ids.includes(dragged)||!enabled)return;
  e.preventDefault();e.dataTransfer.dropEffect='move';
  const box=e.currentTarget.getBoundingClientRect();
  setOver({id,edge:e.clientY<box.top+box.height/2?'before':'after'});
  const frame=scroll.current;if(frame){const r=frame.getBoundingClientRect();if(e.clientY<r.top+45)frame.scrollTop-=12;else if(e.clientY>r.bottom-45)frame.scrollTop+=12;}
 }
 return <><div className="table-scroll" ref={scroll}><table><thead><tr>{(l==='fa'?['کار / عنوان','وضعیت','مسئول','اولویت','موعد']:['Issue / title','Status','Assignee','Priority','Due date']).map(t=><th key={t}>{t}</th>)}</tr></thead><tbody>{groups.map(g=>{
 const groupRows=g==='all'?rows:rows.filter(i=>i.assigneeId===g);const ids=groupRows.map(i=>i.id);
 return <Fragment key={g}>{g!=='all'&&<tr className="group-row"><th colSpan={5}>{users.find(u=>u.id===g)?.[l==='fa'?'name':'nameEn']||t('Unassigned','بدون مسئول')} <span>{groupRows.length}</span></th></tr>}{groupRows.map((i,n)=><tr key={i.id} data-issue={i.semanticKey} className={[dragged===i.id?'dragging-row':'',over?.id===i.id?`drop-${over.edge}`:''].join(' ')} onDragOver={e=>dragOver(e,i.id,ids)} onDrop={e=>{if(!dragged||!ids.includes(dragged)||!over)return;e.preventDefault();p.reorder(ids,dragged,i.id,over.edge);end();}}><td><div className="issue-cell"><button className="drag-handle" aria-label={`${t('Reorder','جابه‌جایی')} ${i.semanticKey}`} title={enabled?t('Drag to reorder; click for move controls. Alt + ↑ / ↓ also works.','برای جابه‌جایی بکشید؛ برای کنترل‌های حرکت کلیک کنید. Alt + ↑ / ↓ نیز فعال است.'):t('Choose Manual priority to reorder','ابتدا ترتیب رسیدگی را انتخاب کنید')} disabled={!enabled} draggable={enabled} onDragStart={e=>{setMenu(null);setDragged(i.id);e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',i.id);const row=e.currentTarget.closest('tr');if(row)e.dataTransfer.setDragImage(row,20,20)}} onDragEnd={end} onClick={()=>setMenu(menu===i.id?null:i.id)} aria-expanded={menu===i.id} onKeyDown={e=>{if(e.key==='Escape')setMenu(null);if(e.altKey&&(e.key==='ArrowUp'||e.key==='ArrowDown')){e.preventDefault();const up=e.key==='ArrowUp';const target=groupRows[n+(up?-1:1)];if(target)p.reorder(ids,i.id,target.id,up?'before':'after');}}}><GripVertical size={14}/></button><button className="issue-link" onClick={()=>p.open(i)}><span className={'issue-dot '+i.status}/><bdi className="key">{i.semanticKey}</bdi><span className="issue-title">{issueTitle(i,l)}</span>{i.blocked&&<span className="blocked"><LockKeyhole size={12}/>{t('Blocked','مسدود')}</span>}</button>{menu===i.id&&<div className="row-move-controls"><button disabled={n===0} aria-label={t('Move up','انتقال به بالا')} onClick={()=>{p.reorder(ids,i.id,groupRows[n-1].id,'before');setMenu(null)}}><ArrowUp size={13}/></button><button disabled={n===groupRows.length-1} aria-label={t('Move down','انتقال به پایین')} onClick={()=>{p.reorder(ids,i.id,groupRows[n+1].id,'after');setMenu(null)}}><ArrowDown size={13}/></button><button aria-label={t('Close move controls','بستن کنترل حرکت')} onClick={()=>setMenu(null)}><X size={12}/></button></div>}</div></td><td colSpan={2}><div className="inline-editors"><Editors issue={i} locale={l} edit={p.edit}/></div></td><td><span className={'priority '+i.priority}>{i.priority==='high'?<ArrowUp size={14}/>:<Minus size={14}/>} {i.priority==='high'?t('High','بالا'):t('Normal','عادی')}</span></td><td className="date">{dateLabel(i.dueDate,l,p.calendar)}</td></tr>)}</Fragment>;
 })}</tbody></table></div></>;
}
