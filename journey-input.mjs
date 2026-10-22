// Physical controls keep working when an IME reports ㄇ, Dead or Process.
const physicalKeys={KeyA:'a',KeyW:'w',KeyE:'e',Space:' ',ArrowLeft:'ArrowLeft',ArrowRight:'ArrowRight',ArrowUp:'ArrowUp',ArrowDown:'ArrowDown',Enter:'Enter',NumpadEnter:'Enter',Escape:'Escape'};
export function gameKey(event){return physicalKeys[event.code]||(typeof event.key==='string'?(event.key.length===1?event.key.toLowerCase():event.key):'');}
export function isEditingText(target){
 if(!target)return false;
 if(target.isContentEditable||target.closest?.('[contenteditable="true"],[contenteditable="plaintext-only"]'))return true;
 const tag=target.tagName?.toUpperCase();
 if(tag==='TEXTAREA'||tag==='SELECT')return true;
 return tag==='INPUT'&&!['button','checkbox','color','file','hidden','image','radio','range','reset','submit'].includes(target.type?.toLowerCase());
}
