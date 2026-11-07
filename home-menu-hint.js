(() => {
 'use strict';
 const lang=document.documentElement.lang.startsWith('ja')?'ja':document.documentElement.lang.startsWith('zh')?'zh':'en';
 const text={zh:'選單與語言切換在這裡',en:'Menu & languages are right here',ja:'メニューと言語切替はこちら'}[lang];
 let host,dock,timer,started=false;const controller=new AbortController(),signal=controller.signal;
 function dismiss(){clearTimeout(timer);dock?.removeAttribute('data-hint');controller.abort();if(host){const closing=host;host=null;setTimeout(()=>closing.remove(),380);}}
 function show(){
  if(started||scrollY>40||document.querySelector('#site-menu[open]'))return;started=true;
  dock=document.getElementById('jarvis-global-dock');if(!dock)return;
  host=document.createElement('jarvis-menu-hint');const clip=document.createElement('div'),copy=document.createElement('p');clip.className='jarvis-hint-clip';copy.textContent=text;copy.setAttribute('role','status');clip.append(copy);host.append(clip);dock.append(host);
  requestAnimationFrame(()=>{if(host)dock.dataset.hint='open';});
  document.dispatchEvent(new CustomEvent('jarvis:menu-hint-cue'));
  window.addEventListener('scroll',()=>{if(scrollY>40)dismiss();},{passive:true,signal});window.addEventListener('resize',dismiss,{passive:true,signal});
  document.getElementById('menu-trigger').addEventListener('click',dismiss,{signal});document.querySelector('.jarvis-dock-hello').addEventListener('click',dismiss,{signal});
  timer=setTimeout(dismiss,5000);
 }
 function ready(){if(!started){clearTimeout(timer);timer=setTimeout(show,650);}}
 document.addEventListener('jarvis:home-ready',ready,{once:true});if(document.documentElement.dataset.jarvisHomeReady==='true')ready();
})();
