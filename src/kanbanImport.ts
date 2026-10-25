import {seed,type Area,type Issue, type Status} from './domain';
import {wipCount} from './kanban';
export type ImportedCard={title:string;titleEn:string;description:string;area:Area;status:Exclude<Status,'cancelled'>;priority:'normal'|'high';assigneeId:string};
const statuses=new Set(['backlog','todo','in_progress','review','completed']);
function csvRows(text:string):string[][]{
 const rows:string[][]=[];let row:string[]=[];let cell='';let quoted=false;
 for(let n=0;n<text.length;n++){const char=text[n];if(char==='"'){if(quoted&&text[n+1]==='"'){cell+='"';n++}else quoted=!quoted}else if(char===','&&!quoted){row.push(cell);cell=''}else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&text[n+1]==='\n')n++;row.push(cell);if(row.some(value=>value.trim()))rows.push(row);row=[];cell=''}else cell+=char}
 if(quoted)throw Error('Unclosed quote in CSV.');row.push(cell);if(row.some(value=>value.trim()))rows.push(row);return rows;
}
export function parseCardFile(text:string,fileName:string):ImportedCard[]{
 let raw:Record<string,unknown>[];
 if(fileName.toLowerCase().endsWith('.json')){const value=JSON.parse(text);raw=Array.isArray(value)?value:value?.cards;if(!Array.isArray(raw))throw Error('JSON must contain an array of cards.');}
 else if(fileName.toLowerCase().endsWith('.csv')){const rows=csvRows(text.replace(/^\uFEFF/,''));if(rows.length<2)throw Error('CSV needs a header and at least one card.');const headers=rows.shift()!.map(value=>value.trim());raw=rows.map(row=>Object.fromEntries(headers.map((header,n)=>[header,row[n]??''])));}
 else throw Error('Choose a .csv or .json file.');
 if(raw.length<1||raw.length>20)throw Error('Import 1 to 20 cards at a time.');
 return raw.map((item,n)=>{if(!item||typeof item!=='object')throw Error(`Card ${n+1} is invalid.`);const title=String(item.title??'').trim();if(!title||title.length>180)throw Error(`Card ${n+1} needs a title of at most 180 characters.`);const area=String(item.area??'web').toLowerCase();const status=String(item.status??'backlog').toLowerCase();const priority=String(item.priority??'normal').toLowerCase();if(area!=='web'&&area!=='mobile')throw Error(`Card ${n+1}: area must be web or mobile.`);if(!statuses.has(status))throw Error(`Card ${n+1}: status must be backlog, todo, in_progress, review, or completed.`);if(priority!=='normal'&&priority!=='high')throw Error(`Card ${n+1}: priority must be normal or high.`);return {title,titleEn:String(item.titleEn??title),description:String(item.description??''),area:area as Area,status:status as ImportedCard['status'],priority:priority as ImportedCard['priority'],assigneeId:String(item.assigneeId??'')}});
}
export function appendImportedCards(issues:Issue[],cards:ImportedCard[],limit:number):Issue[]{
 if(wipCount(issues)+cards.filter(card=>card.status==='in_progress').length>limit)throw Error('WIP limit reached. Import would exceed the shared In Progress limit.');
 const first=seed()[0];let number=Math.max(...issues.map(issue=>Number(issue.semanticKey.split('-')[1])));
 return [...issues,...cards.map(card=>{number++;return {...first,id:crypto.randomUUID(),semanticKey:`EMP-${number}`,title:card.title,titleEn:card.titleEn,description:card.description,descriptionEn:card.description,status:card.status,area:card.area,assigneeId:card.assigneeId,priority:card.priority,blocked:false,blockerReason:null,blockerReasonEn:null,startDate:null,dueDate:null,dependencies:[],comments:[],acceptanceCriteria:[],acceptanceCriteriaEn:[],manualOrder:number,boardOrder:number,version:1} as Issue})];
}
