(() => {
 'use strict';
 const prefix=location.pathname.startsWith('/zh/')?'/zh':location.pathname.startsWith('/ja/')?'/ja':'';
 const locale=prefix==='/zh'?'zh-Hant':prefix==='/ja'?'ja':'en';
 const ui={en:['Different places.','A connected perspective.','Building, learning, and finding the connections along the way.','Experience articles. Drag or use arrow keys to browse.','Close','Could not load articles. Click to retry.'], 'zh-Hant':['不同地方，','連結成共同視野。','在創造與學習之間，找到不同經驗的連結。','經歷文章，可左右滑動、拖曳或使用方向鍵瀏覽。','關閉','文章暫時無法載入，點擊重試。'],ja:['さまざまな場所で、','つながる視点。','つくり、学び、経験のつながりを見つける。','経験の記事。スワイプ、ドラッグ、矢印キーで閲覧できます。','閉じる','記事を読み込めません。クリックして再試行。']};
 let mountedSection=null,track;
 async function mount(){
  const root=document.querySelector('.framer-zrw9y0');if(!root)return false;
  if(mountedSection){if(!mountedSection.isConnected){root.querySelector('.jarvis-experience-carousel')?.remove();root.append(mountedSection);}return true;}
  let section=root.querySelector('.jarvis-experience-carousel');if(section?.dataset.marquee)return true;
  if(!section){section=document.createElement('section');section.className='jarvis-experience-carousel';root.append(section);}
  section.dataset.marquee='true';mountedSection=section;const labels=ui[locale];
  const heading=section.querySelector('.jarvis-carousel-heading')?.cloneNode(true);
  section.replaceChildren();
  if(heading)section.append(heading);else{const h=document.createElement('div');h.className='jarvis-carousel-heading';const title=document.createElement('h3'),span=document.createElement('span'),p=document.createElement('p');title.append(labels[0],document.createElement('br'));span.textContent=labels[1];title.append(span);p.textContent=labels[2];h.append(title,p);section.append(h);}
  track=document.createElement('div');track.className='jarvis-carousel-track jarvis-article-marquee';track.tabIndex=0;track.setAttribute('role','region');track.setAttribute('aria-roledescription','carousel');track.setAttribute('aria-label',labels[3]);section.append(track);
  let cards;
  async function load(){try{track.setAttribute('aria-busy','true');const catalog=await window.JarvisArticles.index(locale);const byId=new Map(catalog.notes.map(note=>[note.id,note]));cards=catalog.featured.map(id=>byId.get(id)).filter(Boolean);track.replaceChildren();
   for(let repeat=0;repeat<2;repeat++)for(const card of cards){const a=document.createElement('a');a.href='#article-'+card.id;a.dataset.articleId=card.id;a.draggable=false;a.className='jarvis-marquee-card';if(repeat){a.tabIndex=-1;a.setAttribute('aria-hidden','true');a.dataset.copy='true';}
    const title=card.title,img=document.createElement('img');img.src=card.cover?.src||'';if(card.cover?.srcset){img.srcset=card.cover.srcset;img.sizes='(max-width:809px) 250px, 340px';}img.decoding='async';img.alt='';img.draggable=false;img.loading='lazy';a.setAttribute('aria-label',title);
    const caption=document.createElement('span');caption.className='jarvis-category-caption';const text=document.createElement('span'),category=document.createElement('small');text.textContent=title;category.textContent=card.category;caption.append(category,text);a.append(img,caption);track.append(a);
   }
   track.removeAttribute('aria-busy');
  }catch{track.removeAttribute('aria-busy');const retry=document.createElement('button');retry.type='button';retry.textContent=labels[5];retry.addEventListener('click',load);track.replaceChildren(retry);}}
  let start=null,suppress=false,until=0,frame=0,previous=0,visible=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const pause=()=>{until=performance.now()+2500;};
  track.addEventListener('pointerdown',e=>{pause();suppress=false;if(e.pointerType==='mouse'&&e.button===0)start={x:e.clientX,left:track.scrollLeft,id:e.pointerId};});
  track.addEventListener('pointermove',e=>{if(!start)return;const delta=e.clientX-start.x;if(Math.abs(delta)>5){suppress=true;track.setPointerCapture(start.id);track.scrollLeft=start.left-delta;track.classList.add('is-dragging');pause();}});
  const end=()=>{start=null;track.classList.remove('is-dragging');pause();};['pointerup','pointercancel','lostpointercapture'].forEach(name=>track.addEventListener(name,end));track.addEventListener('dragstart',e=>e.preventDefault());track.addEventListener('wheel',pause,{passive:true});
  track.addEventListener('click',e=>{const a=e.target.closest('[data-article-id]');if(!a)return;e.preventDefault();if(suppress){suppress=false;return;}pause();const id=a.dataset.articleId;const opener=a.dataset.copy?track.querySelector('[data-article-id="'+id+'"]:not([data-copy])'):a;window.JarvisArticleDialog.open(id,opener,locale);});
  track.addEventListener('keydown',e=>{pause();if(e.target!==track)return;const step=(track.querySelector('a')?.getBoundingClientRect().width||280)+20;if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const firstCopy=track.querySelector('[data-copy]');const length=firstCopy?firstCopy.offsetLeft-track.querySelector('a').offsetLeft:track.scrollWidth;const value=e.key==='Home'?0:e.key==='End'?length-track.clientWidth:track.scrollLeft+(e.key==='ArrowRight'?step:-step);track.scrollTo({left:value,behavior:reduced.matches?'instant':'smooth'});}});
  function tick(now){frame=0;if(!visible||document.hidden)return;const dt=previous?Math.min(50,now-previous):0;previous=now;
   if(!reduced.matches&&!start&&!window.JarvisArticleDialog.isOpen&&now>until&&!track.querySelector(':focus-visible')){const copy=track.querySelector('[data-copy]'),first=track.querySelector('a');if(copy&&first){const length=copy.offsetLeft-first.offsetLeft;track.scrollLeft+=dt*.028;if(length>0&&track.scrollLeft>=length)track.scrollLeft-=length;}}
   frame=requestAnimationFrame(tick);
  }
  const wake=()=>{if(visible&&!document.hidden&&!frame){previous=0;frame=requestAnimationFrame(tick);}};
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else wake();}).observe(section);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();});
  await load();return true;
 }
 window.JarvisHome.onReady(mount);
})();
