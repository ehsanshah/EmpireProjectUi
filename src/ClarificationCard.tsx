import {uiText} from './i18n';
import {useEffect,useId,useRef,useState,type FormEvent} from 'react';
import {ArrowLeft,ArrowUp,Check,PenLine,X} from 'lucide-react';

export interface ClarificationOption {id:string;label:string;detail:string}
export interface ClarificationAnswer {kind:'option'|'text'|'skip';value:string;revision:number}
interface Props {locale:'en'|'fa'|'ar';required:boolean;context:string;options:ClarificationOption[];answer:ClarificationAnswer|null;draftText:string;otherOpen:boolean;onDraftText:(value:string)=>void;onOtherOpen:(value:boolean)=>void;onAnswer:(answer:ClarificationAnswer|null)=>void;onClose:()=>void;questionTitle?:string;whyNeeded?:string;position?:{index:number;total:number};onBack?:()=>void;busy?:boolean;externalError?:string}

/** Local presentation preview. It never issues a project command or engine request. */
export function ClarificationCard({locale,required,context,options,answer,draftText,otherOpen,onDraftText,onOtherOpen,onAnswer,onClose,questionTitle,whyNeeded,position,onBack,busy=false,externalError=''}:Props){
 const fa=locale==='fa',t=(en:string,persian:string,ar?:string)=>uiText(locale,en,persian,ar);
 const id=useId();const [error,setError]=useState('');const otherRef=useRef<HTMLInputElement>(null);const closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{closeRef.current?.focus()},[]);
 useEffect(()=>{if(otherOpen)otherRef.current?.focus()},[otherOpen]);
 function submitText(e:FormEvent){e.preventDefault();const value=draftText.trim();if(!value){setError(t('Enter an answer first.','ابتدا پاسخ را وارد کنید.'));otherRef.current?.focus();return}setError('');onAnswer({kind:'text',value,revision:1})}
 const choose=(id:string)=>{setError('');onAnswer({kind:'option',value:id,revision:1})};
 const selected=answer?.kind==='option'?options.find(option=>option.id===answer.value):null;
 return <section className="clarification-card" aria-labelledby={`${id}-title`} aria-busy={busy} data-testid="clarification-card" onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();onClose()}}}>
  <div className="clarification-top"><div><span className="clarification-kicker">{position?`${t('DEMO QUESTION','پرسش آزمایشی')} ${position.index+1} ${t('of','از')} ${position.total}`:t('DEMO CLARIFICATION · NO ACTION SENT','پرسش آزمایشی · اقدامی ارسال نمی‌شود')}</span><h3 id={`${id}-title`}>{questionTitle??t('Which Sara do you mean?','منظورتان کدام سارا است؟')}</h3></div><button ref={closeRef} type="button" className="clarification-close" onClick={onClose} aria-label={t('Close clarification','بستن پرسش')}><X size={16}/></button></div>
  <p className="clarification-context">{context} · {whyNeeded??t('Two demo people match this name.','دو شخص نمونه با این نام مطابقت دارند.')}</p>
  {onBack&&<button type="button" className="clarification-back" onClick={onBack}>{t('Back to previous question','بازگشت به پرسش قبل')}</button>}
  {externalError&&<p className="clarification-error" role="alert">{externalError}</p>}
  {answer?<div className="clarification-result" role="status"><Check size={18}/><div><strong>{answer.kind==='skip'?t('Skipped in this preview','در این پیش‌نمایش رد شد'):t('Answer recorded in this preview','پاسخ در این پیش‌نمایش ثبت شد')}</strong><span>{answer.kind==='option'?selected?.label:answer.kind==='text'?answer.value:t('Optional question','پرسش اختیاری')}</span><small>{t('No issue, membership or project was changed.','هیچ کار، عضویت یا پروژه‌ای تغییر نکرد.')}</small></div><button type="button" onClick={()=>{onAnswer(null);onOtherOpen(answer.kind==='text');if(answer.kind==='text')onDraftText(answer.value)}}><ArrowLeft size={14}/>{t('Edit answer','ویرایش پاسخ')}</button></div>:<>
   <div className="clarification-options" role="group" aria-label={t('Choose an answer','انتخاب پاسخ')}>{options.map((option,index)=><button type="button" key={option.id} disabled={busy} onClick={()=>choose(option.id)}><span className="clarification-number" aria-hidden="true">{index+1}</span><span className="clarification-option-copy"><strong>{option.label}</strong><small>{option.detail}</small></span><ArrowUp size={14} className="clarification-option-arrow"/></button>)}<button type="button" disabled={busy} onClick={()=>{onOtherOpen(true);setError('')}} aria-expanded={otherOpen}><span className="clarification-number"><PenLine size={14}/></span><span className="clarification-option-copy"><strong>{t('Something else…','پاسخ دیگر…')}</strong><small>{t('Type the answer in your own words','پاسخ را با کلمات خودتان بنویسید')}</small></span></button></div>
   <form className="clarification-direct" onSubmit={submitText}><label htmlFor={`${id}-answer`}>{otherOpen?t('Your answer','پاسخ شما'):t('Or reply directly…','یا مستقیم پاسخ دهید…')}</label><div><input ref={otherRef} id={`${id}-answer`} value={draftText} onChange={e=>{onDraftText(e.target.value);setError('')}} aria-invalid={!!error} aria-describedby={error?`${id}-error`:undefined} placeholder={t('Name or detail','نام یا توضیح')}/><button type="submit" aria-label={t('Send clarification answer','ارسال پاسخ پرسش')}><ArrowUp size={16}/></button></div>{error&&<p id={`${id}-error`} className="clarification-error" role="alert">{error}</p>}</form>
   <div className="clarification-actions"><span>{required?t('Answer required to continue','برای ادامه پاسخ لازم است'):t('Optional question','پرسش اختیاری')}</span>{!required&&<button type="button" disabled={busy} onClick={()=>onAnswer({kind:'skip',value:'',revision:1})}>{t('Skip','رد کردن')}</button>}</div>
  </>}
 </section>
}
