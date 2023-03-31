namespace DiceCup {
    import ƒ = FudgeCore;

    export async function initViewport() {
        viewport.camera.mtxPivot.translateZ(10);
        viewport.camera.mtxPivot.rotateY(180);
        viewport.camera.mtxPivot.translateX(1);
        viewport.camera.mtxPivot.translateY(1);
        let graph: ƒ.Node = viewport.getBranch();
    
        let dice: ƒ.Node = graph.getChildrenByName("Dice")[0];
        console.log(dice.mtxLocal.translation);
    }

    export let bot: Bot;
    export let bot2: Bot;

    export function initGame(): void {
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        initCategories();
        dices = [];

        let gameDiv: HTMLDivElement = document.createElement("div");
        gameDiv.id = "rollingDiv_id";
        document.getElementById("game").appendChild(gameDiv);
    
        for (let i: number = 0; i < 6; i++) {
            dices.push(new Dice(i));
            dices.push(new Dice(i));
        }
    
        for (let i: number = 0; i < 12; i++) {
            let diceDiv: HTMLDivElement = document.createElement("div");
            diceDiv.classList.add("diceDiv");
            diceDiv.id = "diceContainer_id_" + i;
            diceDiv.innerHTML = dices[i].value.toString();
            diceDiv.style.background = DiceColor[dices[i].color].toString();
            document.getElementById("rollingDiv_id").appendChild(diceDiv);
        }

        bot = new Bot("Agent", BotDifficulty.easy, dices);
        bot2 = new Bot("Spion", BotDifficulty.easy, dices);
    
        console.log("Augen auf ...");
        ƒ.Time.game.setTimer(3000, 1, () => { gameValidate()  });

    }

    function rollDices(): void {
        dices = [];
        for (let i: number = 0; i < 6; i++) {
        dices.push(new Dice(i));
        dices.push(new Dice(i));
        }
        for (let i: number = 0; i < 12; i++) {
        let diceDiv: HTMLDivElement = document.createElement("div");
        diceDiv.classList.add("diceDiv");
        diceDiv.id = "diceContainer_id_" + i;
        diceDiv.innerHTML = dices[i].value.toString();
        diceDiv.style.background = DiceColor[dices[i].color].toString();
        document.getElementById("rollingDiv_id").appendChild(diceDiv);
        }
        console.log("Augen auf ...");
        ƒ.Time.game.setTimer(3000, 1, gameValidate);
    }

    function gameValidate(): void {
        showCategories();
        for (let i: number = 0; i < 12; i++) {
            document.getElementById("diceContainer_id_" + i).remove();
            document.getElementById("valuation_id_" + i).classList.add("valuationShow");
            document.getElementById("valuation_id_" + i).addEventListener("click", handleValidate);
        }
        console.log("Becher drauf!");
        for (let i: number = 0; i < 12; i++) {
            let valuationDiv: HTMLButtonElement = <HTMLButtonElement>document.getElementById("valuation_id_" + i);
            valuationDiv.setAttribute("index", i.toString());
            valuationDiv.classList.add("valuationShow");
            valuationDiv.addEventListener("click", handleValidate);
        }
        
    }

    function handleValidate(_event: Event): void {
        showCategories();
        new Valuation(parseInt((<HTMLDivElement>_event.currentTarget).getAttribute("index")), dices);
        bot.botEasy();
        bot2.botEasy();
        this.disabled = true;
        this.style.backgroundColor = "black";
        this.style.color = "gray";
        this.classList.remove("valuationShow");
        this.classList.add("valuationHidden");
        console.log("Total: " + highscore);
        rollDices();
    }

    function update(_event: Event): void {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        //ƒ.AudioManager.default.update();
      }
}