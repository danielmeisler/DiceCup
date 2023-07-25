namespace DiceCup {

    // -- Variable declaration --

    // Gets all Menu Page Ids from the enum
    let menuIds: string[] = Object.values(MenuPage);

    // Initialize all menu pages in the beginning of the application
    export async function initMenu(): Promise<void> {
        mainMenu();
        singleplayerMenu();
        singleplayerGameOptions();
        multiplayerServers();
        multiplayerMenu();
        multiplayerGameOptions();
        optionsMenu();
        helpMenu();
        
        // if the app resets after the player changed some options he will be brought back to the option screen
        if (localStorage.getItem("optionsMenu")) {
            switchMenu(MenuPage.options);
            localStorage.removeItem("optionsMenu");
        } else {
            switchMenu(MenuPage.main);
        }
    }

    // Hides all menu pages except the given page and switches to another menu page
    export function switchMenu(_toMenuID: MenuPage): void {
        hideMenu();
        document.getElementById(_toMenuID).style.zIndex = "10";
        document.getElementById(_toMenuID).style.visibility = "visible"; 
    }

    // Hides all menu pages
    export function hideMenu(): void {
        for (let index = 0; index < Object.values(MenuPage).length; index++) {
            document.getElementById(menuIds[index]).style.visibility = "hidden"; 
            document.getElementById(menuIds[index]).style.zIndex = "0";
        }
    }
}