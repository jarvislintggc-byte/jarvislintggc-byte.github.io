(() => {
 'use strict';
 const lang=document.documentElement.lang.startsWith('ja')?'ja':document.documentElement.lang.startsWith('zh')?'zh':'en';
 const text={zh:['選單與語言切換在這裡','關閉提示'],en:['Menu & languages are right here','Dismiss hint'],ja:['メニューと言語切替はこちら','ヒントを閉じる']}[lang];
 let host,timer,started=false;const controller=new AbortController(),signal=controller.signal;
 function dismiss(){clearTimeout(timer);host?.remove();controller.abort();}
 function show(){
  if(started||scrollY>40||document.querySelector('#site-menu[open]'))return;started=true;
  const dock=document.getElementById('jarvis-global-dock');if(!dock)return;
  host=document.createElement('jarvis-menu-hint');const root=host.attachShadow({mode:'open'});
  root.innerHTML=`<style>:host{position:fixed;z-index:2147483647;margin:0;padding:0;border:0;background:transparent;width:min(350px,calc(100vw - 32px));max-width:none;overflow:visible;color:#f8f7f3;font:500 14px/1.5 'DM Sans',sans-serif}*{box-sizing:border-box}.hint{display:flex;align-items:center;gap:8px;background:#111;border-radius:14px;padding:5px 5px 5px 18px;box-shadow:0 8px 24px #0002;animation:hint-in .24s ease-out}.hint p{margin:0;flex:1}button{display:grid;place-items:center;flex:none;cursor:pointer;width:44px;height:44px;border:0;background:transparent;border-radius:10px;color:inherit}button:hover{background:#ffffff18}button:focus-visible{outline:2px solid #f8f7f3;outline-offset:-3px}svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8}@keyframes hint-in{from{opacity:.4;transform:translateY(-4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.hint{animation:none}}</style><div class="hint"><p role="status">${text[0]}</p><button type="button" aria-label="${text[1]}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15"/></svg></button></div>`;
  const bounds=dock.getBoundingClientRect();host.style.left=Math.max(16,Math.min(innerWidth-366,bounds.left))+'px';host.style.top=bounds.bottom+10+'px';
  document.body.append(host);if(host.showPopover){host.setAttribute('popover','manual');host.showPopover();}
  root.querySelector('button').addEventListener('click',dismiss);
  document.dispatchEvent(new CustomEvent('jarvis:menu-hint-cue'));
  window.addEventListener('scroll',()=>{if(scrollY>40)dismiss();},{passive:true,signal});window.addEventListener('resize',dismiss,{passive:true,signal});
  document.getElementById('menu-trigger').addEventListener('click',dismiss,{signal});document.querySelector('.jarvis-dock-hello').addEventListener('click',dismiss,{signal});
  timer=setTimeout(dismiss,6000);
 }
 function ready(){if(!started){clearTimeout(timer);timer=setTimeout(show,650);}}
 document.addEventListener('jarvis:home-ready',ready,{once:true});if(document.documentElement.dataset.jarvisHomeReady==='true')ready();
})();
