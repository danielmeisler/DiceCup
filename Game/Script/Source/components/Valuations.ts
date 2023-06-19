namespace DiceCup {
    import ƒ = FudgeCore;
    
    export function validateRound(): void {
        playSFX("Audio|2023-05-16T09:50:26.609Z|95993");
        nextTrack(1);
        console.log("HIER BIN ICH");
        roundCounter++;

        if (playerMode == PlayerMode.multiplayer) {
            if (document.getElementById("waitAlert_id")) {
                document.getElementById("waitAlert_id").remove();
            }
        }        
        
        console.log(roundCounter + "/" + maxRounds);
        if (roundCounter <= maxRounds) {
            console.log("Next round");
            ƒ.Time.game.setTimer(2000, 1, () => { changeGameState(GameState.summary) });
        } else {
            console.log("Placements");
            ƒ.Time.game.setTimer(2000, 1, () => { changeGameState(GameState.placement) });
        }


    }

    export function waitForPlayerValidation(): void {
        if (playerMode == PlayerMode.multiplayer) {
            let waitAlert: HTMLSpanElement = document.createElement("span");
            waitAlert.id = "waitAlert_id";
            waitAlert.innerHTML = language.game.validation.wait_for_validation;
            document.getElementById("hud_id").appendChild(waitAlert);
        }
    }

}