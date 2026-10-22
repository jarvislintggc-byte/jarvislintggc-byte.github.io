import {dialoguePerformances} from './journey-expression-cues.mjs';
// Current first-person narration uses owner-confirmed facts, not private quotes.
export function isClosingSpeech(state){
  return state.phase==='portal'||state.phase==='reward'&&state.rewardBeat===3;
}
export function storyLine(state,chapter){
  if(isClosingSpeech(state))return [chapter.result,chapter.bridge].filter(Boolean).join(' ');
  if(['reading','encounter','retiring','reward'].includes(state.phase)||state.phase==='battle'&&state.castReturn!=='portal')return chapter.pages[state.page];
  if(state.phase==='battle'&&state.castReturn==='portal')return [chapter.result,chapter.bridge].filter(Boolean).join(' ');
  if(['portal','walking'].includes(state.phase))return [chapter.result,chapter.bridge].filter(Boolean).join(' ');
  return '';
}
export function readingDuration(text){
  const chinese=(text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu)||[]).length;
  const words=(text.match(/[A-Za-z0-9]+/g)||[]).length;
  return Math.max(3200,Math.min(chinese?8000:22000,1000+chinese*155+words*260));
}
export function autoAdvanceDue(state,elapsed,text,enabled){
  return enabled&&!state.paused&&['reading','portal'].includes(state.phase)&&!(state.mode==='manual'&&state.phase==='portal')&&elapsed>=readingDuration(text);
}
export function bubbleGeometry({width,height,actorX,boxWidth,boxHeight,headHeight}){
  const left=Math.max(12,Math.min(width-boxWidth-12,width*actorX/100-boxWidth/2));
  return {left,bottom:Math.max(30,Math.min(46+headHeight+30,height-boxHeight-12)),
    // The original diagonal tail's visible tip is at source x=1 (2 CSS px).
    tail:Math.max(12,Math.min(boxWidth-38,width*actorX/100-left-2))};
}

// Finished speech leaves the scene; its text remains in the bottom history.
export function speechVisible(state,chapter,elapsed=0,text=storyLine(state,chapter)){
 return state.phase==='reading'||isClosingSpeech(state)&&elapsed<readingDuration(text);
}
export function dialogueExpression(state,chapter,elapsed=0,text=storyLine(state,chapter)){
 if(!speechVisible(state,chapter,elapsed,text))return 'default';
 const page=isClosingSpeech(state)?'portal':state.page;
 return dialoguePerformances.find(cue=>cue.chapter===chapter.id&&cue.page===page)?.expression||'default';
}
