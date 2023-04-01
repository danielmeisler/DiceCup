namespace DiceCup {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Dice Cup is running!");
  
  export let viewport: ƒ.Viewport;
  export let gameState: GameState;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  export let dices: Dice[] = [];
  export let highscore: number = 0;

  function start(_event: CustomEvent): void {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("../../serviceWorker.js")
    }
    viewport = _event.detail;
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    gameState = GameState.menu;
    changeGameState();
  }
}