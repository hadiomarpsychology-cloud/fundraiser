/* LDT country and language access — no external script dependencies */
(function(){
"use strict";
const countries=Array.isArray(window.LDT_COUNTRIES)?window.LDT_COUNTRIES:[];
if(countries.length!==193){return;}
const translations={
"ar":"العربية","fa":"فارسی","ckb":"کوردی سۆرانی","he":"עברית","en":"English","fr":"Français","es":"Español","de":"Deutsch","it":"Italiano","pt":"Português","zh-CN":"简体中文","zh-TW":"繁體中文","hi":"हिन्दी","ur":"اردو","ru":"Русский","ja":"日本語","ko":"한국어","tr":"Türkçe","nl":"Nederlands","sw":"Kiswahili","bn":"বাংলা","ps":"پښتو","ku":"Kurdî","cy":"Cymraeg","gd":"Gàidhlig","tl":"Filipino","am":"አማርኛ","so":"Soomaali","om":"Afaan Oromoo","vi":"Tiếng Việt","id":"Bahasa Indonesia","ms":"Bahasa Melayu","ta":"தமிழ்","te":"తెలుగు","uk":"Українська","el":"Ελληνικά","ca":"Català","af":"Afrikaans","sv":"Svenska","da":"Dansk","no":"Norsk","fi":"Suomi","pl":"Polski","ro":"Română","sr":"Српски","hr":"Hrvatski","bg":"Български","cs":"Čeština","sk":"Slovenčina","hu":"Magyar","ne":"नेपाली","sq":"Shqip","hy":"Հայերեն","ka":"ქართული","az":"Azərbaycanca","uz":"Oʻzbekcha","tk":"Türkmençe","kk":"Қазақша","ky":"Кыргызча","mn":"Монгол","th":"ไทย","lo":"ລາວ","km":"ខ្មែរ","my":"မြန်မာ","rw":"Kinyarwanda","zu":"isiZulu","xh":"isiXhosa","yo":"Yorùbá","ha":"Hausa","ig":"Igbo","ee":"Eʋegbe","sn":"ChiShona","mg":"Malagasy","mt":"Malti","ga":"Gaeilge","mi":"Te Reo Māori","gu":"ગુજરાતી","pa":"ਪੰਜਾਬੀ","ml":"മലയാളം","mr":"मराठी","kn":"ಕನ್ನಡ","si":"සිංහල","ti":"ትግርኛ","ceb":"Cebuano","ilo":"Ilokano"
};
const wrap=document.createElement("section");wrap.className="ldt-global";wrap.setAttribute("aria-label","اختيار الدولة واللغة");
wrap.innerHTML='<div class="ldt-global-line"><span class="ldt-global-mark" aria-hidden="true">◉</span><span class="ldt-global-title">إل دي تي · اللغات العالمية</span><span class="ldt-global-hint">١٩٣ دولة · ٥ لغات لواجهة الموقع</span><button class="ldt-global-trigger" type="button" aria-expanded="false" aria-controls="ldt-country-panel">🌐 اختر الدولة واللغة ▾</button></div><div id="ldt-country-panel" class="ldt-global-panel" hidden><div class="ldt-global-inner"><label for="ldt-country-search">ابحث باسم الدولة أو اللغة</label><input id="ldt-country-search" class="ldt-global-search" type="search" placeholder="اكتب اسم دولة أو لغة…" autocomplete="off"><div id="ldt-country-result" role="status" class="ldt-global-hint"></div><div id="ldt-country-grid" class="ldt-global-grid" role="group" aria-label="قائمة الدول"></div><div id="ldt-country-choice" class="ldt-global-choice" hidden></div><p class="ldt-global-note">هذه قائمة الدول الأعضاء الـ١٩٣ وليست ١٩٣ لغة رسمية. تغيير لغة الموقع فوري، دون خدمات ترجمة خارجية؛ الملفات الأصلية لا تُترجم تلقائيًا.</p></div></div>';
document.body.insertBefore(wrap,document.body.firstChild);
const trigger=wrap.querySelector(".ldt-global-trigger"),panel=wrap.querySelector(".ldt-global-panel"),search=wrap.querySelector("#ldt-country-search"),grid=wrap.querySelector("#ldt-country-grid"),choice=wrap.querySelector("#ldt-country-choice"),result=wrap.querySelector("#ldt-country-result");
const nativeSelect=document.querySelector("select#language,select#lang");
if(nativeSelect){
 const quick=document.createElement("div");quick.className="ldt-global-quick";
 for(const item of [["ar","العربية"],["fa","فارسی"],["ckb","کوردی"],["he","עברית"],["en-GB","English (UK)"]]){
  if(!Array.from(nativeSelect.options).some(o=>o.value===item[0]))continue;
  const b=document.createElement("button");b.type="button";b.textContent=item[1];b.addEventListener("click",()=>chooseLanguage(item[0]));quick.append(b);
 }
 wrap.querySelector(".ldt-global-line").insertBefore(quick,trigger);
}

const builtIn=["ar","fa","ckb","he","en-GB"];
const builtInLabels={"ar":"العربية","fa":"فارسی","ckb":"کوردی سۆرانی","he":"עברית","en-GB":"English (UK)"};
function flag(code){return Array.from(code.toUpperCase()).map(c=>String.fromCodePoint(127397+c.charCodeAt(0))).join("");}
function label(code){return translations[code]||builtInLabels[code]||code;}
function chooseLanguage(code){
 if(!nativeSelect){return;}
 if(!builtIn.includes(code)){return;}
 const o=Array.from(nativeSelect.options).find(x=>x.value===code);
 if(!o){return;}
 nativeSelect.value=code;nativeSelect.dispatchEvent(new Event("change",{bubbles:true}));
 try{sessionStorage.setItem("ldt-access-language",code);}catch(e){}
 panel.hidden=true;trigger.setAttribute("aria-expanded","false");
}
function renderCountry(country){
 choice.hidden=false;choice.replaceChildren();
 const heading=document.createElement("strong");heading.textContent=flag(country.c)+" "+country.a+" — "+country.n;
 const text=document.createElement("p");text.textContent="الترجمة داخل الموقع متاحة باللغات المبينة أدناه فقط. القائمة تعرض دول العالم واللغات المرتبطة بها، دون تحويلك إلى خدمات خارجية.";text.style.margin="5px 0";
 const buttons=document.createElement("div");buttons.className="ldt-global-langs";
 const available=builtIn.filter(code=>nativeSelect&&Array.from(nativeSelect.options).some(o=>o.value===code));
 if(!available.length){
  const note=document.createElement("p");note.textContent="الوثائق الأصلية في هذه الصفحة متاحة بلغاتها المنشورة. لا توجد ترجمة تلقائية لهذه الصفحة.";buttons.append(note);
 }else{
  available.forEach(code=>{
   const b=document.createElement("button");b.type="button";b.className="ldt-global-lang";b.textContent=builtInLabels[code];b.addEventListener("click",()=>chooseLanguage(code));buttons.append(b);
  });
 }
 const associated=document.createElement("p");associated.className="ldt-global-note";associated.textContent="لغات مرتبطة بالدولة: "+(country.l.length?country.l.map(label).join("، "):"لا توجد بيانات لغوية كافية لهذا البلد")+". ليست جميعها ترجمات متاحة للموقع.";
 choice.append(heading,text,buttons,associated);
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