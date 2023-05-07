namespace DiceCup{

    export function changeGameState(_gameState: GameState) {
        switch (_gameState) {
            case GameState.menu: 
                switchMenu(MenuPage.main);
            break;
            case GameState.init: 
                initHud();
                initCategories();
                initSummary();
                initViewport();
                initPlacements();
                changeGameState(GameState.ready);
            break;
            case GameState.ready: 
                startTransition();
                rollDices();
            break;
            case GameState.counting: 
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