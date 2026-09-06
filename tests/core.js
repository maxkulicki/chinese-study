// Run with gjs tests/core.js from the project root.
const GLib = imports.gi.GLib;
function read(path){return new TextDecoder().decode(GLib.file_get_contents(path)[1]);}
function assert(ok,msg){if(!ok)throw new Error(msg);}
let source=read('content.js')+'\n'+read('app.js').split("$('#menu').onclick")[0];
source=source.replace("const $ = s => document.querySelector(s);","const $ = s => ({textContent:'',hidden:true});");
globalThis.window={};globalThis.location={href:'https://example.com/study/chinese-radicals.html'};
globalThis.URL=class {constructor(){this.pathname='/study/';}};
eval(source+`
assert(content.length>150,'content extracted');
assert(new Set(content.map(i=>i.id)).size===content.length,'unique IDs');
assert(content.every(i=>i.zh&&i.en&&i.pinyin),'all cards complete');
for(const type of Object.keys(TYPES))for(const from of Object.keys(FIELDS))for(const to of Object.keys(FIELDS)){
 if(from===to)continue;
 const s={type,from,to,mode:'quiz',pool:'all'};
 for(const item of content.filter(i=>i.type===type)){
  const choices=optionsFor(item,s);
  assert(choices.includes(item[to]),'correct option present');
  assert(choices.length>=2&&choices.length<=4,'enough options');
  assert(new Set(choices).size===choices.length,'distinct answers');
  const equivalents=content.filter(i=>i.type===type&&overlaps(i[from],item[from],from));
  assert(choices.filter(v=>equivalents.some(i=>overlaps(v,i[to],to))).length===1,'no ambiguous distractor');
 }
}
assert(validData(data),'default backup valid');
assert(!validData({...data,version:2}),'reject unknown schema');
assert(!validData({...data,settings:{...data.settings,to:'zh'}}),'reject same-field direction');
assert(!validData({...data,records:{x:{attempts:0}}}),'reject malformed records');
assert(!validData({...data,seen:[]}),'reject arrays');
const id=content[0].id;
data.records[key(id)]={attempts:3,correct:3,streak:3,last:Date.now(),next:Date.now()+86400000};
assert(!needs(record(id)),'familiar item');
assert(!record(id,{...data.settings,from:'en',to:'zh'}),'direction independent');
assert(!record(id,{...data.settings,mode:'quiz'}),'activity independent');
assert(needs({...record(id),next:0}),'old item needs practice');
assert(needs({...record(id),streak:0}),'miss needs practice');
assert(!pool({...data.settings,pool:'unseen'}).some(i=>i.id===id),'unseen excludes attempted');
assert(!pool({...data.settings,pool:'practice'}).some(i=>i.id===id),'practice excludes familiar');
print('PASS: '+content.length+' items, every quiz direction and prompt, pool logic, independent progress, backup validation.');
`);
