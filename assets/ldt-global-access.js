/* LDT country and language access — no external script dependencies */
(function(){
"use strict";
const countries=Array.isArray(window.LDT_COUNTRIES)?window.LDT_COUNTRIES:[];
if(countries.length!==193){return;}
const translations={
"ar":"العربية","fa":"فارسی","ckb":"کوردی سۆرانی","he":"עברית","en":"English","fr":"Français","es":"Español","de":"Deutsch","it":"Italiano","pt":"Português","zh-CN":"简体中文","zh-TW":"繁體中文","hi":"हिन्दी","ur":"اردو","ru":"Русский","ja":"日本語","ko":"한국어","tr":"Türkçe","nl":"Nederlands","sw":"Kiswahili","bn":"বাংলা","ps":"پښتو","ku":"Kurdî","cy":"Cymraeg","gd":"Gàidhlig","tl":"Filipino","am":"አማርኛ","so":"Soomaali","om":"Afaan Oromoo","vi":"Tiếng Việt","id":"Bahasa Indonesia","ms":"Bahasa Melayu","ta":"தமிழ்","te":"తెలుగు","uk":"Українська","el":"Ελληνικά","ca":"Català","af":"Afrikaans","sv":"Svenska","da":"Dansk","no":"Norsk","fi":"Suomi","pl":"Polski","ro":"Română","sr":"Српски","hr":"Hrvatski","bg":"Български","cs":"Čeština","sk":"Slovenčina","hu":"Magyar","ne":"नेपाली","sq":"Shqip","hy":"Հայերեն","ka":"ქართული","az":"Azərbaycanca","uz":"Oʻzbekcha","tk":"Türkmençe","kk":"Қазақша","ky":"Кыргызча","mn":"Монгол","th":"ไทย","lo":"ລາວ","km":"ខ្មែរ","my":"မြန်မာ","rw":"Kinyarwanda","zu":"isiZulu","xh":"isiXhosa","yo":"Yorùbá","ha":"Hausa","ig":"Igbo","ee":"Eʋegbe","sn":"ChiShona","mg":"Malagasy","mt":"Malti","ga":"Gaeilge","mi":"Te Reo Māori","gu":"ગુજરાતી","pa":"ਪੰਜਾਬੀ","ml":"മലയാളം","mr":"मराठी","kn":"ಕನ್ನಡ","si":"සිංහල","ti":"ትግርኛ","ceb":"Cebuano","ilo":"Ilokano"
};
const wrap=document.createElement("section");wrap.className="ldt-global";wrap.setAttribute("aria-label","اختيار الدولة واللغة");
wrap.innerHTML='<div class="ldt-global-line"><span class="ldt-global-mark" aria-hidden="true">◉</span><span class="ldt-global-title">إل دي تي · اللغات العالمية</span><span class="ldt-global-hint">دليل الدول الأعضاء الـ١٩٣ · ابحث عن دولة أو لغة</span><button class="ldt-global-trigger" type="button" aria-expanded="false" aria-controls="ldt-country-panel">🌐 اختر الدولة واللغة ▾</button></div><div id="ldt-country-panel" class="ldt-global-panel" hidden><div class="ldt-global-inner"><label for="ldt-country-search">ابحث باسم الدولة أو اللغة</label><input id="ldt-country-search" class="ldt-global-search" type="search" placeholder="اكتب اسم دولة أو لغة…" autocomplete="off"><div id="ldt-country-result" role="status" class="ldt-global-hint"></div><div id="ldt-country-grid" class="ldt-global-grid" role="group" aria-label="قائمة الدول"></div><div id="ldt-country-choice" class="ldt-global-choice" hidden></div><p class="ldt-global-note">هذه قائمة ١٩٣ دولة عضوًا في الأمم المتحدة وليست ١٩٣ لغة رسمية. النصوص الأصلية والوثائق لا تتغير. بعض الترجمات تعتمد على خدمة جوجل الخارجية وقد لا تتاح لجميع اللغات.</p></div></div>';
document.body.insertBefore(wrap,document.body.firstChild);
const trigger=wrap.querySelector(".ldt-global-trigger"),panel=wrap.querySelector(".ldt-global-panel"),search=wrap.querySelector("#ldt-country-search"),grid=wrap.querySelector("#ldt-country-grid"),choice=wrap.querySelector("#ldt-country-choice"),result=wrap.querySelector("#ldt-country-result");
const nativeSelect=document.querySelector("select#language,select#lang");
const supportedOptions=nativeSelect?Array.from(nativeSelect.options).map(o=>({v:o.value,t:o.textContent})).filter(o=>o.v!=="en-GB"):[];
function flag(code){return Array.from(code.toUpperCase()).map(c=>String.fromCodePoint(127397+c.charCodeAt(0))).join("");}
function label(code){return translations[code]||supportedOptions.find(x=>x.v===code)?.t||code;}
function saveChoice(code){try{sessionStorage.setItem("ldt-access-language",code);}catch(e){}}
function chooseLanguage(code){
 saveChoice(code);
 if(nativeSelect&&Array.from(nativeSelect.options).some(o=>o.value===code)){nativeSelect.value=code;nativeSelect.dispatchEvent(new Event("change",{bubbles:true}));panel.hidden=true;trigger.setAttribute("aria-expanded","false");return;}
 const path=location.href.split("#")[0];
 if(code==="en"){location.assign("https://translate.google.com/translate?sl=ar&tl=en&u="+encodeURIComponent(path));return;}
 if(!/^[a-zA-Z]{2,3}(?:-[a-zA-Z]{2,3})?$/.test(code)){return;}
 location.assign("https://translate.google.com/translate?sl=auto&tl="+encodeURIComponent(code)+"&u="+encodeURIComponent(path));
}
function renderCountry(country){
 choice.hidden=false;choice.replaceChildren();
 const heading=document.createElement("strong");heading.textContent=flag(country.c)+" "+country.a+" — "+country.n;
 const text=document.createElement("p");text.textContent="اختر لغة لعرض الموقع. يمكن أيضًا اختيار أي لغة أخرى من القائمة العامة.";text.style.margin="5px 0";
 const buttons=document.createElement("div");buttons.className="ldt-global-langs";
 const langCodes=[...new Set(["ar",...country.l])];
 langCodes.forEach(code=>{
  const b=document.createElement("button");b.type="button";b.className="ldt-global-lang";b.textContent=label(code);b.addEventListener("click",()=>chooseLanguage(code));buttons.append(b);
 });
 const others=document.createElement("details");const summary=document.createElement("summary");summary.textContent="لغات إضافية متاحة في الموقع";others.append(summary);
 const otherBox=document.createElement("div");otherBox.className="ldt-global-langs";
 supportedOptions.filter(x=>x.v!=="ar"&&!langCodes.includes(x.v)).forEach(o=>{
  const b=document.createElement("button");b.type="button";b.className="ldt-global-lang";b.textContent=o.t;b.addEventListener("click",()=>chooseLanguage(o.v));otherBox.append(b);
 });others.append(otherBox);
 choice.append(heading,text,buttons,others);
 choice.scrollIntoView({block:"nearest",behavior:"smooth"});
}
function render(){
 const q=search.value.trim().toLocaleLowerCase();
 const list=countries.filter(c=>(c.a+" "+c.n+" "+c.c+" "+c.l.map(label).join(" ")).toLocaleLowerCase().includes(q));
 result.textContent="الدول المعروضة: "+list.length+" من ١٩٣";
 grid.replaceChildren(...list.map(c=>{
  const b=document.createElement("button");b.type="button";b.className="ldt-global-country";b.setAttribute("aria-pressed","false");
  const f=document.createElement("span");f.textContent=flag(c.c);
  const body=document.createElement("span");const strong=document.createElement("strong");strong.textContent=c.a;const small=document.createElement("small");small.textContent=c.n;body.append(strong,small);b.append(f,body);
  b.addEventListener("click",()=>{grid.querySelectorAll("[aria-pressed='true']").forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");renderCountry(c);});
  return b;
 }));
}
trigger.addEventListener("click",()=>{const open=panel.hidden;panel.hidden=!open;trigger.setAttribute("aria-expanded",String(open));if(open){render();search.focus();}});
search.addEventListener("input",render);
render();
})();