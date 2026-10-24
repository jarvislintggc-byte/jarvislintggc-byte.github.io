import { chapters } from './journey-data.mjs';
import { englishChapters, englishSkillNames } from './journey-en.mjs';
import { equipmentChanges } from './journey-growth.mjs';
import { monsters } from './journey-monsters.mjs';

export const LANGUAGE_KEY='jarvis-journey-language';
const english={
 "操作角色：左右方向鍵移動，Space / W / ↑ 跳躍，空中再按一次二段跳，所有職業從初心者起即可使用。靠近繩梯後按住 ↑／↓ 攀爬，Space 跳離；平台上 ↓＋Space 往下跳。地面按住 ↓ 趴下，放開站起。對話結束後 A 攻擊，學到新技能後會自動成為攻擊。對話期間可移動與跳躍。HP 歸零後等待墓碑落地，按「在本關復活」或 Enter 繼續。怪物倒下後可繼續移動，三隻寵物會跨平台取回地上裝備。靠近開啟的傳點按 E。Enter 推進對話。觸控可點擊本章阻力攻擊，點擊藍光傳點進入。":"Play: use the left and right arrows to move. Space / W / \u2191 jumps; press Jump again in midair to double jump. All classes can do this from Beginner. Hold \u2191 / \u2193 near ropes and ladders to climb, and press Space to jump off. Press \u2193 + Space to drop through platforms. Hold \u2193 on the ground to crouch. A attacks after dialogue ends and automatically uses your newest skill. You can move and jump during dialogue. If HP reaches zero, wait for the tombstone to land, then choose Revive Here or press Enter. After defeating a monster, keep moving while your three pets retrieve equipment across platforms. Press E beside an open portal. Enter advances dialogue. On touchscreens, tap the monster to attack or the blue portal to enter.",
 '攻擊本章阻力':"Attack this chapter's monster",
 '每一段，都是下一段的起點。':'Every chapter is a new beginning.',
 '選一門職業探索我的旅程':'Choose a class. Explore my journey.',
 '劍士':'Warrior','法師':'Magician','盜賊':'Thief','弓手':'Bowman','海盜':'Pirate','初心者':'Beginner',
 '普通攻擊':'Basic Attack','初心者服裝':'Beginner Outfit',
 '操作角色':'Play','觀看故事':'Watch Story','選擇你的職業方向，再開始故事。':'Choose your class to begin.',
 '五種冒險職業，可左右切換':'Five adventurer classes; use left and right to choose',
 '選擇職業方向':'Choose your class','選擇職業':'Choose a class','輪播':'Carousel',
 '出發':'Begin','下一句':'Next Line','按 A 攻擊':'Press A to Attack','施放中…':'Attacking…','退場中…':'Defeated…',
 '收尾對話…':'Chapter Closing…','稍候…':'Please Wait…','成長中…':'Leveling Up…','E 進入傳點':'E · Enter Portal',
 '完成這段旅程':'Complete the Journey','進入傳送門':'Enter Portal','走向傳點…':'Walking to Portal…',
 '前往下一站…':'Traveling…','等待復活':'Awaiting Revival','重新選擇職業':'Choose Another Class',
 '繼續':'Resume','暫停':'Pause','這一章':'This Chapter','繼續前進':'Keep Going',
 '自動：開':'Auto: On','自動：關':'Auto: Off','自動':'Auto','開':'On','關':'Off',
 '謝謝你走過我的故事。下一章還在繼續，也希望有機會和你聊聊，我能為你的團隊做什麼。':'Thank you for walking through my story. The next chapter is still unfolding. I hope we can talk about what I could bring to your team.',
 '下一章，':'The next chapter','還在繼續。':'is still unfolding.',
 '18 章旅程 · 故事仍在繼續':'18 chapters · The story continues',
 '我的經歷':'My Experience','我能帶來什麼':'What I Bring','聯絡我 ↗':'Contact Me ↗',
 '裝備':'Equipment','技能':'Skills','角色狀態':'Character Stats','角色資訊':'Character Information',
 '熱鍵選項':'Controls','旅程目錄':'Chapters','目錄':'Chapters','遊戲選單':'Game Menu','關閉選單':'Close Menu',
 '遊戲場景':'Game Scene','章節進度':'Chapter Progress','觀看故事速度':'Story Playback Speed',
 'Jarvis 的人生冒險遊戲':"Jarvis's Life Journey Game",'開啟選單／離開遊戲':'Open Menu / Leave Game',
 '角色操作':'Player Controls','向左移動':'Move Left','向右移動':'Move Right',
 '靠近繩梯後按住向上攀爬':'Hold to climb up a nearby rope or ladder',
 '按住趴下，繩梯上向下攀爬':'Hold to crouch, or climb down a rope or ladder',
 '跳躍，空中再按一次二段跳':'Jump; press again in the air to double jump',
 '攀爬':'Climb','趴下':'Crouch','跳躍':'Jump','旁白':'Story',
 '角色狀態與旁白紀錄':'Character Stats and Dialogue History','最新一則對話':'Latest Dialogue',
 '旅程暫停':'Journey Paused','準備好了，再繼續。':'Continue when you are ready.','繼續旅程 →':'Resume Journey →',
 '角色已倒下':'You Have Fallen','在本關復活':'Revive Here',
 '在本關復活，繼續這段旅程。':'Revive in this chapter and continue your journey.',
 '稍候，墓碑正在落下…':'Please wait for the tombstone to land…',
 '等待對話完畢後，才可攻擊怪物。':'Wait for the dialogue to finish before attacking.',
 '先跳離繩梯，再按 A 攻擊':'Jump off the rope or ladder before pressing A.',
 '放開 ↓ 後按 A 攻擊':'Release ↓ before pressing A to attack.',
 'MP 恢復中，使用普通攻擊':'Recovering MP · Using a basic attack',
 '走到藍光傳點旁，落地後按 E 進入。':'Stand beside the blue portal, land, and press E to enter.',
 '沒有命中，靠近並面向怪物再按 A':'Missed · Move closer, face the monster, and press A.',
 '靠近阻力，按 A 攻擊':'Approach the monster and press A to attack.',
 '最終未錄取 / 故事繼續':'Not Hired / The Story Continues',
 '這次創業沒有成功 / 故事繼續':'This Venture Did Not Succeed / The Story Continues',
 '故事走到這裡 / 下一步仍在進行':'The Story So Far / The Next Step Is Unfolding',
 '傳點開啟，走到旁邊按 E':'Portal Open · Approach and press E',
 '走近地上的裝備即可拾取':'Walk up to the equipment on the ground to pick it up.',
 '寵物正在取回裝備':'Your pets are fetching the equipment.',
 '寵物夥伴':'Pet Companions',
 '進入傳送門，完成這段旅程':'Enter the portal to complete this journey',
 '傳送門尚未開啟':'The portal is not open yet','尚未開啟':'Not Open Yet',
 '完成旅程 →':'Finish →','下一章 →':'Next Chapter →','傳送中…':'Traveling…',
 '常駐：二段跳（空中再按跳躍）／↓ 趴下':'Always available: double jump (jump again in midair) / ↓ crouch',
 'A：使用最新學會的技能攻擊':'A: attack with your newest skill','A：普通攻擊':'A: basic attack',
 '完成第一章後，解鎖第一個職業技能。':'Complete chapter 1 to unlock your first class skill.',
 ' · A 攻擊':' · A to attack',
 '← →：左右移動':'← →: move left and right',
 'Space / W：跳躍；空中再按一次二段跳':'Space / W: jump; press again in midair to double jump',
 '↑／↓：靠近繩梯後攀爬；Space 跳離':'↑ / ↓: climb a nearby rope or ladder; Space: jump off',
 '↓＋Space：從平台往下跳':'↓ + Space: drop through a platform',
 '二段跳：五職業從初心者起常駐，落地恢復，不消耗 MP':'Double jump: available to all classes from Beginner; resets on landing and costs no MP',
 '↓：地面按住趴下，放開站起':'↓: hold to crouch on the ground; release to stand',
 'A：攻擊（自動使用最新學會的技能）':'A: attack (automatically uses your newest skill)',
 'E：互動／靠近傳點後進入':'E: interact / enter a nearby portal','Enter：推進對話':'Enter: advance dialogue',
 '觸控：跳躍按兩次二段跳、按住趴下；點擊阻力攻擊、藍光傳點進入':'Touch: tap Jump twice to double jump; hold Crouch; tap the monster to attack or the blue portal to enter',
 '關閉所有聲音':'Mute All Audio','開啟所有聲音':'Unmute All Audio',
 '技能音效載入失敗':'Skill audio could not load','升級音效載入失敗':'Level-up audio could not load','音效目前無法使用':'Audio is currently unavailable',
 '經典登入':'Classic Login','維多利亞港':'Lith Harbor','魔法森林':'Ellinia','弓箭手村':'Henesys','墮落城市':'Kerning City','海島海岸':'Island Coast','沙漠旅程':'Desert Journey',
 'BGM · 開':'BGM · On','BGM · 關':'BGM · Off','BGM · 點擊重試':'BGM · Retry','BGM · 點擊播放':'BGM · Play',
 '請先開啟喇叭，再播放背景音樂':'Unmute the speaker before playing background music',
 '關閉背景音樂':'Mute Background Music','重試背景音樂':'Retry Background Music','播放背景音樂':'Play Background Music','開啟音樂':'Play Music',
 '此互動旅程需要 JavaScript。你也可以前往 ':'This interactive journey requires JavaScript. You can also visit ',
 ' 閱讀我的經歷。':' to read my story.',
};

