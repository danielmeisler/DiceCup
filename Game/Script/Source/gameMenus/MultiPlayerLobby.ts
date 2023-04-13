namespace DiceCup {

    let playerCounter: number = 0;

    export function multiplayerMenu(): void {
        new SubMenu(MenuPage.multiplayerLobby, "multiplayerLobby", "LOBBY");

        document.getElementById("multiplayerLobbyMenuReturnButton_id").addEventListener("click", () => {
            switchMenu(MenuPage.multiplayer);
        });

        let settingsButton: HTMLButtonElement = document.createElement("button");
        settingsButton.id = "multiplayerLobbySettingsButton_id";
        settingsButton.classList.add("gameMenuButtons");
        settingsButton.classList.add("diceCupButtons");
        document.getElementById("multiplayerLobbyMenuLeftButtonArea_id").appendChild(settingsButton);

        let settingsIcon: HTMLImageElement = document.createElement("img");
        settingsIcon.classList.add("diceCupButtonsIcons");
        settingsIcon.src = "Game/Assets/images/menuButtons/settings.svg";
        settingsButton.appendChild(settingsIcon);

        settingsButton.addEventListener("click", () => {
        });

        let startButton: HTMLButtonElement = document.createElement("button");
        startButton.id = "multiplayerLobbyStartButton_id";
        startButton.classList.add("gameMenuStartButtons");
        startButton.classList.add("gameMenuButtons");
        startButton.classList.add("diceCupButtons");
        startButton.innerHTML = "START";
        document.getElementById("multiplayerLobbyMenuRightButtonArea_id").appendChild(startButton);

        startButton.addEventListener("click", () => {
            hideMenu();
            // createGameSettings();
        });

        createPlayerPortrait();
        for (let i = 0; i < 5; i++) {
            createWaitPortrait();
        }
    }

    function createPlayerPortrait(): void {
        let playerContainer: HTMLDivElement = document.createElement("div");
        playerContainer.id = "playerContainer_id";
        playerContainer.classList.add("lobbyContainer");
        playerContainer.classList.add("waitContainer");
        playerContainer.style.order = "0";
        document.getElementById("multiplayerLobbyMenuContent_id").appendChild(playerContainer);

        let playerDiv: HTMLButtonElement = document.createElement("button");
        playerDiv.id = "playerPortrait_id";
        playerDiv.classList.add("lobbyPortrait");
        playerDiv.classList.add("lobbyPortrait_active");
        playerDiv.classList.add("diceCupButtons");
        playerContainer.appendChild(playerDiv);

        if (playerCounter > 0) {
            let playerRemove: HTMLButtonElement = document.createElement("button");
            playerRemove.id = "playerRemove_id_" + playerCounter;
            playerRemove.classList.add("removeButton");
            playerDiv.appendChild(playerRemove);
            // playerRemove.addEventListener("click", );

            let botRemoveIcon: HTMLImageElement = document.createElement("img");
            botRemoveIcon.classList.add("removeButtonIcons");
            botRemoveIcon.src = "Game/Assets/images/menuButtons/minus.svg";
            playerRemove.appendChild(botRemoveIcon);
        }

        let playerIcons: HTMLImageElement = document.createElement("img");
        playerIcons.classList.add("lobbyPortraitIcons");
        playerIcons.src = "Game/Assets/images/menuButtons/player.svg";
        playerDiv.appendChild(playerIcons);

        let playerName: HTMLInputElement = document.createElement("input");
        playerName.id = "playerName_id";
        playerName.classList.add("nameInputs");
        playerName.placeholder = "Player";
        playerContainer.appendChild(playerName);

        playerCounter++;
    }

    function createWaitPortrait(): void {
        let waitContainer: HTMLDivElement = document.createElement("div");
        waitContainer.classList.add("waitContainer");
        waitContainer.classList.add("lobbyContainer");
        waitContainer.style.order = "2";
        document.getElementById("multiplayerLobbyMenuContent_id").appendChild(waitContainer);

        let waitPlayerDiv: HTMLButtonElement = document.createElement("button");
        waitPlayerDiv.classList.add("lobbyPortrait");
        waitPlayerDiv.classList.add("lobbyPortrait_inactive");
        waitPlayerDiv.classList.add("diceCupButtons");
        waitContainer.appendChild(waitPlayerDiv);

        let addIcons: HTMLImageElement = document.createElement("img");
        addIcons.classList.add("lobbyPortraitIcons_inactive");
        addIcons.src = "Game/Assets/images/menuButtons/player.svg";
        waitPlayerDiv.appendChild(addIcons);

        let playerName: HTMLDivElement = document.createElement("div");
        playerName.id = "playerName_id";
        playerName.classList.add("nameInputs");
        playerName.classList.add("lobbyPortrait_inactive");
        playerName.innerHTML = "Waiting...";
        waitContainer.appendChild(playerName);
    }
}