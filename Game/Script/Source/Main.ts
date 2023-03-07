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
      game();
    });

  }

  function game(): void {
    dices = [];

    if (!document.getElementById("rollingDiv")) {
      let gameDiv: HTMLDivElement = document.createElement("div");
      gameDiv.id = "rollingDiv";
      document.getElementById("game").appendChild(gameDiv);
  
      for (let i: number = 0; i < 6; i++) {
        dices.push(new Dice(i));
        dices.push(new Dice(i));
      }
  
      for (let i: number = 0; i < 12; i++) {
        let diceDiv: HTMLDivElement = document.createElement("div");
        diceDiv.classList.add("diceDiv");
        diceDiv.id = "diceContainer" + i;
        diceDiv.innerHTML = dices[i].value.toString();
        diceDiv.style.background = DiceColor[dices[i].color].toString();
        document.getElementById("rollingDiv").appendChild(diceDiv);
      }
  
      console.log("Augen auf ...");
      ƒ.Time.game.setTimer(3000, 1, gameValidate);
    }

  }

  function gameValidate(): void {
    document.getElementById("rollingDiv").remove();

    console.log("Becher drauf!");

    for (let i: number = 0; i < 12; i++) {
      let valuationDiv: HTMLButtonElement = <HTMLButtonElement>document.getElementById("valuation" + i);
      valuationDiv.addEventListener("click", () => { console.clear(), new Valuation(i, dices), new Bot(BotDifficulty.easy, dices), game(), valuationDiv.disabled = true, valuationDiv.style.backgroundColor = "black", valuationDiv.style.color = "gray"});
    }

  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}