for(const [index,source] of chapters.entries()){
 const translated=englishChapters[index];
 for(const key of ['title','region','symbol','result','bridge'])if(source[key])english[source[key]]=translated[key];
 source.pages.forEach((line,page)=>english[line]=translated.pages[page]);
 english[[source.result,source.bridge].filter(Boolean).join(' ')]=[translated.result,translated.bridge].filter(Boolean).join(' ');
 english[source.alt]=`Original MapleStory scenery used as the game stage for “${translated.title}”, not a photo of the real location.`;
}
for(const items of Object.values(equipmentChanges))for(const item of items)english[item.name]=item.originalName.trim();
for(const item of englishSkillNames)english[item.chinese]=item.english;
for(const mob of Object.values(monsters))english[mob.name]=mob.originalName;
const terms=Object.entries(english).sort(([a],[b])=>b.length-a.length);

export function translateGameText(text,locale='zh-Hant'){
 text=String(text??'');if(locale!=='en')return text;
 if(Object.hasOwn(english,text))return english[text];
 if(!/[\p{Script=Han}]/u.test(text))return text;
 const translate=value=>translateGameText(value,locale);
 let match;
 if((match=text.match(/^重看第 (\d+) 章：(.+)$/)))return `Replay chapter ${match[1]}: ${translate(match[2])}`;
 if((match=text.match(/^進入傳送門，前往第 (\d+) 章$/)))return `Enter portal to chapter ${match[1]}`;
 if((match=text.match(/^(.+)路線 · 從初心者出發$/)))return `${translate(match[1])} route · Start as a Beginner`;
 if((match=text.match(/^楓之谷(.+)完整角色立繪$/)))return `MapleStory ${translate(match[1])} character illustration`;
 if((match=text.match(/^攻擊(.+)，象徵(.+)$/)))return `Attack ${translate(match[1])}, representing ${translate(match[2])}`;
 if((match=text.match(/^已學會：(.+)。按 A 使用最新學會的技能攻擊。$/)))return `Learned: ${match[1].split('、').map(translate).join(', ')}. Press A to attack with your newest skill.`;
 if((match=text.match(/^選擇(.+)$/)))return `Choose ${translate(match[1])}`;
 for(const [source,target]of terms)if(source.length>1&&text.includes(source))text=text.split(source).join(target);
 return text.replaceAll('章節進度','Chapter Progress').replaceAll('：',': ').replaceAll('、',', ');
}

export function applyGameLanguage(section,locale){
 section.setAttribute('lang',locale);
 for(const node of section.querySelectorAll('[data-journey-text]'))node.textContent=translateGameText(node.getAttribute('data-journey-text'),locale);
 for(const attribute of ['aria-label','aria-roledescription'])for(const node of section.querySelectorAll(`[data-journey-${attribute}]`))node.setAttribute(attribute,translateGameText(node.getAttribute(`data-journey-${attribute}`),locale));
}

export function readGameLanguage(storage){
 try{storage??=globalThis.localStorage;return storage?.getItem(LANGUAGE_KEY)==='en'?'en':'zh-Hant';}catch{return 'zh-Hant';}
}
export function saveGameLanguage(locale,storage){
 try{storage??=globalThis.localStorage;storage?.setItem(LANGUAGE_KEY,locale);}catch{}
}
