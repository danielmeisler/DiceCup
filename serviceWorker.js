const staticDiceCup = "dev-dice-cup-v1"
const assets = [
  "/",
  "DiceCup.html",
  "Game/Styling/DiceCup.css",
  "Game/Styling/Menu.css",
  "Game/Styling/Game.css",
  "Game/Script/Build/Script.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDiceCup).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", function (event) {
  event.respondWith(
      fetch(event.request).catch(function() {
          return caches.match(event.request)
      })
  )
})