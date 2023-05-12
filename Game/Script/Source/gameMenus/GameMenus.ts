namespace DiceCup {

    let menuIds: string[] = Object.values(MenuPage);

    export function initMenu(): void {
        mainMenu();
        singleplayerMenu();
        multiplayerServers();
        multiplayerMenu();
        optionsMenu();
        helpMenu();
        
        if (localStorage.getItem("optionsMenu")) {
            switchMenu(MenuPage.options);
            localStorage.removeItem("optionsMenu");
        } else {
            switchMenu(MenuPage.main);
        }
    }

    export function switchMenu(_toMenuID: MenuPage ): void {
        hideMenu();
        document.getElementById(_toMenuID).style.zIndex = "10";
        document.getElementById(_toMenuID).style.visibility = "visible"; 
    }

    export function hideMenu(): void {
        for (let index = 0; index < Object.values(MenuPage).length; index++) {
            document.getElementById(menuIds[index]).style.visibility = "hidden"; 
            document.getElementById(menuIds[index]).style.zIndex = "0";
        }
    }
}