// Frame sampling preserves original WZ delays, including transparent wait frames.
export const sequenceDuration=frames=>frames.reduce((total,frame)=>total+frame.delay,0);
export function sampleFrames(frames,time,loop=false){
  const duration=sequenceDuration(frames);
  if(!duration||time<0||(!loop&&time>=duration))return null;
  let remaining=loop?time%duration:time;
  for(const frame of frames){if(remaining<frame.delay)return {frame,progress:remaining/frame.delay};remaining-=frame.delay;}
  return null;
}
export function sampleTrack(track,time){
  const local=time-track.start;
  const window=track.anchor==='projectile'?Math.max(track.flight||250,track.hold||0):Math.max(track.duration,track.hold||0);
  if(local<0||local>=window)return null;
  const loop=track.anchor==='projectile'||track.hold>track.duration;
  const result=sampleFrames(track.frames,local,loop);
  if(!result)return null;
  const {frame,progress}=result;
  const alpha0=frame.a0??255,alpha1=frame.a1??alpha0;
  return {...result,opacity:(alpha0+(alpha1-alpha0)*progress)/255,flight:Math.min(1,(local%(track.flight||window))/(track.flight||window))};
}

export function createSkillView(host,{asset,applySprite,worldSize}){
  let current=null,layers=[];
  function configure(ability){
    if(current===ability)return;
    current=ability;host.replaceChildren();layers=[];
    if(!ability)return;
    for(const track of ability.tracks){
      const anchor=document.createElement('span'),image=document.createElement('img');
      anchor.className='maple-skill-layer';image.alt='';anchor.append(image);host.append(anchor);layers.push({track,anchor,image});
    }
  }
  return {
    hide(){host.hidden=true;},
    render(ability,time,actorX,reduced=false,{facing=1,targetX=64,lift=0,impact=true}={}){
      configure(ability);host.hidden=!ability;
      if(!ability)return false;
      const dimensions=worldSize(),baseScale=dimensions.mobile?.98:1.4;
      const actor=sampleFrames(ability.actorFrames,time,ability.id===3121004&&time<1860);
      if(actor)applySprite(actor.frame);
      for(const {track,anchor,image}of layers){
        const result=sampleTrack(track,reduced?Math.floor(time/150)*150:time);
        anchor.hidden=!result||result.frame.transparent||track.anchor==='boss'&&!impact;
        if(!result)continue;
        const {frame}=result;
        const maxWidth=Math.max(...track.frames.map(f=>f.width));
        const scale=maxWidth>600?Math.min(baseScale,dimensions.width*1.2/maxWidth):baseScale;
        let x=track.anchor==='actor'?actorX:targetX;
        if(track.anchor==='projectile')x=actorX+(targetX-actorX)*result.flight;
        anchor.style.left=`${x}%`;
        anchor.style.bottom=track.anchor==='boss'?`calc(var(--ground-inset) + ${dimensions.mobile?50:75}px)`:track.anchor==='projectile'?`calc(var(--ground-inset) + ${35*baseScale+lift}px)`:`calc(var(--ground-inset) + ${lift}px)`;
        anchor.style.transform=(facing===1)!==Boolean(frame.flip)?'scaleX(-1)':'none';anchor.style.opacity=String(result.opacity);
        if(!image.src.endsWith(frame.file))image.src=asset(frame.file);
        Object.assign(image.style,{width:`${frame.width*scale}px`,height:`${frame.height*scale}px`,left:`${-frame.origin.x*scale}px`,top:`${-frame.origin.y*scale}px`});
      }
      return Boolean(actor);
    }
  };
}
