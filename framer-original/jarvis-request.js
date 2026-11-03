(() => {
  'use strict';
  const photos = [
    ['research','cover-arizona-chip-journey.png','Research Focus','04'],
    ['ventures','cover-mrs-angel.png','Entrepreneurship','05'],
    ['special','industry-learning-venture-cafe.png','Special Projects','03']
  ];
  let pending=false;
  function mount() {
    if(document.readyState!=='complete')return;
    const root=document.querySelector('.framer-zrw9y0');
    if(!root||root.querySelector('.jarvis-experience-carousel'))return;
    const prefix=location.pathname.startsWith('/zh/')?'/zh':location.pathname.startsWith('/ja/')?'/ja':'';
    const section=document.createElement('section');
    section.className='jarvis-experience-carousel';section.setAttribute('aria-label','Experiences');
    section.innerHTML='<div class="jarvis-carousel-heading"><h3>Different places.<br><span>A connected perspective.</span></h3><p>Building, learning, and finding the connections along the way.</p></div><div class="jarvis-carousel-track" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Experience photos. Drag or use the arrow keys to browse."></div>';
    const track=section.querySelector('.jarvis-carousel-track');
    for(const [id,file,label,count] of photos){
      const link=document.createElement('a');link.href=prefix+'/experience/?category='+id;link.setAttribute('aria-label',label+' '+count);link.draggable=false;
      const image=document.createElement('img');image.src='/assets/experience/'+file;image.alt=label;image.loading='lazy';image.decoding='async';image.draggable=false;
      const caption=document.createElement('span');caption.className='jarvis-category-caption';
      const title=document.createElement('span');title.textContent=label;
      const number=document.createElement('span');number.textContent=count;
      caption.append(title,number);link.append(image,caption);track.append(link);
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
      if(event.key==='Home'||event.key==='End'){event.preventDefault();track.scrollTo({left:event.key==='Home'?0:track.scrollWidth,behavior:'instant'});}
    });
    root.append(section);
  }
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;mount();});}
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',schedule);
  schedule();
})();
