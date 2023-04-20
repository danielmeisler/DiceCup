namespace DiceCup {
    import ƒ = FudgeCore;

    export let dices: Dice[] = [];
    export let firstRound: boolean = true;
    export let highscore: number = 0;
    export let roundTimer: number = 3;
    export let roundCounter: number = 1;
    export let maxRounds: number = 12;
    export let gameSettings: SinglePlayerSettingsDao;
    let bots: Bot[] = [];

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
        bots = [];
        for (let index = 0; index < _bots.length; index++) {
            bots[index] = new Bot(_bots[index].botName, _bots[index].difficulty, dices);
        }
        return bots;
    }

    export function round(): void {
        console.clear();
        if (firstRound == true) {
            createBots(gameSettings.bot);
            let gameDiv: HTMLDivElement = document.createElement("div");
            gameDiv.id = "rollingDiv_id";
            document.getElementById("game").appendChild(gameDiv);
            firstRound = false;
        } else {
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
            new TimerBar("hudTimer_id", roundTimer);
            ƒ.Time.game.setTimer(roundTimer * 1000, 1, () => { changeGameState(GameState.choosing)});
    }

    export function update(_event: Event): void {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }


}