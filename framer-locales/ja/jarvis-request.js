(() => {
  'use strict';
  const photos = [
    ['mrs-angel','cover-mrs-angel.png','Mrs.Angel Taiwanese Bubble Tea Shop'],
    ['yuki-personal-pc-studio','cover-yuki-studio.png','Yuki Personal PC Studio'],
    ['industry-learning','industry-learning-venture-cafe.png','Industry learning and networking in Arizona'],
    ['crispy-chicken-tomato-kokushikan','cover-crispy-chicken.png',"CRISPY CHICKEN n’ TOMATO, Kokushikan University"],
    ['milk-tea-supply-chain','cover-bubble-tea-supply-chain.png','Bubble Tea Shop Supply Chain'],
    ['ecosystem-study','cover-ecosystem-study.png','Industry Ecosystem Study']
  ];
  let pending=false;
  function mount() {
    if(document.readyState!=='complete')return;
    const root=document.querySelector('.framer-zrw9y0');
    if(!root||root.querySelector('.jarvis-experience-carousel'))return;
    const prefix=location.pathname.startsWith('/zh/')?'/zh':location.pathname.startsWith('/ja/')?'/ja':'';
    const section=document.createElement('section');
    section.className='jarvis-experience-carousel';section.setAttribute('aria-label',"経験・プロジェクト");
    section.innerHTML='<div class="jarvis-carousel-heading"><h3>さまざまな場所で。<br><span>経験が一つの視点につながる。</span></h3><p>つくり、学び、その道のりでつながりを見つける。</p></div><div class="jarvis-carousel-track" tabindex="0" role="region" aria-roledescription="carousel" aria-label="経験の写真。ドラッグまたは矢印キーで閲覧できます。"></div>';
    const track=section.querySelector('.jarvis-carousel-track');
    for(const [id,file,label] of photos){
      const link=document.createElement('a');link.href=prefix+'/experience/?note='+id;link.setAttribute('aria-label',label);link.draggable=false;
      const image=document.createElement('img');image.src='/assets/experience/'+file;image.alt=label;image.loading='lazy';image.decoding='async';image.draggable=false;
      link.append(image);track.append(link);
    }
    let start=null,moved=false,suppressClick=false;
    track.addEventListener('pointerdown',event=>{
      if(event.pointerType!=='mouse'||event.button!==0)return;
      start={x:event.clientX,scroll:track.scrollLeft,id:event.pointerId};moved=false;
    });
    track.addEventListener('pointermove',event=>{
      if(!start)return;
      const delta=event.clientX-start.x;
      if(!moved&&Math.abs(delta)>5){moved=true;track.setPointerCapture(start.id);track.classList.add('is-dragging');}
      if(moved){event.preventDefault();track.scrollLeft=start.scroll-delta;}
    });
    function finish(){if(!start)return;suppressClick=moved;start=null;track.classList.remove('is-dragging');}
    track.addEventListener('pointerup',finish);track.addEventListener('pointercancel',finish);track.addEventListener('lostpointercapture',finish);
    track.addEventListener('dragstart',event=>event.preventDefault());
    track.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false;}},true);
    track.addEventListener('keydown',event=>{
      if(event.target!==track)return;
      const step=track.querySelector('a').getBoundingClientRect().width+20;
      if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();track.scrollBy({left:event.key==='ArrowRight'?step:-step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
      if(event.key==="ホーム"||event.key==='End'){event.preventDefault();track.scrollTo({left:event.key==="ホーム"?0:track.scrollWidth,behavior:'instant'});}
    });
    root.append(section);
  }
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;mount();});}
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',schedule);
  schedule();
})();
