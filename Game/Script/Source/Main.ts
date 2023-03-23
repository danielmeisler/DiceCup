namespace DiceCup {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Dice Cup is running!");
  
  export let viewport: ƒ.Viewport;

  //window.addEventListener("load", start);

  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  export let dices: Dice[] = [];
  export let highscore: number = 0;

  function start(_event: CustomEvent): void {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("../../serviceWorker.js")
    }
    
    document.getElementById("play").addEventListener("click", () => {
      document.getElementById("mainMenu").style.display = "none"; 
      Hud.initHud();
      initViewport(_event);
      initGame();
    });
  }
}