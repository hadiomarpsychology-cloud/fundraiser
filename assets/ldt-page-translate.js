/* LDT: optional private, on-device translation for complete visible page text. */
(function(){
"use strict";
const supported=new Set("ar bg bn cs da de el en es fi fr he hi hr hu id it ja kn ko lt mr nl no pl pt ro ru sk sl sv ta te th tr uk vi zh zh-Hant".split(" "));
const originalText=new WeakMap(),tracked=new Set(),originalAttrs=new Map();
let requestId=0, observer=null, activeTarget=null, sessions=null, translating=false;
const ignore="script,style,noscript,svg,canvas,code,[contenteditable],.ldt-global,[data-ldt-no-translate],iframe";
function normal(code){if(code==="en-GB")return "en";if(code==="zh-CN")return "zh";if(code==="zh-TW")return "zh-Hant";return code;}
function source(text,node){
 const owner=node.parentElement, lang=owner?.closest("[lang]")?.getAttribute("lang");
 if(lang==="en")return "en";
 if(lang==="ar"&&/[\u0600-\u06ff]/.test(text))return "ar";
 const arabic=(text.match(/[\u0600-\u06ff]/g)||[]).length;
 const latin=(text.match(/[A-Za-z]/g)||[]).length;
 return arabic>latin?"ar":"en";
}
function eligible(node){
 if(!node||node.nodeType!==3||!node.parentElement||node.parentElement.closest(ignore))return false;
 if(!node.textContent.trim()||!/\p{L}/u.test(node.textContent))return false;
 return true;
}
function collect(){
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 const nodes=[];
 while(walker.nextNode()){
  const node=walker.currentNode;
  if(!eligible(node))continue;
  if(!originalText.has(node)){originalText.set(node,node.textContent);tracked.add(node);}
  const initial=originalText.get(node);
  if(initial&&initial.trim())nodes.push({node,initial,from:source(initial,node)});
 }
 return nodes;
}
function restore(){
 if(observer)observer.disconnect();
 for(const node of tracked){if(node.isConnected&&originalText.has(node))node.textContent=originalText.get(node);}
 for(const [el,attrs] of originalAttrs){if(el.isConnected)for(const [key,value] of attrs)el.setAttribute(key,value);}
 activeTarget=null;sessions=null;
}
function chunks(str){
 const pieces=[];let pos=0;
 while(pos<str.length){
  if(str.length-pos<=1300){pieces.push(str.slice(pos));break;}
  let end=str.lastIndexOf(" ",pos+1300);
  if(end<pos+350)end=pos+1300;
  pieces.push(str.slice(pos,end));pos=end;
 }
 return pieces;
}
async function translateValue(value,from,to,session){
 if(from===to||!session)return value;
 const parts=chunks(value),done=[];
 for(const part of parts)done.push(await session.translate(part));
 return done.join("");
}
function status(message){document.dispatchEvent(new CustomEvent("ldt-translation-status",{detail:message}));}
async function start(code){
 const token=++requestId,target=normal(code);
 restore();
 if(!supported.has(target)){status("No complete translation is available for this language on this browser. Original content is preserved.");return false;}
 if(!("Translator" in window)){status("Your browser does not support on-device page translation. The original content remains available.");return false;}
 const jobs={};
 try {
  // Only request language models actually required by this page.
  const all=collect();
  const sources=[...new Set(all.map(x=>x.from).filter(from=>from!==target))];
  // Begin creation synchronously within the language-button click gesture.
  for(const from of sources){
   jobs[from]=window.Translator.create({sourceLanguage:from,targetLanguage:target,monitor(m){m.addEventListener("downloadprogress",e=>{if(token===requestId)status("Preparing translation on your device… "+Math.round((e.loaded||0)*100)+"%");});}});
  }
  sessions={};
  for(const from of Object.keys(jobs))sessions[from]=await jobs[from];
  if(token!==requestId)return false;
  activeTarget=target;
  status("Translating the whole page on your device…");
  translating=true;
  let completed=0,failed=0;const queue=all.slice();
  async function worker(){
   while(queue.length&&token===requestId){
    const item=queue.shift();
    try{
     const translated=await translateValue(item.initial,item.from,target,sessions[item.from]);
     if(token!==requestId)return;
     if(item.node.isConnected){item.node.textContent=translated;completed++;}
    }catch(e){failed++;}
   }
  }
  await Promise.all(Array.from({length:3},worker));
  // Include accessible labels, headings in the browser title, image alt text and placeholders.
  const attributes=[];
  for(const el of document.querySelectorAll("[title],[alt],[placeholder],[aria-label]")){
   if(el.closest(ignore)||el.matches("input[type=password],input[type=hidden]"))continue;
   if(!originalAttrs.has(el))originalAttrs.set(el,new Map());
   const saved=originalAttrs.get(el);
   for(const name of ["title","alt","placeholder","aria-label"]){
    if(!el.hasAttribute(name))continue;
    if(!saved.has(name))saved.set(name,el.getAttribute(name));
    const value=saved.get(name);
    if(value&&/[A-Za-z\u0600-\u06ff]/.test(value))attributes.push({el,name,value,from:source(value,{parentElement:el})});
   }
  }
  for(const item of attributes){
   try{
    const text=await translateValue(item.value,item.from,target,sessions[item.from]);
    if(token!==requestId)return false;
    if(item.el.isConnected)item.el.setAttribute(item.name,text);
   }catch(e){failed++;}
  }

  translating=false;
  if(token!==requestId)return false;
  if(failed)status("Translated "+completed+" text sections. "+failed+" sections remain in the original language.");
  else status("Page text translated locally. Original documents are unchanged. Automatic translation may contain errors.");
  // Mutation observer handles new dynamic page text without changing user inputs.
  observer=new MutationObserver(records=>{
   if(!activeTarget||translating||token!==requestId)return;
   if(records.some(r=>r.addedNodes.length))setTimeout(()=>{
    if(token!==requestId||translating)return;
    const added=collect().filter(x=>x.node.textContent===x.initial&&x.from!==target);
    if(!added.length)return;
    translating=true;
    (async()=>{for(const item of added){try{const text=await translateValue(item.initial,item.from,target,sessions[item.from]);if(token!==requestId)return;if(item.node.isConnected)item.node.textContent=text;}catch(e){}}translating=false;})();
   },250);
  });
  observer.observe(document.body,{childList:true,subtree:true});
  return true;
 }catch(e){
  if(token===requestId){restore();status("This language pair is not available for complete on-device translation. Original content is preserved.");}
  return false;
 }
}
window.LDTFullTranslate=start;
window.LDTRestoreText=function(){requestId++;restore();status("Original content restored.");};
})();