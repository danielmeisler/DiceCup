namespace DiceCup {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a


    let dices: Dice[] = [];

    for (let i: number = 0; i < 6; i++) {
      dices.push(new Dice(i));
      dices.push(new Dice(i));
    }

    console.log(dices);

    for (let i: number = 0; i < 12; i++) {
      new Valuation(i, dices);
    }

    
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}