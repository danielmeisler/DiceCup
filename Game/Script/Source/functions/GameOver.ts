namespace DiceCup {
    import ƒ = FudgeCore;

    // Resets all used variables and settings to the beginning state to start a new round
    export function gameOver(_return: MenuPage): void {
        // Resets variables
        inGame = false;
        lastPoints = [];
        roundCounter = 1;
        playerNames = [];
        gameSettings_sp = {playerName: "", bot: []};
        gameSettings_mp = {playerNames: []};
        freePlayerCategories = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        // Change viewportstate to menu again
        changeViewportState(ViewportState.menu);

        // Removes the last shown dice
        let graph: ƒ.Node = viewport.getBranch();
        let diceNode: ƒ.Node = graph.getChildrenByName("Dices")[0];
        diceNode.removeAllChildren();

        // Removes all used panels and visible phases
        while (document.getElementById("DiceCup").childNodes.length > 1) {
            document.getElementById("DiceCup").removeChild(document.getElementById("DiceCup").lastChild);
        }

        // Changes back to menu music and given menu page
        nextTrack(0);
        switchMenu(_return);
    }
    
}