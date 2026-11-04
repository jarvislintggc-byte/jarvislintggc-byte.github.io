(() => {
 'use strict';
 const game=document.getElementById('life-game'),auto=document.getElementById('mobile-auto'),sound=document.getElementById('game-sound'),pause=document.getElementById('game-pause'),settings=document.getElementById('journey-settings');
 if(!game||!auto||!sound||document.getElementById('mobile-auto-tip'))return;
 const media=matchMedia('(max-width:760px), (hover:none) and (pointer:coarse) and (max-width:1024px)');
 const autoHome=document.createComment('Auto desktop position'),soundHome=document.createComment('Sound desktop position');auto.before(autoHome);sound.before(soundHome);
 const tip=document.createElement('aside');tip.id='mobile-auto-tip';tip.hidden=true;tip.setAttribute('role','status');
 const copy=document.createElement('p'),dismiss=document.createElement('button');dismiss.type='button';tip.append(copy,dismiss);document.body.append(tip);
 const labels={en:['Tap Auto to watch the story. Tap again to play with the controls.','Got it'],ja:['「自動」を押すと物語が自動で進みます。もう一度押すと自分で操作できます。','わかりました'],'zh-Hant':['點「自動」就能觀看故事，再點一次即可切回自己操作。','知道了']};
 let seen=false,pending=false;try{seen=localStorage.getItem('jarvis-mobile-auto-tip-v1')==='seen';}catch{}
 function finish(){seen=true;tip.hidden=true;try{localStorage.setItem('jarvis-mobile-auto-tip-v1','seen');}catch{}}
 dismiss.addEventListener('click',finish);auto.addEventListener('click',finish);
 function update(){
  if(media.matches){const tools=game.querySelector('.game-tools');if(auto.parentElement!==tools)tools.insertBefore(auto,pause);if(sound.parentElement!==tools)tools.append(sound);sound.classList.add('mobile-direct-sound');if(settings.open)settings.open=false;}
  else{if(auto.previousSibling!==autoHome)autoHome.after(auto);if(sound.previousSibling!==soundHome)soundHome.after(sound);sound.classList.remove('mobile-direct-sound');}
  const lang=game.dataset.language||document.documentElement.lang,ui=labels[lang]||labels.en;
  if(copy.textContent!==ui[0])copy.textContent=ui[0];if(dismiss.textContent!==ui[1])dismiss.textContent=ui[1];
  const show=media.matches&&!seen&&!auto.hidden&&game.dataset.phase!=='ready'&&document.querySelector('.journey-stage')?.dataset.revealed==='true'&&!document.querySelector('dialog[open]');
  if(tip.hidden===show)tip.hidden=!show;
 }
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;update();});}
 media.addEventListener('change',schedule);window.addEventListener('resize',schedule);document.addEventListener('journeylanguage',schedule);
 new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','data-phase','data-revealed','data-language','open']});
 update();
})();
