namespace DiceCup {
    import ƒ = FudgeCore;

    export function gameOver(_return: MenuPage): void {
        lastPoints = [];
        firstRound = true;
        roundCounter = 1;
        playerNames = [];
        gameSettings = {playerName: "", bot: []};
        changeViewportState(ViewportState.menu);

        let graph: ƒ.Node = viewport.getBranch();
        let diceNode: ƒ.Node = graph.getChildrenByName("Dices")[0];
        diceNode.removeAllChildren();

        while (document.getElementById("DiceCup").childNodes.length > 1) {
            document.getElementById("DiceCup").removeChild(document.getElementById("DiceCup").lastChild);
        }

        switchMenu(_return);
    }
    
}