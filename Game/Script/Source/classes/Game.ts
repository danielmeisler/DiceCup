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

    export function initGame(): void {
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        // initCategories();
        // dices = [];

        // let gameDiv: HTMLDivElement = document.createElement("div");
        // gameDiv.id = "rollingDiv_id";
        // document.getElementById("game").appendChild(gameDiv);
    
        // for (let i: number = 0; i < 6; i++) {
        //     dices.push(new Dice(i));
        //     dices.push(new Dice(i));
        // }
    
        // for (let i: number = 0; i < 12; i++) {
        //     let diceDiv: HTMLDivElement = document.createElement("div");
        //     diceDiv.classList.add("diceDiv");
        //     diceDiv.id = "diceContainer_id_" + i;
        //     diceDiv.innerHTML = dices[i].value.toString();
        //     diceDiv.style.background = DiceColor[dices[i].color].toString();
        //     document.getElementById("rollingDiv_id").appendChild(diceDiv);
        //     // document.getElementById("valuation_id_" + i).classList.add("valuationShow");
        // }
    
        // console.log("Augen auf ...");
        // ƒ.Time.game.setTimer(3000, 1, () => { gameValidate()  });

    }

    export function rollDices(): void {
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

    export function gameValidate(): void {
        console.log("Becher drauf!");
        showCategories();
        for (let i: number = 0; i < 12; i++) {
            document.getElementById("diceContainer_id_" + i).remove();
        }
        // for (let i: number = 0; i < 12; i++) {
        //     let valuationDiv: HTMLButtonElement = <HTMLButtonElement>document.getElementById("valuation_id_" + i);
        //     valuationDiv.setAttribute("index", i.toString());
        //     valuationDiv.classList.add("valuationShow");
        // }
        
    }

    export function update(_event: Event): void {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }

    export function changeGameState() {
        switch (gameState) {
            case GameState.menu: 
                gameMenu();
            break;
            case GameState.ready: 
                initTransition();
            break;
            case GameState.counting: 

            break;
            case GameState.choosing: 

            break;
            case GameState.validating: 

            break;
            case GameState.summary: 
            
            break;
        }
    }
}