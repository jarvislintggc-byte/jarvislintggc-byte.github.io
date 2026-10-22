import { combatAudio } from './journey-sfx-data.mjs';
import { impactTimes } from './journey-combat.mjs';
export function soundEvents(ability){
  const entry=ability?combatAudio.skills[ability.id]:{use:combatAudio.beginner};
  const uses=ability?.id===3001005?[100,180]:[0];
  return [...uses.map(time=>({kind:'cast',time:320+time,file:entry.use,gain:.48})),
    ...impactTimes(ability).map(time=>({kind:'hit',time:320+time,file:entry.hit||combatAudio.sharedHit,gain:entry.hit ? .55 : .28}))].sort((a,b)=>a.time-b.time);
}
export function createCombatSound({asset,load=url=>fetch(url).then(response=>{if(!response.ok)throw new Error('Skill audio unavailable');return response.arrayBuffer();})}){
  const cache=new Map(),voices=new Set();let events=[],fired=new Set(),rate=1;
  function stop(){for(const voice of voices){try{voice.stop();}catch{}}voices.clear();events=[];fired=new Set();}
  return {
    setRate(value){rate=[1,1.25,1.5].includes(value)?value:1;for(const voice of voices)if(voice.playbackRate)voice.playbackRate.value=rate;},
    async prepare(context,abilities){
      const files=new Set(abilities.flatMap(ability=>soundEvents(ability).map(event=>event.file)));
      await Promise.all([...files].map(file=>{
        if(!cache.has(file)){
          const item={buffer:null};
          item.pending=load(asset(file)).then(bytes=>context.decodeAudioData(bytes)).then(buffer=>item.buffer=buffer).catch(error=>{cache.delete(file);throw error;});
          cache.set(file,item);
        }
        return cache.get(file).pending;
      }));
    },
    start(ability){stop();events=soundEvents(ability);fired=new Set();},
    tick(context,time,enabled=true,{impact=true}={}){
      events.forEach((event,index)=>{
        if(time<event.time||fired.has(index))return;
        fired.add(index);
        const buffer=cache.get(event.file)?.buffer;
        if(!enabled||!context||!buffer||event.kind==='hit'&&!impact)return;
        const source=context.createBufferSource(),gain=context.createGain();
        source.buffer=buffer;if(source.playbackRate)source.playbackRate.value=rate;gain.gain.value=event.gain;source.connect(gain);gain.connect(context.destination);
        voices.add(source);source.onended=()=>voices.delete(source);source.start();
      });
    },
    stop
  };
}
