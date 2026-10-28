import {uiText} from '../i18n';
import type {ActivityEntry,Receipt,WorkItem} from './contracts';
import type {Status} from '../domain';
import './core.css';

export type DemoTransitionScenario='normal'|'async'|'outcome_unknown';
export interface ConflictDraft {issueId:string;desired:Status;latest:WorkItem;original:WorkItem;fields?:Record<string,unknown>}
export function TransitionDetails({locale,item,receipt,activity,pending,conflict,scenario,sessionUser,projectCount,onScenario,onConcurrent,onRetry}:{locale:'en'|'fa'|'ar';item:WorkItem|null;receipt:Receipt|null;activity:ActivityEntry[];pending:string;conflict:ConflictDraft|null;scenario:DemoTransitionScenario;sessionUser:string|null;projectCount:number|null;onScenario:(value:DemoTransitionScenario)=>void;onConcurrent:()=>void;onRetry:()=>void}){
 const t=(en:string,persian:string,ar?:string)=>uiText(locale,en,persian,ar);
 const statusText=(value:Status)=>t(({backlog:'Backlog',todo:'To do',in_progress:'In progress',review:'In review',completed:'Completed',cancelled:'Cancelled'} as Record<Status,string>)[value],({backlog:'انباشت',todo:'برای انجام',in_progress:'در حال انجام',review:'در بازبینی',completed:'تکمیل‌شده',cancelled:'لغوشده'} as Record<Status,string>)[value]);
 return <section className="core-transition-details" aria-label={t('Demo transition and activity','انتقال و فعالیت آزمایشی')}>
  <div className="core-details-head"><h3>{t('Transition evidence','شواهد انتقال')}</h3><span>{t('DEMO CORE','هسته آزمایشی')}</span></div>
  <p>{t('Session → project → issue → validated command → receipt → activity.','نشست ← پروژه ← کار ← فرمان اعتبارسنجی‌شده ← رسید ← فعالیت.')}</p>
  <div className="core-evidence-grid"><span>{t('Demo session','نشست نمونه')}</span><strong><bdi>{sessionUser??'…'}</bdi></strong><span>{t('Project read count','تعداد خوانده‌شدهٔ پروژه')}</span><strong>{projectCount??'…'}</strong><span>{t('Issue version','نسخه کار')}</span><strong>{item?.version??'…'}</strong><span>ETag</span><code dir="ltr">{item?.etag??'…'}</code></div>
  <div className="core-scenario"><label htmlFor="core-transition-scenario">{t('Next status change','تغییر وضعیت بعدی')}</label><select id="core-transition-scenario" value={scenario} onChange={e=>onScenario(e.target.value as DemoTransitionScenario)}><option value="normal">{t('Normal Demo receipt','رسید معمول نمونه')}</option><option value="async">{t('Simulate 202 operation','شبیه‌سازی عملیات ۲۰۲')}</option><option value="outcome_unknown">{t('Simulate lost response','شبیه‌سازی پاسخ گم‌شده')}</option></select><button type="button" onClick={onConcurrent}>{t('Simulate concurrent version','شبیه‌سازی نسخه هم‌زمان')}</button></div>
  {pending&&<p className="core-pending" role="status">{pending}</p>}
  {conflict&&<div className="core-conflict" role="alert"><strong>{t('Version conflict — draft kept','تعارض نسخه؛ پیش‌نویس حفظ شد')}</strong><p>{t('You requested','درخواست شما')}: <bdi>{statusText(conflict.desired)}</bdi>. {t('Latest issue version','آخرین نسخه کار')}: {conflict.latest.version}. {t('Review before retrying.','پیش از تلاش دوباره بررسی کنید.')}</p><button type="button" onClick={onRetry}>{t('Use latest version and retry','استفاده از آخرین نسخه و تلاش دوباره')}</button></div>}
  {receipt&&<div className="core-receipt" role="status"><strong>{t('Applied Demo receipt','رسید اعمال آزمایشی')}</strong><span><bdi>{receipt.id}</bdi> · v{receipt.resourceVersion}</span><small>{t('A receipt confirms this local command. An event alone does not.','رسید این فرمان محلی را تأیید می‌کند؛ رویداد به‌تنهایی کافی نیست.')}</small></div>}
  <h4>{t('Activity','فعالیت')}</h4>{activity.length?<ol className="core-activity">{activity.map(entry=><li key={entry.id}><bdi>{statusText(entry.before)}</bdi> → <bdi>{statusText(entry.after)}</bdi><small>{t('Demo receipt','رسید آزمایشی')} <bdi>{entry.receiptId}</bdi></small></li>)}</ol>:<p className="core-empty">{t('No recorded transition in this Demo session.','هنوز انتقال ثبت‌شده‌ای در این نشست نمونه وجود ندارد.')}</p>}
 </section>
}
