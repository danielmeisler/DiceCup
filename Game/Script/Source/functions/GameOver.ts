namespace DiceCup {

    export function gameOver(): void {
        lastPoints = [];
        firstRound = true;
        roundCounter = 1;
        playerNames = [];
        gameSettings = {playerName: "", bot: []};
        while (document.getElementById("DiceCup").childNodes.length > 1) {
            document.getElementById("DiceCup").removeChild(document.getElementById("DiceCup").lastChild);
        }
        while (document.getElementById("game").firstChild) {
        document.getElementById("game").removeChild(document.getElementById("game").lastChild);
        }
    }
    
}