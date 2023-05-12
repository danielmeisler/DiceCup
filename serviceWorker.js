const staticDiceCup = "dev-dice-cup-v1"
const assets = [
  "/",
  "DiceCup.html",
  "Game/Script/Styling/DiceCup.css",
  "Game/Script/Styling/ColorPalette.css",
  "Game/Script/Styling/Variables.css",

  "Game/Script/Styling/Menu/Menu.css",
  "Game/Script/Styling/Menu/SingleplayerMenu.css",
  "Game/Script/Styling/Menu/MultiplayerMenu.css",
  "Game/Script/Styling/Menu/OptionsMenu.css",
  "Game/Script/Styling/Menu/HelpMenu.css",

  "Game/Script/Styling/Components/Hud.css",
  "Game/Script/Styling/Components/Game.css",
  "Game/Script/Styling/Components/Categories.css",
  "Game/Script/Styling/Components/Summary.css",
  "Game/Script/Styling/Components/Transitions.css",
  "Game/Script/Styling/Components/Placements.css"
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