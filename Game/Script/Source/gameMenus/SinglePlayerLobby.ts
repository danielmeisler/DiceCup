namespace DiceCup {
    import ƒ = FudgeCore;
    let botSettings: BotDao[];
    let firstBot: number = 0;
    let botCount: number = 0;
    let chosenDifficulty: number = 1;

    export function singleplayerMenu(): void {
        new SubMenu(MenuPage.singleplayer, "singleplayer", language.menu.singleplayer.lobby.title);
        let localCount: number[] = JSON.parse(localStorage.getItem("difficulties")) ?? [1];
        let botCounter: number = localCount.length ?? localCount[0];

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
        });

        let startButton: HTMLButtonElement = document.createElement("button");
        startButton.id = "singleplayerStartButton_id";
        startButton.classList.add("gameMenuStartButtons");
        startButton.classList.add("gameMenuButtons");
        startButton.classList.add("diceCupButtons");
        document.getElementById("singleplayerMenuRightButtonArea_id").appendChild(startButton);

        let startText: HTMLSpanElement = document.createElement("span");
        startText.id = "singleplayerStartText_id";
        startText.innerHTML = language.menu.singleplayer.lobby.start_button;
        startButton.appendChild(startText);

        startButton.addEventListener("click", () => {
            playSFX(buttonClick);
            nextTrack(1);
            createGameSettings();
        });
    }

    function createGameSettings(): void {
        // let bots: number = document.querySelectorAll(".botContainer").length;
        botSettings = [];
        let ids: string[] = [];

        for (let i = 0, idCounter = 0; i < 5; i++) {
            if ((<HTMLInputElement>document.getElementById("botName_id_" + i))) {
                ids[idCounter] = (<HTMLInputElement>document.getElementById("botName_id_" + i)).placeholder;  
                idCounter++;
            }
        }

        for (let i = 0; i < ids.length; i++) {
            botSettings.push({botName: ids[i], difficulty: BotDifficulty.easy});
        }

        gameSettings = {playerName: (<HTMLInputElement>document.getElementById("playerName_id")).placeholder, bot: botSettings};

        if ((<HTMLInputElement>document.getElementById("playerName_id")).value) {
            gameSettings.playerName = (<HTMLInputElement>document.getElementById("playerName_id")).value;
        }

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

        let playerNames: string[] = [gameSettings.playerName];
        for (let index = 0; index < gameSettings.bot.length; index++) {
            playerNames.push(gameSettings.bot[index].botName);
        }

        if (!checkPlayernames(playerNames)) {
            ƒ.Time.game.setTimer(1000, 1, () => {document.getElementById("singleplayerAlert_id").innerHTML = ""});
        } else {
            hideMenu();
            localStorage.setItem("playernames",JSON.stringify(playerNames));
            localStorage.setItem("difficulties", JSON.stringify(botSettings.map(elem => elem.difficulty)));
            changeGameState(GameState.init);
        }
    }

    function checkPlayernames(_names: string[]): boolean {
        let doubles: string[] = _names.filter((item, index) => _names.indexOf(item) !== index);
        for (let i = 0; i < _names.length; i++) {
            if (!/^[A-Za-z0-9]*$/.test(_names[i])) {
                document.getElementById("singleplayerAlert_id").innerHTML = "Only alphabetic and numeric tokens!";
                return false;
            }
            if (doubles.length != 0) {
                document.getElementById("singleplayerAlert_id").innerHTML = "No identical names!";
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
        let playernames: string[] = JSON.parse(localStorage.getItem("playernames")) ?? [language.menu.player];
        playerName.placeholder = playernames[0];
        playerContainer.appendChild(playerName);

        let difficultySwitchHidden: HTMLDivElement = document.createElement("div");
        difficultySwitchHidden.classList.add("difficultySwitch");
        difficultySwitchHidden.style.visibility = "hidden";
        playerContainer.appendChild(difficultySwitchHidden);
    }

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

        let botName: HTMLInputElement = document.createElement("input");
        botName.id = "botName_id_" + botCount;
        let localBots: number = botCount + 1;
        let playernames: string[] = JSON.parse(localStorage.getItem("playernames")) ?? [];
        botName.placeholder = playernames[localBots] ?? "Agent" + Math.floor((Math.random() * 99));
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
        difficultyText.id = "switchDifficultyText_id_" + botCount;

        let difficulties: string[] = JSON.parse(localStorage.getItem("difficulties")) ?? [];
        difficultyText.innerHTML = difficultyLanguage(BotDifficulty[parseInt(difficulties[botCount])]) ?? difficultyLanguage(BotDifficulty[chosenDifficulty]);
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
            difficultyText.innerHTML = difficultyLanguage(BotDifficulty[chosenDifficulty]);
        });
        switchButtonLeft.addEventListener("click", () => {
            playSFX(buttonClick);
            if (chosenDifficulty > 0) {
                chosenDifficulty--;
            } else {
                chosenDifficulty = 2;
            }
            difficultyText.innerHTML = difficultyLanguage(BotDifficulty[chosenDifficulty]);
        });
        botCount++;
        firstBot++;
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
        addPlayerDiv.addEventListener("click", () => playSFX(buttonClick));
    }

    function handleAddBot(_event: Event): void {
        firstBot++;
        this.parentElement.remove();
        createBotPortrait();
    }

    function handleRemoveBot(_event: Event): void {
        firstBot--;
        botCount--;
        this.parentElement.parentElement.remove();
        createAddPortrait();
    }

    function difficultyLanguage(_difficulty: string): string {
        let diff_lang: string;
        switch (_difficulty) {
            case BotDifficulty[BotDifficulty.easy]:
                diff_lang = language.menu.singleplayer.lobby.difficulties.easy;
                break;
            case BotDifficulty[BotDifficulty.normal]:
                diff_lang = language.menu.singleplayer.lobby.difficulties.normal;
                break;
            case BotDifficulty[BotDifficulty.hard]:
                diff_lang = language.menu.singleplayer.lobby.difficulties.hard;
                break;
            default:
                break;
        }
        return diff_lang;
    }
}