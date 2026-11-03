// The whole game loads as one versioned module graph. Asset URLs stay cached.
import('/runtime/journey.js?v=9a94c13b7267777f').catch(error=>{
  console.error('Journey could not initialize:',error);
  const stage=document.getElementById('journey-stage'),game=document.getElementById('life-game');
  if(!stage||!game)return;
  stage.dataset.revealed='true';stage.style.setProperty('--journey-reveal','1');
  game.dataset.loadState='error';game.inert=false;
  const cover=document.getElementById('game-cover'),screen=document.getElementById('class-screen');
  if(cover)cover.hidden=false;
  if(screen){
    screen.hidden=false;
    const locale=document.documentElement?.lang || 'zh-Hant',english=locale==='en',japanese=locale==='ja';
    const title=document.createElement('h3'),message=document.createElement('p'),retry=document.createElement('button');
    title.textContent=japanese?'物語を読み込めませんでした':english?'The journey could not load':'旅程暫時沒有載入完成';message.textContent=japanese?'ページを再読み込みして冒険を始めてください。':english?'Reload the page to start your adventure.':'請重新載入，再開始冒險。';message.className='cover-description';
    retry.type='button';retry.className='journey-retry';retry.textContent=japanese?'再読み込み':english?'Reload':'重新載入';retry.addEventListener('click',()=>location.reload());
    screen.setAttribute('role','alert');screen.replaceChildren(title,message,retry);
  }
});
