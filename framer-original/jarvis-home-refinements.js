(() => {
  'use strict';
  const config=JSON.parse(document.getElementById('jarvis-home-data').textContent);
  const {locale,labels:life,credentials:credentialFiles}=config;
  let credentialDialog,credentialOpener;
  function credential(kind){
  if(!credentialDialog?.open)credentialOpener=document.activeElement;
  if(!credentialDialog){
   credentialDialog=document.createElement('dialog');credentialDialog.id='jarvis-credential-dialog';credentialDialog.className='jarvis-credential-dialog';credentialDialog.setAttribute('aria-labelledby','credential-title');credentialDialog.setAttribute('data-lenis-prevent','');
   const top=document.createElement('div');top.className='credential-top';const title=document.createElement('h2');title.id='credential-title';const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label',life.close);close.addEventListener('click',()=>credentialDialog.close());top.append(title,close);
   const body=document.createElement('div');body.className='credential-body';credentialDialog.append(top,body);document.body.append(credentialDialog);
   credentialDialog.addEventListener('close',()=>{document.body.classList.remove('credential-open');credentialOpener?.focus({preventScroll:true});});
  }
  const extra=config.extra[kind];
  credentialDialog.querySelector('h2').textContent=extra?extra[0]:kind==='graduation'?life.degreeTitle:life.awardTitle;
  const body=credentialDialog.querySelector('.credential-body');body.replaceChildren();
  const detail=document.createElement('p');detail.textContent=extra?extra[1]:kind==='graduation'?life.degreeDetail:life.awardDetail;body.append(detail);
  const entry=credentialFiles[kind],files=entry?.files||(entry?.src?[entry]:[]);
  if(files.length){for(const file of files){const caption=file.caption?.[locale]||detail.textContent;const figure=document.createElement('figure'),link=document.createElement('a'),image=document.createElement('img'),label=document.createElement('figcaption');link.href=file.src;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',caption+' · '+life.view);image.src=file.src;image.alt=caption;image.decoding='async';label.textContent=caption;link.append(image);figure.append(link,label);body.append(figure);}}
  else{const pending=document.createElement('p');pending.className='credential-pending';pending.textContent=life.pending;body.append(pending);}
  if(!credentialDialog.open){credentialDialog.showModal();document.body.classList.add('credential-open');}credentialDialog.scrollTop=0;
 }

  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-credential]');
    if(button){event.preventDefault();credential(button.dataset.credential);}
    const menu=document.querySelector('.jarvis-cv[open]');if(menu&&!menu.contains(event.target))menu.open=false;
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){const menu=document.querySelector('.jarvis-cv[open]');if(menu){menu.open=false;menu.querySelector('summary').focus({preventScroll:true});}}});
  function updateCvDownloads(){
    document.querySelectorAll('.jarvis-cv button[disabled]').forEach(button=>{
      const link=document.createElement('a');
      const japanese=button.lang==='ja';
      link.href=japanese?'/assets/resume/CV_Jarvis_Lin_Japanese.pdf?v=20261113-r2':'/assets/resume/CV_Jarvis_Lin.pdf?v=20261109';
      link.download=japanese?'Jarvis_Lin_CV_Japanese.pdf':'Jarvis_Lin_CV_English.pdf';link.type='application/pdf';link.hreflang=japanese?'ja':'en';
      link.lang=button.lang;link.append(document.createTextNode(button.firstChild.textContent.trim()));
      const note=document.createElement('small');note.textContent=japanese?'日本語 PDF':'English PDF';link.append(note);
      button.replaceWith(link);
    });
  }
  function updateExperienceLabels(){
    const category = document.querySelector('#experience .jarvis-life-row:has(.jarvis-place-flag img[src="/assets/flags/tw.svg"]) .jarvis-life-category p');
    const taiwanLabel = {en:'Life in Taiwan', 'zh-Hant':'台灣生活', ja:'台湾での暮らし'}[locale];
    if(category && taiwanLabel && category.textContent !== taiwanLabel) category.textContent = taiwanLabel;

    if(locale !== 'zh-Hant') return;
    const summary = document.querySelector('#experience .jarvis-experience-summary');
    const originalHeading = summary?.querySelector('.framer-1inv1wp');
    if(!originalHeading || summary.querySelector('.jarvis-mobile-experience-heading')) return;
    const heading = document.createElement('h2');
    heading.className = 'jarvis-mobile-experience-heading';
    for(const line of ['在不同地方，','留下實踐的足跡。']){
      const span = document.createElement('span');
      span.textContent = line;
      heading.append(span);
    }
    originalHeading.after(heading);
  }

  let watched=[],pending=false;
  const observer=new ResizeObserver(schedule);
  function schedule(){
    if(pending) return;
    pending=true;
    requestAnimationFrame(()=>{
      pending=false;
      updateCvDownloads();
      updateExperienceLabels();
      center();
    });
  }

  function center(){
    const orbit = [...document.querySelectorAll('.jarvis-exploration-orbit')].find(node=>node.offsetHeight);
    const text = [...document.querySelectorAll('.jarvis-exploration-title')].find(node=>node.offsetParent);
    if(!orbit || !text) return;
    const parent = text.offsetParent;
    const targets = [orbit,text,parent];
    if(targets.some((node,index)=>watched[index]!==node)){
      observer.disconnect();
      targets.forEach(node=>observer.observe(node));
      watched=targets;
    }
    let top = 0;
    let node = orbit;
    while(node && node !== parent){
      top += node.offsetTop;
      node = node.offsetParent;
    }
    const bounds = orbit.getBoundingClientRect();
    const centerY = innerWidth < 810 && node === parent
      ? top + orbit.offsetHeight / 2
      : bounds.top + bounds.height / 2 - parent.getBoundingClientRect().top;
    const value = centerY.toFixed(2)+'px';
    if(text.style.getPropertyValue('--jarvis-exploration-center')!==value) text.style.setProperty('--jarvis-exploration-center',value);
    text.classList.add('jarvis-centered-exploration');
  }
  window.JarvisHome.onReady(schedule);document.fonts?.ready.then(schedule);
})();
