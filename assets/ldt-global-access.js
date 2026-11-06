(function(){
"use strict";
const countries=Array.isArray(window.LDT_COUNTRIES)?window.LDT_COUNTRIES:[];
if(countries.length!==193)return;
const supported=new Set(["ar","fa","ckb","he","en-GB"]);
const names={"ar":"العربية","fa":"فارسی","ckb":"کوردی سۆرانی","he":"עברית","en-GB":"English (UK)","en":"English","fr":"Français","es":"Español","de":"Deutsch","pt":"Português","it":"Italiano","zh-CN":"中文","ja":"日本語","ko":"한국어","hi":"हिन्दी","ru":"Русский","tr":"Türkçe","ur":"اردو","bn":"বাংলা","nl":"Nederlands","sw":"Kiswahili","am":"አማርኛ","vi":"Tiếng Việt","id":"Bahasa Indonesia","ms":"Bahasa Melayu","dz":"རྫོང་ཁ","rn":"Kirundi","ss":"siSwati","st":"Sesotho","bi":"Bislama","dv":"ދިވެހި","tl":"Filipino","si":"සිංහල","hy":"Հայերեն","az":"Azərbaycanca","sq":"Shqip","ca":"Català","sr":"Српски","hr":"Hrvatski","bg":"Български","cs":"Čeština","da":"Dansk","et":"Eesti","ti":"ትግርኛ","fi":"Suomi","ka":"ქართული","hu":"Magyar","is":"Íslenska","ga":"Gaeilge","kk":"Қазақша","ky":"Кыргызча","lo":"ລາວ","lv":"Latviešu","lt":"Lietuvių","lb":"Lëtzebuergesch","mt":"Malti","mn":"Монгол","my":"မြန်မာ","ne":"नेपाली","mk":"Македонски","no":"Norsk","pl":"Polski","ro":"Română","rw":"Kinyarwanda","sm":"Gagana Sāmoa","sk":"Slovenčina","sl":"Slovenščina","sv":"Svenska","th":"ไทย","to":"Lea faka-Tonga","tk":"Türkmençe","uk":"Українська","uz":"Oʻzbekcha","af":"Afrikaans","he":"עברית","el":"Ελληνικά","fa":"فارسی"};
const bar=document.createElement("section");bar.className="ldt-global ldt-one-menu";bar.setAttribute("aria-label","دليل الدول واللغات / Country and language directory");
bar.innerHTML='<div class="ldt-global-line"><span class="ldt-global-mark" aria-hidden="true">◉</span><span class="ldt-global-title">إل دي تي · وصول عالمي</span><button class="ldt-global-trigger" type="button" aria-expanded="false" aria-controls="ldt-country-panel">🌐 اختر الدولة · Choose country ▾</button></div><div class="ldt-global-panel" id="ldt-country-panel" hidden><div class="ldt-global-inner"><label for="ldt-country-search">ابحث عن الدولة / Search country</label><input id="ldt-country-search" class="ldt-global-search" type="search" placeholder="Country · الدولة" autocomplete="off"><p id="ldt-country-result" role="status"></p><div class="ldt-global-grid" id="ldt-country-grid" role="group" aria-label="193 countries"></div><div id="ldt-country-selection" class="ldt-global-choice" role="status" hidden></div><p class="ldt-global-note">كل دولة مرتبطة بلغة رئيسية للعرض. الترجمات المنشورة للموقع محدودة؛ اختيار لغة أخرى لا يترجم النصوص أو الوثائق تلقائيًا. لا توجد تحويلات إلى جوجل.</p><button class="ldt-global-lang" id="ldt-close" type="button">إغلاق · Close</button></div></div>';
document.body.insertBefore(bar,document.body.firstChild);
const trigger=bar.querySelector(".ldt-global-trigger"),panel=bar.querySelector("#ldt-country-panel"),search=bar.querySelector("#ldt-country-search"),grid=bar.querySelector("#ldt-country-grid"),status=bar.querySelector("#ldt-country-result"),selected=bar.querySelector("#ldt-country-selection");
function flag(code){return [...code.toUpperCase()].map(c=>String.fromCodePoint(127397+c.charCodeAt(0))).join("");}
function langName(code){if(names[code])return names[code];try{return new Intl.DisplayNames(["en"],{type:"language"}).of(code)||code;}catch(e){return code;}}
function persist(country){try{localStorage.setItem("ldt-country",country.c);localStorage.setItem("ldt-global-language",country.p);}catch(e){}}
function apply(country,remember){
 if(!country)return;
 const code=country.p;
 if(remember)persist(country);
 selected.hidden=false;
 selected.replaceChildren();
 const heading=document.createElement("strong");heading.textContent=flag(country.c)+" "+country.a+" — "+country.n;
 const line=document.createElement("p");line.style.margin="7px 0";line.textContent="اللغة الرئيسية / Primary language: "+langName(code);
 const note=document.createElement("p");note.className="ldt-global-note";
 if(supported.has(code)||code==="en"){
  const actual=code==="en"?"en-GB":code;
  window.dispatchEvent(new CustomEvent("ldt-language-change",{detail:actual}));
  document.documentElement.lang=actual;
  document.documentElement.dir=actual==="en-GB"?"ltr":"rtl";
  note.textContent="تم اختيار اللغة المتاحة لواجهة الموقع. المستندات الأصلية كما هي.";
 }else{
  note.textContent="هذه اللغة مرتبطة بالدولة، لكن ترجمة الموقع إليها غير منشورة بعد. يمكنك تصفح المحتوى بلغته الأصلية.";
 }
 selected.append(heading,line,note);
 trigger.textContent="🌐 "+flag(country.c)+" "+country.a+" · "+langName(code)+" ▾";
 grid.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.country===country.c)));
}
function render(){
 const query=search.value.trim().toLocaleLowerCase();
 const found=countries.filter(c=>(c.a+" "+c.n+" "+c.c+" "+langName(c.p)).toLocaleLowerCase().includes(query));
 status.textContent=found.length+" / 193";
 grid.replaceChildren(...found.map(c=>{
  const button=document.createElement("button");button.type="button";button.className="ldt-global-country";button.dataset.country=c.c;button.setAttribute("aria-pressed","false");
  const f=document.createElement("span");f.textContent=flag(c.c);f.setAttribute("aria-hidden","true");
  const contents=document.createElement("span");const title=document.createElement("strong");title.textContent=c.a;const sub=document.createElement("small");sub.textContent=c.n+" · "+langName(c.p);contents.append(title,sub);
  button.append(f,contents);button.addEventListener("click",()=>apply(c,true));return button;
 }));
}
function toggle(open){panel.hidden=!open;trigger.setAttribute("aria-expanded",String(open));if(open){search.focus();}else{trigger.focus();}}
trigger.addEventListener("click",()=>toggle(panel.hidden));
bar.querySelector("#ldt-close").addEventListener("click",()=>toggle(false));
search.addEventListener("input",render);
bar.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)toggle(false);});
render();
let remembered=null;try{remembered=localStorage.getItem("ldt-country");}catch(e){}
const country=countries.find(x=>x.c===remembered);
if(country)apply(country,false);
})();