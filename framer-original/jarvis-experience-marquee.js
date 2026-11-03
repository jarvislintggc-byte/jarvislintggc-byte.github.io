(() => {
 'use strict';
 const prefix=location.pathname.startsWith('/zh/')?'/zh':location.pathname.startsWith('/ja/')?'/ja':'';
 const locale=prefix==='/zh'?'zh-Hant':prefix==='/ja'?'ja':'en';
 const ui={en:['Different places.','A connected perspective.','Building, learning, and finding the connections along the way.','Experience articles. Drag or use arrow keys to browse.','Close','Could not load articles. Click to retry.'], 'zh-Hant':['不同地方，','連結成共同視野。','在創造與學習之間，找到不同經驗的連結。','經歷文章，可左右滑動、拖曳或使用方向鍵瀏覽。','關閉','文章暫時無法載入，點擊重試。'],ja:['さまざまな場所で、','つながる視点。','つくり、学び、経験のつながりを見つける。','経験の記事。スワイプ、ドラッグ、矢印キーで閲覧できます。','閉じる','記事を読み込めません。クリックして再試行。']};
 const paths={en:'','zh-Hant':'/zh',ja:'/ja'},cache=new Map();
 async function source(lang){if(!cache.has(lang))cache.set(lang,fetch(paths[lang]+'/experience/').then(r=>{if(!r.ok)throw Error(r.status);return r.text();}).then(html=>new DOMParser().parseFromString(html,'text/html')).catch(e=>{cache.delete(lang);throw e;}));return cache.get(lang);}
 let dialog,opener,windowTop=0,trackLeft=0,currentId,modalLanguage=locale,track;
 function populate(doc,id,lang){
  const card=doc.getElementById(id),template=doc.getElementById('note-content-'+id);
  if(!card||!template)throw Error('Article missing: '+id);
  dialog.dataset.note=id;dialog.lang=lang;modalLanguage=lang;
  dialog.querySelector('#note-dialog-category').textContent=card.querySelector('.card-meta').textContent;
  dialog.querySelector('#note-dialog-title').textContent=card.querySelector('h3').textContent;
  dialog.querySelector('#note-dialog-subtitle').textContent=card.querySelector('.note-subtitle').textContent;
  dialog.querySelector('#note-dialog-body').replaceChildren(template.content.cloneNode(true));
  dialog.querySelector('#note-dialog-close').setAttribute('aria-label',ui[lang][4]);
  dialog.querySelectorAll('[data-article-language]').forEach(a=>{a.setAttribute('aria-current',a.dataset.articleLanguage===lang?'true':'false');});
  dialog.scrollTop=0;
 }
 function makeDialog(){
  dialog=document.createElement('dialog');dialog.id='note-dialog';dialog.className='jarvis-home-article';dialog.setAttribute('aria-labelledby','note-dialog-title');dialog.setAttribute('aria-describedby','note-dialog-subtitle');dialog.setAttribute('data-lenis-prevent','');
  dialog.innerHTML='<div class="dialog-top"><span id="note-dialog-category"></span><div class="dialog-actions"><nav aria-label="Language">'+[['zh-Hant','中文'],['en','EN'],['ja','日本語']].map(([lang,label])=>'<button type="button" data-article-language="'+lang+'">'+label+'</button>').join('')+'</nav><button type="button" id="note-dialog-close" aria-label="'+ui[locale][4]+'">×</button></div></div><div class="dialog-content"><h2 id="note-dialog-title"></h2><p id="note-dialog-subtitle"></p><div id="note-dialog-body"></div></div>';
  document.body.append(dialog);
  dialog.querySelector('#note-dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');track.scrollLeft=trackLeft;window.scrollTo({top:windowTop,behavior:'instant'});opener?.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  let request=0;
  dialog.querySelectorAll('[data-article-language]').forEach(a=>a.addEventListener('click',async()=>{const serial=++request;try{const doc=await source(a.dataset.articleLanguage);if(serial===request&&dialog.open)populate(doc,currentId,a.dataset.articleLanguage);}catch{}}));
 }
 async function mount(){
  const root=document.querySelector('.framer-zrw9y0');if(!root)return false;
  let section=root.querySelector('.jarvis-experience-carousel');if(section?.dataset.marquee)return true;
  if(!section){section=document.createElement('section');section.className='jarvis-experience-carousel';root.append(section);}
  section.dataset.marquee='true';const labels=ui[locale];
  const heading=section.querySelector('.jarvis-carousel-heading')?.cloneNode(true);
  section.replaceChildren();
  if(heading)section.append(heading);else{const h=document.createElement('div');h.className='jarvis-carousel-heading';const title=document.createElement('h3'),span=document.createElement('span'),p=document.createElement('p');title.append(labels[0],document.createElement('br'));span.textContent=labels[1];title.append(span);p.textContent=labels[2];h.append(title,p);section.append(h);}
  track=document.createElement('div');track.className='jarvis-carousel-track jarvis-article-marquee';track.tabIndex=0;track.setAttribute('role','region');track.setAttribute('aria-roledescription','carousel');track.setAttribute('aria-label',labels[3]);section.append(track);
  makeDialog();
  let cards;
  async function load(){try{track.setAttribute('aria-busy','true');const doc=await source(locale);cards=['research','ventures','special'].flatMap(category=>[...doc.querySelectorAll('.work-note')].filter(c=>c.dataset.category===category));if(cards.length!==12)throw Error('Expected 12 articles');track.replaceChildren();
   for(let repeat=0;repeat<2;repeat++)for(const card of cards){const a=document.createElement('a');a.href='#article-'+card.id;a.dataset.articleId=card.id;a.draggable=false;a.className='jarvis-marquee-card';if(repeat){a.tabIndex=-1;a.setAttribute('aria-hidden','true');a.dataset.copy='true';}
    const title=card.querySelector('h3').textContent,image=card.querySelector('img'),img=document.createElement('img');img.src=image?.getAttribute('src')||'';img.alt='';img.draggable=false;img.loading='lazy';a.setAttribute('aria-label',title);
    const caption=document.createElement('span');caption.className='jarvis-category-caption';const text=document.createElement('span'),category=document.createElement('small');text.textContent=title;category.textContent=card.querySelector('.card-meta>span').textContent;caption.append(category,text);a.append(img,caption);track.append(a);
   }
   track.removeAttribute('aria-busy');
  }catch{track.removeAttribute('aria-busy');const retry=document.createElement('button');retry.type='button';retry.textContent=labels[5];retry.addEventListener('click',load);track.replaceChildren(retry);}}
  let start=null,suppress=false,until=0,hover=false,frame=0,previous=0,visible=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const pause=()=>{until=performance.now()+2500;};
  track.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hover=true;});track.addEventListener('pointerleave',()=>{hover=false;});
  track.addEventListener('pointerdown',e=>{pause();suppress=false;if(e.pointerType==='mouse'&&e.button===0)start={x:e.clientX,left:track.scrollLeft,id:e.pointerId};});
  track.addEventListener('pointermove',e=>{if(!start)return;const delta=e.clientX-start.x;if(Math.abs(delta)>5){suppress=true;track.setPointerCapture(start.id);track.scrollLeft=start.left-delta;track.classList.add('is-dragging');pause();}});
  const end=()=>{start=null;track.classList.remove('is-dragging');pause();};['pointerup','pointercancel','lostpointercapture'].forEach(name=>track.addEventListener(name,end));track.addEventListener('dragstart',e=>e.preventDefault());track.addEventListener('wheel',pause,{passive:true});
  track.addEventListener('click',async e=>{const a=e.target.closest('[data-article-id]');if(!a)return;e.preventDefault();if(suppress){suppress=false;return;}pause();const id=a.dataset.articleId;try{const doc=await source(locale);if(dialog.open)return;opener=a.dataset.copy?track.querySelector('[data-article-id="'+id+'"]:not([data-copy])'):a;currentId=id;windowTop=window.scrollY;trackLeft=track.scrollLeft;populate(doc,id,locale);dialog.showModal();document.body.classList.add('modal-open');}catch{}});
  track.addEventListener('keydown',e=>{pause();if(e.target!==track)return;const step=(track.querySelector('a')?.getBoundingClientRect().width||280)+20;if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const firstCopy=track.querySelector('[data-copy]');const length=firstCopy?firstCopy.offsetLeft-track.querySelector('a').offsetLeft:track.scrollWidth;const value=e.key==='Home'?0:e.key==='End'?length-track.clientWidth:track.scrollLeft+(e.key==='ArrowRight'?step:-step);track.scrollTo({left:value,behavior:reduced.matches?'instant':'smooth'});}});
  function tick(now){frame=0;if(!visible||document.hidden)return;const dt=previous?Math.min(50,now-previous):0;previous=now;
   if(!reduced.matches&&!hover&&!start&&!dialog.open&&now>until&&!track.querySelector(':focus-visible')){const copy=track.querySelector('[data-copy]'),first=track.querySelector('a');if(copy&&first){const length=copy.offsetLeft-first.offsetLeft;track.scrollLeft+=dt*.028;if(length>0&&track.scrollLeft>=length)track.scrollLeft-=length;}}
   frame=requestAnimationFrame(tick);
  }
  const wake=()=>{if(visible&&!document.hidden&&!frame){previous=0;frame=requestAnimationFrame(tick);}};
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else wake();}).observe(section);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();});
  await load();return true;
 }
 function boot(){if(document.readyState!=='complete')return;mount().then(done=>{if(done)observer.disconnect();});}
 const observer=new MutationObserver(()=>{if(!document.querySelector('.jarvis-experience-carousel[data-marquee]'))boot();});observer.observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('load',boot);boot();
})();
