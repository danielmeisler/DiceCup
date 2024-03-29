namespace DiceCup {

    // Initialize the main menu with all containers and buttons for every submenu
    export function mainMenu(): void {
        let gameMenuDiv: HTMLDivElement = document.createElement("div");
        gameMenuDiv.id = "gameMenu_id";
        gameMenuDiv.classList.add("gameMenus");
        gameMenuDiv.style.visibility = "hidden";
        document.getElementById("DiceCup").appendChild(gameMenuDiv);

        let menuDiv: HTMLDivElement = document.createElement("div");
        menuDiv.id = MenuPage.main;
        menuDiv.classList.add("gameMenus");
        menuDiv.classList.add("noBackground");
        gameMenuDiv.appendChild(menuDiv);

        let logoDiv: HTMLDivElement = document.createElement("div");
        logoDiv.id = "logoContainer_id";
        menuDiv.appendChild(logoDiv);

        let logoImage: HTMLImageElement = document.createElement("img");
        logoImage.id = "logo_id";
        logoImage.src = "Game/Assets/images/temp_logo_test.png";
        logoDiv.appendChild(logoImage);

        let buttonDiv: HTMLDivElement = document.createElement("div");
        buttonDiv.id = "buttonContainer_id";
        menuDiv.appendChild(buttonDiv);

        // Determines the main menu button ids and their icon paths
        let menuButtonIds: string[] = ["play_id", "multiplayer_id", "help_id", "options_id"];
        let menuButtonIconPaths: string[] = ["Game/Assets/images/menuButtons/play.svg", "Game/Assets/images/menuButtons/multiplayer.svg", "Game/Assets/images/menuButtons/help.svg", "Game/Assets/images/menuButtons/settings.svg"];

        // Creates the main menu buttons
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

        // Adds the event listener for each button

        document.getElementById("play_id").addEventListener("click", () => {
            playSFX(buttonClick);
            switchMenu(MenuPage.singleplayer);
        });

        document.getElementById("multiplayer_id").addEventListener("click", () => {
            playSFX(buttonClick);
            switchMenu(MenuPage.multiplayer);

        });

        document.getElementById("help_id").addEventListener("click", () => {
            playSFX(buttonClick);
            switchMenu(MenuPage.help);
        });

        document.getElementById("options_id").addEventListener("click", () => {
            playSFX(buttonClick);
            switchMenu(MenuPage.options);
        });


        // Creates the online container in the corner of the main menu to see directly if the client is connected and his id

        let onlineContainer: HTMLDivElement = document.createElement("div");
        onlineContainer.id = "onlineContainer_id";
        menuDiv.appendChild(onlineContainer);

        let statusText: HTMLSpanElement = document.createElement("span");
        statusText.id = "onlineStatus_id";
        statusText.innerHTML = client.id ? "status: online" : "status: offline";
        onlineContainer.appendChild(statusText);

        let clientText: HTMLSpanElement = document.createElement("span");
        clientText.id = "onlineClient_id";
        clientText.innerHTML = client.id ? "client_id: " + client.id : "client_id: undefined";
        onlineContainer.appendChild(clientText);

    }
}