namespace DiceCup {

    export function mainMenu(): void {
        let gameMenuDiv: HTMLDivElement = document.createElement("div");
        gameMenuDiv.id = "gameMenu_id";
        gameMenuDiv.classList.add("gameMenus");
        document.getElementById("DiceCup").appendChild(gameMenuDiv);

        let menuDiv: HTMLDivElement = document.createElement("div");
        menuDiv.id = "mainMenu_id";
        menuDiv.classList.add("gameMenus");
        gameMenuDiv.appendChild(menuDiv);

        let logoDiv: HTMLDivElement = document.createElement("div");
        logoDiv.id = "logoContainer_id";
        menuDiv.appendChild(logoDiv);

        let logoImage: HTMLImageElement = document.createElement("img");
        logoImage.id = "logo_id";
        logoImage.src = "Game/Assets/images/temp_logo.png";
        logoDiv.appendChild(logoImage);

        let buttonDiv: HTMLDivElement = document.createElement("div");
        buttonDiv.id = "buttonContainer_id";
        menuDiv.appendChild(buttonDiv);

        let menuButtonIds: string[] = ["play_id", "help_id", "shop_id", "options_id"];
        let menuButtonIconPaths: string[] = ["Game/Assets/images/menuButtons/play.svg", "Game/Assets/images/menuButtons/shop.svg", "Game/Assets/images/menuButtons/help.svg", "Game/Assets/images/menuButtons/settings.svg"];

        for (let i = 0; i < 4; i++) {
            let menuButtons: HTMLButtonElement = document.createElement("button");
            menuButtons.classList.add("menuButtons");
            menuButtons.classList.add("diceCupButtons");
            menuButtons.id = menuButtonIds[i];
            buttonDiv.appendChild(menuButtons);

            let menuIcons: HTMLImageElement = document.createElement("img");
            menuIcons.classList.add("menuButtonsIcons");
            menuIcons.src = menuButtonIconPaths[i];
            menuButtons.appendChild(menuIcons);
        }

        document.getElementById("play_id").addEventListener("click", () => {
            switchMenu(MenuPages.main, MenuPages.singleplayer);
        });

        document.getElementById("shop_id").addEventListener("click", () => {
            switchMenu(MenuPages.main, MenuPages.shop);

        });

        document.getElementById("help_id").addEventListener("click", () => {
            switchMenu(MenuPages.main, MenuPages.help);
        });

        document.getElementById("options_id").addEventListener("click", () => {
            switchMenu(MenuPages.main, MenuPages.options);
        });

    }

    export function switchMenu(_thisMenuID: MenuPages, _toMenuID: MenuPages ): void {
        document.getElementById(_thisMenuID).style.visibility = "hidden"; 
        document.getElementById(_toMenuID).style.visibility = "visible"; 
    }
}