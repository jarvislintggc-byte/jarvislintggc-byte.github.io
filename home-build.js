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
 .completion{position:absolute;inset:0;overflow:hidden;pointer-events:none}.completion[hidden]{display:none}
 .completion-toast{position:absolute;left:50%;bottom:95px;transform:translateX(-50%);padding:15px 24px;border:1px solid #9bffddaa;border-radius:16px;background:linear-gradient(130deg,#102b2eee,#142018f5);color:#d4fff0;box-shadow:0 0 36px #4ee8c34d,0 8px 28px #0002;font:700 15px/1.4 Arial,sans-serif;letter-spacing:1px;white-space:nowrap;animation:build-toast 1.8s both}
 .completion-ring{position:absolute;left:50%;top:calc(100% - 110px);width:130px;height:130px;border:2px solid #83ffe4;border-radius:50%;box-shadow:0 0 24px #76ffd699;animation:build-ring 1.7s ease-out both}
 .completion-spark{position:absolute;left:50%;top:calc(100% - 110px);width:var(--length);height:3px;border-radius:3px;background:var(--color);box-shadow:0 0 8px var(--color);animation:build-spark 1.65s cubic-bezier(.15,.7,.3,1) both;animation-delay:var(--delay)}
 @keyframes build-toast{0%{opacity:0;transform:translate(-50%,18px) scale(.85)}20%,73%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-12px) scale(1.025)}}
 @keyframes build-ring{0%{opacity:.9;transform:translate(-50%,-50%) scale(.15)}100%{opacity:0;transform:translate(-50%,-50%) scale(3.3)}}
 @keyframes build-spark{0%{opacity:0;transform:translate(0,0) rotate(var(--angle)) scaleX(.1)}12%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--angle)) scaleX(.3)}}
 @media(prefers-reduced-motion:reduce){.ruler,.bar{transition:none}}
 @media(max-width:600px){.bar{width:auto;gap:6px;padding:7px;bottom:max(10px,env(safe-area-inset-bottom));border-radius:13px}.progress{display:none}.identity{padding:0 3px}.count{min-width:47px;font-size:10px}button{padding:8px 9px;min-height:42px;font-size:11px}.agent span{font-size:9px}}
 </style><div class="rulers" aria-hidden="true"><div class="ruler ruler-top"><i></i><div class="ruler-labels"></div></div><div class="ruler ruler-left"><i></i><div class="ruler-labels"></div></div></div><div class="effects" aria-hidden="true"></div><div class="completion" hidden role="status" aria-live="polite"></div><div class="bar is-away" inert aria-hidden="true" role="region" aria-label="首頁動畫試作控制列"><div class="identity" aria-label="0 Agents"><div class="dots" aria-hidden="true"></div><strong class="agent-number">0</strong><span class="caption">Agents</span></div><span class="count">準備中</span><div class="progress"><i></i></div></div><button class="replay replay-launcher" hidden>重播動畫 ↻</button>`;
 const ui=selector=>shadow.querySelector(selector),reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:600px)');
 const language=document.documentElement.lang.startsWith('ja')?'ja':document.documentElement.lang.startsWith('zh')?'zh':'en';
 const labels={zh:{complete:'建構完成',replay:'重播動畫 ↻',controls:'動畫控制列',participants:'目前工作的 Agents'},en:{complete:'Build complete',replay:'Replay ↻',controls:'Animation controls',participants:'Agents working now'},ja:{complete:'構築完了',replay:'もう一度再生 ↻',controls:'アニメーション操作',participants:'現在作業中の Agents'}}[language];
 ui('.bar').setAttribute('aria-label',labels.controls);ui('.replay').textContent=labels.replay;
 let sections=[],tasks=[],agents=[],done=0,running=false,paused=false,autoFollow=true,engaged=false,followUntil=0,followTimer=0,raf=0,last=0,started=false,autoCancelled=false,bootTimer;
 reduced.addEventListener('change',()=>{if(reduced.matches&&running)finish();});
 window.addEventListener('error',event=>{if(event.filename?.includes('/home-build.js?v=ffe8edb4f21a868d'))finish();});
 const speed=1;
 const colors=['#4d78ce','#a75b86','#528c69','#b18138'];
 const sfx=window.JarvisBuildSound?new window.JarvisBuildSound():null;
 let assignment=0,lastRoster='',audioEnabled=true,hudSection=null,hadVisibleWork=false,completionActive=false,completionTimer=0,completionEnd=0,lastCompletionAt=-Infinity;
 const lockedControls=new Map(),completedGroups=new Set();let contentGroups=[],wasReading=false;
 const reading=()=>Boolean(document.querySelector('dialog[open]'));
 const insideConstruction=target=>sections.some(root=>root.contains(target));
 const blocked=target=>Boolean(target.closest?.('[data-build-locked]')&&!target.closest?.('[data-build-ready]'));
 function restoreControl(control){const prior=lockedControls.get(control);if(!prior)return;control.inert=prior.inert;if(prior.disabled===null)control.removeAttribute('aria-disabled');else control.setAttribute('aria-disabled',prior.disabled);lockedControls.delete(control);}
 function makeReady(group){completedGroups.add(group);group.setAttribute('data-build-ready','');if(group.matches('a,button,summary'))restoreControl(group);group.querySelectorAll('a,button,summary,input,select,textarea').forEach(restoreControl);if(sections.includes(group)){group.removeAttribute('data-build-locked');group.removeAttribute('aria-busy');}}
 function updateReadyContent(){if(!running)return;for(const group of contentGroups)if(!completedGroups.has(group.el)&&group.tasks.every(task=>task.state==='done')){makeReady(group.el);if(group.el.matches('.jarvis-marquee-card'))for(const copy of document.querySelectorAll('.jarvis-marquee-card[data-copy]'))if(copy.dataset.articleId===group.el.dataset.articleId)makeReady(copy);}}
 function lockContent(){for(const root of sections){root.setAttribute('data-build-locked','');root.setAttribute('aria-busy','true');for(const control of root.querySelectorAll('a,button,summary,input,select,textarea')){lockedControls.set(control,{inert:control.inert,disabled:control.getAttribute('aria-disabled')});control.inert=true;control.setAttribute('aria-disabled','true');}}}
 function unlockContent(){for(const control of [...lockedControls.keys()])restoreControl(control);for(const group of completedGroups)group.removeAttribute('data-build-ready');completedGroups.clear();contentGroups=[];for(const root of sections){root.removeAttribute('data-build-locked');root.removeAttribute('aria-busy');root.querySelector('.jarvis-article-marquee')?.removeAttribute('data-build-positioning');}}
 function syncMarquee(){for(const root of sections){const track=root.querySelector('.jarvis-article-marquee');if(track)track.toggleAttribute('data-build-positioning',running&&autoFollow&&tasks.some(t=>track.contains(t.el)&&t.state!=='done'));}}
 for(const type of ['click','auxclick'])window.addEventListener(type,event=>{if(running&&blocked(event.target)){event.preventDefault();event.stopImmediatePropagation();}},{capture:true});
 window.addEventListener('pointerdown',event=>{if(running&&blocked(event.target)&&event.target.closest?.('a,button,summary'))event.preventDefault();},{capture:true});
 let guideCueUntil=0,guideCuePending=false,resumeAt=0,resumePending=false,audibleStarted=false,audioTailUntil=0,audioTailTimer=0,completionPending=false,completionRequestedAt=0,finalCueRequested=false;
 function syncSound(){
  if(!sfx?.ctx)return;
  const on=audioEnabled&&!document.hidden&&((inSections()&&running&&!reading())||performance.now()<audioTailUntil||performance.now()<guideCueUntil);
  if(sfx.on!==on)sfx.setOn(on);
 }
 function flushCompletion(){if(!completionPending)return;if(performance.now()-completionRequestedAt>12000){completionPending=false;return;}if(document.hidden||sfx?.ctx?.state!=='running')return;completionPending=false;audioTailUntil=performance.now()+7200;clearTimeout(audioTailTimer);syncSound();sfx.complete();audioTailTimer=setTimeout(syncSound,7300);}
 function requestFinalCue(){if(finalCueRequested||!audioEnabled)return;finalCueRequested=true;completionPending=true;completionRequestedAt=performance.now();unlockSound();flushCompletion();}
 function confirmAudio(){syncSound();flushCompletion();if(guideCuePending&&sfx?.ready()){guideCuePending=false;sfx.start();}if(!audibleStarted&&sfx?.ready()&&inSections()&&running){audibleStarted=true;sfx.start();}}
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
 document.addEventListener('jarvis:menu-hint-cue',()=>{guideCuePending=true;guideCueUntil=performance.now()+1800;unlockSound();setTimeout(syncSound,1900);});
 window.addEventListener('focus',()=>unlockSound());window.addEventListener('pageshow',()=>unlockSound());
 function visibleWork(){return tasks.some(t=>t.state==='pending'&&ready(t)&&(()=>{const r=t.el.getBoundingClientRect();return r.top<innerHeight*.86&&r.bottom>0&&r.left<innerWidth&&r.right>0;})());}
 function clearCompletion(){clearTimeout(completionTimer);clearTimeout(completionEnd);completionTimer=0;completionActive=false;ui('.completion').hidden=true;ui('.completion').replaceChildren();}
 function advanceFollow(){
  if(!autoFollow||!engaged||!running||document.hidden||reading())return;
  for(const task of tasks){if(task.state==='pending'&&ready(task)&&task.el.getBoundingClientRect().bottom<0){clearElement(task.el);task.state='done';done++;}}progress();
  const next=tasks.find(t=>t.state==='pending'&&ready(t));if(!next){if(done===tasks.length){finish();completeBuild();}return;}
  const r=next.el.getBoundingClientRect(),track=next.el.closest('.jarvis-article-marquee');
  if(track&&r.top<innerHeight*.8&&r.bottom>80&&(r.left<24||r.right>innerWidth-24)){
   const box=track.getBoundingClientRect();track.scrollBy({left:r.left-box.left-12,behavior:'smooth'});
  }else window.scrollTo({top:scrollY+r.top-innerHeight*.22,behavior:'smooth'});
  followUntil=performance.now()+800;host.dataset.following='true';clearTimeout(followTimer);
  followTimer=setTimeout(()=>{followUntil=0;delete host.dataset.following;setBarVisibility();schedule();},850);
 }
 function settleBatch(){
  completionTimer=0;if(reading()||agents.some(a=>a.task)||visibleWork())return;
  const sectionTasks=tasks.filter(t=>hudSection?.contains(t.el)),sectionDone=sectionTasks.length&&sectionTasks.every(t=>t.state==='done');
  hadVisibleWork=false;
  if(sectionDone||done===tasks.length)completeBuild();
  else if(autoFollow&&engaged)advanceFollow();
  else setBarVisibility();
 }
 function completeBuild(){
  completionTimer=0;hadVisibleWork=false;
  const ending=done>0&&(done===tasks.length||(hudSection?.id==='experience'&&tasks.filter(t=>hudSection.contains(t.el)).every(t=>t.state==='done')));
  if(ending)requestFinalCue();
  if(!inSections()||reduced.matches)return;
  if(done!==tasks.length&&performance.now()-lastCompletionAt<8000){if(autoFollow)advanceFollow();return;}
  lastCompletionAt=performance.now();completionActive=true;
  showRulers(hudSection,true);
  const layer=ui('.completion');layer.hidden=false;layer.innerHTML=`<div class="completion-ring" aria-hidden="true"></div><div class="completion-toast">✓ ${labels.complete}</div>`;
  const count=mobile.matches?16:28;
  for(let i=0;i<count;i++){const spark=document.createElement('i'),angle=Math.PI*(1.08+i/(count-1)*.84),distance=110+(i%5)*38;spark.className='completion-spark';spark.setAttribute('aria-hidden','true');spark.style.cssText=`--dx:${Math.cos(angle)*distance}px;--dy:${Math.sin(angle)*distance}px;--angle:${angle}rad;--length:${10+i%4*5}px;--delay:${i%4*22}ms;--color:${['#89ffe0','#57beff','#ead995'][i%3]}`;layer.append(spark);}
  if(!ending){audioTailUntil=performance.now()+2800;clearTimeout(audioTailTimer);syncSound();if(audioEnabled)sfx?.start();audioTailTimer=setTimeout(syncSound,2900);}
  host.dataset.completion=String(Number(host.dataset.completion||0)+1);
  completionEnd=setTimeout(()=>{completionActive=false;layer.hidden=true;layer.replaceChildren();setBarVisibility();if(autoFollow)advanceFollow();},1900);setBarVisibility();
 }
 function setBarVisibility(){
  const current=sections.find(root=>{const r=root.getBoundingClientRect();return r.top<innerHeight*.5&&r.bottom>80;})||sections.find(root=>{const r=root.getBoundingClientRect();return r.top<innerHeight-40&&r.bottom>80;});
  if(current!==hudSection){hudSection=current;clearCompletion();hadVisibleWork=false;}
  const modal=reading(),sectionVisible=Boolean(current),working=running&&!modal&&(followUntil>performance.now()||agents.some(a=>a.task)||visibleWork());
  if(working){hadVisibleWork=true;if(completionTimer){clearTimeout(completionTimer);completionTimer=0;}if(completionActive)clearCompletion();}
  else if(!modal&&sectionVisible&&hadVisibleWork&&done>0&&!completionTimer&&!completionActive){completionTimer=setTimeout(settleBatch,450);}
  const visible=!modal&&sectionVisible&&(working||completionActive||Boolean(completionTimer));ui('.effects').style.visibility=sectionVisible&&!modal?'visible':'hidden';ui('.completion').style.visibility=modal?'hidden':'';
  ui('.bar').classList.toggle('is-away',!visible);ui('.bar').inert=!visible;ui('.bar').setAttribute('aria-hidden',String(!visible));
  ui('.replay').hidden=modal||!(sectionVisible&&!working&&!completionActive&&!completionTimer&&(done>0||!running));
  syncSound();if(sectionVisible&&running&&sfx?.ctx?.state!=='running')unlockSound();
 }
 function updateRoster(){
  const active=agents.filter(a=>a.task),signature=assignment+'|'+active.map(a=>a.assignment).join(',');
  if(signature===lastRoster)return;lastRoster=signature;
  ui('.agent-number').textContent=String(active.length);ui('.identity').setAttribute('aria-label',active.length+' Agents');ui('.identity').title=labels.participants;
  const roster=active;
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
 function showRulers(section,force=false){
  if((ruledSections.has(section)&&!force)||reduced.matches)return;
  ruledSections.add(section);updateRulers();clearTimeout(rulerTimer);ui('.rulers').classList.add('is-visible');
  rulerTimer=setTimeout(hideRulers,2000);
 }
 function clearElement(el){el.removeAttribute('data-build-pending');el.removeAttribute('data-build-active');el.removeAttribute('data-build-typing');el.removeAttribute('data-build-stage');el.style.removeProperty('--build-unrevealed');if(el.hasAttribute('data-build-cv')){el.open=el.dataset.buildCv==='open';el.removeAttribute('data-build-cv');for(const prop of ['--build-cv-reveal','--build-cv-inset','--build-cv-bottom'])el.style.removeProperty(prop);}}
 function progress(){ui('.count').textContent=`${done} / ${tasks.length}`;ui('.progress i').style.width=`${tasks.length?done/tasks.length*100:0}%`;updateReadyContent();syncMarquee();}

 function finish(message='組裝完成 · 可以自由瀏覽'){
  running=false;unlockContent();clearTimeout(followTimer);followUntil=0;clearCompletion();hadVisibleWork=false;hideRulers();cancelAnimationFrame(raf);raf=0;last=0;
  tasks.forEach(t=>clearElement(t.el));agents.forEach(a=>{a.pointer.remove();a.box.remove();a.ghost?.remove();});agents=[];updateRoster();
  clearTimeout(audioTailTimer);audioTailUntil=done>0&&done===tasks.length?performance.now()+2800:0;
  if(!audioTailUntil)completionPending=false;
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
  const selected=new Set(sections.flatMap(root=>[...root.querySelectorAll('.jarvis-cv')]).filter(eligible)),textTargets=new Set(),groups=sections.flatMap(root=>[...root.querySelectorAll('.jarvis-marquee-card:not([data-copy])')]).filter(eligible);
  groups.forEach(e=>{selected.add(e);e.querySelectorAll('.jarvis-category-caption > *').forEach(label=>{selected.add(label);textTargets.add(label);});});
  const rows=[...document.querySelectorAll('#experience .jarvis-life-row')].filter(eligible);rows.forEach(e=>selected.add(e));
  const scope=sections.flatMap(root=>[root,...root.querySelectorAll('*')]);
  for(const el of scope){
   if(!eligible(el)||el.closest('.jarvis-marquee-card')||el.matches('.jarvis-article-marquee'))continue;
   const r=el.getBoundingClientRect();
   if(r.right<0||r.left>innerWidth)continue;
   const directText=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
   if(directText){
    const block=el.closest('h1,h2,h3,h4,h5,h6,p,button,summary,dt,dd,figcaption')||el;
    if(eligible(block)){selected.add(block);textTargets.add(block);}
   }
   if(el.matches('img,svg,video,canvas,hr'))selected.add(el.closest('button')||el);
   const style=getComputedStyle(el),color=style.backgroundColor;
   const painted=(color!=='transparent'&&!/rgba\([^)]*,\s*0\)/.test(color)&&color!=='rgba(0, 0, 0, 0)')||style.backgroundImage!=='none'||style.boxShadow!=='none'||['Top','Right','Bottom','Left'].some(side=>parseFloat(style['border'+side+'Width'])>0&&style['border'+side+'Style']!=='none');
   if(painted&&r.height<innerHeight*2&&el.id!=='main')selected.add(el);
  }
  // SVG paths are represented by their SVG, and text spans by their text block.
  const clean=[...selected].filter(el=>!el.parentElement?.closest('svg')&&!([...selected].some(parent=>parent!==el&&parent.contains(el)&&(textTargets.has(parent)||parent.matches('h1,h2,h3,h4,h5,h6,p,button,summary,dt,dd,figcaption,.jarvis-cv,.jarvis-photo-row,.jarvis-article-marquee,.jarvis-exploration-orbit')))));
  return clean.map(el=>({el,isText:textTargets.has(el),top:el.closest('#jarvis-global-dock')?-100:el.getBoundingClientRect().top+scrollY,state:'pending',rowIndex:rows.indexOf(el),row:el.closest('.jarvis-life-row'),parents:clean.filter(parent=>parent!==el&&parent.contains(el))})).sort((a,b)=>a.top-b.top||a.parents.length-b.parents.length);
 }
 function ready(task){
  if(task.parents.some(p=>p.hasAttribute('data-build-pending')||p.hasAttribute('data-build-active')))return false;
  const rows=[...document.querySelectorAll('#experience .jarvis-life-row')],index=rows.indexOf(task.row);
  return index<1||rows[0].getBoundingClientRect().bottom<=0||!tasks.some(t=>rows[0].contains(t.el)&&t.state!=='done');
 }
 function styledCopy(source){
  const copy=source.cloneNode(true),originals=[source,...source.querySelectorAll('*')],clones=[copy,...copy.querySelectorAll('*')];
  originals.forEach((el,i)=>{const style=getComputedStyle(el),clone=clones[i];clone.removeAttribute('id');clearElement(clone);for(const prop of ['display','position','width','height','minWidth','padding','margin','gap','flexDirection','alignItems','justifyContent','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','textAlign','border','borderRadius','backgroundColor','gridTemplateColumns'])clone.style[prop]=style[prop];clone.style.opacity='1';clone.style.transform='none';});
  return copy;
 }
 function beginEffect(agent,task){
  const style=getComputedStyle(task.el),size=parseFloat(style.fontSize),hasText=task.isText&&task.el.textContent.trim();
  task.effect=task.el.matches('.jarvis-cv')?'cv-menu':task.rowIndex>0?'duplicate':hasText?(size>20?'type-scale':'type'):'draw';task.duration=task.effect==='draw'?1350:2150;
  if(task.effect==='cv-menu'){task.duration=3400;task.el.dataset.buildCv=task.el.open?'open':'closed';task.el.open=true;return;}
  if(task.effect==='draw')return;
  task.el.setAttribute('data-build-typing','');
  const ghost=document.createElement('div'),typing=task.effect==='type'||task.effect==='type-scale';ghost.className='build-ghost '+(typing?'type':'duplicate');agent.ghost=ghost;
  if(typing){
   task.fontSize=size;const copy=styledCopy(task.el);copy.style.margin='0';copy.style.position='static';ghost.append(copy);
   const walker=document.createTreeWalker(copy,NodeFilter.SHOW_TEXT);task.textNodes=[];let node;while((node=walker.nextNode())){task.textNodes.push({node,chars:Array.from(node.textContent)});node.textContent='';}
   task.textLength=task.textNodes.reduce((total,part)=>total+part.chars.length,0);task.typingDuration=Math.min(2800,Math.max(900,task.textLength*36));task.scaleAt=400+task.typingDuration;task.duration=task.scaleAt+(task.effect==='type-scale'?1000:300);task.typedCount=0;
   for(const prop of ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','textAlign','color'])ghost.style[prop]=style[prop];
  }else{const first=document.querySelector('#experience .jarvis-life-row');task.copyRect=first.getBoundingClientRect();ghost.append(styledCopy(first));}
  ui('.effects').append(ghost);
 }
 const clamp=t=>Math.max(0,Math.min(1,t));
 const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
 function effectFrame(agent,target){
  const task=agent.task,time=agent.time;
  if(task.effect==='cv-menu'){const base=task.el.getBoundingClientRect(),menu=task.el.querySelector('ul').getBoundingClientRect(),reveal=clamp((time-300)/900),close=smooth((time-2500)/700);task.el.style.setProperty('--build-cv-reveal',String(reveal*(1-close)));task.el.style.setProperty('--build-cv-inset',(1-reveal)*100+'%');task.el.style.setProperty('--build-cv-bottom',close*100+'%');task.el.dataset.buildStage=close>0?'cv-closing':'cv-drawing';return {rect:{left:Math.min(base.left,menu.left),top:base.top,width:Math.max(base.right,menu.right)-Math.min(base.left,menu.left),height:base.height+(Math.max(base.bottom,menu.bottom)-base.bottom)*(1-close)},draw:Math.max(.1,reveal)};}
  if(task.effect==='draw')return {rect:target,draw:clamp((time-280)/850)};
  if(task.effect==='type-scale'||task.effect==='type'){
   const typed=clamp((time-250)/task.typingDuration),scale=task.effect==='type-scale'?16/task.fontSize+(1-16/task.fontSize)*smooth((time-task.scaleAt)/800):1;
   const count=Math.floor(task.textLength*typed);if(task.typedCount!==count){let remaining=count;for(const part of task.textNodes){part.node.textContent=part.chars.slice(0,remaining).join('');remaining=Math.max(0,remaining-part.chars.length);}if(audioEnabled)sfx?.key(target.left,innerWidth,agent.assignment,count-task.typedCount,0);task.typedCount=count;}
   Object.assign(agent.ghost.style,{left:target.left+'px',top:target.top+'px',width:target.width+'px',height:target.height+'px',transform:`scale(${scale})`,opacity:time>=250?'1':'0'});
   task.el.dataset.buildStage=time<task.scaleAt?'typing':task.effect==='type-scale'?'resizing':'typed';
   const step=Math.floor(smooth((time-task.scaleAt)/800)*8);if(step!==task.growStep){task.growStep=step;if(audioEnabled&&task.effect==='type-scale'&&time>task.scaleAt)sfx?.grow(step,target.left,innerWidth);}
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
  completionPending=false;finalCueRequested=false;audioTailUntil=0;clearTimeout(audioTailTimer);
  const main=document.querySelector('#main')||document.querySelector('main');
  if(!main){return;}
  // Keep original nodes, handlers, Framer transforms and the ink canvas intact.
  if(audioEnabled&&sfx?.ctx)sfx.setOn(true);
  tasks=collect();
  contentGroups=[...new Set([...sections,...sections.flatMap(root=>[...root.querySelectorAll('.jarvis-life-row,.jarvis-cv,.jarvis-marquee-card:not([data-copy])')])])].map(el=>({el,tasks:tasks.filter(task=>el.contains(task.el))})).filter(group=>group.tasks.length);
  if(!tasks.length){return;}
  clearCompletion();hadVisibleWork=false;hudSection=null;lastCompletionAt=-Infinity;assignment=0;updateRoster();ruledSections.clear();done=0;paused=false;last=0;autoFollow=true;engaged=false;followUntil=0;clearTimeout(followTimer);progress();
  if(reduced.matches){finish('已依系統偏好減少動畫 · 首頁可直接使用');return;}
  tasks.forEach(t=>t.el.setAttribute('data-build-pending',''));
  ui('.replay').hidden=true;
  agents=Array.from({length:mobile.matches?5:8},(_,i)=>{
   const pointer=document.createElement('div'),box=document.createElement('div'),color=colors[i%colors.length];
   pointer.className='agent';pointer.style.setProperty('--color',color);pointer.innerHTML=`<svg viewBox="0 0 24 30"><path d="M3 2L21 18L12 19L8 27Z"/></svg><span></span>`;
   box.className='box';box.style.setProperty('--color',color);box.innerHTML='<small></small>';ui('.effects').append(box,pointer);
   return {pointer,box,task:null,time:0,x:innerWidth*(.2+i*.13),y:innerHeight*.3};
  });
  running=true;lockContent();syncMarquee();host.dataset.state='running';setBarVisibility();document.documentElement.setAttribute('data-build-demo','');unlockSound();schedule();
 }
 function inSections(){return sections.some(root=>{const r=root.getBoundingClientRect();return r.top<innerHeight-40&&r.bottom>80;});}
 function schedule(){if(running&&!paused&&!document.hidden&&!reading()&&inSections()&&!raf)raf=requestAnimationFrame(frame);}
 function frame(now){
  raf=0;const dt=last?Math.min(50,now-last):0;last=now;
  if(!running||paused||document.hidden||reading()||!inSections())return;
  if(followUntil>performance.now()){setBarVisibility();schedule();return;}
  const pending=tasks.filter(t=>t.state==='pending');
  for(const agent of agents){
   if(!agent.task){
    const candidates=pending.filter(t=>t.state==='pending'&&ready(t)&&(()=>{const r=t.el.getBoundingClientRect();return r.top<innerHeight*.86&&r.bottom>0&&r.left<innerWidth&&r.right>0;})());
    const load=t=>agents.filter(a=>a.task&&(a.task.row||a.task.el)===(t.row||t.el)).length;
    candidates.sort((a,b)=>load(a)-load(b));const task=candidates[0];
    if(task){engaged=true;showRulers(sections.find(root=>root.contains(task.el)));task.state='active';agent.task=task;agent.time=0;agent.fromX=agent.x;agent.fromY=agent.y;task.el.removeAttribute('data-build-pending');task.el.setAttribute('data-build-active','');agent.assignment=assignment++;agent.pointer.style.setProperty('--color',colors[agent.assignment%colors.length]);beginEffect(agent,task);if(audioEnabled)sfx?.press(task.el.getBoundingClientRect().left,innerWidth);updateRoster();}
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
  if(done===tasks.length){finish();completeBuild();return;}
  setBarVisibility();schedule();
 }
 window.addEventListener('scroll',()=>{setBarVisibility();if(ui('.rulers').classList.contains('is-visible'))updateRulers();if(inSections())schedule();else{hideRulers();cancelAnimationFrame(raf);raf=0;last=0;}},{passive:true});
 ui('.replay').onclick=()=>{const nearest=[...sections].sort((a,b)=>Math.abs(a.getBoundingClientRect().top)-Math.abs(b.getBoundingClientRect().top))[0];prepare();if(nearest)scrollTo({top:scrollY+nearest.getBoundingClientRect().top-100,behavior:'instant'});schedule();};
 function takeControl(event){if(!event.isTrusted||!running||!engaged||reading()||event.target.closest?.('dialog'))return;autoFollow=false;syncMarquee();clearTimeout(followTimer);followUntil=0;delete host.dataset.following;}
 window.addEventListener('wheel',takeControl,{passive:true});
 window.addEventListener('touchstart',event=>{if(!event.composedPath().includes(host))takeControl(event);},{passive:true});
 document.addEventListener('keydown',event=>{if(reading()||event.target.closest?.('dialog'))return;if(event.key==='Escape'){autoCancelled=true;if(running)finish();}else if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))takeControl(event);});
 document.addEventListener('click',e=>{if(running&&!reading()&&!wasReading&&!e.target.closest?.('dialog')&&!insideConstruction(e.target)&&e.target.closest?.('a,button')&&!e.composedPath().includes(host))finish('已進入瀏覽 · 動畫已結束');},true);
 document.addEventListener('focusin',e=>{if(running&&!reading()&&!wasReading&&e.target!==host&&!insideConstruction(e.target))finish('已進入瀏覽 · 動畫已結束');});
 new MutationObserver(()=>{const modal=reading();if(modal===wasReading)return;wasReading=modal;last=0;if(modal){cancelAnimationFrame(raf);raf=0;clearTimeout(completionTimer);completionTimer=0;}setBarVisibility();if(!modal){schedule();if(running&&autoFollow&&!agents.some(a=>a.task)&&!visibleWork())advanceFollow();}}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 document.addEventListener('visibilitychange',()=>{syncSound();if(!document.hidden)unlockSound();last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule();});
 let width=innerWidth;window.addEventListener('resize',()=>{if(Math.abs(innerWidth-width)>40&&running)finish('畫面尺寸已變更 · 可重播動畫');width=innerWidth;},{passive:true});
 function boot(){if(started)return;started=true;clearTimeout(bootTimer);Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))]).then(()=>setTimeout(()=>{if(!autoCancelled)prepare();},600));}
 document.addEventListener('jarvis:home-ready',boot,{once:true});
 if(document.documentElement.dataset.jarvisHomeReady==='true')boot();
 bootTimer=setTimeout(()=>{if(!started){ui('.replay').hidden=false;}},10000);
})();
