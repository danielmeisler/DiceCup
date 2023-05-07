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
        // let response: Response = await fetch("Game/Script/Data/diceColors.json");
        // let diceColors: RgbaDao[] = await response.json();
        
        viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 8, -4);
        viewport.camera.mtxPivot.rotation = new ƒ.Vector3(60, 0, 0);

        // for (let i = 0, color = 0; i < 12; i++, color+=0.5) {
        //     dices.push(new Dice("Dice_" + i, diceColors[Math.floor(color)], Math.floor(color)));
        // }

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 60);
    }

    function createBots(_bots: BotDao[]): Bot[] {
        bots = [];
        for (let index = 0; index < _bots.length; index++) {
            bots[index] = new Bot(_bots[index].botName, _bots[index].difficulty, dices);
        }
        return bots;
    }

    export async function round(): Promise<void> {
        console.clear();
        let response: Response = await fetch("Game/Script/Data/diceColors.json");
        let diceColors: RgbaDao[] = await response.json();
        
        if (firstRound == true) {
            createBots(gameSettings.bot);
            firstRound = false;
        }
            dices = [];

            for (let i = 0, color = 0; i < 12; i++, color+=0.5) {
                dices.push(new Dice("Dice_" + i, diceColors[Math.floor(color)], Math.floor(color)));
            }

            for (let index = 0; index < bots.length; index++) {
                bots[index].botsTurn();
            }

            new TimerBar("hudTimer_id", roundTimer);
            ƒ.Time.game.setTimer(roundTimer * 1000, 1, () => { changeGameState(GameState.choosing)});
    }

    function update(_event: Event): void {
        ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
}