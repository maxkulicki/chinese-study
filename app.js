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
const SMART_SETTINGS={from:'zh',to:'en',mode:'lesson'};
const smartRecord=id=>record(id,SMART_SETTINGS)||Object.entries(data.records)
 .filter(([k])=>k.startsWith(id+'|')).map(([,r])=>r).sort((a,b)=>b.last-a.last)[0];
const smartStage=id=>{const r=smartRecord(id);return !r?'New':r.streak<3?'Learning':r.next<=Date.now()?'Review':'Familiar';};
const needs=r=>!!r && (r.streak<3 || r.next<=Date.now());
function notify(text){$('#notice').textContent=text;$('#notice').hidden=!text;}
function normalize(s){return String(s).normalize('NFC').trim().toLocaleLowerCase().replace(/[。？！?.!,，！；;：:]/g,'').replace(/\s+/g,' ');}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function validateSettings(s){return s && Object.hasOwn(TYPES,s.type)&&['flash','quiz'].includes(s.mode)&&Object.hasOwn(FIELDS,s.from)&&Object.hasOwn(FIELDS,s.to)&&s.from!==s.to&&['all','unseen','practice'].includes(s.pool);}
function validData(d){
 if(!d||d.version!==1||!validateSettings(d.settings)||!d.records||Array.isArray(d.records)||typeof d.records!=='object'||!d.seen||Array.isArray(d.seen)||typeof d.seen!=='object')return false;
 if(Object.keys(d.records).length>100000||Object.keys(d.seen).length>100000)return false;
 for(const [k,r] of Object.entries(d.records)){
  if(!/\|(zh|pinyin|en)>(zh|pinyin|en)\|(flash|quiz|lesson)$/.test(k)||!r)return false;
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
 if(data.session&&!validSession(data.session))data.session=null;
 render();
 if('serviceWorker' in navigator && ['https:','http:'].includes(location.protocol)){
  let reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloading){reloading=true;location.reload();}});
  try{await navigator.serviceWorker.register('./sw.js');await navigator.serviceWorker.ready;offlineReady=true;if(tab==='progress')render();}
  catch(e){notify('Offline installation is not ready. Stay online and reopen the app to try again.');}
 }else notify('For offline installation, open this app from GitHub Pages or localhost.');
}
function typeChips(){return '<div class="chips">'+Object.entries(TYPES).map(([k,v])=>`<button data-type="${k}" class="${data.settings.type===k?'active':''}" aria-pressed="${data.settings.type===k}">${v}</button>`).join('')+'</div>';}
function select(name,options,value){return `<select id="${name}">${Object.entries(options).map(([k,v])=>`<option value="${k}" ${k===value?'selected':''}>${v}</option>`).join('')}</select>`;}
function pool(s=data.settings){return content.filter(i=>i.type===s.type).filter(i=>s.pool==='all'||(s.pool==='unseen'?!record(i.id,s):needs(record(i.id,s))));}
function validSession(s){
 if(s.kind==='guided')return Array.isArray(s.steps)&&s.steps.length>0&&s.steps.every(step=>['intro','flash','quiz','match'].includes(step.mode)&&Array.isArray(step.ids)&&step.ids.length>0&&step.ids.every(id=>byId.has(id)))&&Number.isInteger(s.index)&&s.index>=0&&s.index<s.steps.length;
 return validateSettings(s.settings)&&Array.isArray(s.queue)&&s.queue.length>0&&s.queue.every(id=>byId.has(id))&&Number.isInteger(s.index)&&s.index>=0&&s.index<s.queue.length;
}
function smartCounts(){return Object.fromEntries(['New','Learning','Familiar','Review'].map(stage=>[stage,content.filter(i=>smartStage(i.id)===stage).length]));}
function smartLessonPlan(){
 const ranks={radical:0,character:1,word:2,sentence:3};
 const familiar=type=>content.filter(i=>i.type===type&&smartStage(i.id)==='Familiar').length;
 const maxRank=familiar('radical')<3?0:familiar('character')<5?1:familiar('word')<3?2:3;
 const introduced=content.filter(i=>smartStage(i.id)!=='New');
 const eligible=shuffle(content.filter(i=>smartStage(i.id)==='New'&&ranks[i.type]<=maxRank&&i.prerequisites.every(id=>smartStage(id)!=='New')))
  .sort((a,b)=>ranks[b.type]-ranks[a.type]||b.prerequisites.length-a.prerequisites.length);
 const newItems=eligible.slice(0,introduced.length<4?Math.max(1,4-introduced.length):1);
 const learning=content.filter(i=>smartStage(i.id)==='Learning').sort((a,b)=>(smartRecord(a.id).streak-smartRecord(b.id).streak)||(smartRecord(a.id).last-smartRecord(b.id).last));
 const review=content.filter(i=>smartStage(i.id)==='Review').sort((a,b)=>smartRecord(a.id).next-smartRecord(b.id).next);
 const familiarItems=content.filter(i=>smartStage(i.id)==='Familiar').sort((a,b)=>smartRecord(a.id).last-smartRecord(b.id).last);
 const selected=[];
 for(const item of [...newItems,...learning.slice(0,3),...review.slice(0,2),...familiarItems.slice(0,2)])if(!selected.includes(item))selected.push(item);
 for(const item of [...learning,...review,...familiarItems])if(selected.length<7&&!selected.includes(item))selected.push(item);
 const actuallyNew=selected.filter(i=>smartStage(i.id)==='New');
 const directions=[['zh','en'],['zh','pinyin'],['en','zh']];
 const steps=actuallyNew.map(i=>({mode:'intro',ids:[i.id]}));
 const matchItems=[];
 for(const item of selected)if(!matchItems.some(other=>overlaps(other.en,item.en,'en'))){matchItems.push(item);if(matchItems.length===4)break;}
 if(matchItems.length>=3)steps.push({mode:'match',ids:matchItems.map(i=>i.id),left:shuffle(matchItems.map(i=>i.id)),right:shuffle(matchItems.map(i=>i.id)),matched:[],selectedLeft:null,selectedRight:null,answered:false,feedback:''});
 selected.slice(0,Math.min(3,selected.length)).forEach((item,index)=>{const [from,to]=directions[index%directions.length];steps.push({mode:'quiz',ids:[item.id],from,to,options:optionsFor(item,{type:item.type,from,to}),answered:false,picked:null});});
 selected.slice(-Math.min(3,selected.length)).forEach((item,index)=>{const [from,to]=directions[(index+1)%directions.length];steps.push({mode:'flash',ids:[item.id],from,to,revealed:false,answered:false});});
 return {steps,newCount:actuallyNew.length,focus:actuallyNew[0]?.type||selected[0]?.type||'radical'};
}
function render(){
 document.body.classList.toggle('in-session',!!data.session);
 document.querySelectorAll('[data-tab]').forEach(b=>{if(b.dataset.tab===tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 if(tab==='study')renderStudy();else if(tab==='library')renderLibrary();else renderProgress();
}
function renderStudy(){
 if(data.session){renderCard();return;}
 const s=data.settings,c=smartCounts(),plan=smartLessonPlan();
 $('#app').innerHTML=`<div class="eyebrow">Make room for a little Chinese</div><h1>Choose how to study</h1><section class="panel smart-panel"><div class="row"><div><h2>Smart lesson</h2><p class="sub">A short mix chosen from your progress.</p></div><span class="level-badge">${TYPES[plan.focus]}</span></div><div class="lifecycle"><span><b>${c.New}</b> New</span><span><b>${c.Learning}</b> Learning</span><span><b>${c.Familiar}</b> Familiar</span><span><b>${c.Review}</b> Review</span></div><p class="badge">Flashcards, multiple choice, and matching · ${plan.newCount} new ${plan.newCount===1?'item':'items'} in this block</p><button id="smart-start" class="primary wide" ${!plan.steps.length?'disabled':''}>Start smart lesson</button></section><details class="panel"><summary>Free practice</summary><div class="details-body">${typeChips()}<label>Activity${select('mode',{flash:'Flashcards',quiz:'Multiple-choice quiz'},s.mode)}</label><div class="grid field"><label>Show${select('from',FIELDS,s.from)}</label><label>Recall${select('to',Object.fromEntries(Object.entries(FIELDS).filter(([k])=>k!==s.from)),s.to)}</label></div><label class="field">Choose items${select('pool',{all:'Everything',unseen:'Not practised in this direction',practice:'Needs practice'},s.pool)}</label><p class="badge">${pool().length} items · Progress is separate for each activity and direction.</p><button id="start" class="wide" ${!pool().length?'disabled':''}>Start free practice</button></div></details><p class="sub">Just want to look? Open the Library to browse all three forms together.</p>`;
 for(const name of ['mode','from','to','pool'])$('#'+name).onchange=async e=>{s[name]=e.target.value;if(s.from===s.to)s.to=Object.keys(FIELDS).find(f=>f!==s.from);await save();render();};
 $('#start').onclick=start;$('#smart-start').onclick=startSmart;
}
async function startSmart(){
 if(busy)return;busy=true;const plan=smartLessonPlan();
 data.session={kind:'guided',steps:plan.steps,index:0,total:0,correct:0,newCount:plan.newCount,focus:plan.focus};
 await save();busy=false;render();navigator.storage?.persist?.().catch(()=>{});
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

function smartCurrent(){return data.session.steps[data.session.index];}
function smartRecordUpdate(id,correct){
 const now=Date.now(),k=key(id,SMART_SETTINGS),r=data.records[k]||{attempts:0,correct:0,streak:0,last:0,next:0};
 r.attempts++;r.correct+=Number(correct);r.streak=correct?r.streak+1:0;r.last=now;r.next=now+(correct?Math.min(90,Math.pow(2,Math.min(r.streak-1,7)))*86400000:0);data.records[k]=r;data.seen[id]=now;
}
function renderSmartCard(){
 const session=data.session,step=smartCurrent(),item=byId.get(step.ids[0]);
 const heading=`<div class="row"><span class="eyebrow">Smart lesson · ${session.index+1} / ${session.steps.length}</span><button id="end-smart" class="quiet">End session</button></div><p class="badge">${session.total} answered · ${session.correct} remembered</p>`;
 if(step.mode==='intro'){
  const prereqs=item.prerequisites.map(id=>byId.get(id)).filter(Boolean);
  $('#app').innerHTML=heading+`<section class="card"><div class="eyebrow">New ${TYPES[item.type].slice(0,-1)}</div><div class="prompt chinese ${item.type==='sentence'?'sentence':''}" lang="zh-Hans">${esc(item.zh)}</div><p class="pinyin">${esc(item.pinyin)}</p><p class="english">${esc(item.en)}</p>${prereqs.length?`<p class="badge">Built on: ${prereqs.map(p=>`<span lang="zh-Hans">${esc(p.zh)}</span> ${esc(p.en)}`).join(' · ')}</p>`:''}</section><div class="session-actions"><button id="smart-next" class="primary wide">Continue</button></div>`;
 }else if(step.mode==='match'){
  const remainingLeft=step.left.filter(id=>!step.matched.includes(id)),remainingRight=step.right.filter(id=>!step.matched.includes(id));
  $('#app').innerHTML=heading+`<section class="card match-card"><div class="eyebrow">Match Chinese and English</div><p class="sub">Tap one card in each column.</p><div class="match-grid"><div>${remainingLeft.map(id=>`<button data-match-left="${esc(id)}" class="match-option ${step.selectedLeft===id?'selected':''}" lang="zh-Hans">${esc(byId.get(id).zh)}</button>`).join('')}</div><div>${remainingRight.map(id=>`<button data-match-right="${esc(id)}" class="match-option ${step.selectedRight===id?'selected':''}">${esc(byId.get(id).en)}</button>`).join('')}</div></div><p class="feedback" role="status">${esc(step.feedback||`${step.matched.length} of ${step.ids.length} matched`)}</p></section>${step.answered?'<div class="session-actions"><button id="smart-next" class="primary wide">Next exercise</button></div>':''}`;
 }else{
  const quiz=step.mode==='quiz';
  $('#app').innerHTML=heading+`<section class="card"><div class="badge">${quiz?'Choose':'Recall'} the ${FIELDS[step.to].toLowerCase()}</div><div class="prompt ${step.from==='zh'?'chinese':''} ${item.type==='sentence'?'sentence':''}" ${step.from==='zh'?'lang="zh-Hans"':''}>${esc(item[step.from])}</div>${quiz?`<div class="options">${step.options.map((v,n)=>`<button data-smart-option="${n}" ${step.to==='zh'?'lang="zh-Hans"':''} ${step.answered?'disabled':''} class="${step.answered?(v===item[step.to]?'correct':n===step.picked?'wrong':''):''}">${esc(v)}</button>`).join('')}</div>`:''}${step.answered?`<div class="feedback" role="status">${step.lastCorrect?'Got it.':'Keep practising — this returns in a future lesson.'}</div>`:''}${step.revealed||step.answered?answerHTML(item):''}</section>${!quiz?(!step.revealed?'<div class="session-actions"><button id="smart-reveal" class="primary wide">Show answer</button></div>':!step.answered?'<div class="session-actions grid"><button id="smart-miss">Missed it</button><button id="smart-got" class="primary">Got it</button></div>':''):''}${step.answered?'<div class="session-actions"><button id="smart-next" class="primary wide">Next exercise</button></div>':''}`;
 }
 $('#end-smart').onclick=endSmart;
 if($('#smart-next'))$('#smart-next').onclick=smartNext;
 if($('#smart-reveal'))$('#smart-reveal').onclick=async()=>{step.revealed=true;data.seen[item.id]=Date.now();await save();render();};
 if($('#smart-got')){$('#smart-got').onclick=()=>smartGrade(true);$('#smart-miss').onclick=()=>smartGrade(false);}
 document.querySelectorAll('[data-smart-option]').forEach(button=>button.onclick=()=>smartGrade(step.options[Number(button.dataset.smartOption)]===item[step.to],Number(button.dataset.smartOption)));
 document.querySelectorAll('[data-match-left]').forEach(button=>button.onclick=()=>smartMatch('left',button.dataset.matchLeft));
 document.querySelectorAll('[data-match-right]').forEach(button=>button.onclick=()=>smartMatch('right',button.dataset.matchRight));
}
async function smartGrade(correct,picked=null){
 const session=data.session,step=smartCurrent();if(busy||step.answered)return;busy=true;
 smartRecordUpdate(step.ids[0],correct);step.answered=true;step.revealed=true;step.picked=picked;step.lastCorrect=correct;session.total++;session.correct+=Number(correct);
 await save();busy=false;render();
}
async function smartMatch(side,id){
 const session=data.session,step=smartCurrent();if(busy||step.answered)return;
 step[side==='left'?'selectedLeft':'selectedRight']=id;
 if(!step.selectedLeft||!step.selectedRight){render();return;}
 busy=true;const correct=step.selectedLeft===step.selectedRight;smartRecordUpdate(step.selectedLeft,correct);session.total++;session.correct+=Number(correct);
 if(correct){step.matched.push(step.selectedLeft);step.feedback='Matched.';}else step.feedback='Not a match — try that Chinese card again.';
 step.selectedLeft=null;step.selectedRight=null;step.answered=step.matched.length===step.ids.length;await save();busy=false;render();
}
async function smartNext(){
 if(busy)return;const session=data.session,step=smartCurrent();
 if(step.mode!=='intro'&&!step.answered)return;busy=true;
 if(step.mode==='intro')data.seen[step.ids[0]]=Date.now();
 session.index++;if(session.index>=session.steps.length){busy=false;await endSmart();return;}
 await save();busy=false;render();window.scrollTo(0,0);
}
async function endSmart(){
 if(busy)return;busy=true;const session=data.session;data.session=null;await save();busy=false;document.body.classList.remove('in-session');
 $('#app').innerHTML=`<div class="eyebrow">Smart lesson complete</div><h1>A little stronger.</h1><div class="stats"><div><strong>${session.total}</strong><span>answered</span></div><div><strong>${session.correct}</strong><span>remembered</span></div><div><strong>${session.total-session.correct}</strong><span>missed</span></div></div><p class="sub">Familiar items will still return for maintenance. There is no daily backlog.</p><button id="again" class="primary wide">Back to Study</button>`;
 $('#again').onclick=render;
}

function renderCard(){
 if(data.session.kind==='guided')return renderSmartCard();
 const session=data.session,s=session.settings,i=current();
 if(!session.options && s.mode==='quiz'){session.options=optionsFor(i,s);save();}
 const quiz=s.mode==='quiz', insufficient=quiz&&session.options.length<2;
 $('#app').innerHTML=`<div class="row"><span class="eyebrow">${TYPES[s.type]} · ${quiz?'Quiz':'Flashcards'}</span><button id="end" class="quiet">End session</button></div><p class="badge">${session.total} answered · ${session.correct} ${quiz?'correct':'remembered'} · ${FIELDS[s.from]} → ${FIELDS[s.to]}</p><section class="card"><div class="badge">${quiz?'Choose':'Recall'} the ${FIELDS[s.to].toLowerCase()}</div><div class="prompt ${s.from==='zh'?'chinese':''} ${i.type==='sentence'?'sentence':''}" ${s.from==='zh'?'lang="zh-Hans"':''}>${esc(i[s.from])}</div>${quiz&&!insufficient?`<div class="options">${session.options.map((v,n)=>`<button data-option="${n}" ${s.to==='zh'?'lang="zh-Hans"':''} ${session.answered?'disabled':''} class="${session.answered?(v===i[s.to]?'correct':n===session.picked?'wrong':''):''}">${esc(v)}</button>`).join('')}</div>`:''}${insufficient?'<p>Not enough distinct answers for a fair quiz. Use this as a flashcard.</p>':''}${session.answered?`<div class="feedback" role="status">${session.lastCorrect?'Got it.':'Keep practising — you’ll see this again.'}</div>`:''}${session.revealed||session.answered?answerHTML(i):''}</section>${!quiz||insufficient?(!session.revealed?'<div class="session-actions"><button id="reveal" class="primary wide">Show answer</button></div>':!session.answered?'<div class="session-actions grid"><button id="miss">Missed it</button><button id="got" class="primary">Got it</button></div>':''):''}${session.answered?'<div class="session-actions"><button id="next" class="primary wide">Next card</button></div>':''}`;
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
 if(busy)return;busy=true;const s=data.session;data.session=null;await save();busy=false;document.body.classList.remove('in-session');
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
 $('#app').innerHTML=`<div class="eyebrow">Your progress</div><h1>Built one recall at a time.</h1><p class="sub">No streak to maintain. Come back whenever you like.</p><div class="panel"><h2>${FIELDS[data.settings.from]} → ${FIELDS[data.settings.to]} · ${data.settings.mode==='flash'?'Flashcards':'Quiz'}</h2><div class="stats"><div><strong>${content.length-attempted}</strong><span>not practised</span></div><div><strong>${attempted-known}</strong><span>need practice</span></div><div><strong>${known}</strong><span>familiar</span></div></div><p class="badge">Across all four levels. Familiar means at least three consecutive successes, with the next review still in the future. Results are separate for each direction and activity.</p><p>${total} answers overall · ${Object.keys(data.seen).filter(id=>byId.has(id)).length} items seen</p></div><div class="panel"><h2>Smart lesson lifecycle</h2><div class="lifecycle">${Object.entries(smartCounts()).map(([stage,count])=>`<span><b>${count}</b> ${stage}</span>`).join('')}</div><p class="badge">Smart lessons share progress across their three exercise forms. Familiar material is periodically mixed back in; Review means its scheduled interval has elapsed.</p></div><div class="panel"><h2>Saved on this device</h2><p>${storageOK?'Local saving is working.':'Local saving is unavailable. Export before closing.'} ${offlineReady?'Offline files are ready.':'Offline files are not ready yet.'}</p><p class="badge">Use the Home Screen app consistently. Clearing website data or moving to another phone can remove your progress. Keep a backup in Files or iCloud Drive.</p><button id="export" class="wide">Export backup</button><label class="field">Restore backup (replaces current progress)<input id="restore" type="file" accept="application/json,.json"></label><p id="backup-status" role="status" class="badge"></p></div><div class="panel"><h2>Install on iPhone</h2><p>Open the published site in Safari, tap Share, then Add to Home Screen. Open that icon online once, and check that “Offline files are ready” appears here before going offline.</p><p class="badge">App updates become available online. Close all app windows and reopen to use an installed update. Progress stays on this device.</p></div>`;
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
