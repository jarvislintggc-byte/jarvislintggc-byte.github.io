(() => {
  'use strict';
  const triggers = [...document.querySelectorAll('#menu-trigger,#game-menu-trigger')];
  let trigger = triggers[0];
  const menu = document.querySelector('#site-menu');
  const closeButton = document.querySelector('#menu-close');
  const links = [...menu.querySelectorAll('.menu-list a')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const mouse=matchMedia('(hover:hover) and (pointer:fine)');
  let closing = false, pointerDriven=false,leaveTimer=0;
  let closeTimer;
  let destination = null;
  function cancelPointerClose(){clearTimeout(leaveTimer);leaveTimer=0;}
  function schedulePointerClose(){if(!leaveTimer)leaveTimer=setTimeout(()=>{leaveTimer=0;if(menu.open&&pointerDriven&&!closing)closeMenu();},160);}

  function updateCurrent() {
    const current = location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
    links.forEach(link => {
      const path = link.pathname.replace(/\/+$/, '') || '/';
      const active = path === current;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  function openMenu(event) {
    trigger=event?.currentTarget||trigger;
    if (menu.open) return;
    cancelPointerClose();pointerDriven=mouse.matches&&Boolean(event?.fromPointer||event?.detail>0);
    clearTimeout(closeTimer);
    closing = false;
    destination = null;
    updateCurrent();
    menu.classList.remove('is-open', 'is-closing');
    menu.showModal();
    menu.scrollTop = 0;
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('modal-open');
    // Establish the off-screen state before animating the top-layer dialog in.
    void menu.offsetHeight;
    requestAnimationFrame(() => { if (menu.open && !closing) menu.classList.add('is-open'); });
  }
  function closeMenu(target = null) {
    cancelPointerClose();
    if (!menu.open || closing) return;
    closing = true;
    destination = target;
    menu.classList.add('is-closing');
    menu.classList.remove('is-open');
    // The timeout also handles interrupted transitions and hidden browser tabs.
    closeTimer = setTimeout(() => { if (menu.open) menu.close(); }, reducedMotion.matches ? 0 : 680);
  }
  triggers.forEach(button=>button.addEventListener('click',openMenu));
  closeButton.addEventListener('click', () => closeMenu());
  menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
  menu.addEventListener('keydown', event => {
    pointerDriven=false;cancelPointerClose();
    if (event.key !== 'Tab') return;
    // Keep keyboard navigation in the panel, including at both ends of the list.
    const focusable = [...menu.querySelectorAll('a[href],button:not([disabled])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  menu.addEventListener('transitionend', event => {
    if (event.target === menu && event.propertyName === 'transform' && closing && menu.open) menu.close();
  });
  links.forEach(link => link.addEventListener('click', event => {
    // Preserve modifier-click and genuine page URLs for opening another tab.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu(link.href);
  }));
  menu.addEventListener('close', () => {
    pointerDriven=false;cancelPointerClose();
    clearTimeout(closeTimer);
    const targetUrl = destination;
    destination = null;
    closing = false;
    menu.classList.remove('is-open', 'is-closing');
    trigger.setAttribute('aria-expanded', 'false');
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    if (targetUrl) {
      location.assign(targetUrl);
    } else trigger.focus({ preventScroll: true });
  });
  const hello=document.querySelector('.jarvis-dock-hello');
  if(hello&&triggers[0]){
    let armed=true,openedAt=null,pointer=null;
    const outside=(point,r)=>r.width>0&&r.height>0&&(point.x<r.left||point.x>r.right||point.y<r.top||point.y>r.bottom);
    function hoverOpen(event){
      if(event.pointerType!=='mouse'||!mouse.matches||!armed||menu.open||hello.closest('[inert]'))return;
      armed=false;openedAt=pointer={x:event.clientX,y:event.clientY};openMenu({currentTarget:triggers[0],fromPointer:true});
    }
    hello.addEventListener('pointerenter',hoverOpen);
    // Layout changes while closing or wobbling must not count as a fresh hover.
    window.addEventListener('pointermove',event=>{
      if(event.pointerType!=='mouse')return;pointer={x:event.clientX,y:event.clientY};
      if(menu.open){
        if(!mouse.matches||closing){cancelPointerClose();return;}
        if(outside(pointer,menu.getBoundingClientRect())){if(pointerDriven)schedulePointerClose();}
        else{pointerDriven=true;cancelPointerClose();}
        return;
      }
      if(armed||!openedAt||pointer.x===openedAt.x&&pointer.y===openedAt.y)return;
      if(outside(pointer,hello.getBoundingClientRect()))armed=true;
    },{passive:true});
    menu.addEventListener('close',()=>{if(!armed&&pointer&&outside(pointer,hello.getBoundingClientRect()))armed=true;});
    // The navigation controller can finish loading after the pointer arrives.
    if(mouse.matches&&hello.matches(':hover')){const r=hello.getBoundingClientRect();hoverOpen({pointerType:'mouse',clientX:r.left+r.width/2,clientY:r.top+r.height/2});}
  }
})();
