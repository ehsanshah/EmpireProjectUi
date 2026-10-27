export type FlowStatus = 'done'|'needs_decision'|'in_progress'|'waiting'|'ready';
export interface FlowIssue {id:string;key:string;title:string;titleFa:string;status:FlowStatus;owner:string;context:string;contextFa:string}
export interface FlowEdge {from:string;to:string}
export interface FlowGraph {nodes:FlowIssue[];edges:FlowEdge[]}
export const paymentFlow:FlowGraph={nodes:[
 {id:'pay-38',key:'PAY-38',title:'Design error messages',titleFa:'طراحی پیام‌های خطا',status:'done',owner:'Sara',context:'Product design',contextFa:'طراحی محصول'},
 {id:'pay-42',key:'PAY-42',title:'Retry payment',titleFa:'تلاش دوباره برای پرداخت',status:'needs_decision',owner:'Ali',context:'Waiting for gateway response',contextFa:'در انتظار پاسخ درگاه'},
 {id:'pay-46',key:'PAY-46',title:'Record payment events',titleFa:'ثبت رویدادهای پرداخت',status:'in_progress',owner:'Mina',context:'Engineering',contextFa:'مهندسی'},
 {id:'pay-51',key:'PAY-51',title:'Test and prepare release',titleFa:'آزمون و آماده‌سازی انتشار',status:'waiting',owner:'Nima',context:'2 open dependencies',contextFa:'۲ پیش‌نیاز باز'},
],edges:[{from:'pay-38',to:'pay-42'},{from:'pay-38',to:'pay-46'},{from:'pay-42',to:'pay-51'},{from:'pay-46',to:'pay-51'}]};
export function validateGraph(graph:FlowGraph):FlowGraph{
 const ids=new Set(graph.nodes.map(n=>n.id));if(ids.size!==graph.nodes.length)throw Error('Duplicate workflow node');
 const edgeIds=new Set<string>();for(const edge of graph.edges){if(!ids.has(edge.from)||!ids.has(edge.to))throw Error('Unknown workflow node');if(edge.from===edge.to)throw Error('Self dependency');const pair=`${edge.from}:${edge.to}`;if(edgeIds.has(pair))throw Error('Duplicate workflow edge');edgeIds.add(pair)}
 const visiting=new Set<string>(),visited=new Set<string>();function visit(id:string){if(visiting.has(id))throw Error('Workflow cycle');if(visited.has(id))return;visiting.add(id);for(const edge of graph.edges.filter(e=>e.from===id))visit(edge.to);visiting.delete(id);visited.add(id)}for(const node of graph.nodes)visit(node.id);return graph;
}
export function prerequisites(graph:FlowGraph,id:string){return graph.edges.filter(e=>e.to===id).map(e=>graph.nodes.find(n=>n.id===e.from)!).filter(Boolean)}
export function effectiveStatus(graph:FlowGraph,id:string):FlowStatus{const node=graph.nodes.find(n=>n.id===id);if(!node)throw Error('Unknown workflow node');if(id==='pay-51')return prerequisites(graph,id).every(i=>effectiveStatus(graph,i.id)==='done')?'ready':'waiting';return node.status}
export function updateFlowStatus(graph:FlowGraph,id:string,status:'done'|'needs_decision'|'in_progress'):FlowGraph{if(!['pay-42','pay-46'].includes(id))return graph;return {...graph,nodes:graph.nodes.map(n=>n.id===id?{...n,status}:n)}}
export function activeBlockers(graph:FlowGraph,id='pay-51'){return prerequisites(graph,id).filter(i=>effectiveStatus(graph,i.id)!=='done')}
export function paths(graph:FlowGraph,from:string,to:string):string[][]{const result:string[][]=[];function walk(id:string,seen:string[]){if(id===to){result.push(seen);return}for(const edge of graph.edges.filter(e=>e.from===id))if(!seen.includes(edge.to))walk(edge.to,[...seen,edge.to])}walk(from,[from]);return result}
export interface Position {x:number;y:number}
export const CARD_W=216,CARD_H=132,CANVAS_W=1064,CANVAS_H=420;
export function layoutGraph(graph:FlowGraph):Record<string,Position>{validateGraph(graph);const level=new Map<string,number>();function depth(id:string):number{if(level.has(id))return level.get(id)!;const parents=graph.edges.filter(e=>e.to===id);const value=parents.length?Math.max(...parents.map(e=>depth(e.from)))+1:0;level.set(id,value);return value}for(const node of graph.nodes)depth(node.id);const max=Math.max(...level.values());const result:Record<string,Position>={};for(let n=0;n<=max;n++){const group=graph.nodes.filter(node=>level.get(node.id)===n);group.forEach((node,index)=>{result[node.id]={x:32+n*(CANVAS_W-CARD_W-64)/Math.max(1,max),y:(CANVAS_H-CARD_H)/2+(index-(group.length-1)/2)*172}})}return result}
export function edgeText(graph:FlowGraph,edge:FlowEdge){const a=graph.nodes.find(n=>n.id===edge.from)!,b=graph.nodes.find(n=>n.id===edge.to)!;return `${a.key} must be completed before ${b.key} can proceed.`}
