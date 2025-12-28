self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open("zykon").then(c=>c.addAll([
      "./","index.html","style.css","app.js","users.js"
    ]))
  )
})

self.addEventListener("fetch",e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
})
