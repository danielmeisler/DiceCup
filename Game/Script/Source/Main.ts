namespace DiceCup {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Dice Cup is running!");
  
  let viewport: ƒ.Viewport;

  window.addEventListener("load", start);

  //document.addEventListener("interactiveViewportStarted", <EventListener>start);
  // function start(_event: CustomEvent): void {
  export let dices: Dice[] = [];
  export let highscore: number = 0;

  function start(_event: Event): void {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("../../serviceWorker.js")
    }

    //viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    document.getElementById("play").addEventListener("click", () => {
      document.getElementById("mainMenu").style.display = "none"; 
      //document.getElementById("game").style.display = "none"; 
      Hud.initHud();
      initGame();
    });
  }


  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}