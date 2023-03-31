namespace DiceCup {

    export function playMenu(): void {
        let spMenu: HTMLDivElement = document.createElement("div");
        spMenu.id = "singleplayerMenu_id";
        spMenu.classList.add("gameMenus");
        spMenu.style.visibility = "hidden";
        document.getElementById("gameMenu_id").appendChild(spMenu);

        let spMenuTitle: HTMLSpanElement = document.createElement("span");
        spMenuTitle.id = "singlePlayerMenuTitle_id";
        spMenuTitle.innerHTML = "SINGLEPLAYER";
        spMenu.appendChild(spMenuTitle);

        let lobbyPortraits: HTMLDivElement = document.createElement("div");
        lobbyPortraits.id = "lobbyPortraits_id";
        spMenu.appendChild(lobbyPortraits);

        createPlayerPortrait();
        createBotPortrait();
        for (let index = 0; index < 4; index++) {
            createAddPortrait();
        }

        let buttonArea: HTMLDivElement = document.createElement("div");
        buttonArea.id = "buttonArea_id";
        spMenu.appendChild(buttonArea);

        let leftButtonArea: HTMLDivElement = document.createElement("div");
        leftButtonArea.id = "leftButtonArea_id";
        buttonArea.appendChild(leftButtonArea);

        let rightButtonArea: HTMLDivElement = document.createElement("div");
        rightButtonArea.id = "rightButtonArea_id";
        buttonArea.appendChild(rightButtonArea);
        
        let returnButton: HTMLButtonElement = document.createElement("button");
        returnButton.id = "returnButton_id";
        returnButton.classList.add("buttonArea");
        returnButton.classList.add("diceCupButtons");
        leftButtonArea.appendChild(returnButton);

        let returnIcon: HTMLImageElement = document.createElement("img");
        returnIcon.classList.add("buttonAreaIcons");
        returnIcon.src = "Game/Assets/images/menuButtons/return.svg";
        returnButton.appendChild(returnIcon);
        returnButton.addEventListener("click", () => {
            switchMenu(MenuPages.singleplayer, MenuPages.main);
        });

        let settingsButton: HTMLButtonElement = document.createElement("button");
        settingsButton.id = "settingsButton_id";
        settingsButton.classList.add("buttonArea");
        settingsButton.classList.add("diceCupButtons");
        leftButtonArea.appendChild(settingsButton);

        let settingsIcon: HTMLImageElement = document.createElement("img");
        settingsIcon.classList.add("buttonAreaIcons");
        settingsIcon.src = "Game/Assets/images/menuButtons/settings.svg";
        settingsButton.appendChild(settingsIcon);

        let startButton: HTMLButtonElement = document.createElement("button");
        startButton.id = "startButton_id";
        startButton.classList.add("buttonArea");
        startButton.classList.add("diceCupButtons");
        startButton.innerHTML = "START";
        rightButtonArea.appendChild(startButton);

        startButton.addEventListener("click", () => {
            document.getElementById("gameMenu_id").style.display = "none";
            initTransition();
        });
    }

    function createPlayerPortrait(): void {
        let playerContainer: HTMLDivElement = document.createElement("div");
        playerContainer.id = "playerContainer_id";
        playerContainer.classList.add("lobbyContainer");
        playerContainer.style.order = "0";
        document.getElementById("lobbyPortraits_id").appendChild(playerContainer);

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
        botContainer.id = "botContainer_id";
        botContainer.classList.add("lobbyContainer");
        botContainer.style.order = "1";
        document.getElementById("lobbyPortraits_id").appendChild(botContainer);

        let botDiv: HTMLButtonElement = document.createElement("button");
        botDiv.id = "botPortrait_id";
        botDiv.classList.add("lobbyPortrait");
        botDiv.classList.add("lobbyPortrait_active");
        botDiv.classList.add("diceCupButtons");
        botDiv.disabled = true;
        botContainer.appendChild(botDiv);

        let botRemove: HTMLButtonElement = document.createElement("button");
        botRemove.id = "botRemove_id";
        botRemove.classList.add("botRemove");
        botDiv.appendChild(botRemove);
        botRemove.addEventListener("click", handleRemovePlayer);

        let botRemoveIcon: HTMLImageElement = document.createElement("img");
        botRemoveIcon.classList.add("botRemoveIcons");
        botRemoveIcon.src = "Game/Assets/images/menuButtons/minus.svg";
        botRemove.appendChild(botRemoveIcon);

        let botIcons: HTMLImageElement = document.createElement("img");
        botIcons.classList.add("lobbyPortraitIcons");
        botIcons.src = "Game/Assets/images/menuButtons/bot.svg";
        botDiv.appendChild(botIcons);

        let botName: HTMLInputElement = document.createElement("input");
        botName.id = "botName_id";
        botName.placeholder = "Agent";
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

        let chosenDifficulty: number = 0;

        let difficultySwitchText: HTMLElement = document.createElement("div");
        difficultySwitchText.classList.add("switchDifficultyText");
        difficultySwitchText.innerHTML = BotDifficulty[chosenDifficulty];
        difficultySwitch.appendChild(difficultySwitchText);

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
            difficultySwitchText.innerHTML = BotDifficulty[chosenDifficulty];
        });
        switchButtonLeft.addEventListener("click", () => {
            if (chosenDifficulty > 0) {
                chosenDifficulty--;
            } else {
                chosenDifficulty = 2;
            }
            difficultySwitchText.innerHTML = BotDifficulty[chosenDifficulty];
        });
    }

    function createAddPortrait(): void {
        let addContainer: HTMLDivElement = document.createElement("div");
        addContainer.id = "addContainer_id";
        addContainer.classList.add("lobbyContainer");
        addContainer.style.order = "2";
        document.getElementById("lobbyPortraits_id").appendChild(addContainer);

        let addPlayerDiv: HTMLButtonElement = document.createElement("button");
        addPlayerDiv.classList.add("lobbyPortrait");
        addPlayerDiv.classList.add("lobbyPortrait_inactive");
        addPlayerDiv.classList.add("diceCupButtons");
        addContainer.appendChild(addPlayerDiv);

        let addIcons: HTMLImageElement = document.createElement("img");
        addIcons.classList.add("lobbyPortraitIcons");
        addIcons.src = "Game/Assets/images/menuButtons/plus.svg";
        addPlayerDiv.appendChild(addIcons);

        addPlayerDiv.addEventListener("click", handleAddPlayer);
    }

    function handleAddPlayer(_event: Event): void {
        this.parentElement.remove();
        createBotPortrait();
    }

    function handleRemovePlayer(_event: Event): void {
        this.parentElement.parentElement.remove();
        createAddPortrait();
    }
}