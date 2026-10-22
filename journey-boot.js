// The whole game loads as one versioned module graph. Asset URLs stay cached.
import('/runtime/journey.js?v=a65c26568aff5e00').catch(error=>{
  console.error('Journey could not initialize:',error);
  const stage=document.getElementById('journey-stage'),game=document.getElementById('life-game');
  if(!stage||!game)return;
  stage.dataset.revealed='true';stage.style.setProperty('--journey-reveal','1');
  game.dataset.loadState='error';game.inert=false;
  const cover=document.getElementById('game-cover'),screen=document.getElementById('class-screen');
  if(cover)cover.hidden=false;
  if(screen){
    let english=false;try{english=localStorage.getItem('jarvis-journey-language')==='en';}catch{}
    const title=document.createElement('h3'),message=document.createElement('p'),retry=document.createElement('button');
    title.textContent=english?'The journey could not load':'旅程暫時沒有載入完成';message.textContent=english?'Reload the page to start your adventure.':'請重新載入，再開始冒險。';message.className='cover-description';
    retry.type='button';retry.className='journey-retry';retry.textContent=english?'Reload':'重新載入';retry.addEventListener('click',()=>location.reload());
    screen.setAttribute('role','alert');screen.replaceChildren(title,message,retry);
  }
});
