const staticDiceCup = "dev-dice-cup-v1"
const assets = [
  "/",
  "DiceCup.html",
  "DiceCup.css",
  "Script/Build/Script.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDiceCup).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })