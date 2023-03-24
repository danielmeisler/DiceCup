namespace DiceCup {

    export function playMenu(): void {
        let spMenu: HTMLDivElement = document.createElement("div");
        spMenu.id = "singleplayerMenu_id";
        spMenu.classList.add("gameMenus");
        document.querySelector("body").appendChild(spMenu);

        let spMenuTitle: HTMLDivElement = document.createElement("div");
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
        switchButtonLeft.innerHTML = "◄";
        difficultySwitch.appendChild(switchButtonLeft);

        let chosenDifficulty: number = 0;

        let difficultySwitchText: HTMLElement = document.createElement("div");
        difficultySwitchText.classList.add("switchDifficultyText");
        difficultySwitchText.innerHTML = BotDifficulty[chosenDifficulty];
        difficultySwitch.appendChild(difficultySwitchText);

        let switchButtonRight: HTMLButtonElement = document.createElement("button");
        switchButtonRight.classList.add("switchDifficulty");
        switchButtonRight.innerHTML = "►";
        difficultySwitch.appendChild(switchButtonRight);

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