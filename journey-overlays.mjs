import {createClassCarousel} from './journey-carousel.mjs?v=41bb5f0a7bb3f10f';

// Native dialogs contain focus and isolate game input; closing releases only
// their own pause reason, preserving user/offscreen/visibility pauses.
export function createJourneyOverlays({doc=document,jobs,translate,onSelect,onPause,onContinue,onFocus}){
 const welcome=doc.getElementById('journey-welcome'),picker=doc.getElementById('journey-class-picker');
 const trigger=doc.getElementById('class-picker-toggle');
 let seen=false,selected=null,carousel;
 const supported=typeof welcome?.showModal==='function'&&typeof picker?.showModal==='function';
 const active=()=>Boolean(welcome?.open||picker?.open);
 const scrollBack=amount=>{if(welcome.open&&welcome.scrollTop===0)doc.defaultView?.scrollBy({top:amount,behavior:'instant'});};
 welcome?.addEventListener('wheel',event=>{if(event.deltaY<0&&welcome.scrollTop===0){event.preventDefault();scrollBack(event.deltaY);}},{passive:false});
 welcome?.addEventListener('keydown',event=>{if(['PageUp','Home','ArrowUp'].includes(event.key)&&welcome.scrollTop===0){event.preventDefault();scrollBack(event.key==='ArrowUp'?-60:-doc.defaultView.innerHeight*.25);}});
 if(!supported)return {enter:()=>false,active,render(){}};
 const open=(dialog,reason)=>{if(active())return;delete dialog.dataset.scrollDismissed;dialog.dataset.scrollFading='false';dialog.style.setProperty('--welcome-opacity','1');onPause(reason,true);dialog.showModal();};
 carousel=createClassCarousel({host:doc.getElementById('class-carousel'),choices:doc.getElementById('class-choices'),dots:doc.getElementById('class-dots'),counter:doc.getElementById('class-counter'),jobs,onSelect,translate});
 trigger.addEventListener('click',()=>{open(picker,'class-picker');carousel.render(selected);});
 doc.getElementById('class-picker-close').addEventListener('click',()=>picker.close());
 doc.getElementById('class-picker-done').addEventListener('click',()=>picker.close());
 doc.getElementById('welcome-continue').addEventListener('click',()=>welcome.close());
 welcome.addEventListener('close',()=>{onPause('welcome',false);if(welcome.dataset.scrollDismissed==='true'){delete welcome.dataset.scrollDismissed;seen=false;return;}onContinue();onFocus();});
 picker.addEventListener('close',()=>{onPause('class-picker',false);trigger.focus({preventScroll:true});});
 return {
  active,
  enter(){if(seen)return welcome.open;seen=true;open(welcome,'welcome');return true;},
  render(classId){selected=classId;if(picker.open)carousel.render(classId);}
 };
}
