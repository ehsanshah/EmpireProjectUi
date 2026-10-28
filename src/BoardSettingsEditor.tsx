import type {AdminConfig} from './phase13Domain';
import type {Locale} from './i18n';
import {uiText} from './i18n';

export function BoardSettingsEditor({config,locale,change}:{config:AdminConfig;locale:Locale;change:(edit:(next:AdminConfig)=>void)=>void}) {
 const t=(en:string,fa:string,ar:string)=>uiText(locale,en,fa,ar);
 const moveColumn=(index:number,delta:number)=>change(next=>{const [column]=next.board.columns.splice(index,1);next.board.columns.splice(index+delta,0,column)});
 return <fieldset className="p13-board-editor"><legend>{t('Board mapping & WIP','نگاشت برد و سقف کار','تعيين اللوحة وحدّ العمل')}</legend>
  <p>{t('Draft only. Published Board stays unchanged until approval and a publish receipt. The first mapped status in each column receives drops.','فقط پیش‌نویس. برد منتشرشده تا تأیید و رسید انتشار تغییر نمی‌کند. نخستین وضعیت هر ستون مقصد انتقال است.','مسودة فقط. تبقى اللوحة المنشورة كما هي حتى الاعتماد وإيصال النشر. الحالة الأولى هي وجهة النقل.')}</p>
  <div className="p13-board-columns" aria-label={t('Board column order and names','ترتیب و نام ستون‌ها','ترتيب الأعمدة وأسماؤها')}>
   {config.board.columns.map((column,index)=><div className="p13-board-column" key={column.id} data-board-column={column.id}>
    <strong>{index+1}. {column.id}</strong><div className="p13-board-order"><button type="button" disabled={index===0} aria-label={`${t('Move column earlier','بردن ستون به قبل','انقل العمود للأمام')} ${column.id}`} onClick={()=>moveColumn(index,-1)}>↑</button><button type="button" disabled={index===config.board.columns.length-1} aria-label={`${t('Move column later','بردن ستون به بعد','انقل العمود للخلف')} ${column.id}`} onClick={()=>moveColumn(index,1)}>↓</button></div>
    <label>{t('English name','نام انگلیسی','الاسم الإنجليزي')}<input aria-label={`English name for ${column.id}`} maxLength={48} value={column.labelEn} onChange={event=>change(next=>{next.board.columns.find(item=>item.id===column.id)!.labelEn=event.target.value})}/></label>
    <label>{t('Persian / RTL name','نام فارسی / راست‌به‌چپ','الاسم الفارسي / يمين إلى يسار')}<input aria-label={`Persian name for ${column.id}`} maxLength={48} value={column.labelFa} onChange={event=>change(next=>{next.board.columns.find(item=>item.id===column.id)!.labelFa=event.target.value})}/></label>
    <small>{t('Statuses','وضعیت‌ها','الحالات')}: {column.statusIds.join(', ')||t('none · drops disabled','ندارد · انتقال غیرفعال','لا شيء · النقل معطّل')}</small>
   </div>)}
  </div>
  <h3>{t('Status → column mapping','وضعیت ← ستون','الحالة ← العمود')}</h3>
  {config.statuses.map(status=><label key={status.id}>{status.id}<select aria-label={`Board mapping for ${status.id}`} value={config.board.columns.find(column=>column.statusIds.includes(status.id))?.id??''} onChange={event=>change(next=>{for(const column of next.board.columns)column.statusIds=column.statusIds.filter(id=>id!==status.id);if(event.target.value)next.board.columns.find(column=>column.id===event.target.value)?.statusIds.push(status.id)})}><option value="">{t('Unmapped tray','درگاه وضعیت بدون ستون','صينية الحالات غير المعيّنة')}</option>{config.board.columns.map(column=><option key={column.id} value={column.id}>{column.labelEn} · {column.id}</option>)}</select></label>)}
  <h3>{t('Swimlane grouping and order','گروه‌بندی و ترتیب مسیرها','تجميع المسارات وترتيبها')}</h3>
  <label>{t('Supported grouping','گروه‌بندی پشتیبانی‌شده','التجميع المدعوم')}<select aria-label="Board swimlane grouping" value="area" onChange={()=>{}}><option value="area">{t('Area · Web / Mobile','حوزه · وب / موبایل','المجال · الويب / المحمول')}</option><option disabled value="assignee">{t('Assignee · unavailable','مسئول · پشتیبانی‌نشده','المكلّف · غير متاح')}</option></select></label>
  <div className="p13-board-lanes">{config.board.swimlaneOrder.map((area,index)=><div key={area}><strong>{index+1}. {area==='web'?t('Web','وب','ويب'):t('Mobile','موبایل','محمول')}</strong><button type="button" disabled={index===0} aria-label={`Move ${area} swimlane earlier`} onClick={()=>change(next=>{next.board.swimlaneOrder.reverse()})}>↑</button><button type="button" disabled={index===1} aria-label={`Move ${area} swimlane later`} onClick={()=>change(next=>{next.board.swimlaneOrder.reverse()})}>↓</button></div>)}</div>
  {config.board.wip.map((item,index)=><label key={item.columnId}>{t('Project-wide WIP limit','سقف هم‌زمان کل پروژه','حد العمل الجاري للمشروع')} · {item.columnId}<input type="number" min="1" max="100" value={item.limit} onChange={event=>change(next=>{next.board.wip[index].limit=Number(event.target.value)})}/><small>{item.scope} · {t('all lanes and filters','همهٔ مسیرها و فیلترها','كل المسارات والمرشحات')}</small></label>)}
 </fieldset>;
}
