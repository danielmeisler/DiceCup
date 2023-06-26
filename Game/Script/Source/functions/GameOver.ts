namespace DiceCup {
    import ƒ = FudgeCore;

    export function gameOver(_return: MenuPage): void {
        inGame = false;
        lastPoints = [];
        firstRound = true;
        roundCounter = 1;
        playerNames = [];
        gameSettings_sp = {playerName: "", bot: []};
        gameSettings_mp = {playerNames: []};
        freePlayerCategories = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        changeViewportState(ViewportState.menu);

        let graph: ƒ.Node = viewport.getBranch();
        let diceNode: ƒ.Node = graph.getChildrenByName("Dices")[0];
        diceNode.removeAllChildren();

        while (document.getElementById("DiceCup").childNodes.length > 1) {
            document.getElementById("DiceCup").removeChild(document.getElementById("DiceCup").lastChild);
        }

        nextTrack(0);
        switchMenu(_return);
    }
    
}