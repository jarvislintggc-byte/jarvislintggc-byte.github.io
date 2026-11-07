(() => {
 'use strict';
 let active=null,dispose=()=>{};
 function mount(){
  const track=document.querySelector('.jarvis-article-marquee');if(!track||track===active)return;
  dispose();active=track;track.dataset.bound='true';
  const abort=new AbortController(),signal=abort.signal;
  let start=null,pressed=null,suppress=false,until=0,frame=0,previous=0,visible=false;
  let position=track.scrollLeft,lastWritten=position;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const pause=()=>{until=performance.now()+2500;};
  track.addEventListener('pointerdown',e=>{pause();pressed=e.pointerId;suppress=false;if(e.pointerType==='mouse'&&e.button===0)start={x:e.clientX,left:track.scrollLeft,id:e.pointerId};},{signal});
  track.addEventListener('pointermove',e=>{if(!start)return;const delta=e.clientX-start.x;if(Math.abs(delta)>5){suppress=true;track.setPointerCapture(start.id);track.scrollLeft=start.left-delta;track.classList.add('is-dragging');pause();}},{signal});
  const end=()=>{start=null;pressed=null;track.classList.remove('is-dragging');pause();};
  ['pointerup','pointercancel'].forEach(name=>window.addEventListener(name,event=>{if(pressed===event.pointerId)end();},{signal}));
  track.addEventListener('lostpointercapture',()=>{if(pressed!==null)end();},{signal});
  window.addEventListener('blur',()=>{if(pressed!==null)end();},{signal});
  track.addEventListener('dragstart',e=>e.preventDefault(),{signal});track.addEventListener('wheel',pause,{passive:true,signal});
  track.addEventListener('click',e=>{
   const card=e.target.closest('[data-article-id]');if(!card)return;
   // Handle the owned link before Framer's ancestor navigation listener.
   e.preventDefault();e.stopPropagation();pause();if(suppress){suppress=false;return;}
   const opener=card.dataset.copy?track.querySelector('[data-article-id="'+card.dataset.articleId+'"]:not([data-copy])'):card;
   window.JarvisArticleDialog.open(card.dataset.articleId,opener);
  },{signal});
  track.addEventListener('keydown',e=>{pause();if(e.target!==track||!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
   e.preventDefault();const first=track.querySelector('a'),copy=track.querySelector('[data-copy]'),step=(first?.getBoundingClientRect().width||280)+20,length=copy?copy.offsetLeft-first.offsetLeft:track.scrollWidth;
   track.scrollTo({left:e.key==='Home'?0:e.key==='End'?length-track.clientWidth:track.scrollLeft+(e.key==='ArrowRight'?step:-step),behavior:reduced.matches?'instant':'smooth'});
  },{signal});
  function tick(now){frame=0;if(!visible||document.hidden||reduced.matches)return;const dt=previous?Math.min(50,now-previous):0;previous=now;
   if(pressed===null&&!track.hasAttribute('data-build-positioning')&&!window.JarvisArticleDialog.isOpen&&now>until&&!(document.activeElement===track&&track.matches(':focus-visible'))){const copy=track.querySelector('[data-copy]'),first=track.querySelector('a');if(copy&&first){
    const length=copy.offsetLeft-first.offsetLeft;
    // Keep fractional motion: scrollLeft may round each individual frame to zero.
    if(track.scrollLeft!==lastWritten)position=track.scrollLeft;
    position+=dt*.028;if(length>0&&position>=length)position-=length;
    track.scrollLeft=position;lastWritten=track.scrollLeft;
   }}
   frame=requestAnimationFrame(tick);
  }
  function wake(){if(visible&&!document.hidden&&!reduced.matches&&!frame){previous=0;frame=requestAnimationFrame(tick);}}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else wake();});observer.observe(track);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(pressed!==null)end();cancelAnimationFrame(frame);frame=0;}else wake();},{signal});
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;wake();},{signal});
  dispose=()=>{abort.abort();observer.disconnect();cancelAnimationFrame(frame);};
 }
 window.JarvisHome.onReady(mount);
})();
