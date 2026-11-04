(() => {
 'use strict';
 const salt='5f1bef7b58392891b96d8d9568bb248f', expected='13095a6a51d930db4c28b260b0198a2aa15ebe5b4529539b187df11b84342780', iterations=210000;
 const paths=new Set(['/','/innovation-map','/ecosystem-network']);
 const labels={
 'zh-Hant':{title:'輸入研究網站密碼',intro:'輸入密碼後，即可開啟這個研究網站。',password:'密碼',unlock:'解鎖',checking:'確認中…',wrong:'密碼不正確，請再試一次。',error:'目前無法確認密碼，請稍後再試。',ready:'密碼正確，可以開啟網站了。',open:'開啟網站 ↗',close:'關閉'},
 en:{title:'Research website password',intro:'Enter the password to open this research website.',password:'Password',unlock:'Unlock',checking:'Checking…',wrong:'Incorrect password. Please try again.',error:'Could not verify the password. Please try again.',ready:'Password accepted. You can open the website.',open:'Open website ↗',close:'Close'},
 ja:{title:'研究サイトのパスワード',intro:'パスワードを入力すると研究サイトを開けます。',password:'パスワード',unlock:'解除',checking:'確認中…',wrong:'パスワードが正しくありません。もう一度お試しください。',error:'確認できませんでした。もう一度お試しください。',ready:'確認できました。サイトを開けます。',open:'サイトを開く ↗',close:'閉じる'}
 };
 let dialog,opener,attempt=0;
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
 function show(link){
  const lang=link.closest('[lang]')?.lang||document.documentElement.lang;
  const ui=labels[lang]||labels.en;
  if(!dialog){dialog=el('dialog','research-link-gate');dialog.id='research-link-gate';dialog.setAttribute('aria-labelledby','research-gate-title');dialog.setAttribute('data-lenis-prevent','');document.body.append(dialog);dialog.addEventListener('close',()=>{attempt++;dialog.replaceChildren();opener?.focus({preventScroll:true});});}
  opener=link;attempt++;
  const top=el('div','research-gate-top'),title=el('h2',null,ui.title),close=el('button','research-gate-close','×');title.id='research-gate-title';close.type='button';close.setAttribute('aria-label',ui.close);close.addEventListener('click',()=>dialog.close());top.append(title,close);
  const body=el('div','research-gate-body'),intro=el('p',null,ui.intro),form=el('form'),label=el('label',null,ui.password),input=el('input'),submit=el('button','research-gate-action',ui.unlock),status=el('p','research-gate-status');
  input.type='password';input.id='research-gate-password';input.name='research-password';input.autocomplete='off';input.required=true;input.autofocus=true;input.spellcheck=false;label.htmlFor=input.id;submit.type='submit';status.setAttribute('role','status');status.setAttribute('aria-live','polite');input.setAttribute('aria-describedby','research-gate-status');status.id='research-gate-status';
  form.append(label,input,submit);body.append(intro,form,status);dialog.replaceChildren(top,body);
  form.addEventListener('submit',async event=>{
   event.preventDefault();const serial=++attempt;submit.disabled=true;submit.textContent=ui.checking;status.textContent='';input.removeAttribute('aria-invalid');
   try{
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value),'PBKDF2',false,['deriveBits']);
    const derived=await crypto.subtle.deriveBits({name:'PBKDF2',salt:Uint8Array.from(salt.match(/../g),x=>parseInt(x,16)),iterations,hash:'SHA-256'},key,256);
    const actual=Array.from(new Uint8Array(derived),x=>x.toString(16).padStart(2,'0')).join('');
    if(serial!==attempt||!dialog.open)return;
    if(actual!==expected){status.textContent=ui.wrong;input.value='';input.setAttribute('aria-invalid','true');input.focus();return;}
    input.value='';form.hidden=true;status.textContent=ui.ready;
    const open=el('a','research-gate-action',ui.open);open.href=link.href;open.target='_blank';open.rel='noopener noreferrer';open.addEventListener('click',()=>dialog.close());body.append(open);open.focus();
   }catch{if(serial===attempt)status.textContent=ui.error;}finally{if(serial===attempt){submit.disabled=false;submit.textContent=ui.unlock;}}
  });
  dialog.showModal();input.focus();
 }
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('.note-resources a');if(!link)return;
  let url;try{url=new URL(link.href);}catch{return;}
  if(url.hostname!=='arizona-jp-tw-map.jarvislintggc.chatgpt.site'||!paths.has(url.pathname.replace(/\/$/,'')||'/'))return;
  event.preventDefault();event.stopImmediatePropagation();show(link);
 },true);
})();
