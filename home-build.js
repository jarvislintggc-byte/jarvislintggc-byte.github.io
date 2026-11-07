(() => {
 'use strict';
 const host=document.createElement('jarvis-home-build'),shadow=host.attachShadow({mode:'open'});
 document.body.append(host);
 shadow.innerHTML=`<style>
 :host{position:fixed;inset:0;overflow:hidden;z-index:2147483646;pointer-events:none;font:12px/1.4 Arial,sans-serif;color:#f8f7f2}
 *{box-sizing:border-box}button{font:inherit;cursor:pointer;border:0;color:inherit;background:#ffffff13;border-radius:9px;padding:9px 12px;min-height:38px;white-space:nowrap}button:hover{background:#ffffff28}button:focus-visible{outline:2px solid #a3d4be;outline-offset:2px}button[aria-pressed=true]{background:#b9d4c5;color:#172a22}button:disabled{opacity:.4;cursor:default}
 .bar{position:absolute;bottom:max(18px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;max-width:calc(100% - 24px);padding:8px 10px;border:1px solid #ffffff25;border-radius:16px;background:#141917f2;box-shadow:0 10px 35px #0003;pointer-events:auto;backdrop-filter:blur(16px);opacity:1;visibility:visible;transition:transform .32s ease,opacity .26s ease,visibility 0s}
 .replay-launcher{position:absolute;right:20px;bottom:max(18px,env(safe-area-inset-bottom));border:1px solid #ffffff30;border-radius:12px;background:#141917ed;box-shadow:0 4px 18px #0002;pointer-events:auto;color:#eee}.replay-launcher[hidden]{display:none}
 .bar.is-away{opacity:0;transform:translate(-50%,calc(100% + 32px));visibility:hidden;pointer-events:none;transition:transform .32s ease,opacity .26s ease,visibility 0s .32s}
 .identity{display:flex;align-items:center;gap:9px;padding:0 6px}.dots{display:flex}.dots i{display:grid;place-items:center;font:700 10px/1 Arial;font-style:normal;color:white;width:21px;height:21px;border-radius:50%;border:2px solid #141917;margin-left:-4px;background:var(--color)}.caption{font-size:13px;color:#b9c3bd;white-space:nowrap}.count{min-width:65px;font-variant-numeric:tabular-nums}.progress{width:54px;height:3px;background:#ffffff25;border-radius:3px;overflow:hidden}.progress i{height:100%;display:block;background:#b9d4c5;width:0;transition:width .15s}
 .agent{position:absolute;left:0;top:0;opacity:0;will-change:transform;color:var(--color);filter:drop-shadow(0 2px 2px #0003)}.agent svg{width:22px;height:28px;display:block;fill:var(--color);stroke:#fff;stroke-width:1.5}.agent span{position:absolute;top:25px;left:16px;padding:3px 7px;border:1px solid #ffffff60;border-radius:3px 8px 8px 8px;background:#079ff4;color:#fff;white-space:nowrap;font:10px/1.4 monospace}
 .box{position:absolute;border:1px solid #079ff4;opacity:0}.box:before,.box:after{content:'';position:absolute;width:5px;height:5px;border:1px solid #079ff4;background:#fff}.box:before{left:-3px;top:-3px}.box:after{right:-3px;bottom:-3px}.box small{position:absolute;left:-1px;top:-19px;white-space:nowrap;background:#079ff4;color:#fff;font:9px/16px monospace;padding:0 5px;border-radius:3px 3px 0 0}
 .build-ghost{position:absolute;pointer-events:none;transform-origin:top left;overflow:hidden}.build-ghost.type{white-space:pre-wrap}.build-ghost.type:after{content:"";border-right:1px solid #079ff4;margin-left:2px}
 .ruler{position:absolute;background:#303438ed;color:#9aabb5;font:9px/1 monospace;overflow:hidden;transition:transform .25s ease;pointer-events:none;z-index:3}
 .ruler-top{left:24px;right:0;top:0;height:24px;transform:translateY(-100%);border-bottom:1px solid #4c5358;background-image:repeating-linear-gradient(90deg,transparent 0 9px,#6d7a8466 9px 10px);background-size:100% 5px;background-repeat:no-repeat;background-position:bottom}
 .ruler-left{left:0;top:24px;bottom:0;width:24px;transform:translateX(-100%);border-right:1px solid #4c5358;background-image:repeating-linear-gradient(0deg,transparent 0 9px,#6d7a8466 9px 10px);background-size:5px 100%;background-repeat:no-repeat;background-position:right}
 .rulers.is-visible .ruler{transform:translate(0,0)}
 .ruler b{position:absolute;font:inherit;font-weight:400}.ruler-top b{top:5px;transform:translateX(-50%)}.ruler-left b{left:5px;writing-mode:vertical-rl;transform:rotate(180deg) translateY(50%)}
 .ruler i{position:absolute;background:#079ff433;box-shadow:inset 0 -1px #079ff4}.ruler-top i{top:0;height:100%;left:0}.ruler-left i{left:0;width:100%;top:0}
 @media(prefers-reduced-motion:reduce){.ruler,.bar{transition:none}}
 @media(max-width:600px){.bar{width:auto;gap:6px;padding:7px;bottom:max(10px,env(safe-area-inset-bottom));border-radius:13px}.progress{display:none}.identity{padding:0 3px}.count{min-width:47px;font-size:10px}button{padding:8px 9px;min-height:42px;font-size:11px}.agent span{font-size:9px}}
 </style><div class="rulers" aria-hidden="true"><div class="ruler ruler-top"><i></i><div class="ruler-labels"></div></div><div class="ruler ruler-left"><i></i><div class="ruler-labels"></div></div></div><div class="effects" aria-hidden="true"></div><div class="bar is-away" inert aria-hidden="true" role="region" aria-label="首頁動畫試作控制列"><div class="identity" aria-label="0 Agents"><div class="dots" aria-hidden="true"></div><strong class="agent-number">0</strong><span class="caption">Agents</span></div><span class="count">準備中</span><div class="progress"><i></i></div></div><button class="replay replay-launcher" hidden>重播動畫 ↻</button>`;
 const ui=selector=>shadow.querySelector(selector),reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:600px)');
 const language=document.documentElement.lang.startsWith('ja')?'ja':document.documentElement.lang.startsWith('zh')?'zh':'en';
 const labels={zh:{replay:'重播動畫 ↻',controls:'動畫控制列',participants:'本次參與的 Agents'},en:{replay:'Replay ↻',controls:'Animation controls',participants:'Agents in this build'},ja:{replay:'もう一度再生 ↻',controls:'アニメーション操作',participants:'今回参加した Agents'}}[language];
 ui('.bar').setAttribute('aria-label',labels.controls);ui('.replay').textContent=labels.replay;
 let sections=[],tasks=[],agents=[],done=0,running=false,paused=false,tour=true,raf=0,last=0,started=false,autoCancelled=false,wait=0,bootTimer;
 reduced.addEventListener('change',()=>{if(reduced.matches&&running)finish();});
 window.addEventListener('error',event=>{if(event.filename?.includes('/home-build.js?v=41bb5f0a7bb3f10f'))finish();});
 const speed=1;
 const colors=['#4d78ce','#a75b86','#528c69','#b18138'];
 const sfx=window.JarvisBuildSound?new window.JarvisBuildSound():null;
 let assignment=0,lastRoster='',audioEnabled=true,hudCollapsed=false,hudSection=null;
 let resumeAt=0,resumePending=false,audibleStarted=false,audioTailUntil=0,audioTailTimer=0;
 function syncSound(){
  if(!sfx?.ctx)return;
  const on=audioEnabled&&inSections()&&!document.hidden&&(running||performance.now()<audioTailUntil);
  if(sfx.on!==on)sfx.setOn(on);
 }
 function confirmAudio(){syncSound();if(!audibleStarted&&sfx?.ready()&&inSections()&&running){audibleStarted=true;sfx.start();}}
 function unlockSound(event){
  if(!audioEnabled||!sfx)return;
  if(sfx.ctx?.state==='closed'){sfx.ctx=null;resumePending=false;audibleStarted=false;}
  if(!sfx.ctx){if(!sfx.init())return;sfx.ctx.addEventListener('statechange',()=>{if(sfx.ctx.state==='running')confirmAudio();});}
  syncSound();
  if(sfx.ctx.state==='running'){confirmAudio();return;}
  const gesture=event?.isTrusted&&['pointerdown','pointerup','touchstart','touchend','click','keydown'].includes(event.type);
  const now=performance.now();if(!gesture&&(resumePending||now-resumeAt<1200))return;
  resumeAt=now;resumePending=true;sfx.ctx.resume().then(()=>{resumePending=false;confirmAudio();}).catch(()=>{resumePending=false;});
 }
 for(const type of ['pointerdown','pointerup','touchstart','touchend','click','keydown'])window.addEventListener(type,unlockSound,{capture:true,passive:true});
 window.addEventListener('focus',()=>unlockSound());window.addEventListener('pageshow',()=>unlockSound());
 function visibleWork(){return tasks.some(t=>t.state==='pending'&&ready(t)&&(()=>{const r=t.el.getBoundingClientRect();return r.top<innerHeight*.86&&r.bottom>0&&r.left<innerWidth&&r.right>0;})());}
 function setBarVisibility(){
  const current=sections.find(root=>{const r=root.getBoundingClientRect();return r.top<innerHeight*.5&&r.bottom>80;})||sections.find(root=>{const r=root.getBoundingClientRect();return r.top<innerHeight-40&&r.bottom>80;});
  if(current!==hudSection){hudSection=current;hudCollapsed=false;}
  const sectionVisible=Boolean(current),working=running&&(agents.some(a=>a.task)||visibleWork());
  if(sectionVisible&&!working&&done>0)hudCollapsed=true;
  const visible=sectionVisible&&working&&!hudCollapsed;ui('.effects').style.visibility=sectionVisible?'visible':'hidden';
  ui('.bar').classList.toggle('is-away',!visible);ui('.bar').inert=!visible;ui('.bar').setAttribute('aria-hidden',String(!visible));
  ui('.replay').hidden=!(sectionVisible&&(hudCollapsed||!running)&&(done>0||!running));
  syncSound();if(sectionVisible&&running&&sfx?.ctx?.state!=='running')unlockSound();
 }
 function updateRoster(){
  const active=agents.filter(a=>a.task),signature=assignment+'|'+active.map(a=>a.assignment).join(',');
  if(signature===lastRoster)return;lastRoster=signature;
  ui('.agent-number').textContent=String(assignment);ui('.identity').setAttribute('aria-label',assignment+' Agents');ui('.identity').title=labels.participants;
  const roster=active.length?active.slice(-5):Array.from({length:Math.min(5,assignment)},(_,i)=>({assignment:assignment-Math.min(5,assignment)+i}));
  ui('.dots').innerHTML=roster.map(a=>`<i style="--color:${colors[a.assignment%colors.length]}">${'SLJVAMKBD'[a.assignment%9]}</i>`).join('');
 }
 let rulerTimer=0,rulerOrigin=null,rulerWidth=0;const ruledSections=new Set();
 function hideRulers(){clearTimeout(rulerTimer);ui('.rulers').classList.remove('is-visible');}
 function updateRulers(){
  if(rulerWidth!==innerWidth){rulerWidth=innerWidth;ui('.ruler-top .ruler-labels').innerHTML=Array.from({length:Math.ceil(innerWidth/100)},(_,i)=>`<b style="left:${i*100-24}px">${i*100}</b>`).join('');}
  const origin=Math.floor(scrollY/100)*100;
  if(origin!==rulerOrigin){rulerOrigin=origin;}
  ui('.ruler-left .ruler-labels').innerHTML=Array.from({length:Math.ceil(innerHeight/100)+2},(_,i)=>`<b style="top:${origin+i*100-scrollY-24}px">${origin+i*100}</b>`).join('');
 }
 function showRulers(section){
  if(ruledSections.has(section)||reduced.matches)return;
  ruledSections.add(section);updateRulers();clearTimeout(rulerTimer);ui('.rulers').classList.add('is-visible');
  rulerTimer=setTimeout(hideRulers,2000);
 }
 function clearElement(el){el.removeAttribute('data-build-pending');el.removeAttribute('data-build-active');el.removeAttribute('data-build-typing');el.removeAttribute('data-build-stage');el.style.removeProperty('--build-unrevealed');if(el.hasAttribute('data-build-cv')){el.open=el.dataset.buildCv==='open';el.removeAttribute('data-build-cv');for(const prop of ['--build-cv-reveal','--build-cv-inset','--build-cv-bottom'])el.style.removeProperty(prop);}}
 function progress(){ui('.count').textContent=`${done} / ${tasks.length}`;ui('.progress i').style.width=`${tasks.length?done/tasks.length*100:0}%`;}
 function setTour(value){tour=value;}
 function finish(message='組裝完成 · 可以自由瀏覽'){
  running=false;hideRulers();cancelAnimationFrame(raf);raf=0;last=0;
  tasks.forEach(t=>clearElement(t.el));agents.forEach(a=>{a.pointer.remove();a.box.remove();a.ghost?.remove();});agents=[];updateRoster();
  clearTimeout(audioTailTimer);audioTailUntil=done>0&&done===tasks.length?performance.now()+2800:0;
  if(audioTailUntil)audioTailTimer=setTimeout(syncSound,2900);syncSound();
  document.documentElement.removeAttribute('data-build-demo');
  ui('.replay').hidden=false;
  host.dataset.state='complete';setBarVisibility();
 }
 function eligible(el){
  if(el.closest('dialog,[hidden],jarvis-home-build,script,style,noscript,template,#site-menu'))return false;
  const r=el.getBoundingClientRect(),s=getComputedStyle(el);
  return r.width>2&&r.height>2&&s.display!=='none'&&s.visibility!=='hidden';
 }
 function collect(){
  const selected=new Set(sections.flatMap(root=>[...root.querySelectorAll('.jarvis-cv')]).filter(eligible)),groups=sections.flatMap(root=>[...root.querySelectorAll('.jarvis-marquee-card:not([data-copy])')]).filter(eligible);
  groups.forEach(e=>selected.add(e));
  const rows=[...document.querySelectorAll('#experience .jarvis-life-row')].filter(eligible);rows.forEach(e=>selected.add(e));
  const scope=sections.flatMap(root=>[root,...root.querySelectorAll('*')]);
  for(const el of scope){
   if(!eligible(el)||el.closest('.jarvis-marquee-card')||el.matches('.jarvis-article-marquee'))continue;
   const r=el.getBoundingClientRect();
   if(r.right<0||r.left>innerWidth)continue;
   const directText=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
   if(directText){
    const block=el.closest('h1,h2,h3,h4,h5,h6,p,button,summary,dt,dd,figcaption')||el;
    if(eligible(block))selected.add(block);
   }
   if(el.matches('img,svg,video,canvas,hr'))selected.add(el.closest('button')||el);
   const style=getComputedStyle(el),color=style.backgroundColor;
   const painted=(color!=='transparent'&&!/rgba\([^)]*,\s*0\)/.test(color)&&color!=='rgba(0, 0, 0, 0)')||style.backgroundImage!=='none'||style.boxShadow!=='none'||['Top','Right','Bottom','Left'].some(side=>parseFloat(style['border'+side+'Width'])>0&&style['border'+side+'Style']!=='none');
   if(painted&&r.height<innerHeight*2&&el.id!=='main')selected.add(el);
  }
  // SVG paths are represented by their SVG, and text spans by their text block.
  const clean=[...selected].filter(el=>!el.parentElement?.closest('svg')&&!([...selected].some(parent=>parent!==el&&parent.contains(el)&&parent.matches('h1,h2,h3,h4,h5,h6,p,button,summary,dt,dd,figcaption,.jarvis-cv,.jarvis-photo-row,.jarvis-article-marquee,.jarvis-exploration-orbit'))));
  return clean.map(el=>({el,top:el.closest('#jarvis-global-dock')?-100:el.getBoundingClientRect().top+scrollY,state:'pending',rowIndex:rows.indexOf(el),row:el.closest('.jarvis-life-row'),parents:clean.filter(parent=>parent!==el&&parent.contains(el))})).sort((a,b)=>a.top-b.top||a.parents.length-b.parents.length);
 }
 function ready(task){
  if(task.parents.some(p=>p.hasAttribute('data-build-pending')||p.hasAttribute('data-build-active')))return false;
  const rows=[...document.querySelectorAll('#experience .jarvis-life-row')],index=rows.indexOf(task.row);
  return index<1||!tasks.some(t=>rows[0].contains(t.el)&&t.state!=='done');
 }
 function styledCopy(source){
  const copy=source.cloneNode(true),originals=[source,...source.querySelectorAll('*')],clones=[copy,...copy.querySelectorAll('*')];
  originals.forEach((el,i)=>{const style=getComputedStyle(el),clone=clones[i];clone.removeAttribute('id');clearElement(clone);for(const prop of ['display','position','width','height','minWidth','padding','margin','gap','flexDirection','alignItems','justifyContent','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','textAlign','border','borderRadius','backgroundColor','gridTemplateColumns'])clone.style[prop]=style[prop];clone.style.opacity='1';clone.style.transform='none';});
  return copy;
 }
 function beginEffect(agent,task){
  const style=getComputedStyle(task.el),size=parseFloat(style.fontSize),hasText=task.el.matches('h1,h2,h3,h4,h5,h6,p,summary,button')&&task.el.innerText.trim();
  task.effect=task.el.matches('.jarvis-cv')?'cv-menu':task.rowIndex>0?'duplicate':hasText&&size>20?'type-scale':'draw';task.duration=task.effect==='draw'?1350:2150;
  if(task.effect==='cv-menu'){task.duration=3400;task.el.dataset.buildCv=task.el.open?'open':'closed';task.el.open=true;return;}
  if(task.effect==='draw')return;
  task.el.setAttribute('data-build-typing','');
  const ghost=document.createElement('div');ghost.className='build-ghost '+(task.effect==='type-scale'?'type':'duplicate');agent.ghost=ghost;
  if(task.effect==='type-scale'){
   task.fontSize=size;task.text=Array.from(task.el.innerText);for(const prop of ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','textAlign','color'])ghost.style[prop]=style[prop];
  }else{const first=document.querySelector('#experience .jarvis-life-row');task.copyRect=first.getBoundingClientRect();ghost.append(styledCopy(first));}
  ui('.effects').append(ghost);
 }
 const clamp=t=>Math.max(0,Math.min(1,t));
 const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
 function effectFrame(agent,target){
  const task=agent.task,time=agent.time;
  if(task.effect==='cv-menu'){const base=task.el.getBoundingClientRect(),menu=task.el.querySelector('ul').getBoundingClientRect(),reveal=clamp((time-300)/900),close=smooth((time-2500)/700);task.el.style.setProperty('--build-cv-reveal',String(reveal*(1-close)));task.el.style.setProperty('--build-cv-inset',(1-reveal)*100+'%');task.el.style.setProperty('--build-cv-bottom',close*100+'%');task.el.dataset.buildStage=close>0?'cv-closing':'cv-drawing';return {rect:{left:Math.min(base.left,menu.left),top:base.top,width:Math.max(base.right,menu.right)-Math.min(base.left,menu.left),height:base.height+(Math.max(base.bottom,menu.bottom)-base.bottom)*(1-close)},draw:Math.max(.1,reveal)};}
  if(task.effect==='draw')return {rect:target,draw:clamp((time-280)/850)};
  if(task.effect==='type-scale'){
   const typed=clamp((time-250)/750),scale=16/task.fontSize+(1-16/task.fontSize)*smooth((time-1100)/800);
   const text=task.text.slice(0,Math.ceil(task.text.length*typed)).join('');if(agent.ghost.textContent!==text){const count=text.length-agent.ghost.textContent.length;agent.ghost.textContent=text;if(audioEnabled)sfx?.key(target.left,innerWidth,agent.assignment,count,0);}
   Object.assign(agent.ghost.style,{left:target.left+'px',top:target.top+'px',width:target.width+'px',height:target.height+'px',transform:`scale(${scale})`,opacity:time>=250?'1':'0'});
   task.el.dataset.buildStage=time<1100?'typing':'resizing';
   const step=Math.floor(smooth((time-1100)/800)*8);if(step!==task.growStep){task.growStep=step;if(audioEnabled&&time>1100)sfx?.grow(step,target.left,innerWidth);}
   return {rect:{...target,width:target.width*scale,height:target.height*scale},draw:1};
  }
  const from=task.copyRect,move=smooth((time-450)/650),resize=smooth((time-1150)/700);
  const rect={left:from.left+(target.left-from.left)*move,top:Math.max(30,from.top)+(target.top-Math.max(30,from.top))*move,width:from.width+(target.width-from.width)*resize,height:from.height+(target.height-from.height)*resize};
  Object.assign(agent.ghost.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',opacity:String(time<250?time/250:time>1800?1-clamp((time-1800)/300):.8)});
  task.el.dataset.buildStage=time<1100?'duplicating':'resizing';
  return {rect,draw:1};
 }
 function prepare(){
  finish();sections=[document.querySelector('#experience'),document.querySelector('.jarvis-experience-carousel')?.closest('.framer-zrw9y0')||document.querySelector('.jarvis-experience-carousel')].filter(Boolean);
  const main=document.querySelector('#main')||document.querySelector('main');
  if(!main){return;}
  // Keep original nodes, handlers, Framer transforms and the ink canvas intact.
  if(audioEnabled&&sfx?.ctx)sfx.setOn(true);
  tasks=collect();
  if(!tasks.length){return;}
  hudCollapsed=false;hudSection=null;assignment=0;updateRoster();ruledSections.clear();done=0;paused=false;wait=0;last=0;setTour(false);progress();
  if(reduced.matches){finish('已依系統偏好減少動畫 · 首頁可直接使用');return;}
  tasks.forEach(t=>t.el.setAttribute('data-build-pending',''));
  ui('.replay').hidden=true;
  agents=Array.from({length:mobile.matches?5:8},(_,i)=>{
   const pointer=document.createElement('div'),box=document.createElement('div'),color=colors[i%colors.length];
   pointer.className='agent';pointer.style.setProperty('--color',color);pointer.innerHTML=`<svg viewBox="0 0 24 30"><path d="M3 2L21 18L12 19L8 27Z"/></svg><span></span>`;
   box.className='box';box.style.setProperty('--color',color);box.innerHTML='<small></small>';ui('.effects').append(box,pointer);
   return {pointer,box,task:null,time:0,x:innerWidth*(.2+i*.13),y:innerHeight*.3};
  });
  running=true;host.dataset.state='running';setBarVisibility();document.documentElement.setAttribute('data-build-demo','');unlockSound();schedule();
 }
 function inSections(){return sections.some(root=>{const r=root.getBoundingClientRect();return r.top<innerHeight-40&&r.bottom>80;});}
 function schedule(){if(running&&!paused&&!document.hidden&&inSections()&&!raf)raf=requestAnimationFrame(frame);}
 function frame(now){
  raf=0;const dt=last?Math.min(50,now-last):0;last=now;
  if(!running||paused||document.hidden||!inSections())return;
  const pending=tasks.filter(t=>t.state==='pending');
  for(const agent of agents){
   if(!agent.task){
    const candidates=pending.filter(t=>t.state==='pending'&&ready(t)&&(()=>{const r=t.el.getBoundingClientRect();return r.top<innerHeight*.86&&r.bottom>0&&r.left<innerWidth&&r.right>0;})());
    const load=t=>agents.filter(a=>a.task&&(a.task.row||a.task.el)===(t.row||t.el)).length;
    candidates.sort((a,b)=>load(a)-load(b));const task=candidates[0];
    if(task){showRulers(sections.find(root=>root.contains(task.el)));task.state='active';agent.task=task;agent.time=0;agent.fromX=agent.x;agent.fromY=agent.y;task.el.removeAttribute('data-build-pending');task.el.setAttribute('data-build-active','');agent.assignment=assignment++;agent.pointer.style.setProperty('--color',colors[agent.assignment%colors.length]);beginEffect(agent,task);if(audioEnabled)sfx?.press(task.el.getBoundingClientRect().left,innerWidth);updateRoster();}
   }
   if(!agent.task)continue;
   agent.time+=dt*speed*2;const task=agent.task,raw=task.el.getBoundingClientRect(),r={left:Math.max(0,raw.left),top:Math.max(0,raw.top),width:Math.min(raw.right,innerWidth)-Math.max(0,raw.left),height:Math.min(raw.bottom,innerHeight)-Math.max(0,raw.top)},visual=effectFrame(agent,r),box=visual.rect,arrival=Math.min(1,agent.time/280),draw=visual.draw,ease=arrival*arrival*(3-2*arrival);
   const x=box.left+box.width*draw,y=task.effect==='draw'?box.top+(task.el.matches('img')?box.height*draw:Math.min(box.height-3,20)):box.top+box.height;
   agent.x=agent.fromX+(x-agent.fromX)*ease;agent.y=agent.fromY+(y-agent.fromY)*ease;
   agent.pointer.style.transform=`translate3d(${agent.x}px,${agent.y}px,0)`;agent.pointer.style.opacity='1';
   Object.assign(agent.box.style,{left:box.left+'px',top:box.top+'px',width:Math.max(1,box.width*draw)+'px',height:box.height+'px',opacity:arrival>.85?'1':'0'});
   const size=`${Math.round(box.width*draw)} × ${Math.round(box.height)}`;
   agent.box.firstElementChild.textContent=size;agent.pointer.querySelector('span').textContent=size;
   if(ui('.rulers').classList.contains('is-visible')){Object.assign(ui('.ruler-top i').style,{left:Math.max(0,r.left-24)+'px',width:Math.max(0,r.width*draw)+'px'});Object.assign(ui('.ruler-left i').style,{top:Math.max(0,r.top-24)+'px',height:Math.max(0,r.height)+'px'});}
   if(task.effect==='draw'&&task.el.matches('p,span,small,summary,button')){const glyphs=Math.floor(task.el.textContent.trim().length*draw);if(glyphs>(task.soundGlyphs||0)){if(audioEnabled)sfx?.key(r.left,innerWidth,agent.assignment,glyphs-(task.soundGlyphs||0),0);task.soundGlyphs=glyphs;}}
   task.el.style.setProperty('--build-unrevealed',`${(1-draw)*100}%`);
   if(agent.time>=task.duration){if(audioEnabled)sfx?.place(task.effect==='duplicate'?'dup':task.effect==='type-scale'?'text':task.el.matches('img,.jarvis-marquee-card')?'image':'rect',r.left,r.top,r.width,r.height,innerWidth,innerHeight,task.fontSize||16);agent.ghost?.remove();agent.ghost=null;clearElement(task.el);task.state='done';done++;agent.task=null;agent.box.style.opacity='0';agent.pointer.style.opacity='0';updateRoster();progress();}
  }
  if(done===tasks.length){finish();return;}
  setBarVisibility();schedule();
 }
 window.addEventListener('scroll',()=>{setBarVisibility();if(ui('.rulers').classList.contains('is-visible'))updateRulers();if(inSections())schedule();else{hideRulers();cancelAnimationFrame(raf);raf=0;last=0;}},{passive:true});
 ui('.replay').onclick=()=>{const nearest=[...sections].sort((a,b)=>Math.abs(a.getBoundingClientRect().top)-Math.abs(b.getBoundingClientRect().top))[0];prepare();if(nearest)scrollTo({top:scrollY+nearest.getBoundingClientRect().top-100,behavior:'instant'});schedule();};
 window.addEventListener('wheel',()=>{if(running)setTour(false);},{passive:true});
 window.addEventListener('touchstart',e=>{if(running&&!e.composedPath().includes(host))setTour(false);},{passive:true});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){autoCancelled=true;if(running)finish('已跳過動畫 · 首頁可直接使用');}else if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)&&running)setTour(false);});
 document.addEventListener('click',e=>{if(running&&e.target.closest?.('a,button')&&!e.composedPath().includes(host))finish('已進入瀏覽 · 動畫已結束');},true);
 document.addEventListener('focusin',e=>{if(running&&e.target!==host)finish('已進入瀏覽 · 動畫已結束');});
 document.addEventListener('visibilitychange',()=>{syncSound();if(!document.hidden)unlockSound();last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule();});
 let width=innerWidth;window.addEventListener('resize',()=>{if(Math.abs(innerWidth-width)>40&&running)finish('畫面尺寸已變更 · 可重播動畫');width=innerWidth;},{passive:true});
 function boot(){if(started)return;started=true;clearTimeout(bootTimer);Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))]).then(()=>setTimeout(()=>{if(!autoCancelled)prepare();},600));}
 document.addEventListener('jarvis:home-ready',boot,{once:true});
 if(document.documentElement.dataset.jarvisHomeReady==='true')boot();
 bootTimer=setTimeout(()=>{if(!started){ui('.replay').hidden=false;}},10000);
})();
