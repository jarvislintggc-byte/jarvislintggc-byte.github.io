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
  let watched=[],pending=false;
  const observer=new ResizeObserver(schedule);
  function schedule(){if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;center();});}}
  function center(){
    const orbit=document.querySelector('.jarvis-exploration-orbit'),text=document.querySelector('.jarvis-exploration-title');
    if(!orbit||!text)return;const parent=text.offsetParent;if(!parent)return;
    const targets=[orbit,text,parent];if(targets.some((e,i)=>watched[i]!==e)){observer.disconnect();targets.forEach(e=>observer.observe(e));watched=targets;}
    if(innerWidth<810)return;
    const r=orbit.getBoundingClientRect(),p=parent.getBoundingClientRect(),value=(r.top+r.height/2-p.top).toFixed(2)+'px';
    if(text.style.getPropertyValue('--jarvis-exploration-center')!==value)text.style.setProperty('--jarvis-exploration-center',value);
    text.classList.add('jarvis-centered-exploration');
  }
  window.JarvisHome.onReady(schedule);document.fonts?.ready.then(schedule);
})();
