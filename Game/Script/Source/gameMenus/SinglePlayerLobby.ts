namespace DiceCup {
    import ƒ = FudgeCore;

    // -- Variable declaration --

    // Object for the bot settings (names and difficulties)
    let botSettings: BotDao[];
    // Determines the first bot so it can't be removed, because the game needs min one bot
    let firstBot: number = 0;
    // Determines how many bots are added or removed from the lobby
    let botCount: number = 0;
    // Determines the chosen difficulty for each bot
    let chosenDifficulty: number = 1;
    // Stores all names for the game settings
    let allNames: string[] = [];

    // Creates a submenu for the singleplayer lobby with localstorage saved settings or min one bot and random names
    export function singleplayerMenu(): void {
        new SubMenu(MenuPage.singleplayer, "singleplayer", language.menu.singleplayer.lobby.title);
        let localCount: number[] = JSON.parse(localStorage.getItem("difficulties")) ?? [1];
        let botCounter: number = localCount.length ?? localCount[0];

        // Creates Player, Bot and Add Containers
        createPlayerPortrait();
        for (let index = 0; index < botCounter; index++) {
            createBotPortrait();
        }
        for (let index = 0; index < (5 - botCounter); index++) {
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
            playSFX(buttonClick);
            switchMenu(MenuPage.singleplayerGameOptions);
        });

        let startButton: HTMLButtonElement = document.createElement("button");
        startButton.id = "singleplayerStartButton_id";
        startButton.classList.add("gameMenuStartButtons");
        startButton.classList.add("gameMenuButtons");
        startButton.classList.add("diceCupButtons");
        startButton.innerHTML = language.menu.singleplayer.lobby.start_button;
        document.getElementById("singleplayerMenuRightButtonArea_id").appendChild(startButton);

        startButton.addEventListener("click", () => {
            playSFX(buttonClick);
            nextTrack(1);
            createGameSettings();
        });
    }

    // Creates and checks the gamesettings if the player wants to start the game
    function createGameSettings(): void {
        botSettings = [];
        let ids: string[] = [];

        // Gets the bot placeholders at names at first
        for (let i = 0, idCounter = 0; i < 5; i++) {
            if ((<HTMLInputElement>document.getElementById("botName_id_" + i))) {
                ids[idCounter] = (<HTMLInputElement>document.getElementById("botName_id_" + i)).placeholder;  
                idCounter++;
            }
        }

        // Pushes them into the bot settings object with preset settings
        for (let i = 0; i < ids.length; i++) {
            botSettings.push({botName: ids[i], difficulty: BotDifficulty.easy});
        }

        // Initialize the game settings object with the playername and botsettings
        gameSettings_sp = {playerName: (<HTMLInputElement>document.getElementById("playerName_id")).placeholder, bot: botSettings};

        // Gets the playername from the input field
        if ((<HTMLInputElement>document.getElementById("playerName_id")).value) {
            gameSettings_sp.playerName = (<HTMLInputElement>document.getElementById("playerName_id")).value;
        }

        // Gets the new bot names and set difficulties from the input fields
        ids = [];
        for (let i = 0, idCounter = 0; i < 5; i++) {
            if ((<HTMLInputElement>document.getElementById("botName_id_" + i))) {
                if ((<HTMLInputElement>document.getElementById("botName_id_" + i)).value) {
                    botSettings[idCounter].botName = (<HTMLInputElement>document.getElementById("botName_id_" + i)).value;
                }
                if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == language.menu.singleplayer.lobby.difficulties.easy) {
                    botSettings[idCounter].difficulty = BotDifficulty.easy;
                } else if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == language.menu.singleplayer.lobby.difficulties.normal){
                    botSettings[idCounter].difficulty = BotDifficulty.normal;
                } else if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == language.menu.singleplayer.lobby.difficulties.hard) {
                    botSettings[idCounter].difficulty = BotDifficulty.hard;
                }
                idCounter++;
            }
        }

        // Pushes all names in a seperated array
        let playerNames: string[] = [gameSettings_sp.playerName];
        for (let index = 0; index < gameSettings_sp.bot.length; index++) {
            playerNames.push(gameSettings_sp.bot[index].botName);
        }

        // Checks the playername and if the check returns true all game settings are saved in localstorage for next game creation
        // Some enums and booleans get changed and the game starts with gamestate change
        if (checkPlayernames(playerNames)) {
            hideMenu();
            localStorage.setItem("playernames",JSON.stringify(playerNames));
            localStorage.setItem("difficulties", JSON.stringify(botSettings.map(elem => elem.difficulty)));
            playerMode = PlayerMode.singlelpayer;
            inGame = true;
            changeGameState(GameState.init);
        }
    }

    // Checks the playernames with regular expressions for invalid tokens and identical names 
    function checkPlayernames(_names: string[]): boolean {
        let doubles: string[] = _names.filter((item, index) => _names.indexOf(item) !== index);
        for (let i = 0; i < _names.length; i++) {
            if (!/^[A-Za-z0-9_]*$/.test(_names[i])) {
                document.getElementById("singleplayerAlert_id").innerHTML = "Only alphabetic and numeric tokens!";
                ƒ.Time.game.setTimer(1000, 1, () => {document.getElementById("singleplayerAlert_id").innerHTML = ""});
                return false;
            }
            if (doubles.length != 0) {
                document.getElementById("singleplayerAlert_id").innerHTML = "No identical names!";
                ƒ.Time.game.setTimer(1000, 1, () => {document.getElementById("singleplayerAlert_id").innerHTML = ""});
                return false;
            }
        }
        return true;
    }

    // Collects all names and checks them directly with the input of the player
    function collectNames(): void {
        allNames = [];

        if ((<HTMLInputElement>document.getElementById("playerName_id"))) {
            if ((<HTMLInputElement>document.getElementById("playerName_id")).value != "") {
                allNames.push((<HTMLInputElement>document.getElementById("playerName_id")).value);
            } else {
                allNames.push((<HTMLInputElement>document.getElementById("playerName_id")).placeholder);
            }
        }

        for (let i = 0; i < 5; i++) {
            if ((<HTMLInputElement>document.getElementById("botName_id_" + i))) {
                if ((<HTMLInputElement>document.getElementById("botName_id_" + i)).value != "") {
                    allNames.push((<HTMLInputElement>document.getElementById("botName_id_" + i)).value);
                } else {
                    allNames.push((<HTMLInputElement>document.getElementById("botName_id_" + i)).placeholder);
                }
            }
        }

        checkPlayernames(allNames);
    }

    // Creates a player container with localstorage savefiles or factory settings
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

        let nameInputContainer: HTMLDivElement = document.createElement("div");
        nameInputContainer.id = "nameInputContainer_id";
        nameInputContainer.classList.add("nameInputContainer");
        playerContainer.appendChild(nameInputContainer);

        let playerName: HTMLInputElement = document.createElement("input");
        playerName.id = "playerName_id";
        playerName.classList.add("nameInputs");
        let playernames: string[] = JSON.parse(localStorage.getItem("playernames")) ?? [language.menu.player];
        playerName.placeholder = playernames[0];
        nameInputContainer.appendChild(playerName);

        let nameInputButton: HTMLButtonElement = document.createElement("button");
        nameInputButton.id = "nameInputButton_id_player";
        nameInputButton.classList.add("nameInputsButtons");
        nameInputButton.innerHTML = "✔";
        nameInputContainer.appendChild(nameInputButton);

        playerName.addEventListener("click", () => {nameInputButton.style.display = "block"; playerName.classList.add("nameInputsFocused");});

        nameInputButton.addEventListener("click", () => {
            playSFX(buttonClick);
            nameInputButton.style.display = "none";
            playerName.classList.remove("nameInputsFocused");
            collectNames();
        });

        let difficultySwitchHidden: HTMLDivElement = document.createElement("div");
        difficultySwitchHidden.classList.add("difficultySwitch");
        difficultySwitchHidden.style.visibility = "hidden";
        playerContainer.appendChild(difficultySwitchHidden);
    }

    // Creates a bot container with localstorage savefiles or factory settings
    function createBotPortrait(): void {
        let botContainer: HTMLDivElement = document.createElement("div");
        botContainer.id = "botContainer_id_" + botCount;
        botContainer.classList.add("botContainer");
        botContainer.classList.add("lobbyContainer");
        botContainer.style.order = "1";
        document.getElementById("singleplayerMenuContent_id").appendChild(botContainer);

        let botDiv: HTMLButtonElement = document.createElement("button");
        botDiv.id = "botPortrait_id_" + botCount;
        botDiv.classList.add("lobbyPortrait");
        botDiv.classList.add("lobbyPortrait_active");
        botDiv.classList.add("diceCupButtons");
        botDiv.disabled = true;
        botContainer.appendChild(botDiv);

        // Creates the remove bot button on every container except the first bot
        if (firstBot > 0) {
            let botRemove: HTMLButtonElement = document.createElement("button");
            botRemove.id = "botRemove_id_" + botCount;
            botRemove.classList.add("removeButton");
            botDiv.appendChild(botRemove);
            botRemove.addEventListener("click", () => {playSFX(buttonClick)});
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

        let nameInputContainer: HTMLDivElement = document.createElement("div");
        nameInputContainer.id = "nameInputContainer_id" + botCount;
        nameInputContainer.classList.add("nameInputContainer");
        botContainer.appendChild(nameInputContainer);

        let botName: HTMLInputElement = document.createElement("input");
        botName.id = "botName_id_" + botCount;
        let localBots: number = botCount + 1;
        let playernames: string[] = JSON.parse(localStorage.getItem("playernames")) ?? [];
        botName.placeholder = playernames[localBots] ?? "Agent" + Math.floor((Math.random() * 99));
        botName.classList.add("nameInputs");
        nameInputContainer.appendChild(botName);

        // Creates the input field with random generated bot names or selfmade names
        let nameInputButton: HTMLButtonElement = document.createElement("button");
        nameInputButton.id = "nameInputButton_id_" + botCount;
        nameInputButton.classList.add("nameInputsButtons");
        nameInputButton.innerHTML = "✔";
        nameInputContainer.appendChild(nameInputButton);

        botName.addEventListener("click", () => {nameInputButton.style.display = "block"; botName.classList.add("nameInputsFocused");});

        nameInputButton.addEventListener("click", () => {
            playSFX(buttonClick);
            nameInputButton.style.display = "none";
            botName.classList.remove("nameInputsFocused");
            collectNames();
        });

        // Creates the difficulty switch to change the difficulty for each bot
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
        difficultyText.id = "switchDifficultyText_id_" + botCount;

        let difficulties: string[] = JSON.parse(localStorage.getItem("difficulties")) ?? [];
        difficultyText.innerHTML = difficultyTranslation(BotDifficulty[parseInt(difficulties[botCount])]) ?? difficultyTranslation(BotDifficulty[chosenDifficulty]);
        difficultySwitchText.appendChild(difficultyText);

        let switchButtonRight: HTMLButtonElement = document.createElement("button");
        switchButtonRight.classList.add("switchDifficulty");
        difficultySwitch.appendChild(switchButtonRight);

        let switchButtonRightIcon: HTMLImageElement = document.createElement("img");
        switchButtonRightIcon.classList.add("switchButtonIcons");
        switchButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        switchButtonRight.appendChild(switchButtonRightIcon);

        switchButtonRight.addEventListener("click", () => {
            playSFX(buttonClick);
            if (chosenDifficulty < 2) {
                chosenDifficulty++;
            } else {
                chosenDifficulty = 0;
            }
            difficultyText.innerHTML = difficultyTranslation(BotDifficulty[chosenDifficulty]);
        });
        switchButtonLeft.addEventListener("click", () => {
            playSFX(buttonClick);
            if (chosenDifficulty > 0) {
                chosenDifficulty--;
            } else {
                chosenDifficulty = 2;
            }
            difficultyText.innerHTML = difficultyTranslation(BotDifficulty[chosenDifficulty]);
        });
        botCount++;
        firstBot++;
    }

    // Creates an add button to add more bots
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
        addPlayerDiv.addEventListener("click", () => playSFX(buttonClick));
    }

    // Adds a bot to the game and visualizes it with a new bot container
    function handleAddBot(_event: Event): void {
        firstBot++;
        this.parentElement.remove();
        createBotPortrait();
    }

    // Removes a bot to the game and visualizes it with a new add button
    function handleRemoveBot(_event: Event): void {
        firstBot--;
        botCount--;
        this.parentElement.parentElement.remove();
        createAddPortrait();
    }
}