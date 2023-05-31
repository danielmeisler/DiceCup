namespace DiceCup {

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
            hideMenu();
        });

        let createButton: HTMLButtonElement = document.createElement("button");
        createButton.id = "multiplayerCreateButton_id";
        createButton.classList.add("gameMenuStartButtons");
        createButton.classList.add("gameMenuButtons");
        createButton.classList.add("diceCupButtons");
        createButton.innerHTML = language.menu.multiplayer.list.create_button;
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
        document.getElementById("multiplayerMenuRightButtonArea_id").appendChild(joinButton);

        joinButton.addEventListener("click", () => {
            playSFX(buttonClick);
            // createGameSettings();
        });

        let contentContainer: HTMLDivElement = document.createElement("div");
        contentContainer.id = "multiplayerContentContainer_id";
        document.getElementById("multiplayerMenuContent_id").appendChild(contentContainer);

        let serverList: HTMLDivElement = document.createElement("div");
        serverList.id = "serverListRow_id_0";
        serverList.classList.add("serverListRow");
        contentContainer.appendChild(serverList);

        initList();
    }

    function initList(): void {
        let serverList: HTMLElement = document.getElementById("serverListRow_id_0");

        let playerCountContainer: HTMLDivElement = document.createElement("div");
        playerCountContainer.id = "playerCountContainer_id_0";
        playerCountContainer.classList.add("serverListContainer");
        serverList.appendChild(playerCountContainer);

        let gameContainer: HTMLDivElement = document.createElement("div");
        gameContainer.id = "gameContainer_id_0";
        gameContainer.classList.add("serverListContainer");
        serverList.appendChild(gameContainer);

        let gamemodeContainer: HTMLDivElement = document.createElement("div");
        gamemodeContainer.id = "gamemodeContainer_id_0";
        gamemodeContainer.classList.add("serverListContainer");
        serverList.appendChild(gamemodeContainer);

        let lockedContainer: HTMLDivElement = document.createElement("div");
        lockedContainer.id = "lockedContainer_id_0";
        lockedContainer.classList.add("serverListContainer");
        serverList.appendChild(lockedContainer);



        let playerCount: HTMLImageElement = document.createElement("img");
        playerCount.id = "playerCount_id";
        playerCount.classList.add("serverListIcons");
        playerCount.src = "Game/Assets/images/menuButtons/player.svg";
        playerCountContainer.appendChild(playerCount);

        let game: HTMLImageElement = document.createElement("img");
        game.id = "room_id";
        game.classList.add("serverListIcons");
        game.src = "Game/Assets/images/menuButtons/player.svg";
        gameContainer.appendChild(game);

        let gamemode: HTMLImageElement = document.createElement("img");
        gamemode.id = "gamemode_id";
        gamemode.classList.add("serverListIcons");
        gamemode.src = "Game/Assets/images/menuButtons/player.svg";
        gamemodeContainer.appendChild(gamemode);

        let locked: HTMLImageElement = document.createElement("img");
        locked.id = "locked_id";
        locked.classList.add("serverListIcons");
        locked.src = "Game/Assets/images/menuButtons/player.svg";
        lockedContainer.appendChild(locked);
    }

    export async function getRooms(_rooms: string[]): Promise<void> {
        let serverList: HTMLElement = document.getElementById("multiplayerServerList_id");

        console.log(_rooms)
        for (let i = 0; i < _rooms.length; i++) {
            let playerCount: HTMLSpanElement = document.createElement("span");
            playerCount.id = "playerCount_id_" + i;
            playerCount.classList.add("serverListRow");
            serverList.appendChild(playerCount);

            let game: HTMLSpanElement = document.createElement("span");
            game.id = "room_id_" + i;
            game.innerHTML = _rooms[i];
            game.classList.add("serverListRow");
            serverList.appendChild(game);

            let gamemode: HTMLSpanElement = document.createElement("span");
            gamemode.id = "gamemode_id_" + i;
            gamemode.innerHTML = "NORMAL";
            gamemode.classList.add("serverListRow");
            serverList.appendChild(gamemode);

            let locked: HTMLImageElement = document.createElement("img");
            locked.id = "locked_id_" + i;
            locked.classList.add("serverListRow");
            serverList.appendChild(locked);
        }

    }

}