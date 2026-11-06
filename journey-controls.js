(() => {
 'use strict';
 const root=document.getElementById('life-game'),auto=document.getElementById('mobile-auto'),speed=document.getElementById('story-speed');
 if(!root||!auto||!speed)return;
 const tray=document.createElement('div');tray.className='journey-auto-speed';auto.after(tray);tray.append(speed);
 let previous=null;
 function update(){
  const open=auto.getAttribute('aria-pressed')==='true'&&!auto.hidden;
  if(previous!==open){tray.classList.toggle('is-open',open);tray.inert=!open;tray.setAttribute('aria-hidden',String(!open));previous=open;}
 }
 new MutationObserver(update).observe(auto,{attributes:true,attributeFilter:['aria-pressed','hidden']});
 update();
})();
