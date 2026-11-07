(() => {
 'use strict';
 for(const detail of document.querySelectorAll('.contact-email')){
  const sync=()=>{detail.querySelector('.contact-flip-front').setAttribute('aria-hidden',String(detail.open));detail.querySelector('.contact-flip-back').setAttribute('aria-hidden',String(!detail.open));};
  detail.addEventListener('toggle',sync);sync();
 }
})();
