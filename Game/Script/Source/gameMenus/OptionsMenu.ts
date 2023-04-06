namespace DiceCup {

    export function optionsMenu(): void {
        let optionMenu: HTMLDivElement = document.createElement("div");
        optionMenu.id = MenuPages.options;
        optionMenu.classList.add("gameMenus");
        optionMenu.style.visibility = "hidden";
        document.getElementById("gameMenu_id").appendChild(optionMenu);
    }
}