(() => {
 'use strict';
 const locale=document.documentElement.lang;
 try{localStorage.setItem('jarvis-site-language',locale);localStorage.setItem('jarvis-journey-language',locale);}catch{}
 const labels={en:'Choose language','zh-Hant':'選擇語言',ja:'言語を選択'};
 let scheduled=false;
 function mount(){
  const prefix=locale==='zh-Hant'?'/zh':locale==='ja'?'/ja':'';
  const title=(locale==='zh-Hant'?'首頁':locale==='ja'?'ホーム':'Home')+' — Jarvis Lin';
  if(document.title!==title)document.title=title;
  for(const dropdown of document.querySelectorAll('.framer-pybl9q')){
   const slugs=['','my-story','experience','what-i-bring','connect'];
   dropdown.querySelectorAll('.framer-w3yfwd a').forEach((a,index)=>{
    if(index>=slugs.length)return;
    const href=prefix+'/'+(slugs[index]?slugs[index]+'/':'');
    if(a.getAttribute('href')!==href)a.setAttribute('href',href);
    a.dataset.jarvisRoute=href;a.target='_self';
   });
   if(dropdown.querySelector('.jarvis-menu-languages'))continue;
   const nav=document.createElement('nav');nav.className='jarvis-menu-languages';nav.setAttribute('aria-label',labels[locale]||labels.en);
   for(const [lang,text,url]of [['zh-Hant','中文','/zh/'],['en','EN','/'],['ja','日本語','/ja/']]){
    const a=document.createElement('a');a.textContent=text;a.href=url;a.lang=lang;a.hreflang=lang;
    if(lang===locale)a.setAttribute('aria-current','page');nav.append(a);
   }
   dropdown.append(nav);
  }
 }
 document.addEventListener('click',event=>{
  const a=event.target.closest('a[data-jarvis-route]');
  if(!a||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();event.stopImmediatePropagation();location.assign(a.dataset.jarvisRoute);
 },true);
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;mount();});}
 new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
 mount();
})();
