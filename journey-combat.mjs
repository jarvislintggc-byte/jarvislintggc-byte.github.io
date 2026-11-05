import {ruleFor} from './journey-skill-rules.mjs?v=3e916b2ea3f82009';
import {castSpan,packetInterval} from './journey-skill-timing.mjs?v=3e916b2ea3f82009';
// A single continuous clock for approach, original cast, recovery and departure.
const clamp=value=>Math.max(0,Math.min(1,value));
const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
export function impactTimes(ability){
  const times=ability?.tracks.filter(track=>track.anchor==='boss').map(track=>track.start)||[];
  const start=times[0]??(ability?Math.min(650,ability.actorDuration*.5):450),rule=ruleFor(ability);
  return Array.from({length:rule.packets},(_,i)=>start+i*packetInterval(ability));
}
export function combatPlan(ability,classId,casts=1,positions={}){
  const ranged=['mage','archer'].includes(classId)&&Boolean(ability);
  const startX=positions.startX??10,targetX=positions.targetX??64,facing=Math.sign(targetX-startX)||1;
  const stationary=Boolean(positions.stationary),castX=stationary?startX:Math.max(5,Math.min(positions.maxX??94,targetX-facing*(ranged?21:8)));
  const castDuration=ability?castSpan(ability)+75:1050;
  casts=casts===3?3:1;
  const recovery=140,activeDuration=castDuration*casts+recovery*(casts-1);
  const approach=stationary?0:320,departure=stationary?0:360;
  return {approach,castDuration,casts,recovery,activeDuration,departure,startX,targetX,facing,castX,stationary,total:approach+activeDuration+departure};
}
export function watchImpactTimes(ability,classId,casts=1,positions={}){
 const plan=combatPlan(ability,classId,casts,positions);
 return Array.from({length:plan.casts},(_,cast)=>impactTimes(ability).map(time=>plan.approach+cast*(plan.castDuration+plan.recovery)+time)).flat();
}
export function combatFrame(ability,classId,time,casts=1,positions={}){
  const plan=combatPlan(ability,classId,casts,positions),activeTime=time-plan.approach;
  const castIndex=Math.max(0,Math.min(plan.casts-1,Math.floor(activeTime/(plan.castDuration+plan.recovery))));
  const castTime=activeTime-castIndex*(plan.castDuration+plan.recovery);
  if(time<plan.approach)return {x:plan.startX+(plan.castX-plan.startX)*smooth(time/plan.approach),facing:Math.sign(plan.castX-plan.startX)||plan.facing,pose:'walk',castTime:-1,hit:0};
  if(castTime<plan.castDuration){
    const impacts=impactTimes(ability);
    const hit=Math.max(0,...impacts.map(start=>{const t=(castTime-start)/180;return t>=0&&t<1?Math.sin(t*Math.PI):0;}));
    return {x:plan.castX,facing:plan.facing,pose:ability?'cast':castTime<750?'attack':'idle',castTime,castIndex,hit};
  }
  if(activeTime<plan.activeDuration)return {x:plan.castX,facing:plan.facing,pose:'idle',phase:'recovery',castTime:-1,castIndex,hit:0};
  if(plan.stationary)return {x:plan.castX,facing:plan.facing,pose:'idle',castTime:-1,castIndex,hit:0};
  return {x:plan.castX+(plan.targetX-plan.castX)*smooth((activeTime-plan.activeDuration)/plan.departure),facing:plan.facing,pose:'walk',castTime:-1,castIndex,hit:0};
}
