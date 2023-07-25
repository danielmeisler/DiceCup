namespace DiceCup {
    import ƒ = FudgeCore;

    // -- Variable declaration --

    // The 12 dices that get rolled every round
    export let dices: Dice[] = [];
    // The round timer for how long you can see the dice before picking a category
    export let roundTimer: number = localStorage.getItem("roundTimer") ?  parseInt(localStorage.getItem("roundTimer")) : 3;
    // Starting round 1
    export let roundCounter: number = 1;
    // Max rounds this game
    export let maxRounds: number = 12;
    // Singleplayer gamesettings for each game (names, bots, difficulties, settings)
    export let gameSettings_sp: SinglePlayerSettingsDao;
    // Multiplayer gamesettings for each game (names, settings, host)
    export let gameSettings_mp: MultiPlayerSettingsDao;
    // Used translations of the dice for the current round to send as host to the other players
    export let usedTranslations: ƒ.Vector3[] = [];
    // Used rotations of the dice for the current round to send as host to the other players
    export let usedRotations: ƒ.Vector3[] = [];
    // Determines if it's the last category for each bot
    export let lastPickedCategory: number;
    // Bots for the current game
    let bots: Bot[] = [];

    // Creates the bots with given game settings in a singleplayer game
    function createBots(_bots: BotDao[]): Bot[] {
        bots = [];
        for (let index = 0; index < _bots.length; index++) {
            bots[index] = new Bot(_bots[index].botName, _bots[index].difficulty, dices, botMode);
        }
        return bots;
    }

    // Each bot makes their turn with picking a category
    export function botTurn(): void {
        for (let index = 0; index < bots.length; index++) {
            bots[index].botsTurn();
        }
    }

    // Loads the json with dice attributes for rolling the dice
    export async function loadDiceColors(): Promise<RgbaDao[]> {
        let response: Response = await fetch("Game/Script/Data/diceColors.json");
        let diceColors: RgbaDao[] = await response.json();
        return diceColors;
    }

    // Rolls all 12 dice if it is a singleplayer game or the host of a multiplayer game
    export async function rollDices(_message?: FudgeNet.Message): Promise<void> {
        if (playerMode == PlayerMode.singlelpayer || (playerMode == PlayerMode.multiplayer && host == true)) {
            let diceColors: RgbaDao[] = await loadDiceColors();
            let graph: ƒ.Node = viewport.getBranch();
            let diceNode: ƒ.Node = graph.getChildrenByName("Dices")[0];
            diceNode.removeAllChildren();
    
            dices = [];

            for (let i = 0, color = 0; i < dicesLength; i++, color+=0.5) {
                dices.push(new Dice(diceColors[Math.floor(color)], Math.floor(color), 1));
            }
        }
    }

    // Multiplayer player that are not the host get the dice from the server that the host sent
    export async function getRolledDices(_message: FudgeNet.Message): Promise<void> {
        let diceColors: RgbaDao[] = await loadDiceColors();
        let graph: ƒ.Node = viewport.getBranch();
        let diceNode: ƒ.Node = graph.getChildrenByName("Dices")[0];
        diceNode.removeAllChildren();

        dices = [];

        for (let i = 0, color = 0; i < dicesLength; i++, color+=0.5) {
            dices.push(new Dice(diceColors[Math.floor(color)], Math.floor(color), 3, _message.content.dice[i]));
        }
    }

    // Handles the round where you can see the dice for normally 3 seconds and visualizes the timer
    export async function round(): Promise<void> {
        console.clear();
        nextTrack(2);

        if (playerMode == PlayerMode.singlelpayer) {
            if (roundCounter == 1) {
                createBots(gameSettings_sp.bot);
            }
        }

        new TimerBar("hudTimer_id", roundTimer);
        ƒ.Time.game.setTimer(roundTimer * 1000, 1, () => { changeGameState(GameState.choosing) });
    }

    // Checks if the round is the last round to change the gamestate to placements instead the next round
    export function lastRound(): void {
        if (roundCounter <= maxRounds) {
            changeGameState(GameState.ready);
        } else {
            changeGameState(GameState.placement);
        }
    }
}