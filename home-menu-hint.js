(() => {
 'use strict';
 const lang=document.documentElement.lang.startsWith('ja')?'ja':document.documentElement.lang.startsWith('zh')?'zh':'en';
 const text={zh:'選單與語言切換在這裡',en:'Menu & languages are right here',ja:'メニューと言語切替はこちら'}[lang];
 let host,dock,timer,delay,ready=false,dismissed=false,remaining=5000,visibleAt=null;
 function pause(){clearTimeout(timer);if(visibleAt!==null){remaining=Math.max(0,remaining-(performance.now()-visibleAt));visibleAt=null;}}
 function dismiss(){clearTimeout(delay);pause();dismissed=true;dock?.removeAttribute('data-hint');if(host){const closing=host;host=null;setTimeout(()=>closing.remove(),380);}}
 function resume(){if(!host||dismissed||document.hidden||visibleAt!==null)return;if(remaining<=0){dismiss();return;}const first=!dock.hasAttribute('data-hint');dock.dataset.hint='open';visibleAt=performance.now();timer=setTimeout(dismiss,remaining);if(first)document.dispatchEvent(new CustomEvent('jarvis:menu-hint-cue'));}
 function show(){
  if(dismissed||document.hidden||!ready||host||document.querySelector('#site-menu[open]'))return;
  dock=document.getElementById('jarvis-global-dock');if(!dock)return;
  host=document.createElement('jarvis-menu-hint');const clip=document.createElement('div'),copy=document.createElement('p');clip.className='jarvis-hint-clip';copy.textContent=text;copy.setAttribute('role','status');clip.append(copy);host.append(clip);dock.append(host);
  requestAnimationFrame(resume);
 }
 function schedule(){clearTimeout(delay);if(ready&&!dismissed&&!document.hidden&&!host)delay=setTimeout(show,650);}
 function homeReady(){ready=true;schedule();}
 document.addEventListener('jarvis:home-ready',homeReady,{once:true});if(document.documentElement.dataset.jarvisHomeReady==='true')homeReady();
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(delay);pause();}else if(host)resume();else schedule();});
 document.addEventListener('click',event=>{if(event.target.closest?.('#menu-trigger,.jarvis-dock-hello'))dismiss();},true);
 const menu=document.getElementById('site-menu');if(menu)new MutationObserver(()=>{if(menu.open)dismiss();}).observe(menu,{attributes:true,attributeFilter:['open']});
 window.addEventListener('pageshow',event=>{if(event.persisted){dismiss();dismissed=false;remaining=5000;schedule();}});
})();
