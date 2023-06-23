namespace DiceCup {
    import ƒ = FudgeCore;

    export let dices: Dice[] = [];
    export let firstRound: boolean = true;
    export let highscore: number = 0;
    export let roundTimer: number = 3;
    export let roundCounter: number = 1;
    export let maxRounds: number = 12;
    export let gameSettings_sp: SinglePlayerSettingsDao;
    export let gameSettings_mp: MultiPlayerSettingsDao;
    export let usedTranslations: ƒ.Vector3[] = [];
    export let usedRotations: ƒ.Vector3[] = [];
    
    let bots: Bot[] = [];

    function createBots(_bots: BotDao[]): Bot[] {
        bots = [];
        console.log(dices);
        for (let index = 0; index < _bots.length; index++) {
            bots[index] = new Bot(_bots[index].botName, _bots[index].difficulty, dices);
        }
        return bots;
    }

    export async function loadDiceColors(): Promise<RgbaDao[]> {
        let response: Response = await fetch("Game/Script/Data/diceColors.json");
        let diceColors: RgbaDao[] = await response.json();
        return diceColors;
    }

    export async function rollDices(_message?: FudgeNet.Message): Promise<void> {
        if (playerMode == PlayerMode.singlelpayer || (playerMode == PlayerMode.multiplayer && host == true)) {
            let diceColors: RgbaDao[] = await loadDiceColors();
            let graph: ƒ.Node = viewport.getBranch();
            let diceNode: ƒ.Node = graph.getChildrenByName("Dices")[0];
            diceNode.removeAllChildren();
    
            dices = [];

            for (let i = 0, color = 0; i < 12; i++, color+=0.5) {
                dices.push(new Dice(diceColors[Math.floor(color)], Math.floor(color), 1));
            }
        }
    }

    export async function getRolledDices(_message: FudgeNet.Message): Promise<void> {
        let diceColors: RgbaDao[] = await loadDiceColors();
        let graph: ƒ.Node = viewport.getBranch();
        let diceNode: ƒ.Node = graph.getChildrenByName("Dices")[0];
        diceNode.removeAllChildren();

        dices = [];

        for (let i = 0, color = 0; i < 12; i++, color+=0.5) {
            dices.push(new Dice(diceColors[Math.floor(color)], Math.floor(color), 3, _message.content.dice[i]));
        }
    }

    export async function round(): Promise<void> {
        console.clear();
        nextTrack(2);

        if (playerMode == PlayerMode.singlelpayer) {
            if (firstRound == true) {
                createBots(gameSettings_sp.bot);
                firstRound = false;
            }
    
            for (let index = 0; index < bots.length; index++) {
                bots[index].botsTurn();
            }
        }

        new TimerBar("hudTimer_id", roundTimer);
        ƒ.Time.game.setTimer(roundTimer * 1000, 1, () => { changeGameState(GameState.choosing) });
    }

    export function lastRound(): void {
        if (roundCounter <= maxRounds) {
            changeGameState(GameState.ready);
        } else {
            changeGameState(GameState.placement);
        }
    }
}