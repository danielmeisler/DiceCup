namespace DiceCup {

    export let username: string = "";

    export function multiplayerMenu(): void {
        new SubMenu(MenuPage.multiplayerLobby, "multiplayerLobby", (<HTMLInputElement>document.getElementById("playerName_id")).placeholder + "'s " + language.menu.multiplayer.lobby.title);

        document.getElementById("multiplayerLobbyMenuReturnButton_id").addEventListener("click", () => {
            playSFX(buttonClick);
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
            switchMenu(MenuPage.multiplayerGameOptions);
        });

        let startButton: HTMLButtonElement = document.createElement("button");
        startButton.id = "multiplayerLobbyStartButton_id";
        startButton.classList.add("gameMenuStartButtons");
        startButton.classList.add("gameMenuButtons");
        startButton.classList.add("diceCupButtons");
        startButton.innerHTML = language.menu.multiplayer.lobby.start_button;
        document.getElementById("multiplayerLobbyMenuRightButtonArea_id").appendChild(startButton);

        startButton.addEventListener("click", () => {
            playSFX(buttonClick);
            hideMenu();
            // createGameSettings();
        });

        // for (let i = 0; i < 6; i++) {
        //     createWaitPortrait(i);
        // }
    }

    function createPlayerPortrait(_client?: string, _name?: string, _id?: number): void {
        let playerContainer: HTMLDivElement = document.createElement("div");
        playerContainer.id = "playerContainer_id_" + _id;
        playerContainer.classList.add("lobbyContainer");
        playerContainer.classList.add("waitContainer");
        playerContainer.style.order = "0";
        document.getElementById("multiplayerLobbyMenuContent_id").appendChild(playerContainer);

        let playerDiv: HTMLButtonElement = document.createElement("button");
        playerDiv.id = "playerPortrait_id_" + _id;
        playerDiv.classList.add("lobbyPortrait");
        playerDiv.classList.add("lobbyPortrait_active");
        playerDiv.classList.add("diceCupButtons");
        playerContainer.appendChild(playerDiv);

        let youIndicator: HTMLDivElement = document.createElement("div");
        youIndicator.classList.add("youIndicator");
        youIndicator.style.visibility = "hidden";
        playerDiv.appendChild(youIndicator);

        let playerRemove: HTMLButtonElement = document.createElement("button");
        playerRemove.id = "playerRemove_id_" + _id;
        playerRemove.classList.add("removeButton");
        playerDiv.appendChild(playerRemove);
        document.getElementById("playerRemove_id_0").style.display = "none";
        playerRemove.addEventListener("click", () => client.dispatch({ command: FudgeNet.COMMAND.ROOM_LEAVE, route: FudgeNet.ROUTE.SERVER, content: { leaver_id: _client, host: false } }));

        let botRemoveIcon: HTMLImageElement = document.createElement("img");
        botRemoveIcon.classList.add("removeButtonIcons");
        botRemoveIcon.src = "Game/Assets/images/menuButtons/minus.svg";
        playerRemove.appendChild(botRemoveIcon);

        let playerIcons: HTMLImageElement = document.createElement("img");
        playerIcons.classList.add("lobbyPortraitIcons");
        playerIcons.src = _id == 0 ? "Game/Assets/images/menuButtons/host.svg" : "Game/Assets/images/menuButtons/player.svg";
        playerDiv.appendChild(playerIcons);

        let nameInputContainer: HTMLDivElement = document.createElement("div");
        nameInputContainer.id = "nameInputContainer_id_" + _id;
        nameInputContainer.classList.add("nameInputContainer");
        playerContainer.appendChild(nameInputContainer);

        let playerName: HTMLInputElement = document.createElement("input");
        playerName.id = "playerName_id_" + _id;
        playerName.classList.add("nameInputs");
        playerName.value = _name ?? _client;
        playerName.setAttribute("client_id", _client);
        playerName.readOnly = true;
        nameInputContainer.appendChild(playerName);

        if (playerName.getAttribute("client_id") == client.id) {
            let nameInputButton: HTMLButtonElement = document.createElement("button");
            nameInputButton.id = "nameInputButton_id";
            nameInputButton.classList.add("nameInputsButtons");
            nameInputButton.innerHTML = "✔";
            nameInputContainer.appendChild(nameInputButton);

            nameInputButton.addEventListener("click", () => {
                playSFX(buttonClick);
                nameInputButton.style.display = "none";
                playerName.classList.remove("nameInputsFocused");
                username = playerName.value;
                console.log("SADASDF")
                // collectNames();
            });

            document.getElementById("nameInputButton_id").addEventListener("click", hndEvent);

            playerName.readOnly = false;
            youIndicator.style.visibility = "visible";
            playerName.addEventListener("click", () => {nameInputButton.style.display = "block"; playerName.classList.add("nameInputsFocused");});
            

        }
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
        console.log(_message.content.name)
        document.getElementById("multiplayerLobbyMenuTitle_id").innerHTML = _message.content.name;
        console.log((6 - Object.keys(_message.content.clients).length));

        while (document.getElementById("multiplayerLobbyMenuContent_id").childNodes.length > 0) {
            document.getElementById("multiplayerLobbyMenuContent_id").removeChild(document.getElementById("multiplayerLobbyMenuContent_id").lastChild);
        }

        for (let i = 0; i < Object.keys(_message.content.clients).length; i++) {
            createPlayerPortrait(Object.keys(_message.content.clients)[i].toString(), (<any>Object.values(_message.content.clients)[i]).name, i);
            if (host == false) {
                document.getElementById("playerRemove_id_" + i).style.display = "none";
            }
        }
        for (let j = 0; j < (6 - Object.keys(_message.content.clients).length); j++) {
            createWaitPortrait(j);
        }
    }
}