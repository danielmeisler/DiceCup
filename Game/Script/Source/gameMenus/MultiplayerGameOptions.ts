namespace DiceCup {

    export let roomPassword: string = "";

    export function multiplayerGameOptions(): void {
        new SubMenu(MenuPage.multiplayerGameOptions, "multiplayerGameOptions", language.menu.gamesettings.title);

        document.getElementById("multiplayerGameOptionsMenuReturnButton_id").addEventListener("click", () => {
            playSFX(buttonClick);
            switchMenu(MenuPage.multiplayerLobby);
        });

        let contentContainer: HTMLDivElement = document.createElement("div");
        contentContainer.id = "multiplayerGameOptionsContentContainer_id";
        contentContainer.classList.add("lobbyContainer");
        document.getElementById("multiplayerGameOptionsMenuContent_id").appendChild(contentContainer);

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                let gridContainer: HTMLDivElement = document.createElement("div");
                gridContainer.id = "multiplayerGameOptionsGrid_id_" + row + "_" + col;
                gridContainer.classList.add("multiplayerGameOptionsRow_" + row);
                gridContainer.classList.add("multiplayerGameOptionsColumn_" + col);
                contentContainer.appendChild(gridContainer);
            }
        }

        let roomPasswordTag: HTMLSpanElement = document.createElement("span");
        roomPasswordTag.id = "multiplayerGameOptionsRoomPasswordTag_id";
        roomPasswordTag.innerHTML = language.menu.gamesettings.multiplayer.password;
        document.getElementById("multiplayerGameOptionsGrid_id_0_0").appendChild(roomPasswordTag);
    
        let roomPasswordContainer: HTMLDivElement = document.createElement("div");
        roomPasswordContainer.id = "multiplayerGameOptionsRoomPasswordContainer_id";
        document.getElementById("multiplayerGameOptionsGrid_id_0_1").appendChild(roomPasswordContainer);

        let passwordCheckbox: HTMLInputElement = document.createElement("input");
        passwordCheckbox.type = "checkbox";
        roomPasswordContainer.appendChild(passwordCheckbox);

        let passwordTag: HTMLSpanElement = document.createElement("span");
        passwordTag.id = "multiplayerGameOptionsPasswordTag2_id";
        passwordTag.innerHTML = language.menu.gamesettings.multiplayer.password;
        document.getElementById("multiplayerGameOptionsGrid_id_1_0").appendChild(passwordTag);
    
        let passwordContainer: HTMLDivElement = document.createElement("div");
        passwordContainer.id = "multiplayerGameOptionsPasswordContainer2_id";
        roomPassword = (Math.floor(Math.random() * 8999) + 1000).toString();
        passwordContainer.innerHTML = roomPassword;
        document.getElementById("multiplayerGameOptionsGrid_id_1_1").appendChild(passwordContainer);

        passwordCheckbox.addEventListener("change", function() {
            if (this.checked) {
                client.dispatch({ command: FudgeNet.COMMAND.ROOM_PASSWORD, route: FudgeNet.ROUTE.SERVER, content: { private: true, password: roomPassword } });
            } else {
                client.dispatch({ command: FudgeNet.COMMAND.ROOM_PASSWORD, route: FudgeNet.ROUTE.SERVER, content: { private: false } });
            }
        });
    }

}