import {npcCast} from './journey-npc-scenes.mjs';
import {npcArt} from './journey-npc-art.mjs';
import {sampleFrames,sequenceDuration} from './journey-animation.mjs';
import {setStyles} from './journey-render.mjs';
import {npcFloorPosition,npcSpriteScale} from './journey-npc-platforms.mjs';

// Every NPC keeps a bubble; lines rotate without empty intervals.
export function npcSpeechPages(text,language='zh-Hant'){
 const english=language==='en',tokens=english?text.split(/\s+/):Array.from(text),pages=[],limit=english?34:18;let page='';
 for(const token of tokens){const next=page+(english&&page?' ':'')+token;if(page&&next.length>limit){pages.push(page);page=token;}else page=next;}
 if(page)pages.push(page);
 if(pages.length>1&&pages.at(-1).length<limit*.5){
  const joined=pages.slice(-2).join(english?' ':''),parts=english?joined.split(' '):Array.from(joined);let balanced=null;
  for(let cut=1;cut<parts.length;cut++){const a=parts.slice(0,cut).join(english?' ':''),b=parts.slice(cut).join(english?' ':'');if(a.length<=limit&&b.length<=limit&&(!balanced||Math.abs(a.length-b.length)<balanced.cost))balanced={a,b,cost:Math.abs(a.length-b.length)};}
  if(balanced)pages.splice(-2,2,balanced.a,balanced.b);
 }
 return pages;
}
export function ambientSpeech(actors,time,{language='zh-Hant',compact=false}={}){
 return actors.map((actor,index)=>{const local=Math.max(0,time-index*2300),line=actor.lines[Math.floor(local/10500)%actor.lines.length],fullText=line[language]||line['zh-Hant'],pages=compact?npcSpeechPages(fullText,language):[fullText];return {index,fullText,text:pages[Math.min(pages.length-1,Math.floor((local%10500)/10500*pages.length))]};});
}
export function trainingMotion(time,index=0,reduced=false){
 const local=(time+index*370)%9600,part=Math.floor(local/2400),progress=(local%2400)/2400;
 if(reduced)return {x:0,y:0,squat:1,facing:1,part};
 return {x:part===0?Math.sin(progress*Math.PI*2)*13:0,y:part===2?Math.max(0,Math.sin(progress*Math.PI*4))*17:0,squat:part===1?1-Math.max(0,Math.sin(progress*Math.PI*4))*.27:1,facing:part===0&&progress>.25&&progress<.75?-1:1,part};
}
export function npcPose(art,time,index=0,base='stand',reduced=false){
 if(reduced)return {pose:base,time:0};
 const local=(time+index*1100)%6800,face=['eye','eyebrow','wink','head'].find(p=>art.poses[p]?.length);
 if(face&&local>=3600&&local<3600+sequenceDuration(art.poses[face]))return {pose:face,time:local-3600};
 if(art.poses.say?.length&&local>=700&&local<Math.min(3300,700+sequenceDuration(art.poses.say)))return {pose:'say',time:local-700};
 return {pose:base,time};
}
const overlaps=(a,b)=>a.left<b.right+8&&a.right+8>b.left&&a.bottom<b.top+8&&a.top+8>b.bottom;
export function layoutNpcBubbles(items,{width,height=600,narrationBounds=null}){
 const occupied=narrationBounds?[narrationBounds]:[],boxes=[];
 for(const item of items){
  const w=Math.min(item.width,width-16),preferred=Math.max(8,Math.min(width-w-8,item.x-w/2)),maxBottom=Math.max(8,height-85-item.height);
  const choices=(width<600&&narrationBounds?[8,width-w-8]:[preferred,8,width-w-8,width/2-w/2,...boxes.map(b=>b.right+10),...boxes.map(b=>b.left-w-10)]).map(x=>Math.max(8,Math.min(width-w-8,x)));
  let best=null;
  for(const left of new Set(choices)){
   let bottom=Math.max(8,item.bottom),box;
   for(let pass=0;pass<=occupied.length;pass++){
    box={left,right:left+w,bottom,top:bottom+item.height,width:w,height:item.height};
    const hit=occupied.filter(b=>overlaps(box,b));if(!hit.length)break;bottom=Math.max(...hit.map(b=>b.top+10));
   }
   if(bottom>maxBottom)continue;
   const cost=Math.abs(left-preferred)+Math.abs(bottom-item.bottom)*.7;
   if(!best||cost<best.cost)best={...box,cost};
  }
  if(!best){const bottom=Math.max(8,Math.min(maxBottom,item.bottom));best={left:preferred,right:preferred+w,bottom,top:bottom+item.height,width:w,height:item.height};}
  occupied.push(best);boxes.push(best);
 }
 return boxes;
}
const drills={'zh-Hant':['行進訓練','蹲姿訓練','跳躍訓練','瞄準訓練'],en:['MARCH','SQUATS','JUMPS','AIM']};
const shortTrainingRoles={2152002:{'zh-Hant':'反抗軍法師',en:'R. Mage'},2152003:{'zh-Hant':'反抗軍弩手',en:'R. Archer'},2152005:{'zh-Hant':'反抗軍機甲',en:'R. Mech'}};
const put=(node,text)=>{if(node.textContent!==text)node.textContent=text;};
export function createNpcView(host,{asset}){
 let chapter=-1,castKind='',entries=[],time=0,lastDraw=-Infinity,lastLanguage='',lastWidth=0,lastHeight=0,lastReduced=null,lastMobile=null;
 return {
  show(index,kind='native'){
   if(chapter===index&&castKind===kind)return;if(chapter!==index)time=0;chapter=index;castKind=kind;lastDraw=-Infinity;entries=[];host.replaceChildren();
   for(const actor of npcCast(index,kind)){
    const anchor=document.createElement('div'),image=document.createElement('img'),name=document.createElement('span'),bubble=document.createElement('p'),drill=document.createElement('span');
    anchor.className='journey-npc';anchor.dataset.npcId=String(actor.id);anchor.dataset.action=actor.action;
    image.alt='';image.draggable=false;image.decoding='async';name.className='npc-name';bubble.className='npc-bubble';bubble.hidden=false;drill.className='npc-drill';drill.hidden=actor.action!=='training';
    anchor.append(image,name,bubble,drill);host.append(anchor);entries.push({actor,anchor,image,name,bubble,drill});
   }
  },
  tick(delta,{state,language='zh-Hant',width,height=600,groundInset=46,mobile=false,reduced=false,narrationBounds=null,floor=()=>0,placements=null}){
   if(state.phase==='ready')time=0;
   if(!state.paused&&!['ready','complete','dead'].includes(state.phase))time+=Math.max(0,delta);
   host.hidden=['ready','complete'].includes(state.phase);if(host.hidden)return;
   const stamp=Math.floor(time/80),speech=ambientSpeech(entries.map(e=>e.actor),time,{language,compact:mobile}),layout=[];
   // Layout follows story movement immediately, while native sprite updates stay bounded.
   const redraw=stamp!==lastDraw||lastLanguage!==language||lastWidth!==width||lastHeight!==height||lastReduced!==reduced||lastMobile!==mobile;
   lastDraw=stamp;lastLanguage=language;lastWidth=width;lastHeight=height;lastReduced=reduced;lastMobile=mobile;
   if(redraw)host.setAttribute('aria-label',language==='en'?'Scene NPCs · fictional game performance':'場景 NPC・遊戲虛構演出');
   entries.forEach((entry,index)=>{
    const {actor,anchor,image,name,bubble,drill}=entry,art=npcArt[actor.id],training=actor.action==='training';
    const motion=training?trainingMotion(time,index,reduced):{x:0,y:0,squat:1,facing:actor.x>60?-1:1,part:0},facing=placements?.[index]?.facing??motion.facing;
    const base=training&&motion.part===3&&art.poses.hand?'hand':actor.action==='work'&&art.poses.work?'work':actor.action==='work'&&art.poses.finger?'finger':'stand';
    const selected=npcPose(art,time,index,base,reduced),frame=sampleFrames(art.poses[selected.pose],selected.time,true)?.frame;if(!frame)return;
    const at=mobile?actor.mobileX??actor.x:actor.x,scale=npcSpriteScale(art,mobile,training),position=placements?.[index]?npcFloorPosition(placements[index],motion.x):{x:at*width/100+motion.x,y:floor(at*width/100+motion.x)},x=position.x,foot=groundInset+position.y+motion.y;
    put(bubble,speech[index].text);if(entry.fullText!==speech[index].fullText){entry.fullText=speech[index].fullText;bubble.title=entry.fullText;bubble.setAttribute('aria-label',entry.fullText);}
    if(redraw){
     if(!image.src.endsWith(frame.file))image.src=asset(frame.file);anchor.dataset.pose=selected.pose;
     const role=mobile&&training?shortTrainingRoles[actor.id]||actor.role:actor.role;put(name,(role[language]||role['zh-Hant'])+' · NPC');
     if(training){put(drill,drills[language==='en'?'en':'zh-Hant'][motion.part]);setStyles(drill,{top:placements?.[index]?.location==='portal'?`${-Math.max(...art.poses.stand.map(f=>f.origin.y))*scale-15}px`:''});}
     setStyles(image,{width:`${frame.width*scale}px`,height:`${frame.height*scale}px`,left:`${-frame.origin.x*scale}px`,top:`${-frame.origin.y*scale}px`,transformOrigin:`${frame.origin.x*scale}px ${frame.origin.y*scale}px`,transform:`scale(${facing===1?-1:1},${motion.squat.toFixed(2)})`});
    }
    setStyles(anchor,{left:placements?`${x}px`:motion.x?`calc(${at}% + ${motion.x.toFixed(1)}px)`:`${at}%`,bottom:`calc(var(--ground-inset) + ${position.y+motion.y}px)`,transform:'none'});
    const bubbleWidth=Math.min(mobile?136:202,width*.44),characters=Math.max(8,(bubbleWidth-22)/(language==='en'?5.8:mobile?11:12)),bubbleHeight=Math.ceil(speech[index].text.length/characters)*(mobile?16.5:18)+20;
    entry.layoutFoot=foot;entry.layoutX=x;layout.push({x,bottom:foot+Math.max(...art.poses.stand.map(f=>f.origin.y))*scale+15,width:bubbleWidth,height:bubbleHeight});
   });
   const boxes=layoutNpcBubbles(layout,{width,height,narrationBounds});
   entries.forEach((entry,index)=>{const box=boxes[index];if(!box)return;setStyles(entry.bubble,{bottom:`${box.bottom-entry.layoutFoot}px`,width:`${box.width}px`,transform:`translateX(${box.left-entry.layoutX}px)`});const tail=`${Math.max(12,Math.min(box.width-16,entry.layoutX-box.left))}px`;if(entry.tail!==tail){entry.bubble.style.setProperty?.('--npc-tail',tail);entry.tail=tail;}});
  }
 };
}
