namespace DiceCup {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Dice Cup is running!");
  
  export let viewport: ƒ.Viewport;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("../../serviceWorker.js")
    }
    viewport = _event.detail;

    let diceCup: HTMLDivElement = document.createElement("div");
    diceCup.id = "DiceCup";
    document.querySelector("body").appendChild(diceCup);

    initMenu();
  }

}