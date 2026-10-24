import {pets} from './journey-pet-art.mjs';
import {sampleFrames} from './journey-animation.mjs';
import {setStyles} from './journey-render.mjs';

export const petSets=Object.freeze({
 luna6:Object.freeze([5002665,5002666,5002667]),
 demonSlayer:Object.freeze([5002732,5002733,5002734]),
 frieren:Object.freeze([5002828,5002829,5002830])
});
export const petTeams=Object.freeze({
 warrior:petSets.demonSlayer,mage:petSets.frieren,thief:petSets.luna6,
 archer:petSets.luna6,pirate:petSets.demonSlayer
});
export const petsFor=id=>(Object.hasOwn(petTeams,id)?petTeams[id]:[]).map(id=>pets[id]);
export function newPetParty(id,x=25,y=0,facing=1){
 return petsFor(id).map((pet,index)=>({id:pet.id,x:Math.max(3,Math.min(96,x-facing*(index+1)*5)),y,facing,moving:false,fetchTime:0}));
}
// A pet travels directly to landed loot, independent of the player's platform.
export function stepPetParty(party,player,state,delta,width){
 if(state.paused||state.phase==='dead'||player.climbing||!width)return {party,collected:false};
 const dt=Math.max(0,Math.min(delta,100))/1000;
 let collected=false,petId=null;
 const fetching=state.phase==='reward'&&state.rewardBeat===0&&state.lootLanded&&state.rewardNew;
 const next=party.map((pet,index)=>{
  const collect=fetching&&index===0,leader=index===0||fetching&&index===1?player:party[index-1];
  const targetX=collect?state.lootX:leader.x,targetY=collect?0:leader.y,dx=(targetX-pet.x)/100*width,dy=targetY-pet.y;
  const gap=Math.min(52,width*.05),horizontal=collect?dx:Math.sign(dx)*Math.max(0,Math.abs(dx)-gap),distance=Math.hypot(horizontal,dy),step=Math.min(distance,(collect?900:620)*dt),ratio=distance?step/distance:0,travelX=horizontal*ratio,travelY=dy*ratio;
  const next={...pet,x:pet.x+travelX/width*100,y:pet.y+travelY,facing:Math.abs(travelX)>.5?(travelX<0?-1:1):pet.facing,moving:Math.hypot(travelX,travelY)>.2,fetchTime:collect?pet.fetchTime+delta:0};
  if(collect&&distance-step<=12&&next.fetchTime>=350){collected=true;petId=pet.id;}
  return next;
 });
 return {party:next,collected,petId};
}
export function createPetView(host,{asset,mobile}){
 let classId=null,party=[],entries=[],time=0,wasClimbing=false;
 return {
  show(id){
   if(classId===id)return;classId=id;party=newPetParty(id);entries=[];host.replaceChildren();
   for(const pet of petsFor(id)){
    const anchor=document.createElement('span'),image=document.createElement('img');anchor.className='journey-pet';anchor.title=pet.zhName+' / '+pet.name;anchor.dataset.petId=String(pet.id);
    image.alt='';image.draggable=false;image.decoding='async';anchor.append(image);host.append(anchor);entries.push({anchor,image,pet});
   }
  },
  reset(x=25,y=0){party=newPetParty(classId,x,y);time=0;wasClimbing=false;},
  tick(delta,player,state,width,reduced=false){
   if(player.climbing){wasClimbing=true;host.hidden=true;return {party,collected:false};}
   if(wasClimbing){party=newPetParty(classId,player.x,player.y,player.facing);wasClimbing=false;}
   const result=stepPetParty(party,player,state,delta,width);party=result.party;if(!state.paused&&state.phase!=='dead')time+=Math.max(0,delta);host.hidden=['ready','complete'].includes(state.phase)||!party.length;
   party.forEach((p,index)=>{
    const {anchor,image,pet}=entries[index],scale=mobile()?.7:.85;
    const pose=state.phase==='reward'&&index===0&&state.rewardBeat===0&&state.lootLanded?'jump':p.moving?'move':'stand0';
    const frame=sampleFrames(pet.poses[pose],reduced?0:time,true)?.frame;if(!frame)return;
    if(!image.src.endsWith(frame.file))image.src=asset(frame.file);
    setStyles(anchor,{left:`${p.x}%`,bottom:`calc(var(--ground-inset) + ${p.y}px)`});
    setStyles(image,{width:`${frame.width*scale}px`,height:`${frame.height*scale}px`,left:`${-frame.origin.x*scale}px`,top:`${-frame.origin.y*scale}px`,transform:p.facing===1?'scaleX(-1)':'none',transformOrigin:`${frame.origin.x*scale}px ${frame.origin.y*scale}px`});
   });return result;
  }
 };
}
