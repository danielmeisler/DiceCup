namespace DiceCup {
    import ƒ = FudgeCore;

    export let gameSettings: SinglePlayerSettingsDao;
    let bots: Bot[] = [];

    export function changeGameState(_gameState: GameState) {
        switch (_gameState) {
            case GameState.menu: 
                switchMenu(MenuPages.main);
            break;
            case GameState.init: 
                initHud();
                initCategories();
                initSummary();
                initViewport();
                initTransition();
                initPlacements();
            break;
            case GameState.ready: 
                initTransition();
            break;
            case GameState.counting: 
                initGame();
            break;
            case GameState.choosing: 
                showCategories();
            break;
            case GameState.validating: 
                // validateRound();
            break;
            case GameState.summary: 
                showSummary();
            break;
            case GameState.placement: 
                showPlacements();
            break;
        }
    }

    export async function initViewport() {
        viewport.camera.mtxPivot.translateZ(10);
        viewport.camera.mtxPivot.rotateY(180);
        viewport.camera.mtxPivot.translateX(1);
        viewport.camera.mtxPivot.translateY(1);
        let graph: ƒ.Node = viewport.getBranch();
    
        let dice: ƒ.Node = graph.getChildrenByName("Dice")[0];
        console.log(dice.mtxLocal.translation);
    }

    function createBots(_bots: BotDao[]): Bot[] {
        for (let index = 0; index < _bots.length; index++) {
            bots[index] = new Bot(_bots[index].botName, _bots[index].difficulty, dices);
        }
        return bots;
    }

    export function initGame(): void {
        console.clear();
        if (firstRound == true) {
            createBots(gameSettings.bot);
            console.log("true");
            let gameDiv: HTMLDivElement = document.createElement("div");
            gameDiv.id = "rollingDiv_id";
            document.getElementById("game").appendChild(gameDiv);
            firstRound = false;
        } else {
            console.log("false");
            for (let i: number = 0; i < 12; i++) {
                document.getElementById("diceContainer_id_" + i).remove();
            }
        }
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
            // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
            // initCategories();
            dices = [];
        
            for (let i: number = 0; i < 6; i++) {
                dices.push(new Dice(i));
                dices.push(new Dice(i));
            }
        
            for (let i: number = 0; i < 12; i++) {
                let diceDiv: HTMLDivElement = document.createElement("div");
                diceDiv.classList.add("diceDiv");
                diceDiv.id = "diceContainer_id_" + i;
                diceDiv.classList.add("diceCategory_" + DiceColor[dices[i].color]);
                diceDiv.innerHTML = dices[i].value.toString();
                diceDiv.style.background = DiceColor[dices[i].color].toString();
                document.getElementById("rollingDiv_id").appendChild(diceDiv);
                // document.getElementById("valuation_id_" + i).classList.add("valuationShow");
            }

            for (let index = 0; index < bots.length; index++) {
                bots[index].chooseDifficulty();
            }

        
            console.log("Augen auf ...");
            ƒ.Time.game.setTimer(3000, 1, () => { changeGameState(GameState.choosing)});
    }

    export function rollDices(): void {
        dices = [];
        for (let i: number = 0; i < 6; i++) {
            dices.push(new Dice(i));
            dices.push(new Dice(i));
        }
        for (let i: number = 0; i < 12; i++) {
            document.getElementById("diceContainer_id_" + i).remove();
            let diceDiv: HTMLDivElement = document.createElement("div");
            diceDiv.classList.add("diceDiv");
            diceDiv.classList.add("diceCategory_" + DiceColor[dices[i].color]);
            diceDiv.id = "diceContainer_id_" + i;
            diceDiv.innerHTML = dices[i].value.toString();
            diceDiv.style.background = DiceColor[dices[i].color].toString();
            document.getElementById("rollingDiv_id").appendChild(diceDiv);
        }
        console.log("Augen auf ...");
        ƒ.Time.game.setTimer(3000, 1, () => { changeGameState(GameState.choosing)});
    }

    export function gameValidate(): void {
        // for (let i: number = 0; i < 12; i++) {
        //     document.getElementById("diceContainer_id_" + i).remove();
        // }
        
    }

    export function update(_event: Event): void {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }

    
}