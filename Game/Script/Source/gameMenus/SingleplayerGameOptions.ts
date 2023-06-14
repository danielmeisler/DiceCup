namespace DiceCup {

    export function singleplayerGameOptions(): void {
        new SubMenu(MenuPage.singleplayerGameOptions, "singleplayerGameOptions", language.menu.gamesettings.title);

        document.getElementById("singleplayerGameOptionsMenuReturnButton_id").addEventListener("click", () => {
            playSFX(buttonClick);
            switchMenu(MenuPage.singleplayer);
        });
    }

}