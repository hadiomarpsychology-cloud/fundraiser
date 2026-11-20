/* psychologistx.art inclusive navigation: independent accessible controls, no page data upload. */
(function(){
"use strict";
if(document.getElementById("px-accessibility"))return;
const root=document.createElement("aside");root.id="px-accessibility";root.setAttribute("aria-label","Accessibility tools / أدوات إمكانية الوصول");
root.innerHTML='<button id="px-a11y-open" type="button" aria-expanded="false" aria-controls="px-a11y-panel" aria-label="Accessibility options / إعدادات إمكانية الوصول">♿ <span>سهولة الوصول</span></button><div id="px-a11y-panel" hidden><h2>إمكانية الوصول · Accessibility</h2><p class="px-a11y-hint">Accessibility options work alongside your device settings.</p><div class="px-a11y-tools"><button type="button" data-feature="large">A+ تكبير الخط</button><button type="button" data-feature="contrast">◐ تباين عالٍ</button><button type="button" data-feature="spacing">↔ تباعد النص</button><button type="button" data-feature="motion">◼ تقليل الحركة</button><button type="button" data-feature="links">🔗 إبراز الروابط</button><button type="button" data-feature="reading">▤ دليل القراءة</button><button type="button" data-feature="reset">↺ استعادة الإعدادات</button></div><p id="px-a11y-status" role="status" aria-live="polite"></p><button type="button" id="px-a11y-close">إغلاق · Close</button></div>';
document.body.append(root);
const open=root.querySelector("#px-a11y-open"),panel=root.querySelector("#px-a11y-panel"),status=root.querySelector("#px-a11y-status");
const features=["large","contrast","spacing","motion","links","reading"];
function read(){try{return JSON.parse(localStorage.getItem("px-a11y")||"{}")}catch(e){return {}}}
let active=read();
function save(){try{localStorage.setItem("px-a11y",JSON.stringify(active))}catch(e){}}
function apply(){for(const name of features){document.documentElement.classList.toggle("px-a11y-"+name,!!active[name]);const b=root.querySelector('[data-feature="'+name+'"]');b.setAttribute("aria-pressed",String(!!active[name]));}}
function toggle(opened){panel.hidden=!opened;open.setAttribute("aria-expanded",String(opened));if(opened)root.querySelector('[data-feature="large"]').focus();else open.focus();}
open.addEventListener("click",()=>toggle(panel.hidden));
root.querySelector("#px-a11y-close").addEventListener("click",()=>toggle(false));
root.querySelector(".px-a11y-tools").addEventListener("click",e=>{const button=e.target.closest("button[data-feature]");if(!button)return;const feature=button.dataset.feature;if(feature==="reset")active={};else active[feature]=!active[feature];save();apply();status.textContent=feature==="reset"?"Settings restored.":"Accessibility preference updated.";});
root.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)toggle(false)});
const skip=document.createElement("a");skip.className="px-skip-link";skip.href="#px-main-content";skip.textContent="تخطي إلى المحتوى الرئيسي · Skip to main content";
document.body.prepend(skip);
const main=document.querySelector("main");if(main&&!main.id)main.id="px-main-content";else if(main)skip.href="#"+main.id;
const live=document.createElement("div");live.className="px-sr-only";live.id="px-site-announcements";live.setAttribute("role","status");live.setAttribute("aria-live","polite");document.body.append(live);
document.addEventListener("px-translation-status",e=>{const msg=String(e.detail||"");live.textContent=msg;});
apply();
})();