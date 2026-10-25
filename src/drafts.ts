import type {Issue} from './domain';
import {blocker,criteria,owner,type Locale} from './Investigation';
export interface FollowUpDraft {issueId:string;body:string;locale:Locale}
const key='empire-follow-up-drafts-v1';
export function proposedDraft(issue:Issue,issues:Issue[],locale:Locale):string {
 const related=issue.dependencies.map(id=>issues.find(i=>i.id===id)).filter((i):i is Issue=>Boolean(i));
 if(locale==='fa')return `پیگیری پیشنهادی برای ${issue.semanticKey}\n\nمسئول: ${owner(issue,locale)}\nمانع ثبت‌شده: ${blocker(issue,locale)||'مانعی ثبت نشده است.'}\n${related.length?`وابسته به: ${related.map(i=>`${i.semanticKey} (${owner(i,locale)})`).join('، ')}\n`:''}\nگام پیشنهادی: ${related.length?'وضعیت وابستگی را با مسئول آن بررسی کنید و موارد لازم برای رفع مانع را ثبت کنید.':issue.blocked?'از مسئول بخواهید موارد لازم برای رفع مانع ثبت‌شده را مشخص کند.':'با مسئول، گام بعدی برای معیار پذیرش را مرور کنید.'}\n${!issue.startDate||!issue.dueDate?'زمان‌بندی مشخص نیست؛ پیش از ثبت تاریخ، آن را با مسئول هماهنگ کنید.\n':''}\nمعیار پذیرش:\n${criteria(issue,locale).map(c=>`• ${c}`).join('\n')||'ثبت نشده است.'}\n\nاین متن پیش‌نویس محلی است و ارسال نشده است.`;
 return `Proposed follow-up · ${issue.semanticKey}\n\nOwner: ${owner(issue,locale)}\nRecorded blocker: ${blocker(issue,locale)||'No blocker recorded.'}\n${related.length?`Depends on: ${related.map(i=>`${i.semanticKey} (${owner(i,locale)})`).join(', ')}\n`:''}\nProposed next step: ${related.length?'Check the linked dependency with its owner and document what is still needed to clear the blocker.':issue.blocked?'Ask the owner to confirm what is needed to resolve the documented blocker.':'Review the acceptance criteria with the owner and agree on the next step.'}\n${!issue.startDate||!issue.dueDate?'Scheduling is incomplete; confirm dates with the owner before recording a plan.\n':''}\nAcceptance criteria:\n${criteria(issue,locale).map(c=>`• ${c}`).join('\n')||'Not specified.'}\n\nLocal draft only. Nothing has been sent.`;
}
export function readDrafts():{drafts:Record<string,FollowUpDraft>;error:boolean} {
 try{const raw=localStorage.getItem(key);if(!raw)return {drafts:{},error:false};const drafts=JSON.parse(raw);if(!drafts||Array.isArray(drafts)||typeof drafts!=='object'||!Object.values(drafts).every(d=>{const v=d as FollowUpDraft;return typeof v.issueId==='string'&&typeof v.body==='string'&&['en','fa'].includes(v.locale)}))throw Error('Invalid drafts');return {drafts,error:false}}catch{return {drafts:{},error:true}}
}
export function writeDraft(draft:FollowUpDraft):boolean {
 try{const existing=readDrafts();if(existing.error)return false;localStorage.setItem(key,JSON.stringify({...existing.drafts,[draft.issueId]:draft}));return true}catch{return false}
}
