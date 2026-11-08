(() => {
 'use strict';
 const dock=document.getElementById('jarvis-global-dock'),button=document.getElementById('menu-trigger');if(!dock||!button)return;
 const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let frame=0,pointer=null;
 function clear(){for(const el of [dock,button])el.style.setProperty('--rim-strength','0');}
 function paint(){frame=0;if(!fine.matches||!pointer||document.hidden){clear();return;}for(const el of [dock,button]){const r=el.getBoundingClientRect(),dx=Math.max(r.left-pointer.x,0,pointer.x-r.right),dy=Math.max(r.top-pointer.y,0,pointer.y-r.bottom),strength=Math.max(0,1-Math.hypot(dx,dy)/115),angle=Math.atan2(pointer.y-r.top-r.height/2,pointer.x-r.left-r.width/2)*180/Math.PI+90;el.style.setProperty('--rim-strength',strength.toFixed(3));el.style.setProperty('--rim-angle',angle.toFixed(1)+'deg');}}
 window.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||!fine.matches)return;pointer={x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(paint);},{passive:true});
 window.addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});fine.addEventListener('change',clear);
 document.addEventListener('pointerout',event=>{if(!event.relatedTarget){pointer=null;clear();}},{passive:true});
 const names=new Set(),visible=new WeakSet();
 function updateNames(){for(const el of names)el.style.animationPlayState=document.hidden||reduced.matches||!visible.has(el)?'paused':'running';}
 function syncVisibility(){dock.toggleAttribute('data-motion-paused',document.hidden);updateNames();}
 const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target);}updateNames();});
 function brand(){for(const el of names)if(!el.isConnected){observer.unobserve(el);names.delete(el);}for(const el of document.querySelectorAll('#hero-section mark,.framer-1p8qmfk *'))if(!el.children.length&&el.textContent.trim()==='Jarvis Lin'&&!names.has(el)){el.classList.add('jarvis-hero-name');names.add(el);observer.observe(el);}}
 window.JarvisHome?.onReady(brand);document.addEventListener('jarvis:home-ready',brand,{once:true});document.addEventListener('visibilitychange',syncVisibility);reduced.addEventListener('change',updateNames);brand();syncVisibility();
})();
