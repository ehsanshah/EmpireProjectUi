export type SpeechLanguage='en-US'|'fa-IR';
export type SpeechFailure='unsupported'|'insecure'|'no_microphone'|'permission_denied'|'network'|'silence'|'recognition'|'cancelled';
export class SpeechCaptureError extends Error{constructor(public code:SpeechFailure,message:string){super(message)}}
interface RecognitionResult {isFinal:boolean;0:{transcript:string}}
interface RecognitionEvent {resultIndex:number;results:ArrayLike<RecognitionResult>}
interface RecognitionLike {lang:string;interimResults:boolean;continuous:boolean;onresult:((event:RecognitionEvent)=>void)|null;onerror:((event:{error:string})=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void;abort:()=>void}
type RecognitionConstructor=new()=>RecognitionLike;
type SpeechWindow=Window & {SpeechRecognition?:RecognitionConstructor;webkitSpeechRecognition?:RecognitionConstructor};
export function speechCapability(){if(!window.isSecureContext)return {available:false,reason:'insecure' as const};if(!navigator.mediaDevices?.getUserMedia)return {available:false,reason:'no_microphone' as const};const browser=window as SpeechWindow;if(!browser.SpeechRecognition&&!browser.webkitSpeechRecognition)return {available:false,reason:'unsupported' as const};return {available:true as const}}
export interface SpeechCaptureSession {stop:()=>void;cancel:()=>void}
export async function startSpeechCapture(language:SpeechLanguage,handlers:{onInterim:(text:string)=>void;onTranscribing:()=>void;onFinal:(text:string)=>void;onError:(error:SpeechCaptureError)=>void;isCancelled:()=>boolean}):Promise<SpeechCaptureSession>{
 const capability=speechCapability();if(!capability.available)throw new SpeechCaptureError(capability.reason,capability.reason==='insecure'?'Microphone requires a secure context.':capability.reason==='unsupported'?'This browser does not support speech recognition.':'No microphone API is available.');
 let stream:MediaStream;try{stream=await navigator.mediaDevices.getUserMedia({audio:true})}catch(error){const name=error instanceof DOMException?error.name:'';throw new SpeechCaptureError(name==='NotAllowedError'||name==='PermissionDeniedError'?'permission_denied':'no_microphone',name==='NotAllowedError'?'Microphone permission was denied.':'No usable microphone was found.')}
 let released=false;const release=()=>{if(released)return;released=true;stream.getTracks().forEach(track=>track.stop())};if(handlers.isCancelled()){release();throw new SpeechCaptureError('cancelled','Recording cancelled.')}
 const Constructor=(window as SpeechWindow).SpeechRecognition||(window as SpeechWindow).webkitSpeechRecognition!;const recognition=new Constructor();recognition.lang=language;recognition.interimResults=true;recognition.continuous=true;
 let done=false;let finalText='';let interimText='';let finished=false;
 const finish=()=>{if(finished)return;finished=true;release();recognition.onresult=null;recognition.onerror=null;recognition.onend=null};
 recognition.onresult=(event)=>{let final='',interim='';for(let index=0;index<event.results.length;index++){const item=event.results[index];if(item.isFinal)final+=` ${item[0].transcript}`;else interim+=` ${item[0].transcript}`}finalText=final.trim();interimText=interim.trim();handlers.onInterim([finalText,interimText].filter(Boolean).join(' '))};
 recognition.onerror=(event)=>{if(finished)return;const code:SpeechFailure=event.error==='not-allowed'||event.error==='service-not-allowed'?'permission_denied':event.error==='network'?'network':event.error==='no-speech'?'silence':'recognition';finish();handlers.onError(new SpeechCaptureError(code,code==='network'?'Speech service is unavailable. Try again or use the typed test mode.':code==='silence'?'No speech was detected. Try again.':code==='permission_denied'?'Microphone permission was denied.':'Speech recognition failed. Try again.'))};
 recognition.onend=()=>{if(finished)return;const transcript=finalText.trim();finish();if(transcript)handlers.onFinal(transcript);else handlers.onError(new SpeechCaptureError('silence','No finalized speech was detected. Try again.'))};
 try{recognition.start()}catch{finish();throw new SpeechCaptureError('recognition','Speech recognition could not start.')}
 return {stop:()=>{if(done||finished)return;done=true;handlers.onTranscribing();release();recognition.stop()},cancel:()=>{if(finished)return;done=true;finish();recognition.abort()}};
}
