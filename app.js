'use strict';
const $ = s => document.querySelector(s);
const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TYPES = {radical:'Radicals', character:'Characters', word:'Words', sentence:'Sentences'};
const FIELDS = {zh:'Chinese',pinyin:'Pinyin',en:'English'};
const DEFAULTS = {type:'radical',mode:'flash',from:'zh',to:'en',pool:'all'};
const STORE_KEY = 'chinese-study-v1:' + new URL('.',location.href).pathname;
let data={version:1,settings:{...DEFAULTS},records:{},seen:{},session:null};
let tab='study', db, storageOK=false, busy=false, search='', libraryLimit=40, offlineReady=false;
const content=window.CONTENT;
const byId=new Map(content.map(i=>[i.id,i]));
const key=(id,s=data.settings)=>id+'|'+s.from+'>'+s.to+'|'+s.mode;
const record=(id,s=data.settings)=>data.records[key(id,s)];
const needs=r=>!!r && (r.streak<3 || r.next<=Date.now());
function notify(text){$('#notice').textContent=text;$('#notice').hidden=!text;}
function normalize(s){return String(s).normalize('NFC').trim().toLocaleLowerCase().replace(/[。？！?.!,，！；;：:]/g,'').replace(/\s+/g,' ');}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function validateSettings(s){return s && Object.hasOwn(TYPES,s.type)&&['flash','quiz'].includes(s.mode)&&Object.hasOwn(FIELDS,s.from)&&Object.hasOwn(FIELDS,s.to)&&s.from!==s.to&&['all','unseen','practice'].includes(s.pool);}
function validData(d){
 if(!d||d.version!==1||!validateSettings(d.settings)||!d.records||Array.isArray(d.records)||typeof d.records!=='object'||!d.seen||Array.isArray(d.seen)||typeof d.seen!=='object')return false;
 if(Object.keys(d.records).length>100000||Object.keys(d.seen).length>100000)return false;
 for(const [k,r] of Object.entries(d.records)){
  if(!/\|(zh|pinyin|en)>(zh|pinyin|en)\|(flash|quiz)$/.test(k)||!r)return false;
  if(!['attempts','correct','streak','last','next'].every(f=>Number.isFinite(r[f])&&r[f]>=0))return false;
  if(!['attempts','correct','streak'].every(f=>Number.isSafeInteger(r[f]))||r.correct>r.attempts||r.streak>r.correct)return false;
 }
 return Object.values(d.seen).every(v=>Number.isFinite(v)&&v>=0);
}
function writeDB(value){return new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put(value,STORE_KEY);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
async function save(){
 if(!db){notify('Progress is not being saved. Enable website storage, then reopen the app. You can still export a backup.');return false;}
 try{await writeDB(data);storageOK=true;return true;}catch(e){storageOK=false;notify('Could not save progress on this device. Export a backup before closing the app.');return false;}
}
async function init(){
 try{
  db=await new Promise((resolve,reject)=>{const req=indexedDB.open('chinese-study',1);req.onupgradeneeded=()=>req.result.createObjectStore('state');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(new Error('blocked'));});
  const saved=await new Promise((resolve,reject)=>{const req=db.transaction('state').objectStore('state').get(STORE_KEY);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
  if(saved){if(!validData(saved))throw new Error('invalid saved data');data=saved;}
  storageOK=true;
 }catch(e){db=null;notify('Local storage is unavailable or unreadable. Progress will only last this visit; export a backup before leaving.');}
 if(data.session && (!validateSettings(data.session.settings)||!Array.isArray(data.session.queue)||!data.session.queue.length||!data.session.queue.every(id=>byId.has(id))||!Number.isInteger(data.session.index)||data.session.index<0||data.session.index>=data.session.queue.length))data.session=null;
 render();
 if('serviceWorker' in navigator && ['https:','http:'].includes(location.protocol)){
  try{await navigator.serviceWorker.register('./sw.js');await navigator.serviceWorker.ready;offlineReady=true;if(tab==='progress')render();}
  catch(e){notify('Offline installation is not ready. Stay online and reopen the app to try again.');}
 }else notify('For offline installation, open this app from GitHub Pages or localhost.');
}
function typeChips(){return '<div class="chips">'+Object.entries(TYPES).map(([k,v])=>`<button data-type="${k}" class="${data.settings.type===k?'active':''}" aria-pressed="${data.settings.type===k}">${v}</button>`).join('')+'</div>';}
function select(name,options,value){return `<select id="${name}">${Object.entries(options).map(([k,v])=>`<option value="${k}" ${k===value?'selected':''}>${v}</option>`).join('')}</select>`;}
function pool(s=data.settings){return content.filter(i=>i.type===s.type).filter(i=>s.pool==='all'||(s.pool==='unseen'?!record(i.id,s):needs(record(i.id,s))));}
function render(){
 document.querySelectorAll('[data-tab]').forEach(b=>{if(b.dataset.tab===tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 if(tab==='study')renderStudy();else if(tab==='library')renderLibrary();else renderProgress();
}
function renderStudy(){
 if(data.session){renderCard();return;}
 const s=data.settings;
 $('#app').innerHTML=`<div class="eyebrow">Make room for a little Chinese</div><h1>What will you practise?</h1><p class="sub">A few cards or a long session. Stop whenever you like.</p>${typeChips()}<div class="panel"><label>Activity${select('mode',{flash:'Flashcards',quiz:'Multiple-choice quiz'},s.mode)}</label><div class="grid field"><label>Show${select('from',FIELDS,s.from)}</label><label>Recall${select('to',Object.fromEntries(Object.entries(FIELDS).filter(([k])=>k!==s.from)),s.to)}</label></div><label class="field">Choose items${select('pool',{all:'Everything',unseen:'Not practised in this direction',practice:'Needs practice'},s.pool)}</label><p class="badge">${pool().length} items · Progress is separate for each activity and direction.</p><button id="start" class="primary wide" ${!pool().length?'disabled':''}>Start practising</button></div><p class="sub">Just want to look? Open the Library to browse all three forms together.</p>`;
 for(const name of ['mode','from','to','pool'])$('#'+name).onchange=async e=>{s[name]=e.target.value;if(s.from===s.to)s.to=Object.keys(FIELDS).find(f=>f!==s.from);await save();render();};
 $('#start').onclick=start;
}
async function start(){
 if(busy)return;busy=true;
 const s={...data.settings};let list=shuffle(pool(s));
 if(s.pool==='practice')list.sort((a,b)=>record(a.id,s).streak-record(b.id,s).streak);
 data.session={settings:s,queue:list.map(i=>i.id),index:0,total:0,correct:0,revealed:false,answered:false,options:null,picked:null};
 await save();busy=false;render();
 navigator.storage?.persist?.().catch(()=>{});
}
function current(){return byId.get(data.session.queue[data.session.index]);}
// Exclude ambiguous prompts, shared pronunciations, and overlapping English glosses.
function tokens(value,field){return field==='en'?value.split('/').map(v=>normalize(v).replace(/\([^)]*\)/g,'').replace(/^to /,'').trim()):[normalize(value)];}
function overlaps(a,b,field){return tokens(a,field).some(t=>tokens(b,field).includes(t));}
function optionsFor(item,s){
 const all=content.filter(i=>i.type===s.type);
 const equivalents=all.filter(i=>overlaps(i[s.from],item[s.from],s.from));
 const choices=[item[s.to]];
 for(const i of shuffle(all)){
  if(equivalents.some(e=>overlaps(e[s.to],i[s.to],s.to)))continue;
  if(choices.some(v=>overlaps(v,i[s.to],s.to)))continue;
  choices.push(i[s.to]);if(choices.length===4)break;
 }
 return shuffle(choices);
}
function answerHTML(i){return `<div class="answer"><div class="answer-zh" lang="zh-Hans">${esc(i.zh)}</div><p class="pinyin">${esc(i.pinyin)}</p><p class="english">${esc(i.en)}</p>${i.variant?`<p class="badge">Variant: <span lang="zh-Hans">${esc(i.variant)}</span></p>`:''}</div>`;}
function renderCard(){
 const session=data.session,s=session.settings,i=current();
 if(!session.options && s.mode==='quiz'){session.options=optionsFor(i,s);save();}
 const quiz=s.mode==='quiz', insufficient=quiz&&session.options.length<2;
 $('#app').innerHTML=`<div class="row"><span class="eyebrow">${TYPES[s.type]} · ${quiz?'Quiz':'Flashcards'}</span><button id="end" class="quiet">End session</button></div><p class="badge">${session.total} answered · ${session.correct} ${quiz?'correct':'remembered'} · ${FIELDS[s.from]} → ${FIELDS[s.to]}</p><section class="card"><div class="badge">${quiz?'Choose':'Recall'} the ${FIELDS[s.to].toLowerCase()}</div><div class="prompt ${s.from==='zh'?'chinese':''} ${i.type==='sentence'?'sentence':''}" ${s.from==='zh'?'lang="zh-Hans"':''}>${esc(i[s.from])}</div>${quiz&&!insufficient?`<div class="options">${session.options.map((v,n)=>`<button data-option="${n}" ${s.to==='zh'?'lang="zh-Hans"':''} ${session.answered?'disabled':''} class="${session.answered?(v===i[s.to]?'correct':n===session.picked?'wrong':''):''}">${esc(v)}</button>`).join('')}</div>`:''}${insufficient?'<p>Not enough distinct answers for a fair quiz. Use this as a flashcard.</p>':''}${session.answered?`<div class="feedback" role="status">${session.lastCorrect?'Got it.':'Keep practising — you’ll see this again.'}</div>`:''}${session.revealed||session.answered?answerHTML(i):''}</section>${!quiz||insufficient?(!session.revealed?'<button id="reveal" class="primary wide">Show answer</button>':!session.answered?'<div class="grid"><button id="miss">Missed it</button><button id="got" class="primary">Got it</button></div>':''):''}${session.answered?'<button id="next" class="primary wide">Next card</button>':''}`;
 $('#end').onclick=end;
 if($('#reveal'))$('#reveal').onclick=async()=>{session.revealed=true;data.seen[i.id]=Date.now();await save();render();};
 if($('#got')){$('#got').onclick=()=>grade(true);$('#miss').onclick=()=>grade(false);}
 document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>grade(session.options[Number(b.dataset.option)]===i[s.to],Number(b.dataset.option)));
 if($('#next'))$('#next').onclick=next;
}
async function grade(correct,picked=null){
 const session=data.session;if(busy||session.answered)return;busy=true;
 const i=current(), now=Date.now(),k=key(i.id,session.settings);
 const r=data.records[k]||{attempts:0,correct:0,streak:0,last:0,next:0};
 r.attempts++;r.correct+=Number(correct);r.streak=correct?r.streak+1:0;r.last=now;r.next=now+(correct?Math.min(90,Math.pow(2,Math.min(r.streak-1,7)))*86400000:0);
 data.records[k]=r;data.seen[i.id]=now;session.answered=true;session.revealed=true;session.picked=picked;session.lastCorrect=correct;session.total++;session.correct+=Number(correct);
 await save();busy=false;render();
}
async function next(){
 if(busy||!data.session?.answered)return;busy=true;
 const s=data.session;const previous=current().id;s.index++;
 if(s.index>=s.queue.length){
  // Continue with the selected pool, or finish naturally when it has been learned.
  s.queue=shuffle(pool(s.settings)).map(i=>i.id);s.index=0;
  if(s.queue.length>1&&s.queue[0]===previous)s.queue.push(s.queue.shift());
  if(!s.queue.length){busy=false;await end();return;}
 }
 s.answered=false;s.revealed=false;s.options=null;s.picked=null;await save();busy=false;render();window.scrollTo(0,0);
}
async function end(){
 if(busy)return;busy=true;const s=data.session;data.session=null;await save();busy=false;
 $('#app').innerHTML=`<div class="eyebrow">Session complete</div><h1>A little more familiar.</h1><div class="stats"><div><strong>${s.total}</strong><span>answered</span></div><div><strong>${s.correct}</strong><span>${s.settings.mode==='quiz'?'correct':'remembered'}</span></div><div><strong>${s.total-s.correct}</strong><span>missed</span></div></div><p class="sub">${storageOK?'Your progress is saved on this device.':'Progress could not be saved. Export a backup from Progress.'}</p><button id="again" class="primary wide">Choose your next practice</button>`;
 $('#again').onclick=render;
}
function status(i){const r=record(i.id);return !r?'Not practised':needs(r)?'Needs practice':'Familiar';}
function renderLibrary(){
 $('#app').innerHTML=`<div class="eyebrow">Your collection</div><h1>Look. Explore. Remember.</h1>${typeChips()}<label>Search Chinese, pinyin, or English<input id="search" type="search" placeholder="Try 水, shuǐ, or water" value="${esc(search)}" autocomplete="off"></label><p class="badge">Status reflects ${FIELDS[data.settings.from]} → ${FIELDS[data.settings.to]}, ${data.settings.mode==='flash'?'flashcards':'quiz'}. Change this in Study.</p><div id="entries"></div>`;
 $('#search').oninput=e=>{search=e.target.value;libraryLimit=40;renderEntries();};renderEntries();
}
function renderEntries(){
 const q=normalize(search),list=content.filter(i=>i.type===data.settings.type&&normalize(i.zh+' '+i.pinyin+' '+i.en+' '+i.tag).includes(q));
 $('#entries').innerHTML=`<p class="badge">${list.length} items</p>`+list.slice(0,libraryLimit).map(i=>`<article class="entry"><div class="row"><span class="answer-zh" lang="zh-Hans">${esc(i.zh)}</span><span class="badge">${status(i)}</span></div><p class="pinyin">${esc(i.pinyin)}</p><p>${esc(i.en)}</p>${i.variant?`<p class="badge">Variant: ${esc(i.variant)}</p>`:''}<button data-seen="${esc(i.id)}" class="quiet" ${data.seen[i.id]?'disabled':''}>${data.seen[i.id]?'Seen':'Mark as seen'}</button></article>`).join('')+(!list.length?'<p class="empty">No matching items.</p>':'')+(list.length>libraryLimit?'<button id="more" class="wide">Show more</button>':'');
 document.querySelectorAll('[data-seen]').forEach(b=>b.onclick=async()=>{data.seen[b.dataset.seen]=Date.now();await save();renderEntries();});
 if($('#more'))$('#more').onclick=()=>{libraryLimit+=40;renderEntries();};
}
function renderProgress(){
 const known=content.filter(i=>{const r=record(i.id);return r&&!needs(r);}).length;
 const attempted=content.filter(i=>record(i.id)).length;
 const total=Object.values(data.records).reduce((n,r)=>n+r.attempts,0);
 $('#app').innerHTML=`<div class="eyebrow">Your progress</div><h1>Built one recall at a time.</h1><p class="sub">No streak to maintain. Come back whenever you like.</p><div class="panel"><h2>${FIELDS[data.settings.from]} → ${FIELDS[data.settings.to]} · ${data.settings.mode==='flash'?'Flashcards':'Quiz'}</h2><div class="stats"><div><strong>${content.length-attempted}</strong><span>not practised</span></div><div><strong>${attempted-known}</strong><span>need practice</span></div><div><strong>${known}</strong><span>familiar</span></div></div><p class="badge">Across all four levels. Familiar means at least three consecutive successes, with the next review still in the future. Results are separate for each direction and activity.</p><p>${total} answers overall · ${Object.keys(data.seen).filter(id=>byId.has(id)).length} items seen</p></div><div class="panel"><h2>Saved on this device</h2><p>${storageOK?'Local saving is working.':'Local saving is unavailable. Export before closing.'} ${offlineReady?'Offline files are ready.':'Offline files are not ready yet.'}</p><p class="badge">Use the Home Screen app consistently. Clearing website data or moving to another phone can remove your progress. Keep a backup in Files or iCloud Drive.</p><button id="export" class="wide">Export backup</button><label class="field">Restore backup (replaces current progress)<input id="restore" type="file" accept="application/json,.json"></label><p id="backup-status" role="status" class="badge"></p></div><div class="panel"><h2>Install on iPhone</h2><p>Open the published site in Safari, tap Share, then Add to Home Screen. Open that icon online once, and check that “Offline files are ready” appears here before going offline.</p><p class="badge">App updates become available online. Close all app windows and reopen to use an installed update. Progress stays on this device.</p></div>`;
 $('#export').onclick=()=>{const blob=new Blob([JSON.stringify({...data,session:null,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='chinese-study-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);$('#backup-status').textContent='Backup download requested. Save the file to Files or iCloud Drive.';};
 $('#restore').onchange=restore;
}
async function restore(e){
 const file=e.target.files[0];if(!file)return;
 try{
  if(file.size>10000000)throw new Error('Backup is too large.');
  const imported=JSON.parse(await file.text());if(!validData(imported))throw new Error('This is not a valid Chinese Study backup.');
  if(!confirm('Replace your current progress and settings with this backup?')){e.target.value='';return;}
  const replacement={version:1,settings:{...imported.settings},records:imported.records,seen:imported.seen,session:null};
  if(!db)throw new Error('Device storage is unavailable. Your current progress has not been changed.');
  await writeDB(replacement);data=replacement;storageOK=true;render();$('#backup-status').textContent='Backup restored successfully.';
 }catch(error){$('#backup-status').textContent=error.message||'Restore failed. Your current progress has not been changed.';e.target.value='';}
}
$('#menu').onclick=()=>{tab='progress';render();window.scrollTo(0,0);};
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render();window.scrollTo(0,0);});
$('#app').addEventListener('click',async e=>{const b=e.target.closest('[data-type]');if(!b)return;data.settings.type=b.dataset.type;libraryLimit=40;await save();render();});
init();
