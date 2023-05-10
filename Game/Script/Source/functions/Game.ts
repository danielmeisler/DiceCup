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

    function createBots(_bots: BotDao[]): Bot[] {
        bots = [];
        console.log(dices);
        for (let index = 0; index < _bots.length; index++) {
            bots[index] = new Bot(_bots[index].botName, _bots[index].difficulty, dices);
        }
        return bots;
    }

    export async function rollDices(): Promise<void> {
        let response: Response = await fetch("Game/Script/Data/diceColors.json");
        let diceColors: RgbaDao[] = await response.json();
        let graph: ƒ.Node = viewport.getBranch();
        let diceNode: ƒ.Node = graph.getChildrenByName("Dices")[0];
        diceNode.removeAllChildren();

        dices = [];

        for (let i = 0, color = 0; i < 12; i++, color+=0.5) {
            dices.push(new Dice(diceColors[Math.floor(color)], Math.floor(color), 1));
        }
    }

    export async function round(): Promise<void> {
        console.clear();
        await rollDices();
        
        if (firstRound == true) {
            createBots(gameSettings.bot);
            firstRound = false;
        }

        for (let index = 0; index < bots.length; index++) {
            bots[index].botsTurn();
        }

        new TimerBar("hudTimer_id", roundTimer);
        ƒ.Time.game.setTimer(roundTimer * 1000, 1, () => { changeGameState(GameState.choosing)});
    }

    export function update(_event: Event): void {
        ƒ.Physics.simulate();  // if physics is included and used

        switch (viewportState) {
            case ViewportState.menu:
                viewport.camera.mtxPivot.lookAt(new ƒ.Vector3(0, 1, 0))
                viewport.camera.mtxPivot.translateX(0.02);
                break;
        
            default:
                break;
        }

        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
}