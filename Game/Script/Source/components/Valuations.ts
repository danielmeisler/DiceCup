namespace DiceCup {
    import ƒ = FudgeCore;
    
    export function validateRound(): void {
        ƒ.Time.game.setTimer(2000, 1, () => { changeGameState(GameState.summary) });
    }

}