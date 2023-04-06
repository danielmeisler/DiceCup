namespace DiceCup {

    export function multiplayerMenu(): void {
        let mpMenu: HTMLDivElement = document.createElement("div");
        mpMenu.id = MenuPages.multiplayer;
        mpMenu.classList.add("gameMenus");
        mpMenu.style.visibility = "hidden";
        document.getElementById("gameMenu_id").appendChild(mpMenu);
    }
}