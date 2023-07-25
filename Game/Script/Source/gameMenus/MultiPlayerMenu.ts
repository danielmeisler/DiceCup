namespace DiceCup {

    // -- Variable declaration --

    // Stores the last clicked/tapped room to join
    export let focusedIdRoom: string = "";

    // Creates a submenu for the server list with empty containers and content
    export function multiplayerServers(): void {
        new SubMenu(MenuPage.multiplayer, "multiplayer", language.menu.multiplayer.list.title);

        let renewButton: HTMLButtonElement = document.createElement("button");
        renewButton.id = "multiplayerRenewButton_id";
        renewButton.classList.add("gameMenuButtons");
        renewButton.classList.add("diceCupButtons");
        document.getElementById("multiplayerMenuLeftButtonArea_id").appendChild(renewButton);

        let renewIcon: HTMLImageElement = document.createElement("img");
        renewIcon.classList.add("diceCupButtonsIcons");
        renewIcon.src = "Game/Assets/images/menuButtons/renew.svg";
        renewButton.appendChild(renewIcon);

        renewButton.addEventListener("click", () => {
            playSFX(buttonClick);
            document.getElementById("multiplayerContentContainer_id").scrollTo(0,0);
        });

        let createButton: HTMLButtonElement = document.createElement("button");
        createButton.id = "multiplayerCreateButton_id";
        createButton.classList.add("gameMenuStartButtons");
        createButton.classList.add("gameMenuButtons");
        createButton.classList.add("diceCupButtons");
        createButton.innerHTML = language.menu.multiplayer.list.create_button;
        client.id ? createButton.disabled = false : createButton.disabled = true;     
        document.getElementById("multiplayerMenuRightButtonArea_id").appendChild(createButton);

        createButton.addEventListener("click", () => {
            playSFX(buttonClick);
            switchMenu(MenuPage.multiplayerLobby);
        });

        let joinButton: HTMLButtonElement = document.createElement("button");
        joinButton.id = "multiplayerJoinButton_id";
        joinButton.classList.add("gameMenuStartButtons");
        joinButton.classList.add("gameMenuButtons");
        joinButton.classList.add("diceCupButtons");
        joinButton.innerHTML = language.menu.multiplayer.list.join_button;
        client.id ? joinButton.disabled = false : joinButton.disabled = true;
        document.getElementById("multiplayerMenuRightButtonArea_id").appendChild(joinButton);

        joinButton.addEventListener("click", () => {
            playSFX(buttonClick);
        });

        if (!client.id) {
            document.getElementById("multiplayerAlert_id").innerHTML = language.menu.alerts.offline;
        }

        let contentContainer: HTMLDivElement = document.createElement("div");
        contentContainer.id = "multiplayerContentContainer_id";
        document.getElementById("multiplayerMenuContent_id").appendChild(contentContainer);

        let serverList: HTMLDivElement = document.createElement("div");
        serverList.id = "serverListRow_id_header";
        serverList.classList.add("serverListRow");
        contentContainer.appendChild(serverList);

        initList();
    }

    // Creates the gridlayout for the rows and cols of the serverlist content
    function initList(): void {
        let serverList: HTMLElement = document.getElementById("serverListRow_id_header");

        let playerCountContainer: HTMLDivElement = document.createElement("div");
        playerCountContainer.id = "playerCountContainer_id_header";
        playerCountContainer.classList.add("serverListContainer");
        playerCountContainer.classList.add("serverListHeader");
        serverList.appendChild(playerCountContainer);

        let nameContainer: HTMLDivElement = document.createElement("div");
        nameContainer.id = "nameContainer_id_header";
        nameContainer.classList.add("serverListContainer");
        nameContainer.classList.add("serverListHeader");
        serverList.appendChild(nameContainer);

        let gamemodeContainer: HTMLDivElement = document.createElement("div");
        gamemodeContainer.id = "gamemodeContainer_id_header";
        gamemodeContainer.classList.add("serverListContainer");
        gamemodeContainer.classList.add("serverListHeader");
        serverList.appendChild(gamemodeContainer);

        let lockedContainer: HTMLDivElement = document.createElement("div");
        lockedContainer.id = "lockedContainer_id_header";
        lockedContainer.classList.add("serverListContainer");
        lockedContainer.classList.add("serverListHeader");
        serverList.appendChild(lockedContainer);


        let playerCount: HTMLImageElement = document.createElement("img");
        playerCount.id = "playerCount_id";
        playerCount.classList.add("serverListIcons");
        playerCount.src = "Game/Assets/images/serverlistIcons/playercount.svg";
        playerCountContainer.appendChild(playerCount);

        let name: HTMLImageElement = document.createElement("img");
        name.id = "room_id";
        name.classList.add("serverListIcons");
        name.src = "Game/Assets/images/serverlistIcons/servername.svg";
        nameContainer.appendChild(name);

        let gamemode: HTMLImageElement = document.createElement("img");
        gamemode.id = "gamemode_id";
        gamemode.classList.add("serverListIcons");
        gamemode.src = "Game/Assets/images/serverlistIcons/gamemode.svg";
        gamemodeContainer.appendChild(gamemode);

        let locked: HTMLImageElement = document.createElement("img");
        locked.id = "locked_id";
        locked.classList.add("serverListIcons");
        locked.src = "Game/Assets/images/serverlistIcons/lock.svg";
        lockedContainer.appendChild(locked);
    }

    // Shows the password input field if the room is private and password secured
    export function passwordInput(): void {
        let passwordInputContainer: HTMLDivElement = document.createElement("div");
        passwordInputContainer.id = "passwordInputContainer_id";
        passwordInputContainer.classList.add("passwordInputContainer");
        document.getElementById("multiplayerMenu_id").appendChild(passwordInputContainer);

        let passwordTitle: HTMLSpanElement = document.createElement("span");
        passwordTitle.classList.add("passwordTitle");
        passwordTitle.innerHTML = language.menu.multiplayer.list.password;
        passwordInputContainer.appendChild(passwordTitle);

        let inputArea: HTMLDivElement = document.createElement("div");
        inputArea.classList.add("passwordInputArea");
        passwordInputContainer.appendChild(inputArea);

        let returnButton: HTMLButtonElement = document.createElement("button");
        returnButton.id = "passwordReturnButton_id";
        returnButton.classList.add("diceCupButtons");
        returnButton.classList.add("passwordReturnButton");
        inputArea.appendChild(returnButton);

        let returnIcon: HTMLImageElement = document.createElement("img");
        returnIcon.classList.add("diceCupButtonsIcons");
        returnIcon.src = "Game/Assets/images/menuButtons/return.svg";
        returnButton.appendChild(returnIcon);
        returnButton.addEventListener("click", () => {
            playSFX(buttonClick);
            document.getElementById("passwordInputContainer_id").remove();
        });

        returnButton.addEventListener("click", hndEvent);

        let inputContainer: HTMLInputElement = document.createElement("input");
        inputContainer.maxLength = 4;
        inputContainer.id = "passwordInput_id";
        inputContainer.classList.add("inputContainer");
        inputArea.appendChild(inputContainer);

        let joinButton: HTMLButtonElement = document.createElement("button");
        joinButton.id = "passwordJoinButton_id";
        joinButton.classList.add("passwordJoinButton");
        joinButton.classList.add("diceCupButtons");
        joinButton.innerHTML = language.menu.multiplayer.list.join_button;
        inputArea.appendChild(joinButton);

        joinButton.addEventListener("click", () => {
            playSFX(buttonClick);
        });

        joinButton.addEventListener("click", hndEvent);

        let passwordAlert: HTMLSpanElement = document.createElement("span");
        passwordAlert.id = "passwordAlert_id";
        passwordInputContainer.appendChild(passwordAlert);
    }

    // Fills the serverlist with all available rooms
    export async function getRooms(_message: FudgeNet.Message): Promise<void> {
        while (document.getElementById("multiplayerContentContainer_id").childNodes.length > 1) {
            document.getElementById("multiplayerContentContainer_id").removeChild(document.getElementById("multiplayerContentContainer_id").lastChild);
        }

        for (let i = _message.content.rooms.length - 1; i > 0; i--) {
            let serverList: HTMLButtonElement = document.createElement("button");
            serverList.id = "serverListRow_id_" + i;
            serverList.classList.add("serverListRow");
            document.getElementById("multiplayerContentContainer_id").appendChild(serverList);
            serverList.addEventListener("click",() => focusedIdRoom = _message.content.rooms[i]);

            let playerCountContainer: HTMLDivElement = document.createElement("div");
            playerCountContainer.id = "playerCountContainer_id_" + i;
            playerCountContainer.classList.add("serverListContainer");
            serverList.appendChild(playerCountContainer);
    
            let nameContainer: HTMLDivElement = document.createElement("div");
            nameContainer.id = "nameContainer_id_" + i;
            nameContainer.classList.add("serverListContainer");
            serverList.appendChild(nameContainer);
    
            let gamemodeContainer: HTMLDivElement = document.createElement("div");
            gamemodeContainer.id = "gamemodeContainer_id_" + i;
            gamemodeContainer.classList.add("serverListContainer");
            serverList.appendChild(gamemodeContainer);
    
            let lockedContainer: HTMLDivElement = document.createElement("div");
            lockedContainer.id = "lockedContainer_id_" + i;
            lockedContainer.classList.add("serverListContainer");
            serverList.appendChild(lockedContainer);

            if (_message.content.private[i]) {
                let locked: HTMLImageElement = document.createElement("img");
                locked.id = "locked_id" + i;
                locked.classList.add("serverListIcons");
                locked.src = "Game/Assets/images/serverlistIcons/lock.svg";
                lockedContainer.appendChild(locked);
            }

            let playerCount: HTMLSpanElement = document.createElement("span");
            playerCount.id = "playerCount_id_" + i;
            playerCount.innerHTML = (_message.content.clients[i] != "" ?  _message.content.clients[i].split(",").length.toString() : "0") + "/6";
            playerCountContainer.appendChild(playerCount);

            let game: HTMLSpanElement = document.createElement("span");
            game.id = "room_id_" + i;
            game.innerHTML = _message.content.roomNames[i];
            nameContainer.appendChild(game);

            let gamemode: HTMLSpanElement = document.createElement("span");
            gamemode.id = "gamemode_id_" + i;
            gamemode.classList.add("multiplayerGamemode");
            gamemode.innerHTML = gamemodeTranslation(_message.content.gamemode[i]);
            gamemodeContainer.appendChild(gamemode);

            let locked: HTMLImageElement = document.createElement("img");
            locked.id = "locked_id_" + i;
            lockedContainer.appendChild(locked);
        }

    }

}