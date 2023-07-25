namespace DiceCup {
    import ƒ = FudgeCore;

    // -- Variable declaration --

    // Stores the username if the player decides to change it
    export let username: string = "";

    // Creates a new submenu for the multiplayer lobby with empty container and content
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
            host && switchMenu(MenuPage.multiplayerGameOptions);
        });
    }

    // Creates different buttons depending if the player is the host or a guest.
    // Host can change the lobby settings and start the game. Guests have a ready button.
    function createLobbyButtons(_host: boolean, _ready?: boolean): void {
        if (_host) {
            while (document.getElementById("multiplayerLobbyMenuRightButtonArea_id").childNodes.length > 0) {
                document.getElementById("multiplayerLobbyMenuRightButtonArea_id").removeChild(document.getElementById("multiplayerLobbyMenuRightButtonArea_id").lastChild);
            }

            let startButton: HTMLButtonElement = document.createElement("button");
            startButton.id = "multiplayerLobbyStartButton_id";
            startButton.classList.add("gameMenuStartButtons");
            startButton.classList.add("gameMenuButtons");
            startButton.classList.add("diceCupButtons");
            startButton.innerHTML = language.menu.multiplayer.lobby.start_button;
            document.getElementById("multiplayerLobbyMenuRightButtonArea_id").appendChild(startButton);

        } else {
            while (document.getElementById("multiplayerLobbyMenuRightButtonArea_id").childNodes.length > 0) {
                document.getElementById("multiplayerLobbyMenuRightButtonArea_id").removeChild(document.getElementById("multiplayerLobbyMenuRightButtonArea_id").lastChild);
            }

            let readyButton: HTMLButtonElement = document.createElement("button");
            readyButton.id = "multiplayerLobbyReadyButton_id";
            readyButton.classList.add("gameMenuStartButtons");
            readyButton.classList.add("gameMenuButtons");
            readyButton.classList.add("diceCupButtons");
            document.getElementById("multiplayerLobbyMenuRightButtonArea_id").appendChild(readyButton);

            document.getElementById("multiplayerLobbyReadyButton_id").addEventListener("click", () => {
                playSFX(buttonClick);
                client.dispatch({ command: FudgeNet.COMMAND.CLIENT_READY, route: FudgeNet.ROUTE.SERVER });
            });

            _ready ? document.getElementById("multiplayerLobbyReadyButton_id").innerHTML = language.menu.multiplayer.lobby.ready_button : document.getElementById("multiplayerLobbyReadyButton_id").innerHTML = language.menu.multiplayer.lobby.not_ready_button;
        }
    }

    // Creates a player container with given attributes to fill with name and if the player is ready or not
    function createPlayerPortrait(_client?: string, _name?: string, _id?: number, _ready?: boolean): void {
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
        youIndicator.id = "playerIndicator_id";
        youIndicator.classList.add("youIndicator");
        playerDiv.appendChild(youIndicator);

        let playerRemove: HTMLButtonElement = document.createElement("button");
        playerRemove.id = "playerRemove_id_" + _id;
        playerRemove.classList.add("removeButton");
        playerDiv.appendChild(playerRemove);
        document.getElementById("playerRemove_id_0").style.display = "none";
        playerRemove.addEventListener("click", () => client.dispatch({ command: FudgeNet.COMMAND.ROOM_LEAVE, route: FudgeNet.ROUTE.SERVER, content: { leaver_id: _client, host: false, kicked: true } }));

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
        playerName.id = "multiplayerName_id_" + _id;
        playerName.classList.add("nameInputs");
        playerName.value = _name ?? _client;
        playerName.setAttribute("client_id", _client);
        playerName.readOnly = true;
        nameInputContainer.appendChild(playerName);

        // If the player isn't ready its visualized with a transparent container
        if (!_ready) {
            playerDiv.classList.add("lobbyPortrait_inactive");
            playerIcons.classList.add("lobbyPortraitIcons_inactive");
            playerName.classList.add("lobbyPortrait_inactive");
        }

        // So that the player can recognize himself more quickly, he is marked with an white dot on his container.
        // The player can only change his name
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
            });

            document.getElementById("nameInputButton_id").addEventListener("click", hndEvent);
            playerName.readOnly = false;
            playerName.addEventListener("click", () => {nameInputButton.style.display = "block"; playerName.classList.add("nameInputsFocused");});
        } else {
            youIndicator.style.visibility = "hidden";
        }
    }

    // Creates an empty container as placeholder until players joins the room
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

    // Checks if there are min 2 players in the lobby and everybody is ready to start the game
    function checkLobbyStart(_everybodyReady: boolean, _lobbySize: number): void {
        let startButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("multiplayerLobbyStartButton_id");
        if (!_everybodyReady) {
            startButton.addEventListener("click", () => {
                document.getElementById("multiplayerLobbyAlert_id").innerHTML = language.menu.alerts.not_ready;
                ƒ.Time.game.setTimer(1000, 1, () => {document.getElementById("multiplayerLobbyAlert_id").innerHTML = ""});
                playSFX(buttonClick);
            });
        } else if (_lobbySize < 2) {
            startButton.addEventListener("click", () => {
                document.getElementById("multiplayerLobbyAlert_id").innerHTML = language.menu.alerts.min_player;
                ƒ.Time.game.setTimer(1000, 1, () => {document.getElementById("multiplayerLobbyAlert_id").innerHTML = ""});
                playSFX(buttonClick);
            });
        } else {
            startButton.addEventListener("click", () => {
                playSFX(buttonClick);
            });
            startButton.addEventListener("click", hndEvent);
        }
    }

    // Everytime a player joins the room it will be updated for everyone in the lobby
    export function joinRoom(_message: FudgeNet.Message): void {
        // Switches to multiplayer lobby menu page and updates the lobby name to host name plus lobby
        switchMenu(MenuPage.multiplayerLobby);
        document.getElementById("multiplayerLobbyMenuTitle_id").innerHTML = _message.content.name;

        // Removes the old unupdated version of the lobby so it can be renewed
        while (document.getElementById("multiplayerLobbyMenuContent_id").childNodes.length > 0) {
            document.getElementById("multiplayerLobbyMenuContent_id").removeChild(document.getElementById("multiplayerLobbyMenuContent_id").lastChild);
        }

        // Creates the lobby buttons depending if the player is host or guest
        createLobbyButtons(host, (<any>Object.values(_message.content.clients)[Object.keys(_message.content.clients).indexOf(client.id)]).ready);

        // Creates playercontainer with attributes with all connected clients
        for (let i = 0; i < Object.keys(_message.content.clients).length; i++) {
            createPlayerPortrait(Object.keys(_message.content.clients)[i].toString(), (<any>Object.values(_message.content.clients)[i]).name, i, (<any>Object.values(_message.content.clients)[i]).ready);
            if (host == false) {
                document.getElementById("playerRemove_id_" + i).style.display = "none";
            }
        }

        // Fills the unused spots with wait containers
        for (let j = 0; j < (6 - Object.keys(_message.content.clients).length); j++) {
            createWaitPortrait(j);
        }

        // Stores all ready states of each player
        let allReady: boolean[] = [];
        for (let index = 0; index < (<any>Object.values(_message.content.clients)).length; index++) {
            allReady[index] = (<any>Object.values(_message.content.clients)[index]).ready;
        }

        // Checks all conditions so the host could start the game
        if (host) {
            checkLobbyStart(allReady.every(x => x), Object.keys(_message.content.clients).length);
        }

    }
}