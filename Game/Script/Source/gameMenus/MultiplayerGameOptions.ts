namespace DiceCup {

    export let roomPassword: string = "";

    export function multiplayerGameOptions(): void {
        new SubMenu(MenuPage.multiplayerGameOptions, "multiplayerGameOptions", language.menu.gamesettings.title);

        document.getElementById("multiplayerGameOptionsMenuReturnButton_id").addEventListener("click", () => {
            playSFX(buttonClick);
            switchMenu(MenuPage.multiplayerLobby);
        });

        let contentContainer: HTMLDivElement = document.createElement("div");
        contentContainer.id = "multiplayergameOptionsContentContainer";
        contentContainer.classList.add("gameOptionsContentContainer");
        contentContainer.classList.add("lobbyContainer");
        document.getElementById("multiplayerGameOptionsMenuContent_id").appendChild(contentContainer);

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                let gridContainer: HTMLDivElement = document.createElement("div");
                gridContainer.id = "multiplayerGameOptionsGrid_id_" + row + "_" + col;
                gridContainer.classList.add("gameOptionsRow_" + row);
                gridContainer.classList.add("gameOptionsColumn_" + col);
                contentContainer.appendChild(gridContainer);
            }
        }

        let roomPasswordTag: HTMLSpanElement = document.createElement("span");
        roomPasswordTag.id = "multiplayerGameOptionsRoomPasswordTag_id";
        roomPasswordTag.innerHTML = language.menu.gamesettings.password_switch;
        document.getElementById("multiplayerGameOptionsGrid_id_0_0").appendChild(roomPasswordTag);
    
        let roomPasswordContainer: HTMLDivElement = document.createElement("div");
        roomPasswordContainer.id = "multiplayerGameOptionsRoomPasswordContainer_id";
        document.getElementById("multiplayerGameOptionsGrid_id_0_1").appendChild(roomPasswordContainer);

        let passwordCheckbox: HTMLInputElement = document.createElement("input");
        passwordCheckbox.type = "checkbox";
        roomPasswordContainer.appendChild(passwordCheckbox);

        let passwordTag: HTMLSpanElement = document.createElement("span");
        passwordTag.id = "multiplayerGameOptionsPasswordTag2_id";
        passwordTag.innerHTML = language.menu.gamesettings.password;
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

        let roundTimerTag: HTMLSpanElement = document.createElement("span");
        roundTimerTag.id = "multiplayerGameOptionsRoundTimer_id";
        roundTimerTag.innerHTML = "Round Timer";
        document.getElementById("multiplayerGameOptionsGrid_id_2_0").appendChild(roundTimerTag);
    
        let roundTimerContainer: HTMLDivElement = document.createElement("div");
        roundTimerContainer.id = "multiplayerGameOptionsRoundTimerContainer_id";
        roundTimerContainer.classList.add("gameOptionsRoundTimerContainer");
        document.getElementById("multiplayerGameOptionsGrid_id_2_1").appendChild(roundTimerContainer);

        let roundTimerButtonLeft: HTMLButtonElement = document.createElement("button");
        roundTimerButtonLeft.classList.add("optionsSwitchVolume");
        roundTimerContainer.appendChild(roundTimerButtonLeft);

        let roundTimerButtonLeftIcon: HTMLImageElement = document.createElement("img");
        roundTimerButtonLeftIcon.classList.add("optionsSwitchVolumeIcons");
        roundTimerButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        roundTimerButtonLeft.appendChild(roundTimerButtonLeftIcon);

        let roundTimeControl: HTMLSpanElement = document.createElement("span");
        roundTimeControl.id = "multiplayerGameOptionsRoundTimerControl_id";
        roundTimeControl.classList.add("gameOptionsRoundTimerControl");
        roundTimeControl.innerHTML = roundTimer + " seconds";
        roundTimerContainer.appendChild(roundTimeControl);

        let roundTimerButtonRight: HTMLButtonElement = document.createElement("button");
        roundTimerButtonRight.classList.add("optionsSwitchVolume");
        roundTimerContainer.appendChild(roundTimerButtonRight);

        let roundTimerButtonRightIcon: HTMLImageElement = document.createElement("img");
        roundTimerButtonRightIcon.classList.add("optionsSwitchVolumeIcons");
        roundTimerButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        roundTimerButtonRight.appendChild(roundTimerButtonRightIcon);

        roundTimerButtonRight.addEventListener("click", () => {
            playSFX(buttonClick);
            if (roundTimer < 5) {
                roundTimer += 0.5;
                roundTimeControl.innerHTML = roundTimer + " seconds";
                roundTimerButtonLeft.disabled = false;
                roundTimerButtonLeftIcon.style.opacity = "100%";
            }
            if (roundTimer == 5) {
                roundTimerButtonRight.disabled = true;
                roundTimerButtonRightIcon.style.opacity = "0";
            }
            localStorage.setItem("roundTimer", roundTimer.toString());
        });
        roundTimerButtonLeft.addEventListener("click", () => {
            playSFX(buttonClick);
            if (roundTimer > 1) {
                roundTimer -= 0.5;
                roundTimeControl.innerHTML = roundTimer + " seconds";
                roundTimerButtonRight.disabled = false;
                roundTimerButtonRightIcon.style.opacity = "100%";
            }
            if (roundTimer == 1) {
                roundTimerButtonLeft.disabled = true;
                roundTimerButtonLeftIcon.style.opacity = "0";
            }
            localStorage.setItem("roundTimer", roundTimer.toString());
        });

        if (roundTimer == 5) {
            roundTimerButtonRight.disabled = true;
            roundTimerButtonRightIcon.style.opacity = "0";
        } else if (roundTimer == 1) {
            roundTimerButtonLeft.disabled = true;
            roundTimerButtonLeftIcon.style.opacity = "0";
        }
    }

}