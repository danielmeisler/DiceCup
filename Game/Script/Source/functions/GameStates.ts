namespace DiceCup{

    export async function changeGameState(_gameState: GameState) {
        switch (_gameState) {
            case GameState.menu: 
                switchMenu(MenuPage.main);
                changeViewportState(ViewportState.menu);
            break;
            case GameState.init: 
                initHud();
                initCategories();
                initSummary();
                initPlacements();
                changeGameState(GameState.ready);
            break;
            case GameState.ready: 
                await rollDices();
                startTransition();
                changeViewportState(ViewportState.transition);
            break;
            case GameState.counting: 
                round();
                changeViewportState(ViewportState.game);
            break;
            case GameState.choosing: 
                showCategories();
            break;
            case GameState.validating: 
                // validateRound();
            break;
            case GameState.summary: 
                showSummary();
            break;
            case GameState.placement: 
                updatePlacements()
                showPlacements();
            break;
        }
        resetTimer();
    }

}