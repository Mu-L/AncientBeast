self.addEventListener("install",(function(e){e.waitUntil(caches.open("ancientbeast").then((function(e){return e.addAll(["/","/index.html","/index.html?homescreen=1","/?homescreen=1"])})))})),self.addEventListener("fetch",(function(e){console.log(e.request.url),e.respondWith(caches.match(e.request).then((function(n){return n||fetch(e.request)})))}));