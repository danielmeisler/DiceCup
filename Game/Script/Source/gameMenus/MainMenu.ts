namespace DiceCup {

    export function mainMenu(): void {
        let gameMenuDiv: HTMLDivElement = document.createElement("div");
        gameMenuDiv.id = "gameMenu_id";
        gameMenuDiv.classList.add("gameMenus");
        gameMenuDiv.style.visibility = "hidden";
        document.getElementById("DiceCup").appendChild(gameMenuDiv);

        let menuDiv: HTMLDivElement = document.createElement("div");
        menuDiv.id = MenuPages.main;
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

        let menuButtonIds: string[] = ["play_id", "shop_id", "help_id", "options_id"];
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
            switchMenu(MenuPages.singleplayer);
        });

        document.getElementById("shop_id").addEventListener("click", () => {
            switchMenu(MenuPages.multiplayer);

        });

        document.getElementById("help_id").addEventListener("click", () => {
            switchMenu(MenuPages.help);
        });

        document.getElementById("options_id").addEventListener("click", () => {
            switchMenu(MenuPages.options);
        });

    }
}