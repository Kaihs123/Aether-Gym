/* Keeps the app's own files available offline. Saved data always comes live from Supabase. */
const V="aether-gym-v18",SHELL=["./","index.html","hub.css","hub.js","theme.js","app-gym.css","app-gym.js","backend.js","install.js","config.js","site.css","manifest.webmanifest","icons/icon-192.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
});
