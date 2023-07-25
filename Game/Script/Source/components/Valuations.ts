namespace DiceCup {
    import ƒ = FudgeCore;
    
    // Validation phase shows the picked dice and adds the round.
    export function validateRound(): void {
        playSFX("Audio|2023-05-16T09:50:26.609Z|95993");
        nextTrack(1);
        roundCounter++;

        if (playerMode == PlayerMode.singlelpayer) {
            ƒ.Time.game.setTimer(2000, 1, () => { changeGameState(GameState.summary) });
        }
    }

    // Multiplayer: Waits for all players validation so everyone can go into the next round simultaneously
    // Creates the waiting alert at the top of the screen
    export function waitForPlayerValidation(): void {
        if (playerMode == PlayerMode.multiplayer) {
            let waitAlert: HTMLSpanElement = document.createElement("span");
            waitAlert.id = "waitAlert_id";
            waitAlert.innerHTML = language.game.validation.wait_for_validation;
            document.getElementById("hud_id").appendChild(waitAlert);
        }
    }

}