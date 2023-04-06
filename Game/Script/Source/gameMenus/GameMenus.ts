namespace DiceCup {

    let menuIds: string[] = Object.values(MenuPages);

    export function initMenu(): void {
        mainMenu();
        singleplayerMenu();
        multiplayerMenu();
        optionsMenu();
        switchMenu(MenuPages.main);
    }

    export function switchMenu(_toMenuID: MenuPages ): void {
        for (let index = 0; index < Object.values(MenuPages).length; index++) {
            document.getElementById(menuIds[index]).style.visibility = "hidden"; 
        }
        document.getElementById(_toMenuID).style.visibility = "visible"; 
    }

    export function hideMenu(): void {
        for (let index = 0; index < Object.values(MenuPages).length; index++) {
            document.getElementById(menuIds[index]).style.visibility = "hidden"; 
        }
    }
}