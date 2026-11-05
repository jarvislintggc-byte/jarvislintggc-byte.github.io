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

 const life={
  'zh-Hant':{degree:'国士舘大学経営学部畢業',award:'連續三年獎學金 · 累計 ¥1,000,000',lead:'在日本，除了創業，也完成了學業。',degreeTitle:'国士舘大学 · 経営学部',degreeDetail:'畢業證書',awardTitle:'連續三年獲獎',awardDetail:'獎學金累計總額 ¥1,000,000',pending:'證明文件即將補上',close:'關閉',view:'點擊查看證明',places:[['菲律賓 · 六個月','在宿霧，學習也生活。','在宿霧島生活六個月，把學習融入日常，也走進海島與自然環境，感受不同於城市的生活節奏。','Cebu, Philippines'],['台灣 · 一路相伴','帶著朋友的支持，繼續向前。','在台灣，有一群愛我的朋友。一路上的支持與鼓勵，讓我在探索不同地方時，也始終有回家的歸屬感。','Taiwan']]},
  en:{degree:'Kokushikan University · Business Administration graduate',award:'Three consecutive years of scholarships · ¥1,000,000 total',lead:'Alongside building businesses in Japan, I completed my university studies.',degreeTitle:'Kokushikan University · Faculty of Business Administration',degreeDetail:'Graduation certificate',awardTitle:'Scholarships for three consecutive years',awardDetail:'Cumulative scholarship awards of ¥1,000,000',pending:'Supporting documents coming soon',close:'Close',view:'View supporting documents',places:[['PHILIPPINES · SIX MONTHS','Learning and living in Cebu.','Six months in Cebu brought learning into everyday life, with time to explore the island’s natural surroundings and a different pace of living.','Cebu, Philippines'],['TAIWAN · ALWAYS WITH ME','Encouraged by friends, wherever I go.','Back in Taiwan, I have friends who love me. Their continued support and encouragement give me the confidence to explore, and a place to feel at home.','Taiwan']]},
  ja:{degree:'国士舘大学経営学部 卒業',award:'3年連続の奨学金 · 累計100万円',lead:'日本では起業に取り組みながら、大学での学びも修めました。',degreeTitle:'国士舘大学 · 経営学部',degreeDetail:'卒業証書',awardTitle:'3年連続で奨学金を受給',awardDetail:'奨学金の累計総額100万円',pending:'証明書類は後日掲載予定',close:'閉じる',view:'証明書類を見る',places:[['フィリピン · 6か月','セブで、学びと暮らしを。','セブ島で6か月生活し、日々の学びと島の自然に触れながら、都市とは異なる暮らしのリズムを体験しました。','Cebu, Philippines'],['台湾 · いつもそばに','友人の支えを胸に、次の一歩へ。','台湾には、私を大切に思ってくれる友人たちがいます。旅の途中でも、変わらない支えと励ましが、挑戦する力と帰る場所をくれます。','Taiwan']]}
 }[locale];

 let credentialFiles={graduation:null,scholarship:null},credentialDialog,credentialOpener;
 fetch('/credentials.json?v=3e916b2ea3f82009').then(r=>r.ok?r.json():{}).then(data=>credentialFiles=data).catch(()=>{});
 function credential(kind){
  if(!credentialDialog?.open)credentialOpener=document.activeElement;
  if(!credentialDialog){
   credentialDialog=document.createElement('dialog');credentialDialog.id='jarvis-credential-dialog';credentialDialog.className='jarvis-credential-dialog';credentialDialog.setAttribute('aria-labelledby','credential-title');credentialDialog.setAttribute('data-lenis-prevent','');
   const top=document.createElement('div');top.className='credential-top';const title=document.createElement('h2');title.id='credential-title';const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label',life.close);close.addEventListener('click',()=>credentialDialog.close());top.append(title,close);
   const body=document.createElement('div');body.className='credential-body';credentialDialog.append(top,body);document.body.append(credentialDialog);
   credentialDialog.addEventListener('close',()=>{document.body.classList.remove('credential-open');credentialOpener?.focus({preventScroll:true});});
  }
  const extra={asu:{'zh-Hant':['ASU 供應鏈管理碩士','W. P. Carey School of Business'],'en':['ASU · Master of Science','Supply Chain Management · W. P. Carey School of Business'],ja:['ASU サプライチェーンマネジメント修士','W. P. Carey School of Business']},cebu:{'zh-Hant':['宿霧 · CPILS','Intensive IELTS 課程結業證書'],en:['Cebu · CPILS','Intensive IELTS course completion certificate'],ja:['セブ · CPILS','Intensive IELTSコース 修了証書']}}[kind]?.[locale];
  credentialDialog.querySelector('h2').textContent=extra?extra[0]:kind==='graduation'?life.degreeTitle:life.awardTitle;
  const body=credentialDialog.querySelector('.credential-body');body.replaceChildren();
  const detail=document.createElement('p');detail.textContent=extra?extra[1]:kind==='graduation'?life.degreeDetail:life.awardDetail;body.append(detail);
  const entry=credentialFiles[kind],files=entry?.files||(entry?.src?[entry]:[]);
  if(files.length){for(const file of files){const caption=file.caption?.[locale]||detail.textContent;const figure=document.createElement('figure'),link=document.createElement('a'),image=document.createElement('img'),label=document.createElement('figcaption');link.href=file.src;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',caption+' · '+life.view);image.src=file.src;image.alt=caption;image.decoding='async';label.textContent=caption;link.append(image);figure.append(link,label);body.append(figure);}}
  else{const pending=document.createElement('p');pending.className='credential-pending';pending.textContent=life.pending;body.append(pending);}
  if(!credentialDialog.open){credentialDialog.showModal();document.body.classList.add('credential-open');}credentialDialog.scrollTop=0;
 }
 function japan(row){
  row.querySelector('.jarvis-japan-study')?.remove();
  const paragraph=row.querySelector('.framer-iycs1n p');if(!paragraph||paragraph.querySelector('.jarvis-inline-proof'))return;
  const parts={
   'zh-Hant':['在日本生活六年，經營餐飲、校園店面、外送品牌、客製電腦與電商事業；','国士舘大学経営学部畢業','，並','連續三年獲獎學金，累計100萬日圓','。'],
   en:['Over six years in Japan, I built and ran food businesses, a campus shop, delivery brands, custom PC assembly, and e-commerce ventures; I ','graduated from Kokushikan University’s Faculty of Business Administration',' and received ','scholarships for three consecutive years, totaling ¥1,000,000','.'],
   ja:['日本で6年間生活し、飲食店、大学内の店舗、デリバリーブランド、カスタムPC組み立て、EC事業を経営。','国士舘大学経営学部を卒業','し、','3年連続で奨学金を受給（累計100万円）','しました。']
  }[locale];
  paragraph.classList.add('jarvis-japan-summary');paragraph.replaceChildren(document.createTextNode(parts[0]));
  [['graduation',parts[1]],['scholarship',parts[3]]].forEach(([kind,label],i)=>{if(i)paragraph.append(document.createTextNode(parts[2]));const button=document.createElement('button');button.type='button';button.className='jarvis-credential-link jarvis-inline-proof';button.dataset.credential=kind;button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label',label+' · '+life.view);const strong=document.createElement('strong');strong.textContent=label;button.append(strong);button.addEventListener('click',()=>credential(kind));paragraph.append(button);});paragraph.append(document.createTextNode(parts[4]));
 }
 function credentialHeading(row,kind){
  const heading=row.querySelector('h4');if(!heading||heading.querySelector('[data-credential]'))return;
  const button=document.createElement('button');button.type='button';button.className='jarvis-heading-proof';button.dataset.credential=kind;button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label',heading.textContent.trim()+' · '+life.view);button.textContent=heading.textContent.trim();button.addEventListener('click',()=>credential(kind));heading.replaceChildren(button);
 }
 function places(template){
  const container=template.parentElement.parentElement;
  life.places.forEach((place,i)=>{
   if(container.querySelector('[data-jarvis-place="'+i+'"]'))return;
   const wrapper=template.parentElement.cloneNode(true),row=wrapper.querySelector('.framer-WLFa2');wrapper.dataset.jarvisPlace=String(i);wrapper.classList.add('jarvis-added-place','jarvis-ordered-place');row.dataset.jarvisPlace=String(i);
   wrapper.querySelectorAll('.jarvis-japan-summary').forEach(e=>e.classList.remove('jarvis-japan-summary'));wrapper.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));wrapper.querySelectorAll('.jarvis-japan-study').forEach(e=>e.remove());
   set(row.querySelector('.framer-j6yv7y p'),i===0?'03':'01');set(row.querySelector('.framer-1b2crsy p'),place[0]);set(row.querySelector('h4'),place[1]);set(row.querySelector('.framer-iycs1n p'),place[2]);const location=row.querySelector('.framer-1dwlxmp');location.querySelectorAll('p').forEach((e,n)=>set(e,n===0?place[3]:''));set(row.querySelector('.framer-1hgww3v p'),ui.abroad);
   container.append(wrapper);
  });
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
  experience.querySelectorAll('.framer-WLFa2:not([data-jarvis-place])').forEach((row,i)=>{
   if(i===0){set(row.querySelector('.framer-1b2crsy p'),ui.period);japan(row);places(row);}if(i===1)credentialHeading(row,'asu');
   set(row.querySelector('.framer-1hgww3v p'),ui.abroad);
   row.parentElement.classList.add('jarvis-ordered-place');row.parentElement.style.order=String(i===0?2:i===1?4:5);set(row.querySelector('.framer-j6yv7y p'),i===0?'02':i===1?'04':'05');
   const title=row.querySelector('h4');if(title)set(title,title.textContent.trim());
   const location=row.querySelector('.framer-1dwlxmp');if(location){const ps=location.querySelectorAll('p');set(ps[0],i===0?'Tokyo, Japan':'Phoenix, Arizona');for(const p of [...ps].slice(1))set(p,'');}
  });
  experience.querySelectorAll('.jarvis-added-place').forEach(wrapper=>{wrapper.style.order=wrapper.dataset.jarvisPlace==='1'?'1':'3';if(wrapper.dataset.jarvisPlace==='0')credentialHeading(wrapper,'cebu');});

  const originals=[...experience.querySelectorAll('.framer-WLFa2:not([data-jarvis-place])')];
  const cebu=experience.querySelector('.jarvis-added-place[data-jarvis-place="0"]'),taiwan=experience.querySelector('.jarvis-added-place[data-jarvis-place="1"]');
  if(originals.length===3&&cebu&&taiwan){
   const ordered=[taiwan,originals[0].parentElement,cebu,...originals.slice(1).map(row=>row.parentElement)],container=originals[0].parentElement.parentElement;
   const current=[...container.children].filter(e=>e.querySelector('.framer-WLFa2'));
   if(ordered.some((e,i)=>current[i]!==e))ordered.forEach(e=>container.append(e));
  }
  for(const row of experience.querySelectorAll('.framer-WLFa2')){
   const location=row.querySelector('.framer-1dwlxmp');if(!location)continue;
   const place=location.querySelector('p')?.textContent||'';
   const [symbol,label]=place.includes('Japan')?['jp','Japan']:place.includes('Philippines')?['ph','Philippines']:place==='Taiwan'?['tw','Taiwan']:['us','United States'];
   let flag=location.querySelector('.jarvis-place-flag');if(!flag){flag=document.createElement('div');flag.className='jarvis-place-flag';flag.setAttribute('role','img');location.append(flag);}
   let image=flag.querySelector('img');if(!image){flag.replaceChildren();image=document.createElement('img');image.alt='';image.width=28;image.height=19;flag.append(image);}const url='/assets/flags/'+symbol+'.svg';if(image.getAttribute('src')!==url)image.setAttribute('src',url);flag.setAttribute('aria-label',label);flag.title=label;
  }
  const summary=experience.querySelector('[data-framer-name="Summary"]');if(summary){set(summary.querySelector('.framer-12d458h p'),ui.abroad);cv(summary);}
  center();
 }
 function schedule(){if(!window.JarvisHome.ready||queued)return;queued=true;requestAnimationFrame(()=>{queued=false;update();});}
 window.JarvisHome.onReady(schedule);
 window.addEventListener('resize',schedule);
 document.addEventListener('click',e=>{const menu=document.querySelector('.jarvis-cv[open]');if(menu&&!menu.contains(e.target))menu.open=false;});
 fetch('/home-profile.json?v=3e916b2ea3f82009').then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(data=>{profile=data;document.querySelectorAll('.jarvis-cv').forEach(e=>e.remove());schedule();}).catch(()=>{});
})();
