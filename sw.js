// Bump VERSION whenever any app or content file changes.
const VERSION = 'v2';
const PREFIX = 'chinese-study-' + self.registration.scope + '-';
const CACHE = PREFIX + VERSION;
const FILES = ['./','./index.html','./chinese-radicals.html','./style.css','./content.js','./app.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
 // Wait for existing windows to close before switching all assets together.
});
self.addEventListener('activate', event => {
 event.waitUntil((async()=>{
  for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);
  await self.clients.claim();
 })());
});
self.addEventListener('fetch', event => {
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const hit=await cache.match(event.request,{ignoreSearch:true});
  if(hit)return hit;
  return fetch(event.request);
 })());
});
