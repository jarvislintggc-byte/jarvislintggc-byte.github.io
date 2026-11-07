// Homepage-entry guide. Original vector cat; no image or animation dependency.
(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 if(reduced.matches)return;
 const language=document.documentElement.lang.startsWith('ja')?'ja':document.documentElement.lang.startsWith('zh')?'zh':'en';
 const copy={zh:['嗨！選單與語言在這裡 👋','選擇你習慣的語言','那就開始逛逛吧！'],en:['Hi! Menu & languages live here 👋','Choose your language','Make yourself at home!'],ja:['こんにちは！メニューはこちら 👋','お好きな言語をどうぞ','ゆっくり見ていってね！']}[language];
 const host=document.createElement('jarvis-cat-guide'),root=host.attachShadow({mode:'open'});
 root.innerHTML=`<style>
 :host{position:fixed;inset:0;margin:0;border:0;padding:0;width:100vw;height:100dvh;max-width:none;max-height:none;background:transparent;overflow:hidden;pointer-events:none;z-index:2147483647}
 .cat{position:absolute;width:105px;height:92px;transform-origin:50% 85%;filter:drop-shadow(0 6px 4px #0002)}svg{width:100%;height:100%;overflow:visible}.tail{transform-origin:42px 70px;animation:tail 1s ease-in-out infinite alternate}.leg{transform-box:fill-box;transform-origin:50% 0}.running .leg{animation:leg .2s ease-in-out infinite alternate}.running .leg:nth-of-type(even){animation-delay:-.2s}.waving .front{transform-box:fill-box;transform-origin:50% 10%;animation:wave .3s ease-in-out 5 alternate}.bubble{position:absolute;padding:10px 15px;border:1px solid #d5d9cf;border-radius:14px;background:#fffdf6;color:#26352c;box-shadow:0 7px 22px #18241d20;font:600 13px/1.5 Arial,sans-serif;max-width:calc(100vw - 40px);white-space:nowrap}.rope{position:absolute;width:2px;background:#27372b;transform-origin:top;opacity:0}
 @keyframes tail{to{transform:rotate(-13deg)}}@keyframes leg{to{transform:rotate(30deg)}}@keyframes wave{from{transform:rotate(-35deg)}to{transform:rotate(-105deg)}}
 </style><div class="cat running" aria-hidden="true"><svg viewBox="0 0 130 110"><path class="tail" d="M45 72C2 81 3 42 20 42" fill="none" stroke="#171918" stroke-width="10" stroke-linecap="round"/><ellipse cx="61" cy="74" rx="31" ry="22" fill="#171918"/><path class="leg" d="M42 79L34 103H49L56 82" fill="#111412"/><path class="leg" d="M65 80L62 104H77L82 80" fill="#202522"/><path d="M63 35L61 6L80 22L105 9L109 41" fill="#141816"/><path d="M66 22L67 13L76 25M96 25L102 17L103 30" fill="#786b6e"/><ellipse cx="86" cy="42" rx="26" ry="24" fill="#171b18"/><ellipse cx="76" cy="39" rx="7" ry="8" fill="#f5cc65"/><ellipse cx="96" cy="39" rx="7" ry="8" fill="#f5cc65"/><ellipse cx="78" cy="39" rx="2.5" ry="7" fill="#101411"/><ellipse cx="98" cy="39" rx="2.5" ry="7" fill="#101411"/><path d="M82 50L87 54L91 50" fill="#c1a3a1"/><path d="M87 54V59M87 59L81 60M87 59L93 60M69 53L51 49M69 57L50 57M105 53L120 49M105 57L123 57" fill="none" stroke="#b2bbb3" stroke-width="1.5" stroke-linecap="round"/><path class="leg front" d="M89 69Q103 75 101 92L89 94L80 74" fill="#212824"/><circle cx="94" cy="91" r="6" fill="#303a32"/></svg></div><div class="rope" aria-hidden="true"></div><div class="bubble" role="status" aria-live="polite"></div>`;
 const cat=root.querySelector('.cat'),bubble=root.querySelector('.bubble'),rope=root.querySelector('.rope');
 let stopped=false,started=false,ownedMenu=false,timer=0;const animations=[],timeouts=new Map(),controller=new AbortController();
 const menu=()=>document.getElementById('site-menu'),dock=()=>document.getElementById('jarvis-global-dock');
 function wait(ms){return new Promise(resolve=>{const id=setTimeout(()=>{timeouts.delete(id);resolve();},ms);timeouts.set(id,resolve);});}
 function move(frames,options){if(stopped)return Promise.resolve();const animation=cat.animate(frames,{fill:'forwards',...options});animations.push(animation);return animation.finished.catch(()=>{});}
 function positionBubble(text){const b=dock().getBoundingClientRect();bubble.textContent=text;bubble.style.left=Math.max(15,Math.min(innerWidth-260,b.left))+'px';bubble.style.top=b.bottom+92+'px';}
 function closeOwned(){if(ownedMenu&&menu()?.open)document.getElementById('menu-close')?.click();ownedMenu=false;menu()?.removeAttribute('data-cat-guide');menu()?.querySelectorAll('.cat-language-highlight').forEach(e=>e.classList.remove('cat-language-highlight'));}
 function stop(keepMenu=false){
  if(stopped)return;stopped=true;clearTimeout(timer);for(const [id,resolve]of timeouts){clearTimeout(id);resolve();}controller.abort();timeouts.clear();animations.forEach(a=>a.cancel());
  if(!keepMenu)closeOwned();else{ownedMenu=false;menu()?.removeAttribute('data-cat-guide');menu()?.querySelectorAll('.cat-language-highlight').forEach(e=>e.classList.remove('cat-language-highlight'));}
  delete document.documentElement.dataset.jarvisCatGuide;host.remove();document.dispatchEvent(new CustomEvent('jarvis:cat-cue',{detail:{action:'cancel'}}));
 }
 function userControl(event){if(stopped||!event.isTrusted)return;event.jarvisCatHandled=true;stop(Boolean(event.target.closest?.('#site-menu,#jarvis-global-dock')));}
 window.addEventListener('pointerdown',userControl,{capture:true,passive:true,signal:controller.signal});
 window.addEventListener('keydown',event=>{if(!stopped)userControl(event);},{capture:true,signal:controller.signal});
 window.addEventListener('scroll',()=>{if(scrollY>40)stop();},{passive:true,signal:controller.signal});
 window.addEventListener('resize',()=>stop(),{passive:true,signal:controller.signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},{signal:controller.signal});
 async function begin(){
  if(stopped||started||scrollY>40||menu()?.open||!dock())return;started=true;
  document.documentElement.dataset.jarvisCatGuide='true';document.body.append(host);host.dataset.state='running';
  if(host.showPopover){host.setAttribute('popover','manual');host.showPopover();}
  const bounds=dock().getBoundingClientRect(),x=Math.min(innerWidth-105,bounds.right-105),y=bounds.bottom+5;
  positionBubble(copy[0]);bubble.style.opacity='0';
  document.dispatchEvent(new CustomEvent('jarvis:cat-cue',{detail:{action:'play'}}));
  await move([{transform:`translate(-110px,${y+130}px) rotate(-16deg)`},{transform:`translate(25px,${y+45}px) rotate(3deg)`,offset:.4},{transform:`translate(${x}px,${y}px) rotate(0deg)`}],{duration:1450,easing:'cubic-bezier(.25,.65,.4,1)'});if(stopped)return;
  cat.classList.remove('running');bubble.style.opacity='1';
  Object.assign(rope.style,{left:x+74+'px',top:bounds.bottom-4+'px',height:'45px',opacity:'1'});
  await move([{transform:`translate(${x}px,${y}px)`},{transform:`translate(${x}px,${y+16}px) rotate(5deg)`}],{duration:320,easing:'ease-in'});if(stopped)return;
  menu().setAttribute('data-cat-guide','');ownedMenu=true;document.getElementById('menu-trigger').click();
  if(host.showPopover){host.hidePopover();host.showPopover();}
  rope.style.opacity='0';
  const menuBox=menu().getBoundingClientRect(),outsideX=innerWidth<600?Math.max(15,menuBox.right-110):Math.min(innerWidth-110,menuBox.right+8),outsideY=innerWidth<600?menuBox.top+menu().offsetHeight+12:menuBox.top+100;
  await move([{transform:`translate(${x}px,${y+16}px)`},{transform:`translate(${outsideX}px,${outsideY}px)`}],{duration:240,easing:'ease-out'});if(stopped)return;
  positionBubble(copy[1]);bubble.style.left=Math.max(15,Math.min(innerWidth-260,outsideX))+'px';bubble.style.top=outsideY+90+'px';host.dataset.state='languages';
  const links=[...menu().querySelectorAll('[data-site-language]')];
  for(const link of links){if(stopped)return;link.classList.add('cat-language-highlight');await wait(650);link.classList.remove('cat-language-highlight');}
  links.forEach(link=>link.classList.add('cat-language-highlight'));await wait(500);if(stopped)return;
  closeOwned();await move([{transform:`translate(${outsideX}px,${outsideY}px)`},{transform:`translate(${x}px,${y+16}px)`}],{duration:240,easing:'ease-out'});if(stopped)return;
  positionBubble(copy[2]);cat.classList.add('waving');host.dataset.state='waving';await wait(1300);if(stopped)return;
  bubble.style.opacity='0';await move([{transform:`translate(${x}px,${y+16}px)`,opacity:1},{transform:`translate(${innerWidth+110}px,${y-55}px) rotate(10deg)`,opacity:0}],{duration:650,easing:'ease-in'});stop();
 }
 function ready(){if(stopped||started)return;clearTimeout(timer);timer=setTimeout(()=>begin().catch(()=>stop()),650);}
 document.addEventListener('jarvis:home-ready',ready,{once:true});if(document.documentElement.dataset.jarvisHomeReady==='true')ready();
})();
