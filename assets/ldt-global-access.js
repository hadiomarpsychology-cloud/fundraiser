(function(){
"use strict";
const countries=Array.isArray(window.LDT_COUNTRIES)?window.LDT_COUNTRIES:[];
if(countries.length!==193)return;
const translated=new Set("ar bg bn cs da de el en es fi fr he hi hr hu id it ja kn ko lt mr nl no pl pt ro ru sk sl sv ta te th tr uk vi zh-CN zh-TW en-GB".split(" "));
const names={"ar":"العربية","fa":"فارسی","ckb":"کوردی سۆرانی","he":"עברית","en-GB":"English (UK)","en":"English","fr":"Français","es":"Español","de":"Deutsch","pt":"Português","it":"Italiano","zh-CN":"中文","ja":"日本語","ko":"한국어","hi":"हिन्दी","ru":"Русский","tr":"Türkçe","ur":"اردو","bn":"বাংলা","nl":"Nederlands","sw":"Kiswahili","am":"አማርኛ","vi":"Tiếng Việt","id":"Bahasa Indonesia","ms":"Bahasa Melayu","dz":"རྫོང་ཁ","rn":"Kirundi","ss":"siSwati","st":"Sesotho","bi":"Bislama","dv":"ދިވެހި","tl":"Filipino","si":"සිංහල","hy":"Հայերեն","az":"Azərbaycanca","sq":"Shqip","ca":"Català","sr":"Српски","hr":"Hrvatski","bg":"Български","cs":"Čeština","da":"Dansk","et":"Eesti","ti":"ትግርኛ","fi":"Suomi","ka":"ქართული","hu":"Magyar","is":"Íslenska","ga":"Gaeilge","kk":"Қазақша","ky":"Кыргызча","lo":"ລາວ","lv":"Latviešu","lt":"Lietuvių","lb":"Lëtzebuergesch","mt":"Malti","mn":"Монгол","my":"မြန်မာ","ne":"नेपाली","mk":"Македонски","no":"Norsk","pl":"Polski","ro":"Română","rw":"Kinyarwanda","sm":"Gagana Sāmoa","sk":"Slovenčina","sl":"Slovenščina","sv":"Svenska","th":"ไทย","to":"Lea faka-Tonga","tk":"Türkmençe","uk":"Українська","uz":"Oʻzbekcha","af":"Afrikaans","he":"עברית","el":"Ελληνικά","fa":"فارسی"};

const bar=document.createElement("section");
bar.className="ldt-global ldt-one-menu";
bar.setAttribute("aria-label","Country languages / لغات الدول");
bar.innerHTML='<div class="ldt-global-line"><span class="ldt-global-mark" aria-hidden="true">◉</span><span class="ldt-global-title">إل دي تي · وصول عالمي</span><button class="ldt-global-trigger" type="button" aria-expanded="false" aria-controls="ldt-country-panel">🌐 الدول واللغات · Countries & languages ▾</button></div><div id="ldt-country-panel" class="ldt-global-panel" hidden><div class="ldt-global-inner"><label for="ldt-country-search">ابحث عن دولة أو لغة / Search country or language</label><input id="ldt-country-search" class="ldt-global-search" type="search" placeholder="الدولة أو اللغة · Country or language" autocomplete="off"><p id="ldt-country-result" role="status"></p><div id="ldt-country-grid" class="ldt-global-grid" role="list" aria-label="Languages by country"></div><p id="ldt-language-feedback" class="ldt-global-note" role="status" aria-live="polite">نحاول ترجمة محتوى الصفحة كاملًا على الجهاز حين يدعم المتصفح ذلك. عند عدم الدعم يبقى المحتوى الأصلي كاملًا. لا يوجد تحويل إلى مواقع ترجمة خارجية.</p><button class="ldt-global-lang" id="ldt-close" type="button">إغلاق · Close</button></div></div>';
document.body.insertBefore(bar,document.body.firstChild);
const trigger=bar.querySelector(".ldt-global-trigger"),panel=bar.querySelector("#ldt-country-panel"),search=bar.querySelector("#ldt-country-search"),grid=bar.querySelector("#ldt-country-grid"),status=bar.querySelector("#ldt-country-result"),feedback=bar.querySelector("#ldt-language-feedback");
function flag(code){return [...code.toUpperCase()].map(x=>String.fromCodePoint(127397+x.charCodeAt(0))).join("");}
function langName(code){if(names[code])return names[code];try{return new Intl.DisplayNames(["en"],{type:"language"}).of(code)||code;}catch(e){return code;}}
function languageOptions(country){return [...new Set([country.p,...(Array.isArray(country.l)?country.l:[])].filter(Boolean))];}
function selectLanguage(country,code){
 const language=langName(code);
 const base=code==="en"?"en-GB":code;
 const local=["ar","fa","ckb","he","en-GB"].includes(base);
 const translationAvailable=typeof window.LDTFullTranslate==="function";
 if(!translationAvailable&&!local){
  feedback.textContent=language+": full-page translation is not available in this browser. The original site remains readable.";return;
 }
 try{localStorage.setItem("ldt-country",country.c);}catch(e){}
 const activate=()=>{
  window.dispatchEvent(new CustomEvent("ldt-language-change",{detail:local?base:"ar"}));
  if(code==="ar"){
   window.LDTRestoreText?.();
   document.documentElement.lang="ar";document.documentElement.dir="rtl";
   try{localStorage.setItem("ldt-global-language","ar");}catch(e){}
   feedback.textContent="عاد النص الأصلي بالعربية حيث يتوفر.";
   trigger.textContent="🌐 "+flag(country.c)+" "+language+" ▾";
   toggle(false);
   return;
  }
  if(!translationAvailable){
   document.documentElement.lang=base;
   trigger.textContent="🌐 "+flag(country.c)+" "+language+" ▾";
   toggle(false);
   feedback.textContent="Only the available page interface was changed. The full text remains in its original languages.";
   return;
  }
  const task=window.LDTFullTranslate(code);
  feedback.textContent="Preparing full-page translation on your device…";
  trigger.textContent="🌐 "+flag(country.c)+" "+language+" ▾";
  toggle(false);
  Promise.resolve(task).then(ok=>{
   if(ok){try{localStorage.setItem("ldt-global-language",base);}catch(e){}}
   else if(local){
    window.dispatchEvent(new CustomEvent("ldt-language-change",{detail:base}));
    feedback.textContent="Only the built-in page translation is available here; the full text remains in its original languages.";
   }
  }).catch(()=>{feedback.textContent="Full-page translation is unavailable. Original text is preserved."});
 };
 activate();
}
document.addEventListener("ldt-translation-status",e=>{feedback.textContent=e.detail});
function render(){
 const q=search.value.trim().toLocaleLowerCase();
 const found=countries.filter(c=>(c.a+" "+c.n+" "+c.c+" "+languageOptions(c).map(langName).join(" ")).toLocaleLowerCase().includes(q));
 status.textContent=found.length+" / 193";
 grid.replaceChildren(...found.flatMap(c=>languageOptions(c).map(code=>{
  const b=document.createElement("button");b.type="button";b.className="ldt-country-language-option";
  const available=translated.has(code);
  if(!available)b.classList.add("ldt-untranslated");
  const f=document.createElement("span");f.textContent=flag(c.c);f.className="ldt-option-flag";f.setAttribute("aria-hidden","true");
  const content=document.createElement("span");content.className="ldt-option-details";
  const country=document.createElement("strong");country.textContent=c.a+" · "+c.n;
  const language=document.createElement("span");language.textContent=langName(code)+(available?" · ترجمة تعتمد على المتصفح":" · عرض اللغة فقط");
  content.append(country,language);b.append(f,content);
  b.setAttribute("aria-label",c.n+" — "+langName(code)+(available?" — browser translation may be available":" — translation not yet available"));
  b.addEventListener("click",()=>selectLanguage(c,code));return b;
 })));
}
function toggle(open){panel.hidden=!open;trigger.setAttribute("aria-expanded",String(open));if(open)search.focus();else trigger.focus();}
trigger.addEventListener("click",()=>toggle(panel.hidden));
bar.querySelector("#ldt-close").addEventListener("click",()=>toggle(false));
search.addEventListener("input",render);
bar.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)toggle(false);});
render();
})();