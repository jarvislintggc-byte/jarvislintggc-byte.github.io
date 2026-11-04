(() => {
 'use strict';
 const root=document.getElementById('life-game'),auto=document.getElementById('mobile-auto'),speed=document.getElementById('story-speed'),toggle=document.getElementById('settings-toggle');
 if(!root||!auto||!speed||!toggle)return;
 const tray=document.createElement('div');tray.className='journey-auto-speed';auto.after(tray);tray.append(speed);
 const speaker=document.getElementById('game-sound')?.querySelector('svg')?.cloneNode(true);if(speaker){speaker.querySelector('.sound-muted')?.remove();toggle.querySelector('svg')?.replaceWith(speaker);}
 toggle.removeAttribute('data-journey-aria-label');const title=document.getElementById('settings-heading');title?.removeAttribute('data-journey-text');
 let previous=null;
 function update(){
  const open=auto.getAttribute('aria-pressed')==='true'&&!auto.hidden;
  if(previous!==open){tray.classList.toggle('is-open',open);tray.inert=!open;tray.setAttribute('aria-hidden',String(!open));previous=open;}
  const lang=root.dataset.language||document.documentElement.lang;const text=lang==='ja'?'サウンド設定':lang==='en'?'Sound settings':'音效設定';if(toggle.getAttribute('aria-label')!==text){toggle.setAttribute('aria-label',text);toggle.title=text;}if(title&&title.textContent!==text)title.textContent=text;
 }
 new MutationObserver(update).observe(root,{subtree:true,attributes:true,attributeFilter:['aria-pressed','hidden','data-language','data-mode']});
 update();
})();
