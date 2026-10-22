const clamp=value=>Math.max(0,Math.min(1,value));
export function revealAt(top,height){return clamp(-top/Math.max(1,height));}
export function initJourneyScroll(){
  const runway=document.querySelector('#journey-scroll'),stage=document.getElementById('journey-stage');
  if(!runway||!stage)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let pending=false,lastReady=null;
  function update(){
    pending=false;
    const height=stage.getBoundingClientRect().height;
    let progress=revealAt(runway.getBoundingClientRect().top,height);
    if(reduced.matches)progress=progress<.5?0:1;
    stage.style.setProperty('--journey-reveal',String(progress));
    const ready=progress>=.995;
    stage.dataset.revealed=String(ready);
    document.getElementById('life-game').inert=!ready;
    if(ready!==lastReady){lastReady=ready;document.dispatchEvent(new CustomEvent('journeyreveal',{detail:{ready}}));}
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
  function enter({immediate=false}={}){
    const y=window.scrollY+runway.getBoundingClientRect().top+stage.getBoundingClientRect().height+2;
    window.scrollTo({top:y,behavior:immediate||reduced.matches?'instant':'smooth'});
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);window.addEventListener('pageshow',schedule);
  document.querySelector('.intro-enter')?.addEventListener('click',event=>{event.preventDefault();enter();});
  document.addEventListener('journeyenter',enter);
  const enterFromHash=()=>{if(location.hash==='#journey-game')requestAnimationFrame(()=>enter({immediate:true}));};
  window.addEventListener('hashchange',enterFromHash);window.addEventListener('load',enterFromHash);
  enterFromHash();
  update();
}
