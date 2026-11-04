(() => {
 'use strict';
 const root=document.getElementById('life-game'),trigger=document.getElementById('class-picker-toggle'),choices=document.getElementById('class-choices');
 if(!root||!trigger||!choices||document.getElementById('inline-class-menu'))return;
 const menu=document.createElement('div');menu.id='inline-class-menu';menu.className='inline-class-menu';menu.hidden=true;menu.setAttribute('role','menu');trigger.closest('.character-status').append(menu);
 trigger.setAttribute('aria-haspopup','menu');trigger.setAttribute('aria-controls',menu.id);trigger.setAttribute('aria-expanded','false');
 let key='',pending=false;
 function close(focus=false){menu.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus({preventScroll:true});}
 function refresh(){
  const current=root.dataset.pendingClass||root.dataset.classId;
  const cards=[...choices.querySelectorAll('label')].map(card=>({card,input:card.querySelector('input'),name:card.querySelector('strong')?.textContent||''})).filter(x=>x.input);
  const next=current+'|'+cards.map(x=>x.input.value+':'+x.name).join('|');if(key===next)return;key=next;
  menu.replaceChildren();for(const {card,input,name}of cards){if(input.value===current)continue;
   const button=document.createElement('button');button.type='button';button.setAttribute('role','menuitem');button.dataset.inlineClass=input.value;
   const image=card.querySelector('img');if(image){const clone=image.cloneNode();clone.alt='';clone.loading='eager';button.append(clone);}const text=document.createElement('span');text.textContent=name;button.append(text);
   button.addEventListener('click',event=>{event.stopPropagation();close();input.click();root.focus({preventScroll:true});});menu.append(button);
  }
 }
 trigger.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();refresh();const open=menu.hidden;menu.hidden=!open;trigger.setAttribute('aria-expanded',String(open));},true);
 trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();event.stopPropagation();refresh();menu.hidden=false;trigger.setAttribute('aria-expanded','true');menu.querySelector('button')?.focus();}});
 menu.addEventListener('pointerdown',event=>event.stopPropagation());
 menu.addEventListener('keydown',event=>{event.stopPropagation();const buttons=[...menu.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);if(event.key==='Escape'){event.preventDefault();close(true);}else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();buttons[event.key==='Home'?0:event.key==='End'?buttons.length-1:(i+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();}});
 document.addEventListener('click',event=>{if(!menu.contains(event.target)&&!trigger.contains(event.target))close();});
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;refresh();if(trigger.hidden)close();});}
 new MutationObserver(schedule).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['data-class-id','data-pending-class','data-language','hidden']});
 refresh();
})();
