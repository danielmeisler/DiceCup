namespace DiceCup {
    import ƒ = FudgeCore;
    let botSettings: BotDao[];
    let botCounter: number = 0;
    let chosenDifficulty: number = 1;

    export function singleplayerMenu(): void {
        new SubMenu(MenuPage.singleplayer, "singleplayer", "SINGLEPLAYER");

        createPlayerPortrait();
        createBotPortrait();
        for (let index = 0; index < 4; index++) {
            createAddPortrait();
        }

        let settingsButton: HTMLButtonElement = document.createElement("button");
        settingsButton.id = "singleplayerSettingsButton_id";
        settingsButton.classList.add("gameMenuButtons");
        settingsButton.classList.add("diceCupButtons");
        document.getElementById("singleplayerMenuLeftButtonArea_id").appendChild(settingsButton);

        let settingsIcon: HTMLImageElement = document.createElement("img");
        settingsIcon.classList.add("diceCupButtonsIcons");
        settingsIcon.src = "Game/Assets/images/menuButtons/settings.svg";
        settingsButton.appendChild(settingsIcon);

        settingsButton.addEventListener("click", () => {
        });

        let startButton: HTMLButtonElement = document.createElement("button");
        startButton.id = "singleplayerStartButton_id";
        startButton.classList.add("gameMenuStartButtons");
        startButton.classList.add("gameMenuButtons");
        startButton.classList.add("diceCupButtons");
        startButton.innerHTML = "START";
        document.getElementById("singleplayerMenuRightButtonArea_id").appendChild(startButton);

        startButton.addEventListener("click", () => {
            createGameSettings();
        });
    }

    function createGameSettings(): void {
        let bots: number = document.querySelectorAll(".botContainer").length;
        botSettings = [];
        
        for (let i = 0; i < bots; i++) {
            botSettings.push({botName: (<HTMLInputElement>document.getElementById("botName_id_" + i)).placeholder, difficulty: BotDifficulty.easy})
        }
        
        gameSettings = {playerName: (<HTMLInputElement>document.getElementById("playerName_id")).placeholder, bot: botSettings};

        if ((<HTMLInputElement>document.getElementById("playerName_id")).value) {
            gameSettings.playerName = (<HTMLInputElement>document.getElementById("playerName_id")).value;
        }

        for (let i = 0; i < bots; i++) {
            if ((<HTMLInputElement>document.getElementById("botName_id_" + i)).value) {
                botSettings[i].botName = (<HTMLInputElement>document.getElementById("botName_id_" + i)).value;
            }
            if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == BotDifficulty[0]) {
                botSettings[i].difficulty = BotDifficulty.easy;
            } else if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == BotDifficulty[1]){
                botSettings[i].difficulty = BotDifficulty.normal;
            } else if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == BotDifficulty[2]) {
                botSettings[i].difficulty = BotDifficulty.hard;
            }
        }

        let playerNames: string[] = [gameSettings.playerName];
        for (let index = 0; index < gameSettings.bot.length; index++) {
            playerNames.push(gameSettings.bot[index].botName);
        }

        if (!checkPlayernames(playerNames)) {
            ƒ.Time.game.setTimer(1000, 1, () => {document.getElementById("singleplayerAlert_id").innerHTML = ""});
        } else {
            hideMenu();
            changeGameState(GameState.init);
        }
    }

    function checkPlayernames(_names: string[]): boolean {
        let test: string[] = _names.filter((item, index) => _names.indexOf(item) !== index);
        console.log(test)
        for (let i = 0; i < _names.length; i++) {
            if (!/^[A-Za-z0-9]*$/.test(_names[i])) {
                document.getElementById("singleplayerAlert_id").innerHTML = "Only alphabetic and numeric tokens!";
                return false;
            }
            if (test.length != 0) {
                document.getElementById("singleplayerAlert_id").innerHTML = "No same names!";
                return false;
            }
        }
        return true;
    }

    function createPlayerPortrait(): void {
        let playerContainer: HTMLDivElement = document.createElement("div");
        playerContainer.id = "playerContainer_id";
        playerContainer.classList.add("lobbyContainer");
        playerContainer.style.order = "0";
        document.getElementById("singleplayerMenuContent_id").appendChild(playerContainer);

        let playerDiv: HTMLButtonElement = document.createElement("button");
        playerDiv.id = "playerPortrait_id";
        playerDiv.classList.add("lobbyPortrait");
        playerDiv.classList.add("lobbyPortrait_active");
        playerDiv.classList.add("diceCupButtons");
        playerContainer.appendChild(playerDiv);

        let playerIcons: HTMLImageElement = document.createElement("img");
        playerIcons.classList.add("lobbyPortraitIcons");
        playerIcons.src = "Game/Assets/images/menuButtons/player.svg";
        playerDiv.appendChild(playerIcons);

        let playerName: HTMLInputElement = document.createElement("input");
        playerName.id = "playerName_id";
        playerName.classList.add("nameInputs");
        playerName.placeholder = "Player";
        playerContainer.appendChild(playerName);

        let difficultySwitchHidden: HTMLDivElement = document.createElement("div");
        difficultySwitchHidden.classList.add("difficultySwitch");
        difficultySwitchHidden.style.visibility = "hidden";
        playerContainer.appendChild(difficultySwitchHidden);
    }

    function createBotPortrait(): void {
        let botContainer: HTMLDivElement = document.createElement("div");
        botContainer.id = "botContainer_id_" + botCounter;
        botContainer.classList.add("botContainer");
        botContainer.classList.add("lobbyContainer");
        botContainer.style.order = "1";
        document.getElementById("singleplayerMenuContent_id").appendChild(botContainer);

        let botDiv: HTMLButtonElement = document.createElement("button");
        botDiv.id = "botPortrait_id_" + botCounter;
        botDiv.classList.add("lobbyPortrait");
        botDiv.classList.add("lobbyPortrait_active");
        botDiv.classList.add("diceCupButtons");
        botDiv.disabled = true;
        botContainer.appendChild(botDiv);

        if (botCounter > 0) {
            let botRemove: HTMLButtonElement = document.createElement("button");
            botRemove.id = "botRemove_id_" + botCounter;
            botRemove.classList.add("removeButton");
            botDiv.appendChild(botRemove);
            botRemove.addEventListener("click", handleRemoveBot);

            let botRemoveIcon: HTMLImageElement = document.createElement("img");
            botRemoveIcon.classList.add("removeButtonIcons");
            botRemoveIcon.src = "Game/Assets/images/menuButtons/minus.svg";
            botRemove.appendChild(botRemoveIcon);
        }

        let botIcons: HTMLImageElement = document.createElement("img");
        botIcons.classList.add("lobbyPortraitIcons");
        botIcons.src = "Game/Assets/images/menuButtons/bot.svg";
        botDiv.appendChild(botIcons);

        let botName: HTMLInputElement = document.createElement("input");
        botName.id = "botName_id_" + botCounter;
        botName.placeholder = "Agent" + Math.floor((Math.random() * 99));
        botName.classList.add("nameInputs");
        botContainer.appendChild(botName);

        let difficultySwitch: HTMLDivElement = document.createElement("div");
        difficultySwitch.classList.add("difficultySwitch");
        botContainer.appendChild(difficultySwitch);

        let switchButtonLeft: HTMLButtonElement = document.createElement("button");
        switchButtonLeft.classList.add("switchDifficulty");
        difficultySwitch.appendChild(switchButtonLeft);

        let switchButtonLeftIcon: HTMLImageElement = document.createElement("img");
        switchButtonLeftIcon.classList.add("switchButtonIcons");
        switchButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        switchButtonLeft.appendChild(switchButtonLeftIcon);

        let difficultySwitchText: HTMLDivElement = document.createElement("div");
        difficultySwitchText.classList.add("switchDifficultyText");
        // difficultySwitchText.classList.add("scrollContainer");
        difficultySwitch.appendChild(difficultySwitchText);

        let difficultyText: HTMLSpanElement = document.createElement("span");
        // difficultyText.classList.add("scrollText");
        difficultyText.id = "switchDifficultyText_id_" + botCounter;
        difficultyText.innerHTML = BotDifficulty[chosenDifficulty];
        difficultySwitchText.appendChild(difficultyText);

        let switchButtonRight: HTMLButtonElement = document.createElement("button");
        switchButtonRight.classList.add("switchDifficulty");
        difficultySwitch.appendChild(switchButtonRight);

        let switchButtonRightIcon: HTMLImageElement = document.createElement("img");
        switchButtonRightIcon.classList.add("switchButtonIcons");
        switchButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        switchButtonRight.appendChild(switchButtonRightIcon);

        switchButtonRight.addEventListener("click", () => {
            if (chosenDifficulty < 2) {
                chosenDifficulty++;
            } else {
                chosenDifficulty = 0;
            }
            difficultyText.innerHTML = BotDifficulty[chosenDifficulty];
        });
        switchButtonLeft.addEventListener("click", () => {
            if (chosenDifficulty > 0) {
                chosenDifficulty--;
            } else {
                chosenDifficulty = 2;
            }
            difficultyText.innerHTML = BotDifficulty[chosenDifficulty];
        });
    }

    function createAddPortrait(): void {
        let addContainer: HTMLDivElement = document.createElement("div");
        addContainer.classList.add("addContainer");
        addContainer.classList.add("lobbyContainer");
        addContainer.style.order = "2";
        document.getElementById("singleplayerMenuContent_id").appendChild(addContainer);

        let addPlayerDiv: HTMLButtonElement = document.createElement("button");
        addPlayerDiv.classList.add("lobbyPortrait");
        addPlayerDiv.classList.add("lobbyPortrait_inactive");
        addPlayerDiv.classList.add("diceCupButtons");
        addContainer.appendChild(addPlayerDiv);

        let addIcons: HTMLImageElement = document.createElement("img");
        addIcons.classList.add("lobbyPortraitIcons");
        addIcons.src = "Game/Assets/images/menuButtons/plus.svg";
        addPlayerDiv.appendChild(addIcons);

        addPlayerDiv.addEventListener("click", handleAddBot);
    }

    function handleAddBot(_event: Event): void {
        botCounter++;
        this.parentElement.remove();
        createBotPortrait();
    }

    function handleRemoveBot(_event: Event): void {
        botCounter--;
        this.parentElement.parentElement.remove();
        createAddPortrait();
    }
}