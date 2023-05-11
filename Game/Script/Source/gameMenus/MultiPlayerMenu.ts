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
            // createGameSettings();
        });
    }

}