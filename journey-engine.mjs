import { attackDamage, encounterHealth } from './journey-enemy.mjs?v=097c1c54bb80891c';
import { jobById, skillRankFor } from './journey-growth.mjs?v=097c1c54bb80891c';
import {petTeams} from './journey-pets.mjs?v=097c1c54bb80891c';
import {levelFor} from './journey-progression.mjs?v=097c1c54bb80891c';
import {ruleFor,splitDamage} from './journey-skill-rules.mjs?v=097c1c54bb80891c';
const castRule=s=>ruleFor(s.castSkill?{id:jobById[s.classId].skillIds[skillRankFor(s.completed)-1]}:null);
// Pure transition rules keep portal gating independent of animation/CSS timing.
export function initialState(mode='watch') {
  return { mode,phase:'ready', classId:'mage', pendingClassId:null, chapter:0, page:0, beat:0, paused:false, completed:0, defeated:0, characterX:10,characterY:0,facing:1,deathX:null,portalPlaced:false,portalX:64,portalY:0,bossHp:encounterHealth(0),bossMaxHp:encounterHealth(0),castHit:false,castHits:0,watchHits:0,castSkill:false,castReturn:'encounter', rewardBeat:0, rewardNew:false, rewardLevelUp:false };
}
export function transition(state, event, chapters) {
  const type = typeof event === 'string' ? event : event.type;
  const s = { ...state };
  if (type === 'RESET') return initialState(s.mode);
  if(type==='SELECT_MODE'&&s.phase==='ready'&&['manual','watch'].includes(event.mode))return {...initialState(event.mode),classId:s.classId};
  if(type==='SELECT_CLASS'&&Object.hasOwn(jobById,event.classId)){
    if(s.phase==='battle')return event.classId===(s.pendingClassId||s.classId)?state:{...s,pendingClassId:event.classId===s.classId?null:event.classId};
    return event.classId===s.classId?state:{...s,classId:event.classId,pendingClassId:null};
  }
  // A phone can enter the story while a desktop fight is in progress.
  if(type==='WATCH_ONLY'||type==='SET_MODE'){
    const mode=type==='WATCH_ONLY'?'watch':event.mode;
    if(!['manual','watch'].includes(mode)||mode===s.mode||mode==='manual'&&s.phase==='battle')return state;
    return {...s,mode,phase:s.phase==='battle'&&s.castReturn==='portal'?'portal':mode==='watch'&&['encounter','dead'].includes(s.phase)?'battle':s.phase,beat:0,watchHits:0,watchCasts:event.watchCasts===3?3:1,watchStartHp:s.bossHp,castReturn:'encounter',castHit:false,castSkill:false};
  }
  if (type === 'REPLAY' && !s.paused && ['reading','encounter','portal','complete'].includes(s.phase) && Number.isInteger(event.chapter) && event.chapter >= 0 && event.chapter < s.completed) {
    return { ...s, phase:'reading', chapter:event.chapter, page:0, beat:0, rewardBeat:0, closingFinished:false, deathX:null,portalPlaced:false,portalX:64,portalY:0, characterX:10,characterY:0,bossHp:encounterHealth(event.chapter,s.completed),bossMaxHp:encounterHealth(event.chapter,s.completed), rewardNew:false, rewardLevelUp:false };
  }
  if (type === 'PAUSE' && ['reading','encounter', 'battle', 'retiring', 'reward', 'portal', 'walking', 'transition','dead'].includes(s.phase)) return { ...s, paused: true };
  if (type === 'RESUME') return s.paused ? { ...s, paused:false } : state;
  if (s.paused) return state;
  if(s.mode==='manual'){
    if(type==='PLAYER_DIED'&&event.hp===0&&(s.phase==='encounter'||s.phase==='battle'&&s.castReturn==='encounter'))return {...s,phase:'dead',deathLanded:false,characterY:0,castHit:false};
    if(type==='TOMB_LANDED'&&s.phase==='dead'&&!s.deathLanded)return {...s,deathLanded:true};
    if(type==='REVIVE'&&s.phase==='dead'&&s.deathLanded)return {...s,phase:'encounter',characterX:10,characterY:0,facing:1,castHit:false,castSkill:false,castLanded:false,castReturn:'encounter'};

    if(type==='MOVE'&&['reading','encounter','portal','battle','retiring','reward'].includes(s.phase)&&Number.isFinite(event.x)&&Number.isFinite(event.y))return {...s,characterX:Math.max(5,Math.min(Number.isFinite(event.maxX)?Math.max(94,event.maxX):94,event.x)),characterY:Math.max(0,event.y),portalY:Number.isFinite(event.portalY)?event.portalY:s.portalY||0,facing:event.facing===-1?-1:1};
    if(type==='ATTACK'&&canAttack(s))return {...s,phase:'battle',castReturn:s.phase,castHit:false,castHits:0,castLanded:false,castSkill:Boolean(event.skill&&skillRankFor(s.completed)),castReach:Boolean(event.reaches)};
    if(type==='CAST_HIT'&&s.phase==='battle'){
      const rule=castRule(s),packet=event.packet??0;
      if(packet!==(s.castHits||0)||packet>=rule.packets)return state;
      const landed=s.castReturn==='encounter'&&Boolean(event.reaches??s.castReach),damage=splitDamage(attackDamage(s.completed,s.chapter),rule.packets,packet);
      return {...s,castHit:true,castHits:packet+1,castLanded:s.castLanded||landed,bossHp:landed?Math.max(0,s.bossHp-damage):s.bossHp};
    }
    if(type==='CAST_DONE'&&s.phase==='battle'){
      const defeated=s.castReturn==='encounter'&&s.bossHp===0;
      return {...s,phase:defeated?'retiring':s.castReturn,defeated:defeated?Math.max(s.defeated||0,s.completed,s.chapter+1):s.defeated,classId:s.pendingClassId||s.classId,pendingClassId:null};
    }
  }
  const chapter = chapters[s.chapter];
  if (type === 'ADVANCE') {
    if (s.phase === 'ready' && s.classId) s.phase = 'reading';
    else if (s.phase === 'reading') {
      if (s.page < chapter.pages.length - 1) s.page++;
      else { s.phase = s.mode==='manual'?'encounter':'battle'; s.beat = 0;s.watchHits=0;s.watchCasts=event.watchCasts===3?3:1;s.watchStartHp=s.bossHp; }
    } else if (s.phase === 'portal') {
      if(s.mode==='manual'&&!event.mobileApproach&&(Math.abs(s.characterX-(s.portalX??88))>6||Math.abs(s.characterY-(s.portalY||0))>8))return state;
      s.phase='walking'; s.walkStartY=s.characterY||0; s.walkStartX=s.characterX;s.facing=Math.sign((s.portalX??88)-s.characterX)||s.facing;
    }
    else return state;
  } else if(type==='WATCH_HIT'&&s.phase==='battle'&&s.mode==='watch'){
    const rule=ruleFor({id:jobById[s.classId].skillIds[skillRankFor(s.completed)-1]}),packet=event.packet??0;
    const packets=rule.packets*(s.watchCasts||1);
    if(packet!==(s.watchHits||0)||packet>=packets)return state;
    s.watchHits=packet+1;s.bossHp=packet===packets-1?0:Math.max(1,s.bossHp-splitDamage(s.watchStartHp??s.bossMaxHp,packets,packet));
  } else if (type === 'BEAT' && s.phase === 'battle'&&s.mode==='watch') {
    s.beat++;
    if (s.beat >= 3) { s.phase = 'retiring'; s.characterX=Number.isFinite(event.targetX)?event.targetX:64;s.characterY=0;s.bossHp=0;s.defeated=Math.max(s.defeated||0,s.completed,s.chapter+1); }
  } else if (type === 'BOSS_EXITED' && s.phase === 'retiring') {
    s.phase='reward'; s.rewardBeat=0;s.lootLanded=false;s.petLootReady=false;s.lootX=Number.isFinite(event.lootX)?Math.max(5,Math.min(Number.isFinite(event.maxX)?Math.max(94,event.maxX):94,event.lootX)):64;s.deathX=s.lootX; s.rewardNew=s.chapter >= s.completed;s.rewardLevelUp=false;
  } else if(type==='LOOT_LANDED'&&s.phase==='reward'&&s.rewardBeat===0&&!s.lootLanded){
    s.lootLanded=true;
  } else if(type==='PET_LOOT_REACHED'&&s.phase==='reward'&&s.rewardBeat===0&&s.lootLanded&&!s.petLootReady&&petTeams[s.classId]?.includes(event.petId)){
    s.petLootReady=true;
  } else if (type === 'EQUIPPED' && canCollectLoot(s,event.width)) {
    const completed=Math.max(s.completed,s.chapter+1);
    s.rewardLevelUp=levelFor(completed)>levelFor(s.completed);
    s.completed=completed; s.rewardBeat=1;
  } else if (type === 'REWARD_FINISHED' && s.phase === 'reward' && s.rewardBeat === 1) {
    s.rewardBeat=2;
  } else if (type === 'CLOSING_STARTED' && s.phase === 'reward' && s.rewardBeat === 2) {
    s.rewardBeat=3;s.closingFinished=false;
  } else if (type === 'PORTAL_OPENED' && s.phase === 'reward' && s.rewardBeat === 3) {
    s.phase='portal';
  } else if (type === 'CLOSING_FINISHED' && s.phase === 'portal' && !s.closingFinished) {
    s.closingFinished=true;
  } else if (type === 'WALKED' && s.phase === 'walking') {
    s.phase='transition'; s.characterX=s.portalX??88;
  } else if (type === 'ARRIVED' && s.phase === 'transition') {
    if (s.chapter === chapters.length - 1) s.phase = 'complete';
    else { s.chapter++; s.page=0; s.beat=0; s.rewardBeat=0; s.closingFinished=false;s.deathX=null;s.portalPlaced=false;s.portalX=64;s.portalY=0; s.phase='reading'; s.characterX=10;s.characterY=0;s.bossHp=encounterHealth(s.chapter,s.completed);s.bossMaxHp=s.bossHp; }
  } else return state;
  if(s.pendingClassId&&s.phase!=='battle'){s.classId=s.pendingClassId;s.pendingClassId=null;}
  return s;
}
export function canCollectLoot(state,width){
  if(state.phase!=='reward'||state.rewardBeat!==0||state.paused)return false;
  if(state.mode==='watch'||!state.rewardNew)return true;
  if(state.lootLanded&&state.petLootReady&&petTeams[state.classId]?.length===3)return true;
  return state.lootLanded&&Number.isFinite(width)&&width>0&&Math.abs(state.characterX-state.lootX)/100*width<=44&&state.characterY<=14;
}
export function canAttack(state) { return state.mode==='manual'&&!state.paused&&(state.phase==='encounter'||state.phase==='portal'&&state.closingFinished===true); }
export function canUsePortal(state) { return state.phase === 'portal' && !state.paused; }
export function characterPosition(state, elapsed, duration = 1200) {
  if (state.phase !== 'walking') return state.characterX;
  return state.walkStartX + ((state.portalX??88)-state.walkStartX) * Math.max(0,Math.min(1,elapsed/duration));
}

// Anchor the actual map surface to the actors' feet at every viewport size.
// CSS object-fit/centering cannot preserve a floor coordinate across five maps.
export function projectScene(camera, width, height, groundInset = 46, minimumScale = 0) {
  const scale = Math.max(minimumScale, width / camera.viewWidth, width / camera.width, (height - groundInset) / Math.min(camera.aboveGround,camera.groundY), groundInset / (camera.height - camera.groundY));
  const left = Math.min(0, Math.max(width - camera.width * scale, width * .57 - camera.focusX * scale));
  return { scale, left, top: height - groundInset - camera.groundY * scale, width: camera.width * scale, height: camera.height * scale };
}
