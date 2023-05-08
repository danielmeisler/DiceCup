namespace DiceCup{

    export function changeGameState(_gameState: GameState) {
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
                startTransition();
                changeViewportState(ViewportState.transition);
                rollDices();
            break;
            case GameState.counting: 
                changeViewportState(ViewportState.game);
                round();
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