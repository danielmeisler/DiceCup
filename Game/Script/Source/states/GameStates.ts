namespace DiceCup {

    // Switches between all game state phases in its order and resets the wakelock timer every call.
    export async function changeGameState(_gameState: GameState): Promise<void> {
        switch (_gameState) {
            case GameState.menu: 
                switchMenu(MenuPage.main);
                backgroundMusic(true);
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
                await rollDices();
            break;
            case GameState.counting: 
                changeViewportState(ViewportState.game);
                round();
            break;
            case GameState.choosing: 
                showCategories();
            break;
            case GameState.validating: 
                validateRound();
            break;
            case GameState.summary: 
                showSummary();
            break;
            case GameState.placement: 
                updatePlacements()
                showPlacements();
            break;
        }
        resetWakeLock();  
    }

}