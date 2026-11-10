(function(){
"use strict";
const countries=Array.isArray(window.LDT_COUNTRIES)?window.LDT_COUNTRIES:[];
const names={"ar":"العربية","fa":"فارسی","ckb":"کوردی سۆرانی","he":"עברית","en-GB":"English (UK)","en":"English","fr":"Français","es":"Español","de":"Deutsch","pt":"Português","it":"Italiano","zh-CN":"中文","ja":"日本語","ko":"한국어","hi":"हिन्दी","ru":"Русский","tr":"Türkçe","ur":"اردو","bn":"বাংলা","nl":"Nederlands","sw":"Kiswahili","am":"አማርኛ","vi":"Tiếng Việt","id":"Bahasa Indonesia","ms":"Bahasa Melayu","dz":"རྫོང་ཁ","rn":"Kirundi","ss":"siSwati","st":"Sesotho","bi":"Bislama","dv":"ދިވެހި","tl":"Filipino","si":"සිංහල","hy":"Հայերեն","az":"Azərbaycanca","sq":"Shqip","ca":"Català","sr":"Српски","hr":"Hrvatski","bg":"Български","cs":"Čeština","da":"Dansk","et":"Eesti","ti":"ትግርኛ","fi":"Suomi","ka":"ქართული","hu":"Magyar","is":"Íslenska","ga":"Gaeilge","kk":"Қазақша","ky":"Кыргызча","lo":"ລາວ","lv":"Latviešu","lt":"Lietuvių","lb":"Lëtzebuergesch","mt":"Malti","mn":"Монгол","my":"မြန်မာ","ne":"नेपाली","mk":"Македонски","no":"Norsk","pl":"Polski","ro":"Română","rw":"Kinyarwanda","sm":"Gagana Sāmoa","sk":"Slovenčina","sl":"Slovenščina","sv":"Svenska","th":"ไทย","to":"Lea faka-Tonga","tk":"Türkmençe","uk":"Українська","uz":"Oʻzbekcha","af":"Afrikaans","he":"עברית","el":"Ελληνικά","fa":"فارسی"};


const codes=[...new Set(countries.flatMap(c=>[c.p,...(Array.isArray(c.l)?c.l:[])]).filter(Boolean).map(c=>c==="en-GB"?"en":c))].sort((a,b)=>languageName(a).localeCompare(languageName(b)));
if(!codes.includes("ckb"))codes.push("ckb");
if(!codes.includes("he"))codes.push("he");
if(!codes.includes("ar"))codes.push("ar");
function languageName(code){if(names[code])return names[code];try{return new Intl.DisplayNames(["en"],{type:"language"}).of(code)||code;}catch(e){return code;}}
const root=document.createElement("section");root.className="ldt-global ldt-one-menu";root.setAttribute("aria-label","Language selection / اختيار اللغة");
root.innerHTML='<div class="ldt-global-line"><button class="ldt-global-trigger" type="button" aria-expanded="false" aria-controls="ldt-language-panel">🌐 اللغات · Languages ▾</button></div><div class="ldt-global-panel" id="ldt-language-panel" hidden><div class="ldt-global-inner"><label for="ldt-language-search">اللغة · Language</label><input id="ldt-language-search" class="ldt-global-search" type="search" placeholder="Search language · ابحث عن لغة" autocomplete="off"><p id="ldt-language-count" role="status"></p><div id="ldt-language-options" class="ldt-global-grid" role="group" aria-label="Languages"></div><p id="ldt-language-feedback" class="ldt-global-note" role="status" aria-live="polite">Selecting a language changes page content where translations are available. Other languages may require browser support; original content remains available.</p><button class="ldt-global-lang" id="ldt-language-close" type="button">إغلاق · Close</button></div></div>';
document.body.insertBefore(root,document.body.firstChild);
const trigger=root.querySelector(".ldt-global-trigger"),panel=root.querySelector("#ldt-language-panel"),search=root.querySelector("#ldt-language-search"),grid=root.querySelector("#ldt-language-options"),count=root.querySelector("#ldt-language-count"),feedback=root.querySelector("#ldt-language-feedback");
const native=new Set(["ar","fa","ckb","he","en"]);
const rtl=new Set(["ar","fa","ckb","he","ur","ps","sd","ug","yi"]);
const codeSet=new Set(codes);
function toggle(open){panel.hidden=!open;trigger.setAttribute("aria-expanded",String(open));if(open)search.focus();else trigger.focus();}
function updateLocal(code){window.dispatchEvent(new CustomEvent("ldt-language-change",{detail:code==="en"?"en-GB":code}));}
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
  const saved=localStorage.getItem("ldt-global-language");
  if(saved){const normal=saved==="en-GB"?"en":saved;return codeSet.has(normal)?normal:null;}
 }catch(e){}
 return null;
}
let current=null;
function report(message){feedback.textContent=message;}
function choose(code,automatic=false){
 if(!codeSet.has(code))return;
 const label=languageName(code),local=native.has(code);
 if(current===code&&!automatic){toggle(false);return;}
 current=code;
 if(typeof window.LDTRestoreText==="function")window.LDTRestoreText();
 // Prepared site translations are immediate; page-wide machine translation is optional.
 if(local)updateLocal(code);
 if(code==="ar"){
  document.documentElement.lang="ar";document.documentElement.dir="rtl";
  trigger.textContent="🌐 "+label+" ▾";
  try{localStorage.setItem("ldt-global-language","ar");}catch(e){}
  if(!automatic)toggle(false);
  report("Arabic selected; original content displayed.");
  return;
 }
 const canTranslate=typeof window.LDTFullTranslate==="function"&&typeof window.Translator!=="undefined";
 const applySelection=(ok)=>{
  if(ok||local){
   if(!ok&&local)updateLocal(code);
   document.documentElement.lang=code;
   document.documentElement.dir=rtl.has(code)?"rtl":"ltr";
   trigger.textContent="🌐 "+label+" ▾";
   try{localStorage.setItem("ldt-global-language",code);}catch(e){}
   if(!automatic)toggle(false);
   report(ok?"Page translation applied where supported; review automatically translated text.":"Prepared interface translation applied. Full-page translation is not available in this browser.");
  }else{
   report(label+": full-page translation is unavailable in this browser. Original content is shown.");
  }
 };
 if(!canTranslate){applySelection(false);return;}
 report("Preparing "+label+" translation locally…");
 Promise.resolve(window.LDTFullTranslate(code)).then(applySelection).catch(()=>applySelection(false));
}
function render(){
 const q=search.value.trim().toLocaleLowerCase();
 const found=codes.filter(code=>languageName(code).toLocaleLowerCase().includes(q)||code.toLowerCase().includes(q));
 count.textContent=found.length+" languages";
 grid.replaceChildren(...found.map(code=>{
  const b=document.createElement("button");b.type="button";b.className="ldt-country-language-option";b.textContent=languageName(code);b.setAttribute("lang",code);b.addEventListener("click",()=>choose(code));return b;
 }));
}
trigger.addEventListener("click",()=>toggle(panel.hidden));
root.querySelector("#ldt-language-close").addEventListener("click",()=>toggle(false));
search.addEventListener("input",render);
root.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)toggle(false)});
document.addEventListener("ldt-translation-status",e=>{feedback.textContent=String(e.detail||"")});
render();
const initial=storedChoice()||browserChoice();
// Respect the user's chosen language on every page, or detect it for a first visit.
choose(initial,true);
})();