namespace DiceCup {

    export function multiplayerGameOptions(): void {
        new SubMenu(MenuPage.multiplayerGameOptions, "multiplayerGameOptions", language.menu.gamesettings.title);

        document.getElementById("multiplayerGameOptionsMenuReturnButton_id").addEventListener("click", () => {
            playSFX(buttonClick);
            switchMenu(MenuPage.multiplayerLobby);
        });
    }

}