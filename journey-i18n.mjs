import { japaneseChapters, japaneseUI, japaneseSkillNames, japaneseEquipment } from './journey-ja.mjs';
import { chapters } from './journey-data.mjs';
import { englishChapters, englishSkillNames, englishUI } from './journey-en.mjs';
import { equipmentChanges } from './journey-growth.mjs';
import { monsters } from './journey-monsters.mjs';

export const LANGUAGE_KEY='jarvis-journey-language';
const english={...englishUI};

const japanese={...japaneseUI};
for(const [locale,table,translatedChapters] of [['en',english,englishChapters],['ja',japanese,japaneseChapters]]){
 for(const [index,source] of chapters.entries()){
  const translated=translatedChapters[index];
  for(const key of ['title','region','symbol','result','bridge'])if(source[key])table[source[key]]=translated[key];
  source.pages.forEach((line,page)=>table[line]=translated.pages[page]);
  table[[source.result,source.bridge].filter(Boolean).join(' ')]=[translated.result,translated.bridge].filter(Boolean).join(' ');
  table[source.alt]=locale==='ja'?`「${translated.title}」の舞台として使うメイプルストーリーの背景。実際の場所の写真ではありません。`:`Original MapleStory scenery used as the game stage for “${translated.title}”, not a photo of the real location.`;
 }
}
for(const items of Object.values(equipmentChanges))for(const item of items){
 english[item.name]=item.originalName.trim();
 japanese[item.name]=japaneseEquipment[item.originalName.trim()];
 japanese[item.originalName.trim()]=japaneseEquipment[item.originalName.trim()];
}
for(const item of englishSkillNames){english[item.chinese]=item.english;japanese[item.chinese]=japaneseSkillNames[String(item.id)];}
const monsterNames=['マノ','スタンピ','デウ','ロンバード','セルフ','本の幽霊','キングクラン','ファウスト','タイマー','学者の幽霊','ママシュ','ダイル','ジェノ','タイルン','猫仙人','キメラ','キングスライム','フランケンロイド'];
for(const [index,mob]of Object.values(monsters).entries()){english[mob.name]=mob.originalName;japanese[mob.name]=monsterNames[index];}
export const gameDictionaries={en:english,ja:japanese};
const termTables=Object.fromEntries(Object.entries(gameDictionaries).map(([locale,table])=>[locale,Object.entries(table).sort(([a],[b])=>b.length-a.length)]));

export function translateGameText(text,locale='zh-Hant'){
 text=String(text??'');const table=gameDictionaries[locale];if(!table)return text;
 if(Object.hasOwn(table,text))return table[text];
 if(locale==='en'&&!/[\p{Script=Han}]/u.test(text))return text;
 const translate=value=>translateGameText(value,locale);
 let match;
 if(locale==='ja'){
  if((match=text.match(/^靠近(.+)，按 A 攻擊$/)))return `${translate(match[1])}に近づき、A で攻撃`;
  if((match=text.match(/^攻擊(.+)$/)))return `${translate(match[1])}を攻撃`;
  if((match=text.match(/^重看第 (\d+) 章：(.+)$/)))return `第${match[1]}章をもう一度：${translate(match[2])}`;
  if((match=text.match(/^進入傳送門，前往第 (\d+) 章$/)))return `ポータルに入り、第${match[1]}章へ`;
  if((match=text.match(/^(.+)路線 · 從初心者出發$/)))return `${translate(match[1])}ルート · 初心者から出発`;
  if((match=text.match(/^楓之谷(.+)完整角色立繪$/)))return `メイプルストーリーの${translate(match[1])}の全身イラスト`;
  if((match=text.match(/^攻擊(.+)，象徵(.+)$/)))return `${translate(match[2])}を象徴する${translate(match[1])}を攻撃`;
  if((match=text.match(/^已學會：(.+)。按 A 使用最新學會的技能攻擊。$/)))return `習得済み：${match[1].split('、').map(translate).join('、')}。A で最新スキルを使って攻撃します。`;
  if((match=text.match(/^選擇(.+)$/)))return `${translate(match[1])}を選択`;
  for(const [source,target]of termTables.ja)if(source.length>1&&text.includes(source))text=text.split(source).join(target);
  return text;
 }
 if((match=text.match(/^靠近(.+)，按 A 攻擊$/)))return `Approach ${translate(match[1])} and press A to attack.`;
 if((match=text.match(/^攻擊(.+)$/)))return `Attack ${translate(match[1])}`;
 if((match=text.match(/^重看第 (\d+) 章：(.+)$/)))return `Replay chapter ${match[1]}: ${translate(match[2])}`;
 if((match=text.match(/^進入傳送門，前往第 (\d+) 章$/)))return `Enter portal to chapter ${match[1]}`;
 if((match=text.match(/^(.+)路線 · 從初心者出發$/)))return `${translate(match[1])} route · Start as a Beginner`;
 if((match=text.match(/^楓之谷(.+)完整角色立繪$/)))return `MapleStory ${translate(match[1])} character illustration`;
 if((match=text.match(/^攻擊(.+)，象徵(.+)$/)))return `Attack ${translate(match[1])}, representing ${translate(match[2])}`;
 if((match=text.match(/^已學會：(.+)。按 A 使用最新學會的技能攻擊。$/)))return `Learned: ${match[1].split('、').map(translate).join(', ')}. Press A to attack with your newest skill.`;
 if((match=text.match(/^選擇(.+)$/)))return `Choose ${translate(match[1])}`;
 for(const [source,target]of termTables.en)if(source.length>1&&text.includes(source))text=text.split(source).join(target);
 return text.replaceAll('章節進度','Chapter Progress').replaceAll('：',': ').replaceAll('、',', ');
}

export function applyGameLanguage(section,locale){
 section.setAttribute('lang',locale);
 for(const node of section.querySelectorAll('[data-journey-text]'))node.textContent=translateGameText(node.getAttribute('data-journey-text'),locale);
 for(const attribute of ['aria-label','aria-roledescription'])for(const node of section.querySelectorAll(`[data-journey-${attribute}]`))node.setAttribute(attribute,translateGameText(node.getAttribute(`data-journey-${attribute}`),locale));
}

export function readGameLanguage(storage){
 if(typeof document!=='undefined'&&['en','zh-Hant','ja'].includes(document.documentElement?.lang))return document.documentElement.lang;
 try{storage??=globalThis.localStorage;const value=storage?.getItem(LANGUAGE_KEY);return ['en','ja'].includes(value)?value:'zh-Hant';}catch{return 'zh-Hant';}
}
export function saveGameLanguage(locale,storage){
 if(!['en','zh-Hant','ja'].includes(locale))return;
 try{storage??=globalThis.localStorage;storage?.setItem(LANGUAGE_KEY,locale);storage?.setItem('jarvis-site-language',locale);}catch{}
}
