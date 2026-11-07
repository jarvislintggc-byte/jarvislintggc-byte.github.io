(() => {
 'use strict';
 if(document.getElementById('jarvis-global-dock'))return;
 const labels={
  en:{hello:'Say Hello 👋',open:'Open navigation',close:'Close navigation',nav:'Site navigation',language:'Choose language',pages:['Home','My story','Experience','Connect']},
  'zh-Hant':{hello:'打個招呼 👋',open:'開啟選單',close:'關閉選單',nav:'網站導覽',language:'選擇語言',pages:['首頁','我的故事','經歷與專案','聯絡我']},
  ja:{hello:'こんにちは 👋',open:'メニューを開く',close:'メニューを閉じる',nav:'サイトナビゲーション',language:'言語を選択',pages:['ホーム','私の歩み','経験・プロジェクト','お問い合わせ']}
 };
 const prefixes={en:'','zh-Hant':'/zh',ja:'/ja'},slugs=['','my-story','experience','connect'];
 const locale=()=>!document.body.classList.contains('content-page')?(location.pathname.startsWith('/zh/')?'zh-Hant':location.pathname.startsWith('/ja/')?'ja':'en'):(labels[document.documentElement.lang]?document.documentElement.lang:'en');
 const slug=()=>location.pathname.replace(/^\/(?:zh|ja)(?=\/)/,'').replace(/\/index\.html$/,'/').replace(/^\/+|\/+$/g,'');
 const route=(lang,page)=>prefixes[lang]+'/'+(page?page+'/':'');
 let menu=document.getElementById('site-menu');
 if(!menu){
  menu=document.createElement('dialog');menu.id='site-menu';menu.className='site-menu';menu.setAttribute('aria-labelledby','menu-title');
  menu.innerHTML='<div class="menu-shell"><div class="menu-topbar"><span>Jarvis Lin</span><button class="menu-close" id="menu-close" type="button" autofocus><span></span><span></span></button></div><nav class="menu-navigation"><h2 id="menu-title">Navigation</h2><ol class="menu-list">'+slugs.map((page,i)=>'<li style="--order:'+i+'"><a href="'+route(locale(),page)+'"><span class="menu-text">'+labels[locale()].pages[i]+'</span></a></li>').join('')+'</ol></nav><nav class="site-language jarvis-dock-languages">'+[['zh-Hant','中文'],['en','EN'],['ja','日本語']].map(([lang,text])=>'<a href="'+route(lang,slug())+'" data-site-language="'+lang+'" lang="'+lang+'" hreflang="'+lang+'">'+text+'</a>').join('')+'</nav></div>';
  document.body.append(menu);
 }
 menu.querySelectorAll('.menu-list a[href*="what-i-bring"]').forEach(a=>a.closest('li').remove());
 menu.classList.add('jarvis-compact-menu');
 const shell=menu.querySelector('.menu-shell');
 const language=menu.querySelector('.site-language');
 language.classList.add('jarvis-dock-languages');shell.append(language);
 menu.querySelector('.menu-topbar>span').textContent='Jarvis Lin';
 const dock=document.createElement('aside');dock.id='jarvis-global-dock';dock.className='jarvis-global-dock';dock.setAttribute('aria-label','Jarvis Lin');
 dock.innerHTML='<button class="jarvis-dock-hello" type="button" aria-controls="site-menu" aria-haspopup="dialog"></button><button id="menu-trigger" type="button" aria-controls="site-menu" aria-expanded="false" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg></button>';
 const supportsPopover=typeof dock.showPopover==='function';
 if(supportsPopover)dock.setAttribute('popover','manual');
 document.body.append(dock);
 const hello=dock.querySelector('.jarvis-dock-hello'),trigger=dock.querySelector('#menu-trigger'),close=menu.querySelector('#menu-close');
 hello.addEventListener('click',()=>trigger.click());
 let pending=false,lastOpen=false;
 function text(node,value){if(node.textContent!==value)node.textContent=value;}
 function refresh(){
  const lang=locale(),ui=labels[lang],page=slug();
  const pageIndex=slugs.indexOf(page);
  text(hello,pageIndex>0?ui.pages[pageIndex]:ui.hello);hello.setAttribute('aria-expanded',String(menu.open));trigger.setAttribute('aria-label',ui.open);close.setAttribute('aria-label',ui.close);
  menu.querySelector('.menu-navigation').setAttribute('aria-label',ui.nav);text(menu.querySelector('#menu-title'),ui.nav);
  menu.querySelectorAll('.menu-list a').forEach((a,i)=>{
   a.href=route(lang,slugs[i]);text(a.querySelector('.menu-text'),ui.pages[i]);
   if(slugs[i]===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  language.setAttribute('aria-label',ui.language);
  for(const a of language.querySelectorAll('[data-site-language]')){
   const target=a.dataset.siteLanguage;a.href=route(target,page);
   if(target===lang)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  }
  const reading=!!document.querySelector('#note-dialog[open]');
  dock.inert=reading;dock.setAttribute('aria-hidden',String(reading));
  if(menu.open){
   if(supportsPopover&&dock.matches(':popover-open'))dock.hidePopover();
   dock.hidden=true;lastOpen=true;return;
  }
  dock.hidden=false;
  const active=[...document.querySelectorAll('dialog[open]')].filter(d=>d!==menu).at(-1);
  const host=active||document.body;
  if(dock.parentElement!==host){
   if(supportsPopover&&dock.matches(':popover-open'))dock.hidePopover();host.append(dock);
  }
  if(supportsPopover&&!dock.matches(':popover-open')){try{dock.showPopover();}catch{}}
  if(lastOpen){lastOpen=false;trigger.focus({preventScroll:true});}
 }
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;refresh();});}
 new MutationObserver(schedule).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['open','lang']});
 menu.addEventListener('close',refresh);
 menu.addEventListener('click',event=>{
  if(event.target!==menu)return;
  const b=menu.getBoundingClientRect();
  if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)close.click();
 });
 document.addEventListener('sitelanguage',schedule);document.addEventListener('journeylanguage',schedule);
 document.addEventListener('click',event=>{
  const a=event.target.closest('[data-site-language]');if(!a)return;
  try{localStorage.setItem('jarvis-site-language',a.dataset.siteLanguage);localStorage.setItem('jarvis-journey-language',a.dataset.siteLanguage);}catch{}
 });
 refresh();
 // Reuse the existing focus, navigation, Escape, and game-pause contract.
 const controller=document.createElement('script');controller.src='/navigation.js?v=ceff2acd32ae8c1b';document.body.append(controller);
})();
