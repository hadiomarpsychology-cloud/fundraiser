(function(){
"use strict";
const countries=Array.isArray(window.PX_COUNTRIES)?window.PX_COUNTRIES:[];
const names={"ar":"العربية","fa":"فارسی","ckb":"کوردی سۆرانی","he":"עברית","en-GB":"English (UK)","en":"English","fr":"Français","es":"Español","de":"Deutsch","pt":"Português","it":"Italiano","zh-CN":"中文","ja":"日本語","ko":"한국어","hi":"हिन्दी","ru":"Русский","tr":"Türkçe","ur":"اردو","bn":"বাংলা","nl":"Nederlands","sw":"Kiswahili","am":"አማርኛ","vi":"Tiếng Việt","id":"Bahasa Indonesia","ms":"Bahasa Melayu","dz":"རྫོང་ཁ","rn":"Kirundi","ss":"siSwati","st":"Sesotho","bi":"Bislama","dv":"ދިވެހި","tl":"Filipino","si":"සිංහල","hy":"Հայերեն","az":"Azərbaycanca","sq":"Shqip","ca":"Català","sr":"Српски","hr":"Hrvatski","bg":"Български","cs":"Čeština","da":"Dansk","et":"Eesti","ti":"ትግርኛ","fi":"Suomi","ka":"ქართული","hu":"Magyar","is":"Íslenska","ga":"Gaeilge","kk":"Қазақша","ky":"Кыргызча","lo":"ລາວ","lv":"Latviešu","lt":"Lietuvių","lb":"Lëtzebuergesch","mt":"Malti","mn":"Монгол","my":"မြန်မာ","ne":"नेपाली","mk":"Македонски","no":"Norsk","pl":"Polski","ro":"Română","rw":"Kinyarwanda","sm":"Gagana Sāmoa","sk":"Slovenčina","sl":"Slovenščina","sv":"Svenska","th":"ไทย","to":"Lea faka-Tonga","tk":"Türkmençe","uk":"Українська","uz":"Oʻzbekcha","af":"Afrikaans","he":"עברית","el":"Ελληνικά","fa":"فارسی"};


const codes=["en","zh-CN","es","ar","fr","de","ja"];
function languageName(code){if(names[code])return names[code];try{return new Intl.DisplayNames(["en"],{type:"language"}).of(code)||code;}catch(e){return code;}}
const root=document.createElement("section");root.className="px-global px-one-menu";root.setAttribute("aria-label","Language selection / اختيار اللغة");
root.innerHTML='<div class="px-global-line"><button class="px-global-trigger" type="button" aria-expanded="false" aria-controls="px-language-panel">🌐 اللغات · Languages ▾</button></div><div class="px-global-panel" id="px-language-panel" hidden><div class="px-global-inner"><label for="px-language-search">اللغة · Language</label><input id="px-language-search" type="search" hidden aria-hidden="true" tabindex="-1"><p id="px-language-count" role="status"></p><div id="px-language-options" class="px-global-grid" role="group" aria-label="Languages"></div><p id="px-language-feedback" class="px-global-note" role="status" aria-live="polite">Selecting a language changes page content where translations are available. Other languages may require browser support; original content remains available.</p><button class="px-global-lang" id="px-language-close" type="button">إغلاق · Close</button></div></div>';
document.body.insertBefore(root,document.body.firstChild);
const trigger=root.querySelector(".px-global-trigger"),panel=root.querySelector("#px-language-panel"),search=root.querySelector("#px-language-search"),grid=root.querySelector("#px-language-options"),count=root.querySelector("#px-language-count"),feedback=root.querySelector("#px-language-feedback");
const native=new Set(["ar","en"]);
const rtl=new Set(["ar","fa","ckb","he","ur","ps","sd","ug","yi"]);
const codeSet=new Set(codes);
function toggle(open){panel.hidden=!open;trigger.setAttribute("aria-expanded",String(open));if(open){render();grid.querySelector("button")?.focus();}else trigger.focus();}
function updateLocal(code){window.dispatchEvent(new CustomEvent("px-language-change",{detail:code==="en"?"en-GB":code}));}
function browserChoice(){
 const browserLanguages=Array.isArray(navigator.languages)&&navigator.languages.length?navigator.languages:[navigator.language||"ar"];
 for(const value of browserLanguages){
  const lower=String(value).toLowerCase();
  let candidates=[lower,lower.split("-")[0]];
  if(lower.startsWith("zh-hant")||/zh-(tw|hk|mo)/.test(lower))candidates=["zh-TW","zh-CN"];
  if(lower.startsWith("zh"))candidates=["zh-CN","zh-TW"];
  if(lower.startsWith("ku-arab")||lower.startsWith("ckb"))candidates=["ckb","ku"];
  if(lower.startsWith("en"))candidates=["en"];
  if(lower.startsWith("he")||lower.startsWith("iw"))candidates=["he"];
  if(lower.startsWith("fa"))candidates=["fa"];
  for(const choice of candidates){const matched=[...codeSet].find(x=>x.toLowerCase()===choice.toLowerCase());if(matched)return matched;}
 }
 return "ar";
}
function storedChoice(){
 try{
  const saved=localStorage.getItem("px-global-language");
  if(saved){const normal=saved==="en-GB"?"en":saved;return codeSet.has(normal)?normal:null;}
 }catch(e){}
 return null;
}
let current=null,selection=0;
function report(message){feedback.textContent=message;}
function choose(code,automatic=false){
 if(!codeSet.has(code))return;
 const token=++selection,label=languageName(code),local=native.has(code);
 current=code;
 if(typeof window.pxRestoreText==="function")window.pxRestoreText();
 if(local){
  updateLocal(code);
  trigger.textContent="🌐 "+label+" ▾";
  try{localStorage.setItem("px-global-language",code);}catch(e){}
  report("Prepared site text selected instantly where available. Original documents are unchanged.");
  if(!automatic)toggle(false);
  return;
 }
 if(automatic){report("Choose a language to request optional translation.");return;}
 if(typeof window.pxFullTranslate!=="function"||typeof window.Translator==="undefined"){report(label+": browser translation unavailable. Original text remains visible.");return;}
 report("Optional translation requested. This language may require browser translation resources.");
 Promise.resolve(window.pxFullTranslate(code)).then(ok=>{
  if(token!==selection)return;
  if(ok){document.documentElement.lang=code;document.documentElement.dir=rtl.has(code)?"rtl":"ltr";trigger.textContent="🌐 "+label+" ▾";try{localStorage.setItem("px-global-language",code);}catch(e){}toggle(false);}
  else report(label+": translation unavailable. Original text remains visible.");
 }).catch(()=>{if(token===selection)report("Translation unavailable.");});
}
function render(){
 const q=search.value.trim().toLocaleLowerCase();
 const found=codes.filter(code=>languageName(code).toLocaleLowerCase().includes(q)||code.toLowerCase().includes(q));
 count.textContent="7 international business languages";
 grid.replaceChildren(...found.map(code=>{
  const b=document.createElement("button");b.type="button";b.className="px-country-language-option";b.textContent=languageName(code);b.setAttribute("lang",code);b.addEventListener("click",()=>choose(code));return b;
 }));
}
trigger.addEventListener("click",()=>toggle(panel.hidden));
root.querySelector("#px-language-close").addEventListener("click",()=>toggle(false));
search.addEventListener("input",render);
root.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)toggle(false)});
document.addEventListener("px-translation-status",e=>{feedback.textContent=String(e.detail||"")});
const initial=storedChoice()||browserChoice();
// Respect the user's chosen language on every page, or detect it for a first visit.
choose(initial,true);
})();