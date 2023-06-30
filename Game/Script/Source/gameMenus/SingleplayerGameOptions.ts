namespace DiceCup {

    export let botMode: number;

    export function singleplayerGameOptions(): void {
        new SubMenu(MenuPage.singleplayerGameOptions, "singleplayerGameOptions", language.menu.gamesettings.title);

        document.getElementById("singleplayerGameOptionsMenuReturnButton_id").addEventListener("click", () => {
            playSFX(buttonClick);
            switchMenu(MenuPage.singleplayer);
        });

        let contentContainer: HTMLDivElement = document.createElement("div");
        contentContainer.id = "singleplayergameOptionsContentContainer";
        contentContainer.classList.add("gameOptionsContentContainer");
        contentContainer.classList.add("lobbyContainer");
        document.getElementById("singleplayerGameOptionsMenuContent_id").appendChild(contentContainer);

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                let gridContainer: HTMLDivElement = document.createElement("div");
                gridContainer.id = "singleplayerGameOptionsGrid_id_" + row + "_" + col;
                gridContainer.classList.add("gameOptionsRow_" + row);
                gridContainer.classList.add("gameOptionsColumn_" + col);
                contentContainer.appendChild(gridContainer);
            }
        }

        let roundTimerTag: HTMLSpanElement = document.createElement("span");
        roundTimerTag.id = "singleplayerGameOptionsRoundTimer_id";
        roundTimerTag.innerHTML = language.menu.gamesettings.round_timer;
        document.getElementById("singleplayerGameOptionsGrid_id_0_0").appendChild(roundTimerTag);
    
        let roundTimerContainer: HTMLDivElement = document.createElement("div");
        roundTimerContainer.id = "singleplayerGameOptionsRoundTimerContainer_id";
        roundTimerContainer.classList.add("gameOptionsRoundTimerContainer");
        document.getElementById("singleplayerGameOptionsGrid_id_0_1").appendChild(roundTimerContainer);

        let roundTimerButtonLeft: HTMLButtonElement = document.createElement("button");
        roundTimerButtonLeft.classList.add("optionsSwitchVolume");
        roundTimerContainer.appendChild(roundTimerButtonLeft);

        let roundTimerButtonLeftIcon: HTMLImageElement = document.createElement("img");
        roundTimerButtonLeftIcon.classList.add("optionsSwitchVolumeIcons");
        roundTimerButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        roundTimerButtonLeft.appendChild(roundTimerButtonLeftIcon);

        let roundTimeControl: HTMLSpanElement = document.createElement("span");
        roundTimeControl.id = "singleplayerGameOptionsRoundTimerControl_id";
        roundTimeControl.classList.add("gameOptionsRoundTimerControl");
        roundTimeControl.innerHTML = roundTimer + "&nbsp;" + language.menu.gamesettings.round_timer_unit;
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
                roundTimeControl.innerHTML = roundTimer + "&nbsp;" + language.menu.gamesettings.round_timer_unit;
                roundTimerButtonLeft.disabled = false;
                roundTimerButtonLeftIcon.style.opacity = "100%";
            }
            if (roundTimer == 5) {
                roundTimerButtonRight.disabled = true;
                roundTimerButtonRightIcon.style.opacity = "0";
                gameMode = GameMode.slow;
                localStorage.setItem("gamemode", gameMode.toString());
            }
            if (roundTimer == 3) {
                gameMode = GameMode.normal;
                localStorage.setItem("gamemode", gameMode.toString());
            }
            localStorage.setItem("roundTimer", roundTimer.toString());
        });
        roundTimerButtonLeft.addEventListener("click", () => {
            playSFX(buttonClick);
            if (roundTimer > 1) {
                roundTimer -= 0.5;
                roundTimeControl.innerHTML = roundTimer + "&nbsp;" + language.menu.gamesettings.round_timer_unit;
                roundTimerButtonRight.disabled = false;
                roundTimerButtonRightIcon.style.opacity = "100%";
            }
            if (roundTimer == 1) {
                roundTimerButtonLeft.disabled = true;
                roundTimerButtonLeftIcon.style.opacity = "0";
                gameMode = GameMode.fast;
                localStorage.setItem("gamemode", gameMode.toString());
            }
            if (roundTimer == 3) {
                gameMode = GameMode.normal;
                localStorage.setItem("gamemode", gameMode.toString());
            }
            localStorage.setItem("roundTimer", roundTimer.toString());
        });

        if (roundTimer == 5) {
            roundTimerButtonRight.disabled = true;
            roundTimerButtonRightIcon.style.opacity = "0";
            gameMode = GameMode.slow;
            localStorage.setItem("gamemode", gameMode.toString());
        } else if (roundTimer == 1) {
            roundTimerButtonLeft.disabled = true;
            roundTimerButtonLeftIcon.style.opacity = "0";
            gameMode = GameMode.fast;
            localStorage.setItem("gamemode", gameMode.toString());
        } else if (roundTimer == 3) {
            gameMode = GameMode.normal;
            localStorage.setItem("gamemode", gameMode.toString());
        }

        if (localStorage.getItem("botMode")) {
            botMode = parseInt(localStorage.getItem("botMode"));
        } else {
            botMode = 0;
        }

        let botCatTag: HTMLSpanElement = document.createElement("span");
        botCatTag.id = "singleplayerGameOptionsBotCatTag_id";
        botCatTag.innerHTML = language.menu.gamesettings.bot_pick_same_cat;
        document.getElementById("singleplayerGameOptionsGrid_id_1_0").appendChild(botCatTag);
    
        let botCatContainer: HTMLDivElement = document.createElement("div");
        botCatContainer.id = "singleplayerGameOptionsBotCatContainer_id";
        document.getElementById("singleplayerGameOptionsGrid_id_1_1").appendChild(botCatContainer);

        let botCatCheckbox: HTMLInputElement = document.createElement("input");
        botCatCheckbox.type = "checkbox";
        botCatCheckbox.checked = botMode == 0 ? true : false;
        botCatContainer.appendChild(botCatCheckbox);

        botCatCheckbox.addEventListener("change", function() {
            if (this.checked) {
                botMode = 0;
                localStorage.setItem("botMode", botMode.toString());
            } else {
                botMode = 1;
                localStorage.setItem("botMode", botMode.toString());
            }
        });
    }

}