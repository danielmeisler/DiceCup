const staticDiceCup = "dev-dice-cup-v1"
const assets = [
  "/",
  "DiceCup.html",
  "Game/Script/Styling/DiceCup.css",
  "Game/Script/Styling/Menu.css",
  "Game/Script/Styling/Hud.css",
  "Game/Script/Styling/Game.css",
  "Game/Script/Styling/Categories.css",
  "Game/Script/Styling/Summary.css",
  "Game/Script/Styling/Transitions.css",
  "Game/Script/Styling/Placements.css"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDiceCup).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
      fetch(event.request).then(function(networkResponse) {
          return networkResponse
      })
  )
})