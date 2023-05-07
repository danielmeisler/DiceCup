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
        for (let index = 0; index < _bots.length; index++) {
            bots[index] = new Bot(_bots[index].botName, _bots[index].difficulty, dices);
        }
        return bots;
    }

    export async function rollDices(): Promise<void> {
        let response: Response = await fetch("Game/Script/Data/diceColors.json");
        let diceColors: RgbaDao[] = await response.json();
        dices = [];

        for (let i = 0, color = 0; i < 12; i++, color+=0.5) {
            dices.push(new Dice("Dice_" + i, diceColors[Math.floor(color)], Math.floor(color)));
        }
    }

    export function round(): void {
        console.clear();

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
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
}