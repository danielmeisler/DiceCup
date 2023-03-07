namespace DiceCup {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Dice Cup is running!");

  let viewport: ƒ.Viewport;
  window.addEventListener("load", start);

  //document.addEventListener("interactiveViewportStarted", <EventListener>start);
  // function start(_event: CustomEvent): void {
  let dices: Dice[] = [];
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
      game();
    });

  }


  function game(): void {
    console.clear();
    dices = [];

    if (document.getElementById("gameDiv2")) {
      document.getElementById("gameDiv2").style.visibility = "hidden";
    }

    if (!document.getElementById("gameDiv1")) {
      let gameDiv: HTMLDivElement = document.createElement("div");
      gameDiv.id = "gameDiv1";
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
        document.getElementById("gameDiv1").appendChild(diceDiv);
      }
  
      console.log("Augen auf ...");
      ƒ.Time.game.setTimer(3000, 1, gameValidate);
    }

  }

  function gameValidate(): void {
    document.getElementById("gameDiv1").remove();
    console.log("Becher drauf!");

    if (document.getElementById("gameDiv2")) {
      document.getElementById("gameDiv2").style.visibility = "visible";

    for (let i: number = 0; i < 12; i++) {
      let valuationDiv: HTMLButtonElement = <HTMLButtonElement>document.getElementById("valuationContainer" + i);
      valuationDiv.addEventListener("click", () => { new Valuation(i, dices), game(), console.log("Total: " + highscore), valuationDiv.disabled = true, valuationDiv.style.backgroundColor = "black", valuationDiv.style.color = "gray"});
    }

    } else {
      let gameDiv2: HTMLDivElement = document.createElement("div");
      gameDiv2.id = "gameDiv2";
      document.getElementById("game").appendChild(gameDiv2);

      for (let i: number = 0; i < 12; i++) {
        let valuationDiv: HTMLButtonElement = document.createElement("button");
        valuationDiv.classList.add("valuationDiv");
        valuationDiv.id = "valuationContainer" + i;
        valuationDiv.innerHTML = ScoringCategory[i];
        document.getElementById("gameDiv2").appendChild(valuationDiv);
        valuationDiv.addEventListener("click", () => { new Valuation(i, dices), game(), console.log("Total: " + highscore), valuationDiv.disabled = true, valuationDiv.style.backgroundColor = "black", valuationDiv.style.color = "gray"});
      }

    }



  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}