namespace DiceCup {
    import ƒ = FudgeCore;
    
    export function validateRound(): void {
        playSFX("Audio|2023-05-16T09:50:26.609Z|95993");
        ƒ.Time.game.setTimer(2000, 1, () => { changeGameState(GameState.summary) });
    }

}