(() => {
 'use strict';
 const locale=location.pathname.startsWith('/zh/')?'zh-Hant':location.pathname.startsWith('/ja/')?'ja':'en';
 const ui={en:{stats:['Languages','Countries','Total articles'],period:'JAPAN · SIX YEARS',location:'Location',abroad:'Life Abroad',cv:'Request Full CV',pending:'Coming soon'},'zh-Hant':{stats:['語言','國家','文章總數'],period:'日本 · 六年',location:'地點',abroad:'海外流浪',cv:'Request Full CV',pending:'即將提供'},ja:{stats:['言語','国','記事総数'],period:'日本 · 6年間',location:'所在地',abroad:'海外での歩み',cv:'Request Full CV',pending:'準備中'}}[locale];
 let profile={articleTotal:20,resumes:{en:null,'zh-Hant':null,ja:null}},queued=false;
 const set=(e,t)=>{if(e&&e.textContent!==t)e.textContent=t;};
 function cv(summary){
  if(summary.querySelector('.jarvis-cv'))return;
  const details=document.createElement('details');details.className='jarvis-cv';
  const trigger=document.createElement('summary');trigger.append(ui.cv);const arrow=document.createElement('span');arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');trigger.append(arrow);details.append(trigger);
  const list=document.createElement('ul');
  for(const [lang,label]of [['zh-Hant','中文'],['en','English'],['ja','日本語']]){const li=document.createElement('li'),url=profile.resumes?.[lang],item=document.createElement(url?'a':'button');item.textContent=label;item.lang=lang;if(url){item.href=url;item.target='_blank';item.rel='noopener noreferrer';}else{item.type='button';item.disabled=true;const status=document.createElement('small');status.textContent=ui.pending;item.append(status);}li.append(item);list.append(li);}
  details.append(list);summary.append(details);
  details.addEventListener('keydown',e=>{if(e.key==='Escape'){details.open=false;trigger.focus({preventScroll:true});}});
 }
 let observedCircle=null,observedText=null;
 const resize=new ResizeObserver(()=>center());
 resize.observe(document.body);document.fonts?.ready.then(schedule);
 function center(){
  const circle=document.querySelector('.framer-1kefqrt-container'),text=document.querySelector('.framer-1b6rwjp-container');if(!circle||!text)return;
  if(circle!==observedCircle){if(observedCircle)resize.unobserve(observedCircle);resize.observe(circle);observedCircle=circle;}
  if(text!==observedText){if(observedText)resize.unobserve(observedText);resize.observe(text);observedText=text;}
  if(innerWidth<810)return;
  const parent=text.offsetParent;if(!parent)return;
  const r=circle.getBoundingClientRect(),p=parent.getBoundingClientRect(),y=r.top+r.height/2-p.top;
  const value=y.toFixed(2)+'px';if(text.style.getPropertyValue('--jarvis-exploration-center')!==value)text.style.setProperty('--jarvis-exploration-center',value);
  text.classList.add('jarvis-centered-exploration');
 }
 function update(){
  for(const p of document.querySelectorAll('#hero-section p'))if(/TAIWAN\s*·\s*JAPAN\s*·\s*(ARIZONA|USA)/i.test(p.textContent))set(p,'/TAIWAN · JAPAN · USA');
  const experience=document.querySelector('#experience');if(!experience)return;
  const numbers=['3','4',String(profile.articleTotal)];
  experience.querySelectorAll('.framer-q7h972>div').forEach((block,i)=>{if(i>2)return;const ps=block.querySelectorAll('p');set(ps[0],numbers[i]);set(ps[ps.length-1],ui.stats[i]);ps[0]?.classList.add('jarvis-stat-value');});
  const head=experience.querySelector('[data-framer-name="Table Head"]');if(head){set(head.children[2]?.querySelector('p'),ui.location);set(head.children[3]?.querySelector('p'),ui.abroad);}
  experience.querySelectorAll('.framer-WLFa2').forEach((row,i)=>{
   if(i===0)set(row.querySelector('.framer-1b2crsy p'),ui.period);
   const title=row.querySelector('h4');if(title)set(title,title.textContent.trim());
   const location=row.querySelector('.framer-1dwlxmp');if(location){const ps=location.querySelectorAll('p');set(ps[0],i===0?'Tokyo, Japan':'Phoenix, Arizona');for(const p of [...ps].slice(1))set(p,'');}
  });
  const summary=experience.querySelector('[data-framer-name="Summary"]');if(summary)cv(summary);
  center();
 }
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;update();});}
 new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
 window.addEventListener('resize',schedule);window.addEventListener('load',schedule);
 document.addEventListener('click',e=>{const menu=document.querySelector('.jarvis-cv[open]');if(menu&&!menu.contains(e.target))menu.open=false;});
 fetch('/home-profile.json?v=1').then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(data=>{profile=data;document.querySelectorAll('.jarvis-cv').forEach(e=>e.remove());schedule();}).catch(()=>{});
 schedule();
})();
