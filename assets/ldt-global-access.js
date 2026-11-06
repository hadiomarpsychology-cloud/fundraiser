(function(){
"use strict";
const countries=Array.isArray(window.LDT_COUNTRIES)?window.LDT_COUNTRIES:[];
const languages=[["ar","العربية"],["fa","فارسی"],["ckb","کوردی سۆرانی"],["he","עברית"],["en-GB","English (UK)"]];
if(countries.length!==193)return;
const t={
"ar":{heading:"اختر لغة الموقع",choose:"اللغة",country:"دليل الدول الـ١٩٣",search:"ابحث عن دولة…",count:"دولة",note:"تُعرض واجهة الصفحات باللغات المتاحة؛ تبقى المستندات الأصلية كما نُشرت. لا تُرسل بياناتك إلى خدمات ترجمة خارجية.",directory:"عرض دليل الدول",close:"إغلاق"},
"fa":{heading:"زبان وبگاه را انتخاب کنید",choose:"زبان",country:"فهرست ۱۹۳ کشور",search:"جست‌وجوی کشور…",count:"کشور",note:"رابط صفحات به زبان‌های موجود نمایش داده می‌شود؛ اسناد اصلی بدون تغییر می‌مانند. اطلاعاتی به خدمات ترجمه بیرونی فرستاده نمی‌شود.",directory:"نمایش فهرست کشورها",close:"بستن"},
"ckb":{heading:"زمانی ماڵپەڕ هەڵبژێرە",choose:"زمان",country:"لیستی ١٩٣ وڵات",search:"گەڕان بۆ وڵات…",count:"وڵات",note:"ڕووکاری پەڕەکان بە زمانە بەردەستەکان دەگۆڕێت. بەڵگە ڕەسەنەکان وەک خۆیان دەمێننەوە.",directory:"پیشاندانی لیستی وڵاتان",close:"داخستن"},
"he":{heading:"בחירת שפת האתר",choose:"שפה",country:"מדריך 193 המדינות",search:"חיפוש מדינה…",count:"מדינות",note:"ממשק הדפים מוצג בשפות הזמינות; המסמכים המקוריים אינם משתנים. מידע לא נשלח לשירותי תרגום חיצוניים.",directory:"הצגת רשימת המדינות",close:"סגירה"},
"en-GB":{heading:"Choose website language",choose:"Language",country:"193-country directory",search:"Search for a country…",count:"countries",note:"Page navigation uses the available translations. Original documents remain unchanged. No external translation service receives your information.",directory:"View country directory",close:"Close"}
};
const bar=document.createElement("section");bar.className="ldt-global ldt-one-menu";bar.setAttribute("aria-label","Website language / لغة الموقع");
bar.innerHTML='<div class="ldt-global-line"><span class="ldt-global-mark" aria-hidden="true">◉</span><span class="ldt-global-title">إل دي تي</span><button class="ldt-global-trigger" type="button" aria-expanded="false" aria-controls="ldt-country-panel">🌐 اللغة</button></div><div id="ldt-country-panel" class="ldt-global-panel" hidden><div class="ldt-global-inner"><h2 id="ldt-language-heading" style="font-size:1.35rem;margin:0"></h2><div class="ldt-global-langs" id="ldt-global-language-options" role="group" aria-labelledby="ldt-language-heading"></div><p class="ldt-global-note" id="ldt-language-note"></p><details id="ldt-countries-details"><summary id="ldt-directory-title"></summary><div style="padding-top:12px"><label for="ldt-country-search" id="ldt-search-label"></label><input id="ldt-country-search" class="ldt-global-search" type="search" autocomplete="off"><p id="ldt-country-result" role="status"></p><div id="ldt-country-grid" class="ldt-global-grid" role="list"></div></div></details><button class="ldt-global-lang" id="ldt-close" type="button"></button></div></div>';
document.body.insertBefore(bar,document.body.firstChild);
const trigger=bar.querySelector(".ldt-global-trigger"),panel=bar.querySelector("#ldt-country-panel"),choices=bar.querySelector("#ldt-global-language-options"),search=bar.querySelector("#ldt-country-search"),grid=bar.querySelector("#ldt-country-grid"),count=bar.querySelector("#ldt-country-result"),details=bar.querySelector("#ldt-countries-details");
function read(){try{return localStorage.getItem("ldt-global-language")||"ar"}catch(e){return "ar"}}
function save(v){try{localStorage.setItem("ldt-global-language",v)}catch(e){}}
let current=languages.some(x=>x[0]===read())?read():"ar";
function flag(code){return [...code.toUpperCase()].map(v=>String.fromCodePoint(127397+v.charCodeAt(0))).join("")}
function setLanguage(code,remember=true){
 if(!languages.some(x=>x[0]===code))return;
 current=code;if(remember)save(code);
 document.documentElement.lang=code;
 document.documentElement.dir=code==="en-GB"?"ltr":"rtl";
 window.dispatchEvent(new CustomEvent("ldt-language-change",{detail:code}));
 const label=languages.find(x=>x[0]===code)[1],d=t[code];
 trigger.textContent="🌐 "+label+" ▾";
 bar.querySelector("#ldt-language-heading").textContent=d.heading;
 bar.querySelector("#ldt-language-note").textContent=d.note;
 bar.querySelector("#ldt-directory-title").textContent=d.directory+" (193)";
 bar.querySelector("#ldt-search-label").textContent=d.country;
 bar.querySelector("#ldt-close").textContent=d.close;
 search.placeholder=d.search;
 choices.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.code===code)));
 render();
}
function render(){
 const q=search.value.toLocaleLowerCase().trim();
 const matches=countries.filter(c=>(c.a+" "+c.n+" "+c.c).toLocaleLowerCase().includes(q));
 count.textContent=matches.length+" / 193 "+t[current].count;
 grid.replaceChildren(...matches.map(c=>{
  const div=document.createElement("div");div.className="ldt-global-country";div.setAttribute("role","listitem");div.tabIndex=0;
  const f=document.createElement("span");f.textContent=flag(c.c);f.setAttribute("aria-hidden","true");
  const text=document.createElement("span");const strong=document.createElement("strong");strong.textContent=c.a;const small=document.createElement("small");small.textContent=c.n;text.append(strong,small);div.append(f,text);return div;
 }));
}
for(const [code,name] of languages){
 const b=document.createElement("button");b.type="button";b.className="ldt-global-lang";b.dataset.code=code;b.textContent=name;
 b.addEventListener("click",()=>{setLanguage(code);toggle(false);trigger.focus()});choices.append(b);
}
function toggle(open){panel.hidden=!open;trigger.setAttribute("aria-expanded",String(open));if(open)choices.querySelector("button[aria-pressed='true']")?.focus();}
trigger.addEventListener("click",()=>toggle(panel.hidden));
bar.querySelector("#ldt-close").addEventListener("click",()=>{toggle(false);trigger.focus()});
search.addEventListener("input",render);
bar.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden){toggle(false);trigger.focus()}});
setLanguage(current,false);
})();