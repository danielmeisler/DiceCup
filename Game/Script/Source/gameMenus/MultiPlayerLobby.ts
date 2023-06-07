namespace DiceCup {

    // let playerCounter: number = 0;

    export function multiplayerMenu(): void {
        new SubMenu(MenuPage.multiplayerLobby, "multiplayerLobby", (<HTMLInputElement>document.getElementById("playerName_id")).placeholder + "'s " + language.menu.multiplayer.lobby.title);

        document.getElementById("multiplayerLobbyMenuReturnButton_id").addEventListener("click", () => {
            playSFX(buttonClick);
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
            playSFX(buttonClick);
        });

        let startButton: HTMLButtonElement = document.createElement("button");
        startButton.id = "multiplayerLobbyStartButton_id";
        startButton.classList.add("gameMenuStartButtons");
        startButton.classList.add("gameMenuButtons");
        startButton.classList.add("diceCupButtons");
        document.getElementById("multiplayerLobbyMenuRightButtonArea_id").appendChild(startButton);

        let startText: HTMLSpanElement = document.createElement("span");
        startText.id = "multiplayerLobbyStartText_id";
        startText.innerHTML = language.menu.multiplayer.lobby.start_button;
        startButton.appendChild(startText);

        startButton.addEventListener("click", () => {
            playSFX(buttonClick);
            hideMenu();
            // createGameSettings();
        });

        // for (let i = 0; i < 6; i++) {
        //     createWaitPortrait(i);
        // }
    }

    function createPlayerPortrait(_client?: string): void {
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

        // if (playerCounter > 0) {
        //     let playerRemove: HTMLButtonElement = document.createElement("button");
        //     playerRemove.id = "playerRemove_id_";
        //     playerRemove.classList.add("removeButton");
        //     playerDiv.appendChild(playerRemove);
        //     // playerRemove.addEventListener("click", );

        //     let botRemoveIcon: HTMLImageElement = document.createElement("img");
        //     botRemoveIcon.classList.add("removeButtonIcons");
        //     botRemoveIcon.src = "Game/Assets/images/menuButtons/minus.svg";
        //     playerRemove.appendChild(botRemoveIcon);
        // }

        let playerIcons: HTMLImageElement = document.createElement("img");
        playerIcons.classList.add("lobbyPortraitIcons");
        playerIcons.src = "Game/Assets/images/menuButtons/player.svg";
        playerDiv.appendChild(playerIcons);

        let playerName: HTMLInputElement = document.createElement("input");
        playerName.id = "playerName_id";
        playerName.classList.add("nameInputs");
        playerName.placeholder = _client ?? language.menu.player;
        playerContainer.appendChild(playerName);

        // playerCounter++;
    }

    function createWaitPortrait(_id: number): void {
        let waitContainer: HTMLDivElement = document.createElement("div");
        waitContainer.id = "multiplayerLobbyWaitContainer_id_" + _id;
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
        playerName.innerHTML = language.menu.multiplayer.lobby.waiting;
        waitContainer.appendChild(playerName);
    }

    export function joinRoom(_message: FudgeNet.Message): void {
        switchMenu(MenuPage.multiplayerLobby);
        document.getElementById("multiplayerLobbyMenuTitle_id").innerHTML = _message.content.room;
        console.log((6 - Object.keys(_message.content.clients).length));

        while (document.getElementById("multiplayerLobbyMenuContent_id").childNodes.length > 0) {
            document.getElementById("multiplayerLobbyMenuContent_id").removeChild(document.getElementById("multiplayerLobbyMenuContent_id").lastChild);
        }

        for (let i = 0; i < Object.keys(_message.content.clients).length; i++) {
            createPlayerPortrait(Object.keys(_message.content.clients)[i].toString());
        }
        for (let j = 0; j < (6 - Object.keys(_message.content.clients).length); j++) {
            createWaitPortrait(j);
        }
    }
}