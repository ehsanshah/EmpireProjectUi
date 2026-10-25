import { ArrowUpRight, GitBranch, LockKeyhole, CalendarClock, Check, FilePenLine } from 'lucide-react';
import { users, type Issue, dateLabel } from './domain';
import { issueTitle, labels, statuses } from './Views';
export type Locale = 'fa'|'en';
export const description=(i:Issue,l:Locale)=>l==='en'?i.descriptionEn:i.description;
export const criteria=(i:Issue,l:Locale)=>l==='en'?i.acceptanceCriteriaEn:i.acceptanceCriteria;
export const blocker=(i:Issue,l:Locale)=>l==='en'?i.blockerReasonEn:i.blockerReason;
export const owner=(i:Issue,l:Locale)=>users.find(u=>u.id===i.assigneeId)?.[l==='en'?'nameEn':'name']??(l==='en'?'Unassigned':'بدون مسئول');
interface Props {rows:Issue[];issues:Issue[];locale:Locale;calendar:string;inspect:(i:Issue)=>void;draft:(i:Issue)=>void}
export function RiskInvestigation({rows,issues,locale:l,calendar,inspect,draft}:Props){
 const t=(en:string,fa:string)=>l==='en'?en:fa;
 const blocked=rows.filter(i=>i.blocked);
 const edges=blocked.flatMap(i=>i.dependencies.map(id=>({from:i,to:issues.find(x=>x.id===id)}))).filter(e=>e.to);
 const missing=blocked.filter(i=>!i.startDate||!i.dueDate);
 return <div className="investigation" data-testid="risk-investigation">
  <div className="investigation-intro"><span className="section-kicker">{t('DELIVERY INVESTIGATION','بررسی تحویل')}</span><h2>{t('Follow the blocker. Find the next step.','مانع را دنبال کنید؛ گام بعد را پیدا کنید.')}</h2><p>{t('Recorded blockers and dependencies from this sprint. No risk score or delivery forecast.','موانع و وابستگی‌های ثبت‌شده این اسپرینت؛ بدون امتیاز ریسک یا پیش‌بینی تحویل.')}</p></div>
  <div className="evidence-layout"><section className="evidence-main"><div className="section-heading"><h3><GitBranch size={16}/>{t('The dependency','وابستگی')}</h3><span className="fact-tag">{t('Recorded fact','واقعیت ثبت‌شده')}</span></div>
   {edges.length?edges.map(({from,to})=><div className="dependency-chain" key={from.id+to!.id}>
    {[from,to!].map((i,n)=><div className="chain-step" key={i.id}>{n===1&&<div className="chain-connector"><span/><span>{t('depends on','وابسته به')}</span><ArrowUpRight size={16}/></div>}<button className="chain-node" onClick={()=>inspect(i)}><div><bdi>{i.semanticKey}</bdi><ArrowUpRight size={15}/></div><strong>{issueTitle(i,l)}</strong><span><span className={'avatar '+i.assigneeId}>{i.assigneeId==='agent-hermes'?'🤖':owner(i,l)[0]}</span>{owner(i,l)}<span className="node-status">{labels[l][statuses.indexOf(i.status)]}</span></span></button></div>)}
   </div>):<p className="muted-copy">{t('No dependency is recorded for the issues in this filter.','برای کارهای این فیلتر وابستگی ثبت نشده است.')}</p>}
   <div className="section-heading blocker-heading"><h3><LockKeyhole size={16}/>{t('What is blocking progress','چه چیزی مانع پیشرفت است')}</h3><span>{blocked.length} {t('issues','کار')}</span></div>
   <div className="evidence-records">{blocked.map(i=><article className="evidence-record" key={i.id} data-issue={i.semanticKey}><div className="evidence-record-head"><bdi>{i.semanticKey}</bdi><span className="blocked">{t('Blocked','مسدود')}</span><span className="record-owner">{owner(i,l)}</span></div><h4>{issueTitle(i,l)}</h4><p>{blocker(i,l)||t('No blocker reason recorded.','علت مانع ثبت نشده است.')}</p><div className="record-actions"><button onClick={()=>inspect(i)}>{t('Inspect issue','بررسی کار')}<ArrowUpRight size={13}/></button><button onClick={()=>draft(i)}><FilePenLine size={13}/>{t('Draft next step','پیش‌نویس گام بعد')}</button></div></article>)}</div>
  </section><aside className="evidence-aside"><section className="schedule-note"><span className="section-kicker"><CalendarClock size={14}/>{t('SCHEDULING GAP','اطلاعات زمان‌بندی')}</span><h3>{missing.length? t('A date is still missing','تاریخ هنوز ثبت نشده'):t('Dates are recorded','تاریخ‌ها ثبت شده‌اند')}</h3>{missing.map(i=><div key={i.id}><button onClick={()=>inspect(i)}><bdi>{i.semanticKey}</bdi><ArrowUpRight size={13}/></button><dl><div><dt>{t('Start','شروع')}</dt><dd>{i.startDate?dateLabel(i.startDate,l,calendar):t('Not scheduled','بدون تاریخ')}</dd></div><div><dt>{t('Due','موعد')}</dt><dd>{i.dueDate?dateLabel(i.dueDate,l,calendar):t('Not scheduled','بدون تاریخ')}</dd></div></dl></div>)}</section>
   <section className="suggestion-note"><span className="suggestion-tag">{t('Suggested interpretation','برداشت پیشنهادی')}</span><h3>{t('Resolve the dependency first','ابتدا وابستگی را روشن کنید')}</h3><p>{edges.length?t('The linked contract approval may be a useful starting point. Confirm the recorded blocker with its owner before changing the plan.','تأیید قرارداد مرتبط می‌تواند نقطه شروع مناسبی باشد. پیش از تغییر برنامه، مانع ثبت‌شده را با مسئول بررسی کنید.'):t('Review the recorded blockers with their owners before changing the plan.','پیش از تغییر برنامه، موانع ثبت‌شده را با مسئولان بررسی کنید.')}</p><div className="evidence-limit"><Check size={14}/>{t('Suggestion only · no action taken','فقط پیشنهاد · اقدامی انجام نشده')}</div></section>
  </aside></div>
 </div>
}
