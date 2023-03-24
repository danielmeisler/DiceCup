namespace DiceCup {

    export function mainMenu(): void {
        let menuDiv: HTMLDivElement = document.createElement("div");
        menuDiv.id = "mainMenu_id";
        menuDiv.classList.add("gameMenus");
        document.querySelector("body").appendChild(menuDiv);

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
            menuButtons.id = menuButtonIds[i];
            buttonDiv.appendChild(menuButtons);

            let menuIcons: HTMLImageElement = document.createElement("img");
            menuIcons.classList.add("menuButtonsIcons");
            menuIcons.src = menuButtonIconPaths[i];
            menuButtons.appendChild(menuIcons);
        }

        document.getElementById("play_id").addEventListener("click", () => {
            hideMenu("mainMenu_id");
            // Hud.initHud();
            // initViewport();
            // initGame();
            playMenu();
        });

        document.getElementById("shop_id").addEventListener("click", () => {
            hideMenu("mainMenu_id");

        });

        document.getElementById("help_id").addEventListener("click", () => {
            hideMenu("mainMenu_id");
        });

        document.getElementById("options_id").addEventListener("click", () => {
            hideMenu("mainMenu_id");

        });

    }

    function hideMenu(_menuID: string): void {
        document.getElementById(_menuID).style.display = "none"; 
    }
    
    function showMenu(_menuID: string): void {
        document.getElementById(_menuID).style.display = "visible"; 
    }
}