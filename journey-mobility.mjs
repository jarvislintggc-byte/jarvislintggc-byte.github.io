import { sampleFrames } from './journey-animation.mjs';

// One short native effect at the take-off point, independent of attack layers.
export function createMobilityView(host,{asset,mobile=()=>false}){
  const layer=document.createElement('span'),image=document.createElement('img');
  layer.className='maple-skill-layer';image.alt='';layer.append(image);host.append(layer);host.hidden=true;
  let active=null,time=0;
  function render(reduced){
    const sample=active&&sampleFrames(active.effect.frames,reduced?active.stillTime:time);
    host.hidden=!sample;
    if(!sample){active=null;return;}
    const {frame,progress}=sample,scale=mobile()?.98:1.4;
    layer.style.left=`${active.x}%`;
    layer.style.bottom=`calc(var(--ground-inset) + ${active.y}px)`;
    layer.style.transform=(active.facing===1)!==Boolean(frame.flip)?'scaleX(-1)':'none';
    layer.style.opacity=String(((frame.a0??255)+((frame.a1??frame.a0??255)-(frame.a0??255))*progress)/255);
    if(!image.src.endsWith(frame.file))image.src=asset(frame.file);
    Object.assign(image.style,{width:`${frame.width*scale}px`,height:`${frame.height*scale}px`,left:`${-frame.origin.x*scale}px`,top:`${-frame.origin.y*scale}px`});
  }
  return {
    start(effect,player,reduced=false){let stillTime=0;for(const f of effect.frames){if(f.width>1&&f.height>1)break;stillTime+=f.delay;}active={effect,x:player.x,y:player.y,facing:player.facing,stillTime};time=0;render(reduced);},
    tick(ms,reduced=false){if(!active)return;time+=Math.max(0,ms);if(time>=(reduced?120:active.effect.frames.reduce((sum,f)=>sum+f.delay,0))){this.reset();return;}render(reduced);},
    reset(){active=null;time=0;host.hidden=true;}
  };
}
