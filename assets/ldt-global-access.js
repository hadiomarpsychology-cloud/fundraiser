(function(){
"use strict";
const countries=Array.isArray(window.LDT_COUNTRIES)?window.LDT_COUNTRIES:[];
if(countries.length!==193)return;
const languages=[["ar","العربية"],["fa","فارسی"],["ckb","کوردی سۆرانی"],["he","עברית"],["en-GB","English (UK)"]];
const native=document.querySelector("select#language,select#lang");
const shell=document.createElement("section");
shell.className="ldt-global";
shell.setAttribute("aria-label","قائمة اللغات والدول");
shell.innerHTML='<div class="ldt-global-line"><span class="ldt-global-mark" aria-hidden="true">◉</span><span class="ldt-global-title">إل دي تي · الوصول العالمي</span><button class="ldt-global-trigger" type="button" aria-expanded="false" aria-controls="ldt-country-panel">🌐 اللغة والدولة ▾</button></div><div id="ldt-country-panel" class="ldt-global-panel" hidden><div class="ldt-global-inner"><div class="ldt-global-choice"><strong>لغة واجهة الموقع</strong><div class="ldt-global-langs" id="ldt-global-language-options"></div><p class="ldt-global-note">تُترجم واجهة الصفحات التي تتوفر لها نصوص جاهزة. لا تُترجم المستندات الأصلية تلقائيًا.</p></div><label for="ldt-country-search">دليل الدول الأعضاء الـ١٩٣</label><input id="ldt-country-search" class="ldt-global-search" type="search" placeholder="ابحث باسم دولة أو لغة…" autocomplete="off"><div id="ldt-country-result" role="status" class="ldt-global-hint"></div><div id="ldt-country-grid" class="ldt-global-grid" role="group" aria-label="الدول"></div><p class="ldt-global-note">دليل الدول للبحث والتصفح، وليس قائمة لغات رسمية للأمم المتحدة. لا تُستخدم خدمات ترجمة خارجية.</p></div></div>';
document.body.insertBefore(shell,document.body.firstChild);
const trigger=shell.querySelector(".ldt-global-trigger"),panel=shell.querySelector(".ldt-global-panel"),search=shell.querySelector("#ldt-country-search"),grid=shell.querySelector("#ldt-country-grid"),status=shell.querySelector("#ldt-country-result"),choices=shell.querySelector("#ldt-global-language-options");
function flag(c){return [...c.toUpperCase()].map(v=>String.fromCodePoint(127397+v.charCodeAt(0))).join("");}
function getPreference(){try{return localStorage.getItem("ldt-global-language")||"ar";}catch(e){return "ar";}}
function savePreference(v){try{localStorage.setItem("ldt-global-language",v);}catch(e){}}
function setLanguage(code,save=true){
 if(!languages.some(x=>x[0]===code))return;
 if(save)savePreference(code);
 if(native&&[...native.options].some(o=>o.value===code)){native.value=code;native.dispatchEvent(new Event("change",{bubbles:true}));}
 choices.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.language===code)));
 trigger.textContent="🌐 "+(languages.find(x=>x[0]===code)||languages[0])[1]+" ▾";
}
for(const [code,name] of languages){
 const b=document.createElement("button");b.type="button";b.className="ldt-global-lang";b.dataset.language=code;b.textContent=name;b.setAttribute("aria-pressed","false");
 b.addEventListener("click",()=>{setLanguage(code);panel.hidden=true;trigger.setAttribute("aria-expanded","false");});
 choices.append(b);
}
function render(){
 const query=search.value.trim().toLocaleLowerCase();
 const matches=countries.filter(c=>(c.a+" "+c.n+" "+c.c).toLocaleLowerCase().includes(query));
 status.textContent="الدول المعروضة: "+matches.length+" من ١٩٣";
 grid.replaceChildren(...matches.map(c=>{
  const b=document.createElement("div");b.className="ldt-global-country";
  const f=document.createElement("span");f.textContent=flag(c.c);
  const n=document.createElement("span");const strong=document.createElement("strong");strong.textContent=c.a;const small=document.createElement("small");small.textContent=c.n;
  n.append(strong,small);b.append(f,n);return b;
 }));
}
trigger.addEventListener("click",()=>{panel.hidden=!panel.hidden;trigger.setAttribute("aria-expanded",String(!panel.hidden));if(!panel.hidden){render();search.focus();}});
search.addEventListener("input",render);
setLanguage(getPreference(),false);
render();
})();