"use strict";
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(DiceCup); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    DiceCup.CustomComponentScript = CustomComponentScript;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Dice Cup is running!");
    DiceCup.inGame = false;
    DiceCup.helpCategoryHud = true;
    document.addEventListener("interactiveViewportStarted", start);
    // Start function when the application is loaded
    // Enables wakelock and starts the load process while showing the loading screen with fudge logo
    function start(_event) {
        DiceCup.viewport = _event.detail;
        DiceCup.enableWakeLock();
        DiceCup.playSFX(DiceCup.buttonClick);
        ƒ.Time.game.setTimer(2000, 1, load);
    }
    // Loads all required resources for the game while showing the loading screen
    async function load() {
        // Resizes the resolution
        await DiceCup.resizeScreenresolution();
        // Creates a DiceCup div so all divs are hidden and well-ordered
        let diceCup = document.createElement("div");
        diceCup.id = "DiceCup";
        document.querySelector("body").appendChild(diceCup);
        // Gets the main graph and sets up the audio manager
        let graph = DiceCup.viewport.getBranch();
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.AudioManager.default.listenTo(graph);
        // Declares needed variables for the game like language etc.
        DiceCup.categoriesLength = Object.keys(DiceCup.ScoringCategory).length / 2;
        DiceCup.dicesLength = Object.keys(DiceCup.DiceColor).length;
        DiceCup.gameMode = parseInt(localStorage.getItem("gamemode")) || DiceCup.GameMode.normal;
        DiceCup.currentLanguage = localStorage.getItem("language") || DiceCup.Languages.english;
        // Starts the client, the menus and loads the chosen language and viewport state
        await DiceCup.initBackgroundMusic(0);
        await DiceCup.chooseLanguage(DiceCup.currentLanguage);
        await DiceCup.changeViewportState(DiceCup.ViewportState.menu);
        await DiceCup.initMenu();
        DiceCup.startClient();
        // Removes the loading screen when finished with loading
        document.getElementById("loadingScreen").remove();
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // -- Variable declaration --
    // Categories the player picks will be removed from this array
    DiceCup.freePlayerCategories = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    // The time for picking a category
    let categoryTime = 10;
    // Boolean to check if the timer is over
    let timerOver = false;
    // Timer ID of the category timer so we can delete it etc.
    let timerID;
    // TimerBar object to visualize the time and reset it
    let timerBar;
    //  Initialize the category panel with the buttons etc. at the beginning
    async function initCategories() {
        let response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories = await response.json();
        let background = document.createElement("div");
        background.id = "categoryBackground_id";
        document.getElementById("DiceCup").appendChild(background);
        let container = document.createElement("div");
        container.classList.add("categoriesHidden");
        container.id = "categoryContainer_id";
        background.appendChild(container);
        let header = document.createElement("div");
        header.id = "categoryHeader_id";
        container.appendChild(header);
        let timer = document.createElement("div");
        timer.id = "categoryTimer_id";
        header.appendChild(timer);
        let title = document.createElement("span");
        title.id = "categoryTitle_id";
        title.innerHTML = DiceCup.language.game.categories.title;
        header.appendChild(title);
        let content = document.createElement("div");
        content.id = "categoryContent_id";
        container.appendChild(content);
        // Creates every category button with adds event listener
        // Deletes timer if player picked a category right in time
        for (let i = 0; i < DiceCup.categoriesLength; i++) {
            let button = document.createElement("button");
            button.classList.add("categoryButtons");
            button.classList.add("diceCupButtons");
            button.id = "categoryButtons_id_" + i;
            button.setAttribute("index", i.toString());
            if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
                timerID ?? button.addEventListener("click", () => { ƒ.Time.game.deleteTimer(timerID), timerBar.resetTimer(); });
            }
            button.addEventListener("click", handleCategory);
            button.addEventListener("click", () => { DiceCup.playSFX(DiceCup.buttonClick), blockClicks(); });
            content.appendChild(button);
            let img = document.createElement("img");
            img.src = categories[i].image;
            img.classList.add("categoryImages");
            img.id = "categoryImage_i_" + i;
            button.appendChild(img);
            let points = document.createElement("span");
            points.id = "categoryPoints_id_" + i;
            points.classList.add("categoryPoints");
            button.appendChild(points);
        }
        visibility("hidden");
    }
    DiceCup.initCategories = initCategories;
    // Shows the category panel every round in the category phase
    async function showCategories() {
        // If the player has only one category left it means it's the last round and it can be picked automatically without player input.
        if (DiceCup.freePlayerCategories.length == 1) {
            addPointsToButton(DiceCup.freePlayerCategories[0]);
            // Singleplayer: Bots play their final round
            // Multiplayer: Switching to th last validating state 
            if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
                DiceCup.changeGameState(DiceCup.GameState.validating);
            }
            else {
                DiceCup.botTurn();
            }
        }
        else {
            document.getElementById("categoryContainer_id").classList.add("categoriesShown");
            document.getElementById("categoryContainer_id").classList.remove("categoriesHidden");
            document.getElementById("categoryBackground_id").classList.add("emptyBackground");
            document.getElementById("categoryBackground_id").style.zIndex = "10";
            ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible"); });
            // The timer is only available in the multiplayer
            if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
                timerBar = new DiceCup.TimerBar("categoryTimer_id", categoryTime);
                timerOver = false;
                timerID = ƒ.Time.game.setTimer(categoryTime * 1000, 1, () => {
                    document.getElementById("categoryButtons_id_" + DiceCup.freePlayerCategories[Math.floor(Math.random() * DiceCup.freePlayerCategories.length)]).click();
                    timerOver = true;
                });
            }
        }
    }
    DiceCup.showCategories = showCategories;
    // Hides the panel once timer expires or category has been picked
    function hideCategories() {
        document.getElementById("categoryContainer_id").classList.remove("categoriesShown");
        document.getElementById("categoryContainer_id").classList.add("categoriesHidden");
        document.getElementById("categoryBackground_id").classList.remove("emptyBackground");
        document.getElementById("categoryBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden"); });
    }
    DiceCup.hideCategories = hideCategories;
    // Toggles the visibility of the panel
    function visibility(_visibility) {
        document.getElementById("categoryBackground_id").style.visibility = _visibility;
    }
    // Handles the picked category and changes the panel every round
    async function handleCategory(_event) {
        let index = parseInt(_event.currentTarget.getAttribute("index"));
        document.getElementById("categoryImage_i_" + _event.currentTarget.getAttribute("index")).classList.add("categoryImagesTransparent");
        this.disabled = true;
        let tempArray = DiceCup.freePlayerCategories.filter((element) => element !== index);
        DiceCup.freePlayerCategories = tempArray;
        hideCategories();
        // Singleplayer: The bots pick their categories now
        // Multiplayer: Everyone waits until everyone has chosen a category 
        if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
            DiceCup.waitForPlayerValidation();
        }
        else if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
            DiceCup.lastPickedCategory = index;
            DiceCup.botTurn();
        }
        ƒ.Time.game.setTimer(2000, 1, () => { addPointsToButton(index); });
    }
    // Adds the gotten points for the picked category on the buttons after a little delay so it's only visible next round
    function addPointsToButton(_index) {
        let valuation = new DiceCup.Valuation(_index, DiceCup.dices, true);
        let value = valuation.chooseScoringCategory();
        value = timerOver ? 0 : value;
        timerOver = false;
        timerID ?? ƒ.Time.game.deleteTimer(timerID);
        if (DiceCup.playerMode ?? DiceCup.PlayerMode.multiplayer) {
            timerBar.resetTimer();
        }
        document.getElementById("categoryPoints_id_" + _index).innerHTML = value.toString();
        document.getElementById("categoryImage_i_" + _index).classList.add("categoryImagesTransparent");
        DiceCup.hideHudCategory(_index);
        DiceCup.handleSummary(value, _index);
        unblockClicks();
        DiceCup.changeGameState(DiceCup.GameState.validating);
    }
    // Blocks clicks/taps of all buttons so the player can't pick more than one category
    function blockClicks() {
        for (let i = 0; i < DiceCup.categoriesLength; i++) {
            document.getElementById("categoryButtons_id_" + i).disabled = true;
        }
    }
    // Unblocks the clicks/taps so the player can pick a category again in the next round
    function unblockClicks() {
        for (let i = 0; i < DiceCup.freePlayerCategories.length; i++) {
            document.getElementById("categoryButtons_id_" + DiceCup.freePlayerCategories[i]).disabled = false;
        }
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // Initialize the Hud in beginners state
    async function initHud() {
        let response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories = await response.json();
        let domHud = document.createElement("div");
        domHud.id = "hud_id";
        document.getElementById("DiceCup").appendChild(domHud);
        let timerContainer = document.createElement("div");
        timerContainer.id = "hudTimerContainer_id";
        domHud.appendChild(timerContainer);
        let timer = document.createElement("div");
        timer.id = "hudTimer_id";
        timerContainer.appendChild(timer);
        let valuationContainer = document.createElement("div");
        valuationContainer.id = "valuationContainer_id";
        valuationContainer.style.visibility = DiceCup.helpCategoryHud ? "visibie" : "hidden";
        domHud.appendChild(valuationContainer);
        for (let i = 0; i < DiceCup.categoriesLength; i++) {
            let valuationButton = document.createElement("div");
            valuationButton.classList.add("valuation");
            valuationButton.classList.add("valuationShow");
            valuationButton.id = "valuation_id_" + i;
            valuationContainer.appendChild(valuationButton);
            let icon = document.createElement("div");
            icon.classList.add("valuationIcon");
            valuationButton.appendChild(icon);
            let valuationImage = document.createElement("img");
            valuationImage.src = categories[i].image;
            valuationImage.classList.add("valuationImage");
            valuationImage.id = "valuationImage_i_" + i;
            icon.appendChild(valuationImage);
            let score = document.createElement("div");
            score.classList.add("valuationScore");
            valuationButton.appendChild(score);
        }
    }
    DiceCup.initHud = initHud;
    // Shows the hud every round
    function showHud() {
        for (let i = 0; i < DiceCup.categoriesLength; i++) {
            document.getElementById("valuation_id_" + i).classList.remove("valuationHidden");
            document.getElementById("valuation_id_" + i).classList.add("valuationShow");
        }
    }
    DiceCup.showHud = showHud;
    // Hides single categories after getting picked from players
    function hideHudCategory(_id) {
        document.getElementById("valuation_id_" + _id).classList.remove("valuationShow");
        document.getElementById("valuation_id_" + _id).classList.add("valuationHidden");
    }
    DiceCup.hideHudCategory = hideHudCategory;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // -- Variable declaration --
    // Variable to store the players place in rank
    let place = 0;
    // Initialize the placements screen with empty containers and content
    function initPlacements() {
        let background = document.createElement("div");
        background.id = "placementsBackground_id";
        document.getElementById("DiceCup").appendChild(background);
        let container = document.createElement("div");
        container.classList.add("placementsHidden");
        container.id = "placementsContainer_id";
        background.appendChild(container);
        let placementTitle = document.createElement("span");
        placementTitle.id = "placementsTitle_id";
        placementTitle.innerHTML = DiceCup.language.game.placements.title;
        container.appendChild(placementTitle);
        let placementPortraits = document.createElement("div");
        placementPortraits.id = "placementsPortraits_id";
        container.appendChild(placementPortraits);
        createPlacements();
        let placementsBottomArea = document.createElement("div");
        placementsBottomArea.id = "placementsBottomArea_id";
        container.appendChild(placementsBottomArea);
        let replayButton = document.createElement("button");
        replayButton.id = "replayButton_id";
        replayButton.classList.add("diceCupButtons");
        placementsBottomArea.appendChild(replayButton);
        let replayButtonImage = document.createElement("img");
        replayButtonImage.classList.add("diceCupButtonsIcons");
        replayButtonImage.src = "Game/Assets/images/menuButtons/renew.svg";
        replayButton.appendChild(replayButtonImage);
        replayButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
                DiceCup.gameOver(DiceCup.MenuPage.singleplayer);
            }
            else if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: DiceCup.currentRoom } });
                DiceCup.gameOver(DiceCup.MenuPage.multiplayerLobby);
            }
        });
        let placementPhrase = document.createElement("span");
        placementPhrase.id = "placementsPhrase_id";
        placementsBottomArea.appendChild(placementPhrase);
        let nextButton = document.createElement("button");
        nextButton.id = "nextButton_id";
        nextButton.classList.add("diceCupButtons");
        placementsBottomArea.appendChild(nextButton);
        let nextButtonImage = document.createElement("img");
        nextButtonImage.classList.add("diceCupButtonsIcons");
        nextButtonImage.src = "Game/Assets/images/menuButtons/home.svg";
        nextButton.appendChild(nextButtonImage);
        nextButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (DiceCup.playerMode = DiceCup.PlayerMode.multiplayer) {
                DiceCup.clientLeavesRoom();
            }
            DiceCup.gameOver(DiceCup.MenuPage.main);
        });
        visibility("hidden");
    }
    DiceCup.initPlacements = initPlacements;
    // Creates a placements container for one player with empty content
    function createPlacements() {
        for (let i = 0; i < 6; i++) {
            let placementsContainer = document.createElement("div");
            placementsContainer.id = "placementsContainer_id_" + i;
            placementsContainer.classList.add("placementsContainer");
            document.getElementById("placementsPortraits_id").appendChild(placementsContainer);
            let placementsDiv = document.createElement("div");
            placementsDiv.id = "placementsPlayerPortrait_id_" + i;
            placementsDiv.classList.add("placementsPortrait");
            placementsDiv.classList.add("diceCupButtons");
            placementsContainer.appendChild(placementsDiv);
            let playerIcons = document.createElement("img");
            playerIcons.id = "placementsPlayerIcons_id_" + i;
            playerIcons.classList.add("placementsPortraitIcons");
            playerIcons.src = "Game/Assets/images/menuButtons/bot.svg";
            placementsDiv.appendChild(playerIcons);
            let playerName = document.createElement("div");
            playerName.id = "playerName_id_" + i;
            playerName.classList.add("placementsNames");
            placementsContainer.appendChild(playerName);
            let points = document.createElement("div");
            points.id = "placementsPoints_id_" + i;
            points.classList.add("placementsPoints");
            placementsContainer.appendChild(points);
            let placement = document.createElement("div");
            placement.id = "placementsOrder_id_" + i;
            placement.classList.add("placementsOrder");
            placementsDiv.appendChild(placement);
        }
    }
    // Updates the content after final round with names, points and place in the right order
    function updatePlacements() {
        let name = [];
        let points = [];
        let bots = [];
        // Singleplayer: Gets the names from the singleplayer gamesetting object
        // Multiplayer: Gets the names from all multiplayer player
        if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
            bots = DiceCup.gameSettings_sp.bot;
        }
        else if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
            DiceCup.playerNames = DiceCup.playerNames.filter(name => name != "");
        }
        // Gets names and points from the summary table
        for (let i = 0; i < DiceCup.playerNames.length; i++) {
            name[i] = document.querySelector("#summaryText_id_" + DiceCup.playerNames[i] + "_playerNames").innerHTML;
            points[i] = parseInt(document.querySelector("#summaryText_id_" + DiceCup.playerNames[i] + "_sum").innerHTML);
        }
        // Sorts the placements with bubble sort
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points.length; j++) {
                if (points[j] < points[j + 1]) {
                    [points[j], points[j + 1]] = [points[j + 1], points[j]];
                    [name[j], name[j + 1]] = [name[j + 1], name[j]];
                }
            }
        }
        // Hides the unused containers if less then max players
        for (let i = 0; i < 6; i++) {
            if (i >= DiceCup.playerNames.length) {
                document.getElementById("placementsContainer_id_" + i).style.display = "none";
            }
        }
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < bots.length; j++) {
                // Chooses icon if the player is a real human or a bot
                if (name[i] == bots[j].botName) {
                    document.getElementById("placementsPlayerIcons_id_" + i).src = "Game/Assets/images/menuButtons/bot.svg";
                    break;
                }
                else {
                    document.getElementById("placementsPlayerIcons_id_" + i).src = "Game/Assets/images/menuButtons/player.svg";
                }
            }
            // Fills the container 
            document.getElementById("playerName_id_" + i).innerHTML = name[i];
            document.getElementById("placementsPoints_id_" + i).innerHTML = points[i].toString();
            document.getElementById("placementsOrder_id_" + i).innerHTML = (i + 1).toString();
            // Singleplayer: Shows placement phrase for player
            // Multiplayer: Shows individual placement phrase for each player and send message to server that the game has ended
            if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
                if (name[i] == DiceCup.gameSettings_sp.playerName) {
                    place = i + 1;
                    document.getElementById("placementsPhrase_id").innerHTML = DiceCup.language.game.placements.placement.part_1 + " " + place + ". " + DiceCup.language.game.placements.placement.part_2;
                }
            }
            else if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
                if (name[i] == DiceCup.gameSettings_mp.playerNames[DiceCup.clientPlayerNumber]) {
                    place = i + 1;
                    document.getElementById("placementsPhrase_id").innerHTML = DiceCup.language.game.placements.placement.part_1 + " " + place + ". " + DiceCup.language.game.placements.placement.part_2;
                }
            }
        }
        if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
            DiceCup.client.dispatch({ command: FudgeNet.COMMAND.END_GAME, route: FudgeNet.ROUTE.SERVER });
        }
    }
    DiceCup.updatePlacements = updatePlacements;
    // Shows placement screen at the end of the game
    function showPlacements() {
        document.getElementById("placementsContainer_id").classList.add("placementsShown");
        document.getElementById("placementsContainer_id").classList.remove("placementsHidden");
        document.getElementById("placementsBackground_id").classList.add("emptyBackground");
        document.getElementById("placementsBackground_id").style.zIndex = "10";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible"), placementsSounds(); });
    }
    DiceCup.showPlacements = showPlacements;
    // Hides placement screen after leaving it
    function hidePlacements() {
        document.getElementById("placementsContainer_id").classList.remove("placementsShown");
        document.getElementById("placementsContainer_id").classList.add("placementsHidden");
        document.getElementById("placementsBackground_id").classList.remove("emptyBackground");
        document.getElementById("placementsBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden"); });
    }
    DiceCup.hidePlacements = hidePlacements;
    // Toggles visibility of the placement screen
    function visibility(_visibility) {
        document.getElementById("placementsBackground_id").style.visibility = _visibility;
    }
    // Plays sounds after arriving at the end of the game
    function placementsSounds() {
        DiceCup.playSFX("Audio|2023-05-18T21:20:15.907Z|47241");
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // -- Variable declaration --
    // Gets all playernames for the summary table
    DiceCup.playerNames = [];
    // Stores the last points so it can be highlighted
    DiceCup.lastPoints = [];
    // The time for the summary phase
    let summaryTime = 20;
    // The skip counter skips the summary phase if skipcounter is as high as the max player length
    let skipCounter = 0;
    // Timer ID of the category timer so we can delete it etc.
    let timerID;
    // TimerBar object to visualize the time and reset it
    let timerBar;
    // Initialize the summary table construct with empty content
    async function initSummary() {
        let summaryContent = await createSummaryContent();
        let background = document.createElement("div");
        background.id = "summaryBackground_id";
        document.getElementById("DiceCup").appendChild(background);
        // Singleplayer: Skip phase with click/tap an screen
        // Multiplayer works with timers and skip option
        if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
            background.addEventListener("click", hideSummary);
        }
        let container = document.createElement("div");
        container.classList.add("summaryHidden");
        container.id = "summaryContainer_id";
        background.appendChild(container);
        let content = document.createElement("div");
        content.id = "summaryContent_id";
        container.appendChild(content);
        let colIds = ["playerNames"];
        colIds[1] = "sum";
        // Creates a grid with 7 rows and 14 columns
        // 7 Rows -> Header Row with icons and headlines and max 6 player names
        // 14 Columns -> 1 Playernames column, 1 sum column, 12 categories columns
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 14; col++) {
                let gridDiv = document.createElement("div");
                gridDiv.classList.add("summaryRow_" + row);
                gridDiv.classList.add("summaryColumn_" + col);
                gridDiv.id = "summaryGrid_id_" + row + "_" + col;
                content.appendChild(gridDiv);
                // If: Creates the icon container for the category cells between row 0 col 2-13
                // Else: Creates text span elements for the content like points and names
                if (row == 0 && col > 1 && col < 14) {
                    let imgContainer = document.createElement("div");
                    imgContainer.classList.add("summaryImgContainer");
                    gridDiv.appendChild(imgContainer);
                    let img = document.createElement("img");
                    img.id = "summaryImg_id_" + (col - 2);
                    img.classList.add("summaryImg");
                    img.src = summaryContent[0][col];
                    imgContainer.appendChild(img);
                    colIds[col] = DiceCup.ScoringCategory[col - 2];
                }
                else {
                    let text = document.createElement("span");
                    text.id = "summaryText_id_" + summaryContent[row][0] + "_" + colIds[col];
                    text.classList.add("summaryText");
                    text.innerHTML = summaryContent[row][col];
                    gridDiv.appendChild(text);
                    if (row == 0) {
                        text.classList.add("headerCol");
                    }
                    else if (col == 0) {
                        text.classList.add("headerRow");
                    }
                    else if (col == 1) {
                        text.classList.add("sumRow");
                    }
                    if (row == 0 && col == 0) {
                        text.id = "summaryText_skipCounter_id";
                    }
                }
            }
        }
        document.getElementById("summaryText_skipCounter_id").innerHTML = DiceCup.language.game.summary.skip;
        // Visualize the summary timer in the free left top corner cell
        let timer = document.createElement("div");
        timer.id = "summaryTimer_id";
        document.getElementById("summaryGrid_id_0_0").appendChild(timer);
        if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
            document.getElementById("summaryTimer_id").style.visibility = "hidden";
        }
        visibility("hidden");
    }
    DiceCup.initSummary = initSummary;
    // Creates the content of the summary table at the beginning of the game with the playernames
    async function createSummaryContent() {
        let response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories = await response.json();
        let content = [];
        if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
            DiceCup.playerNames = [DiceCup.gameSettings_sp.playerName];
            for (let index = 0; index < DiceCup.gameSettings_sp.bot.length; index++) {
                DiceCup.playerNames.push(DiceCup.gameSettings_sp.bot[index].botName);
            }
        }
        else if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
            for (let index = 0; index < DiceCup.gameSettings_mp.playerNames.length; index++) {
                DiceCup.playerNames.push(DiceCup.gameSettings_mp.playerNames[index]);
            }
        }
        for (let row = 0; row < 7; row++) {
            content[row] = [];
            for (let col = 0; col < 14; col++) {
                content[row][col] = "";
                if (col > 1 && col < 14) {
                    content[0][col] = categories[col - 2].image;
                }
                else if (col == 1) {
                    content[0][col] = DiceCup.language.game.summary.sum;
                }
            }
            if (row > 0 && row < DiceCup.playerNames.length + 1) {
                content[row][0] = DiceCup.playerNames[row - 1];
            }
        }
        return content;
    }
    // Handles the summary table after everyround in single- and multiplayer differently. Singleplayer updates the table directly and multiplayer sends a message to all players.
    function handleSummary(_value, _index) {
        if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
            updateSummary(_value, _index, DiceCup.gameSettings_sp.playerName);
        }
        else if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
            DiceCup.client.dispatch({ command: FudgeNet.COMMAND.SEND_SCORE, route: FudgeNet.ROUTE.SERVER, content: { value: _value, index: _index, name: DiceCup.gameSettings_mp.playerNames[DiceCup.clientPlayerNumber] } });
        }
    }
    DiceCup.handleSummary = handleSummary;
    // Updates the table every round with picked category and the earned points for each player
    function updateSummary(_points, _category, _name) {
        // Removes the highlights the last picked category and earned points
        if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
            if (DiceCup.lastPoints.length - DiceCup.playerNames.length >= 0) {
                document.getElementById(DiceCup.lastPoints[DiceCup.lastPoints.length - DiceCup.playerNames.length]).classList.remove("summaryHighlight");
            }
        }
        else if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
            if (DiceCup.lastPoints.length - DiceCup.numberOfPlayers >= 0) {
                document.getElementById(DiceCup.lastPoints[DiceCup.lastPoints.length - DiceCup.numberOfPlayers]).classList.remove("summaryHighlight");
            }
        }
        // Add the points to the right cell and highlights the current picked category and earned points
        document.getElementById("summaryText_id_" + _name + "_" + DiceCup.ScoringCategory[_category]).innerHTML = _points.toString();
        document.getElementById("summaryText_id_" + _name + "_" + DiceCup.ScoringCategory[_category]).classList.add("summaryHighlight");
        DiceCup.lastPoints.push("summaryText_id_" + _name + "_" + DiceCup.ScoringCategory[_category]);
        // Sum up all previous earned points
        let temp = 0;
        if (document.getElementById("summaryText_id_" + _name + "_sum").innerHTML) {
            temp = parseInt(document.getElementById("summaryText_id_" + _name + "_sum").innerHTML);
        }
        _points += temp;
        document.getElementById("summaryText_id_" + _name + "_sum").innerHTML = _points.toString();
    }
    DiceCup.updateSummary = updateSummary;
    // Updates the visualized skip counter everytime a player wants to skip the phase
    function updateSummarySkipCounter() {
        skipCounter++;
        document.getElementById("summaryText_skipCounter_id").innerHTML = skipCounter + "/" + DiceCup.numberOfPlayers;
        if (skipCounter == DiceCup.numberOfPlayers) {
            hideSummary();
        }
    }
    DiceCup.updateSummarySkipCounter = updateSummarySkipCounter;
    // Shows the summary table every round
    function showSummary() {
        document.getElementById("summaryContainer_id").classList.add("summaryShown");
        document.getElementById("summaryContainer_id").classList.remove("summaryHidden");
        document.getElementById("summaryBackground_id").classList.add("emptyBackground");
        document.getElementById("summaryBackground_id").style.zIndex = "10";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible"); });
        if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
            timerBar = new DiceCup.TimerBar("summaryTimer_id", summaryTime);
            timerID = ƒ.Time.game.setTimer(summaryTime * 1000, 1, () => {
                hideSummary();
            });
            document.getElementById("summaryBackground_id").addEventListener("click", skip);
        }
    }
    DiceCup.showSummary = showSummary;
    // Hides the summary table and checks which round the game is in
    function hideSummary() {
        document.getElementById("summaryContainer_id").classList.remove("summaryShown");
        document.getElementById("summaryContainer_id").classList.add("summaryHidden");
        document.getElementById("summaryBackground_id").classList.remove("emptyBackground");
        document.getElementById("summaryBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden"); });
        ƒ.Time.game.deleteTimer(timerID);
        if (DiceCup.playerMode ?? DiceCup.PlayerMode.multiplayer) {
            timerBar.resetTimer();
        }
        resetSkip();
        DiceCup.lastRound();
    }
    DiceCup.hideSummary = hideSummary;
    // Sends a message to the server if the player wants to skip this phase. Removes the event listener so the player just can vote once
    function skip(_event) {
        DiceCup.client.dispatch({ command: FudgeNet.COMMAND.SKIP_SUMMARY, route: FudgeNet.ROUTE.SERVER });
        document.getElementById("summaryBackground_id").removeEventListener("click", skip);
    }
    // Resets the skip counter
    function resetSkip() {
        skipCounter = 0;
        document.getElementById("summaryText_skipCounter_id").innerHTML = DiceCup.language.game.summary.skip;
    }
    // Toggles the visibility of the summary table
    function visibility(_visibility) {
        document.getElementById("summaryBackground_id").style.visibility = _visibility;
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // -- Variable declaration --
    // A counter to determine if all transition phrases are finished or not
    let counter = 0;
    // The time for each phrase shown in the transition. Longer phrases get more time
    let shortTime = 1000;
    // let longTime: number = 2000;
    // The span element where the phrases are shown 
    let text;
    // Starts the transition in which the container gets created and the transition starts
    function startTransition() {
        let container = document.createElement("div");
        container.classList.add("startTransitionContainer");
        container.id = "startTransitionContainer";
        document.getElementById("DiceCup").appendChild(container);
        text = document.createElement("span");
        text.id = "startTransitionText_id";
        document.getElementById("startTransitionContainer").appendChild(text);
        let phrase = [DiceCup.language.game.transition.phrase_1 + DiceCup.roundCounter, DiceCup.language.game.transition.phrase_2, DiceCup.language.game.transition.phrase_3];
        transition(phrase);
    }
    DiceCup.startTransition = startTransition;
    // Recursive function until it finished all given phrases for the transition
    // Resets the counter, removes the container and changes the gamestate in the last loop
    function transition(_phrase) {
        if (counter < _phrase.length) {
            text.innerHTML = _phrase[counter];
            counter++;
            ƒ.Time.game.setTimer(shortTime, 1, () => { transition(_phrase); });
            DiceCup.playSFX("Audio|2023-05-17T13:53:32.977Z|22534");
        }
        else {
            DiceCup.playSFX("Audio|2023-05-17T13:53:59.644Z|31971");
            counter = 0;
            document.getElementById("startTransitionContainer").remove();
            DiceCup.changeGameState(DiceCup.GameState.counting);
        }
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // Validation phase shows the picked dice and adds the round.
    function validateRound() {
        DiceCup.playSFX("Audio|2023-05-16T09:50:26.609Z|95993");
        DiceCup.nextTrack(1);
        DiceCup.roundCounter++;
        if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
            ƒ.Time.game.setTimer(2000, 1, () => { DiceCup.changeGameState(DiceCup.GameState.summary); });
        }
    }
    DiceCup.validateRound = validateRound;
    // Multiplayer: Waits for all players validation so everyone can go into the next round simultaneously
    // Creates the waiting alert at the top of the screen
    function waitForPlayerValidation() {
        if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
            let waitAlert = document.createElement("span");
            waitAlert.id = "waitAlert_id";
            waitAlert.innerHTML = DiceCup.language.game.validation.wait_for_validation;
            document.getElementById("hud_id").appendChild(waitAlert);
        }
    }
    DiceCup.waitForPlayerValidation = waitForPlayerValidation;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let BotDifficulty;
    (function (BotDifficulty) {
        BotDifficulty[BotDifficulty["easy"] = 0] = "easy";
        BotDifficulty[BotDifficulty["normal"] = 1] = "normal";
        BotDifficulty[BotDifficulty["hard"] = 2] = "hard";
    })(BotDifficulty = DiceCup.BotDifficulty || (DiceCup.BotDifficulty = {}));
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let DiceColor;
    (function (DiceColor) {
        DiceColor[DiceColor["white"] = 0] = "white";
        DiceColor[DiceColor["black"] = 1] = "black";
        DiceColor[DiceColor["red"] = 2] = "red";
        DiceColor[DiceColor["blue"] = 3] = "blue";
        DiceColor[DiceColor["green"] = 4] = "green";
        DiceColor[DiceColor["yellow"] = 5] = "yellow";
    })(DiceColor = DiceCup.DiceColor || (DiceCup.DiceColor = {}));
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let GameMode;
    (function (GameMode) {
        GameMode[GameMode["normal"] = 0] = "normal";
        GameMode[GameMode["fast"] = 1] = "fast";
        GameMode[GameMode["slow"] = 2] = "slow";
    })(GameMode = DiceCup.GameMode || (DiceCup.GameMode = {}));
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let GameState;
    (function (GameState) {
        GameState[GameState["menu"] = 0] = "menu";
        GameState[GameState["init"] = 1] = "init";
        GameState[GameState["ready"] = 2] = "ready";
        GameState[GameState["counting"] = 3] = "counting";
        GameState[GameState["choosing"] = 4] = "choosing";
        GameState[GameState["validating"] = 5] = "validating";
        GameState[GameState["summary"] = 6] = "summary";
        GameState[GameState["placement"] = 7] = "placement";
    })(GameState = DiceCup.GameState || (DiceCup.GameState = {}));
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let Languages;
    (function (Languages) {
        Languages["english"] = "english";
        Languages["german"] = "german";
    })(Languages = DiceCup.Languages || (DiceCup.Languages = {}));
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let MenuPage;
    (function (MenuPage) {
        MenuPage["main"] = "mainMenu_id";
        MenuPage["singleplayer"] = "singleplayerMenu_id";
        MenuPage["singleplayerGameOptions"] = "singleplayerGameOptions_id";
        MenuPage["multiplayer"] = "multiplayerMenu_id";
        MenuPage["multiplayerLobby"] = "multiplayerLobby_id";
        MenuPage["multiplayerGameOptions"] = "multiplayerGameOptions_id";
        MenuPage["options"] = "optionsMenu_id";
        MenuPage["help"] = "helpMenu_id";
    })(MenuPage = DiceCup.MenuPage || (DiceCup.MenuPage = {}));
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let PlayerMode;
    (function (PlayerMode) {
        PlayerMode[PlayerMode["singlelpayer"] = 0] = "singlelpayer";
        PlayerMode[PlayerMode["multiplayer"] = 1] = "multiplayer";
    })(PlayerMode = DiceCup.PlayerMode || (DiceCup.PlayerMode = {}));
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let ScoringCategory;
    (function (ScoringCategory) {
        ScoringCategory[ScoringCategory["fours"] = 0] = "fours";
        ScoringCategory[ScoringCategory["fives"] = 1] = "fives";
        ScoringCategory[ScoringCategory["sixes"] = 2] = "sixes";
        ScoringCategory[ScoringCategory["white"] = 3] = "white";
        ScoringCategory[ScoringCategory["black"] = 4] = "black";
        ScoringCategory[ScoringCategory["red"] = 5] = "red";
        ScoringCategory[ScoringCategory["blue"] = 6] = "blue";
        ScoringCategory[ScoringCategory["green"] = 7] = "green";
        ScoringCategory[ScoringCategory["yellow"] = 8] = "yellow";
        ScoringCategory[ScoringCategory["doubles"] = 9] = "doubles";
        ScoringCategory[ScoringCategory["oneToThree"] = 10] = "oneToThree";
        ScoringCategory[ScoringCategory["diceCup"] = 11] = "diceCup";
    })(ScoringCategory = DiceCup.ScoringCategory || (DiceCup.ScoringCategory = {}));
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let ViewportState;
    (function (ViewportState) {
        ViewportState[ViewportState["menu"] = 0] = "menu";
        ViewportState[ViewportState["transition"] = 1] = "transition";
        ViewportState[ViewportState["game"] = 2] = "game";
    })(ViewportState = DiceCup.ViewportState || (DiceCup.ViewportState = {}));
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // Changes the floor depending on the gamestate. In the menu the floor is clean so it gets blurred with the walls
    // Ingame the floor gets the fade effect like in the main menu
    function changeFloor(_change) {
        let graph = DiceCup.viewport.getBranch();
        let arena = graph.getChildrenByName("Arena")[0];
        let game_floor = arena.getChildrenByName("Floor_game")[0];
        let menu_floor = arena.getChildrenByName("Floor_menu")[0];
        game_floor.activate(_change);
        menu_floor.activate(!_change);
    }
    DiceCup.changeFloor = changeFloor;
    // Activates/Deactivates the cover so the dice can't stack on each other and cover up important dice values
    function activateCover(_change) {
        let graph = DiceCup.viewport.getBranch();
        let arena = graph.getChildrenByName("Arena")[0];
        let cover = arena.getChildrenByName("Game_cover")[0];
        cover.activate(_change);
    }
    DiceCup.activateCover = activateCover;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // -- Variable declaration --
    // The 12 dices that get rolled every round
    DiceCup.dices = [];
    // The round timer for how long you can see the dice before picking a category
    DiceCup.roundTimer = localStorage.getItem("roundTimer") ? parseInt(localStorage.getItem("roundTimer")) : 3;
    // Starting round 1
    DiceCup.roundCounter = 1;
    // Max rounds this game
    DiceCup.maxRounds = 12;
    // Used translations of the dice for the current round to send as host to the other players
    DiceCup.usedTranslations = [];
    // Used rotations of the dice for the current round to send as host to the other players
    DiceCup.usedRotations = [];
    // Bots for the current game
    let bots = [];
    // Creates the bots with given game settings in a singleplayer game
    function createBots(_bots) {
        bots = [];
        for (let index = 0; index < _bots.length; index++) {
            bots[index] = new DiceCup.Bot(_bots[index].botName, _bots[index].difficulty, DiceCup.dices, DiceCup.botMode);
        }
        return bots;
    }
    // Each bot makes their turn with picking a category
    function botTurn() {
        for (let index = 0; index < bots.length; index++) {
            bots[index].botsTurn();
        }
    }
    DiceCup.botTurn = botTurn;
    // Loads the json with dice attributes for rolling the dice
    async function loadDiceColors() {
        let response = await fetch("Game/Script/Data/diceColors.json");
        let diceColors = await response.json();
        return diceColors;
    }
    DiceCup.loadDiceColors = loadDiceColors;
    // Rolls all 12 dice if it is a singleplayer game or the host of a multiplayer game
    async function rollDices(_message) {
        if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer || (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer && DiceCup.host == true)) {
            let diceColors = await loadDiceColors();
            let graph = DiceCup.viewport.getBranch();
            let diceNode = graph.getChildrenByName("Dices")[0];
            diceNode.removeAllChildren();
            DiceCup.dices = [];
            for (let i = 0, color = 0; i < DiceCup.dicesLength; i++, color += 0.5) {
                DiceCup.dices.push(new DiceCup.Dice(diceColors[Math.floor(color)], Math.floor(color), 1));
            }
        }
    }
    DiceCup.rollDices = rollDices;
    // Multiplayer player that are not the host get the dice from the server that the host sent
    async function getRolledDices(_message) {
        let diceColors = await loadDiceColors();
        let graph = DiceCup.viewport.getBranch();
        let diceNode = graph.getChildrenByName("Dices")[0];
        diceNode.removeAllChildren();
        DiceCup.dices = [];
        for (let i = 0, color = 0; i < DiceCup.dicesLength; i++, color += 0.5) {
            DiceCup.dices.push(new DiceCup.Dice(diceColors[Math.floor(color)], Math.floor(color), 3, _message.content.dice[i]));
        }
    }
    DiceCup.getRolledDices = getRolledDices;
    // Handles the round where you can see the dice for normally 3 seconds and visualizes the timer
    async function round() {
        // console.clear();
        console.log("NEXT ROUND: " + DiceCup.roundCounter);
        DiceCup.nextTrack(2);
        if (DiceCup.playerMode == DiceCup.PlayerMode.singlelpayer) {
            if (DiceCup.roundCounter == 1) {
                createBots(DiceCup.gameSettings_sp.bot);
            }
        }
        new DiceCup.TimerBar("hudTimer_id", DiceCup.roundTimer);
        ƒ.Time.game.setTimer(DiceCup.roundTimer * 1000, 1, () => { DiceCup.changeGameState(DiceCup.GameState.choosing); });
    }
    DiceCup.round = round;
    // Checks if the round is the last round to change the gamestate to placements instead the next round
    function lastRound() {
        if (DiceCup.roundCounter <= DiceCup.maxRounds) {
            DiceCup.changeGameState(DiceCup.GameState.ready);
        }
        else {
            DiceCup.changeGameState(DiceCup.GameState.placement);
        }
    }
    DiceCup.lastRound = lastRound;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // Resets all used variables and settings to the beginning state to start a new round
    function gameOver(_return) {
        // Resets variables
        DiceCup.inGame = false;
        DiceCup.lastPoints = [];
        DiceCup.roundCounter = 1;
        DiceCup.playerNames = [];
        DiceCup.gameSettings_sp = { playerName: "", bot: [] };
        DiceCup.gameSettings_mp = { playerNames: [] };
        DiceCup.freePlayerCategories = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        // Change viewportstate to menu again
        DiceCup.changeViewportState(DiceCup.ViewportState.menu);
        // Removes the last shown dice
        let graph = DiceCup.viewport.getBranch();
        let diceNode = graph.getChildrenByName("Dices")[0];
        diceNode.removeAllChildren();
        // Removes all used panels and visible phases
        while (document.getElementById("DiceCup").childNodes.length > 1) {
            document.getElementById("DiceCup").removeChild(document.getElementById("DiceCup").lastChild);
        }
        // Changes back to menu music and given menu page
        DiceCup.nextTrack(0);
        DiceCup.switchMenu(_return);
    }
    DiceCup.gameOver = gameOver;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // -- Variable declaration --
    // Sound for a button click
    DiceCup.buttonClick = "Audio|2023-05-17T14:09:29.972Z|51408";
    // Menu sound themes
    let themes = ["Audio|2023-05-15T19:01:45.890Z|78438", "Audio|2023-05-18T18:10:25.157Z|72912", "Audio|2023-05-18T18:10:38.906Z|20682"];
    // Audio components seperated into music and sound effects to change volume separately
    let backgroundAudio;
    let sfxAudio;
    // Initialize the background music
    async function initBackgroundMusic(_track) {
        let track = ƒ.Project.resources[themes[_track]];
        backgroundAudio = new ƒ.ComponentAudio(track, true, false);
        backgroundAudio.connect(true);
        backgroundAudio.volume = setMusicVolume(DiceCup.musicVolume);
        backgroundAudio.setAudio(track);
        backgroundMusic(true);
    }
    DiceCup.initBackgroundMusic = initBackgroundMusic;
    // Turns the background music on or off
    function backgroundMusic(_on) {
        backgroundAudio.play(_on);
    }
    DiceCup.backgroundMusic = backgroundMusic;
    // Switches the track with given track number
    function nextTrack(_track) {
        backgroundMusic(false);
        initBackgroundMusic(_track);
    }
    DiceCup.nextTrack = nextTrack;
    // Changes the volume of an audio component
    function changeVolume(_mode) {
        switch (_mode) {
            case 0:
                backgroundAudio.volume = setMusicVolume(DiceCup.musicVolume);
                break;
            case 1:
                sfxAudio.volume = setSFXVolume(DiceCup.sfxVolume);
                break;
            default:
                break;
        }
    }
    DiceCup.changeVolume = changeVolume;
    // Plays a sound effect with the given url
    function playSFX(_sfx) {
        let audio = ƒ.Project.resources[_sfx];
        sfxAudio = new ƒ.ComponentAudio(audio, false, false);
        sfxAudio.connect(true);
        sfxAudio.volume = setSFXVolume(DiceCup.sfxVolume);
        sfxAudio.setAudio(audio);
        sfxAudio.play(true);
    }
    DiceCup.playSFX = playSFX;
    // Mutes all sounds
    function muteAll() {
        backgroundAudio.volume = 0;
        sfxAudio.volume = 0;
    }
    DiceCup.muteAll = muteAll;
    // Changes the music volume
    function setMusicVolume(_volume) {
        return _volume /= 1000;
    }
    // Changes the sfx volume
    function setSFXVolume(_volume) {
        return _volume /= 100;
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // The Update function draws the viewport and simulates the physics every frame
    function update(_event) {
        // FUDGE Physics
        ƒ.Physics.simulate();
        // Mutes all sounds if browser tab is switched or app is in the background on the phone
        if (document.hidden) {
            DiceCup.muteAll();
        }
        else {
            DiceCup.changeVolume(0);
            DiceCup.changeVolume(1);
        }
        // Changes the camera position and behaviour depending in which viewport state the game is in
        switch (DiceCup.viewportState) {
            case DiceCup.ViewportState.menu:
                DiceCup.viewport.camera.mtxPivot.lookAt(new ƒ.Vector3(0, 0.4, 0));
                DiceCup.viewport.camera.mtxPivot.translateX(0.02);
                break;
            default:
                break;
        }
        // Draws the viewport and updates the AudioManager
        DiceCup.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    DiceCup.update = update;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // -- Variable declaration --
    // Gets all Menu Page Ids from the enum
    let menuIds = Object.values(DiceCup.MenuPage);
    // Initialize all menu pages in the beginning of the application
    async function initMenu() {
        DiceCup.mainMenu();
        DiceCup.singleplayerMenu();
        DiceCup.singleplayerGameOptions();
        DiceCup.multiplayerServers();
        DiceCup.multiplayerMenu();
        DiceCup.multiplayerGameOptions();
        DiceCup.optionsMenu();
        DiceCup.helpMenu();
        // if the app resets after the player changed some options he will be brought back to the option screen
        if (localStorage.getItem("optionsMenu")) {
            switchMenu(DiceCup.MenuPage.options);
            localStorage.removeItem("optionsMenu");
        }
        else {
            switchMenu(DiceCup.MenuPage.main);
        }
    }
    DiceCup.initMenu = initMenu;
    // Hides all menu pages except the given page and switches to another menu page
    function switchMenu(_toMenuID) {
        hideMenu();
        document.getElementById(_toMenuID).style.zIndex = "10";
        document.getElementById(_toMenuID).style.visibility = "visible";
    }
    DiceCup.switchMenu = switchMenu;
    // Hides all menu pages
    function hideMenu() {
        for (let index = 0; index < Object.values(DiceCup.MenuPage).length; index++) {
            document.getElementById(menuIds[index]).style.visibility = "hidden";
            document.getElementById(menuIds[index]).style.zIndex = "0";
        }
    }
    DiceCup.hideMenu = hideMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // -- Variable declaration --
    // Determines the start page 
    let helpPages = 1;
    // Determines how many pages the instruction has
    let helpPagesMax = 4;
    // Splits the content into list points or seperate parts of an instruction
    let splitContent;
    // Creates a SubMenu and fills content with game instructions seperated in multiple pages
    function helpMenu() {
        new DiceCup.SubMenu(DiceCup.MenuPage.help, "help", DiceCup.language.menu.help.title);
        let backButton = document.createElement("button");
        backButton.id = "helpNextButton_id";
        backButton.classList.add("gameMenuButtons");
        backButton.classList.add("diceCupButtons");
        document.getElementById("helpMenuRightButtonArea_id").appendChild(backButton);
        let backIcon = document.createElement("img");
        backIcon.classList.add("diceCupButtonsIcons");
        backIcon.src = "Game/Assets/images/menuButtons/left.svg";
        backButton.appendChild(backIcon);
        backButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            helpPages > 1 && changePage(helpPages -= 1);
        });
        let nextButton = document.createElement("button");
        nextButton.id = "helpNextButton_id";
        nextButton.classList.add("gameMenuButtons");
        nextButton.classList.add("diceCupButtons");
        document.getElementById("helpMenuRightButtonArea_id").appendChild(nextButton);
        let nextIcon = document.createElement("img");
        nextIcon.classList.add("diceCupButtonsIcons");
        nextIcon.src = "Game/Assets/images/menuButtons/right.svg";
        nextButton.appendChild(nextIcon);
        nextButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            helpPages < helpPagesMax && changePage(helpPages += 1);
        });
        for (let i = 1; i <= helpPagesMax; i++) {
            loadContent(i);
        }
        // Start the menu with page 1
        changePage(helpPages);
    }
    DiceCup.helpMenu = helpMenu;
    // Changes the page of the instructions
    async function changePage(_page) {
        document.getElementById("helpAlert_id").innerHTML = DiceCup.language.menu.help.page + " " + _page + "/" + helpPagesMax;
        for (let i = 1; i <= helpPagesMax; i++) {
            document.getElementById("helpPage_" + i).hidden = true;
        }
        document.getElementById("helpPage_" + _page).hidden = false;
    }
    // Loads the content for every page
    async function loadContent(_page) {
        let containerDiv = document.createElement("div");
        containerDiv.id = "helpPage_" + _page;
        containerDiv.hidden = true;
        document.getElementById("helpMenuContent_id").appendChild(containerDiv);
        let title = document.createElement("span");
        title.id = "helpSubtitle_id";
        containerDiv.appendChild(title);
        let content = document.createElement("span");
        content.id = "helpContent_id";
        containerDiv.appendChild(content);
        switch (_page) {
            case 1:
                title.innerHTML = DiceCup.language.menu.help.page_1.title;
                content.innerHTML = DiceCup.language.menu.help.page_1.content;
                break;
            case 2:
                title.innerHTML = DiceCup.language.menu.help.page_2.title;
                content.innerHTML = DiceCup.language.menu.help.page_2.content;
                break;
            case 3:
                title.innerHTML = DiceCup.language.menu.help.page_3.title;
                splitContent = DiceCup.language.menu.help.page_3.content.split("<br>");
                let iconLengths = [3, 6, 1, 1, 1];
                let counter = 0;
                for (let i = 0; i < 5; i++) {
                    let row = document.createElement("div");
                    row.id = "helpRow_page_3";
                    content.appendChild(row);
                    let subContent = document.createElement("span");
                    subContent.innerHTML = "· " + splitContent[i];
                    row.appendChild(subContent);
                    let iconContainer = document.createElement("div");
                    iconContainer.id = "helpIconContainer";
                    row.appendChild(iconContainer);
                    for (let j = 0; j < iconLengths[i]; j++) {
                        let icon = document.createElement("img");
                        icon.classList.add("helpIcons");
                        icon.src = await loadIcon(counter + j);
                        iconContainer.appendChild(icon);
                    }
                    counter += iconLengths[i];
                }
                break;
            case 4:
                title.innerHTML = DiceCup.language.menu.help.page_4.title;
                splitContent = DiceCup.language.menu.help.page_4.content.split("<br>");
                let iconArray = [0, 4, 9, 10, 11];
                for (let i = 0; i < 5; i++) {
                    let row = document.createElement("div");
                    row.id = "helpRow_page_4";
                    content.appendChild(row);
                    let icon = document.createElement("img");
                    icon.classList.add("helpIcons");
                    icon.src = await loadIcon(iconArray[i]);
                    row.appendChild(icon);
                    let subContent = document.createElement("span");
                    subContent.innerHTML = splitContent[i];
                    row.appendChild(subContent);
                }
                let example = document.createElement("img");
                example.id = "helpExample_id";
                example.classList.add("exampleIcons");
                example.src = "Game/Assets/images/example.svg";
                content.appendChild(example);
                break;
            default:
                break;
        }
    }
    // Loads the category icons for the needed example situtation
    async function loadIcon(_icon) {
        let response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories = await response.json();
        return categories[_icon].image;
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // Initialize the main menu with all containers and buttons for every submenu
    function mainMenu() {
        let gameMenuDiv = document.createElement("div");
        gameMenuDiv.id = "gameMenu_id";
        gameMenuDiv.classList.add("gameMenus");
        gameMenuDiv.style.visibility = "hidden";
        document.getElementById("DiceCup").appendChild(gameMenuDiv);
        let menuDiv = document.createElement("div");
        menuDiv.id = DiceCup.MenuPage.main;
        menuDiv.classList.add("gameMenus");
        menuDiv.classList.add("noBackground");
        gameMenuDiv.appendChild(menuDiv);
        let logoDiv = document.createElement("div");
        logoDiv.id = "logoContainer_id";
        menuDiv.appendChild(logoDiv);
        let logoImage = document.createElement("img");
        logoImage.id = "logo_id";
        logoImage.src = "Game/Assets/images/temp_logo_test.png";
        logoDiv.appendChild(logoImage);
        let buttonDiv = document.createElement("div");
        buttonDiv.id = "buttonContainer_id";
        menuDiv.appendChild(buttonDiv);
        // Determines the main menu button ids and their icon paths
        let menuButtonIds = ["play_id", "multiplayer_id", "help_id", "options_id"];
        let menuButtonIconPaths = ["Game/Assets/images/menuButtons/play.svg", "Game/Assets/images/menuButtons/multiplayer.svg", "Game/Assets/images/menuButtons/help.svg", "Game/Assets/images/menuButtons/settings.svg"];
        // Creates the main menu buttons
        for (let i = 0; i < 4; i++) {
            let menuButtons = document.createElement("button");
            menuButtons.classList.add("menuButtons");
            menuButtons.classList.add("diceCupButtons");
            menuButtons.id = menuButtonIds[i];
            buttonDiv.appendChild(menuButtons);
            let menuIcons = document.createElement("img");
            menuIcons.classList.add("menuButtonsIcons");
            menuIcons.src = menuButtonIconPaths[i];
            menuButtons.appendChild(menuIcons);
        }
        // Adds the event listener for each button
        document.getElementById("play_id").addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.switchMenu(DiceCup.MenuPage.singleplayer);
        });
        document.getElementById("multiplayer_id").addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.switchMenu(DiceCup.MenuPage.multiplayer);
        });
        document.getElementById("help_id").addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.switchMenu(DiceCup.MenuPage.help);
        });
        document.getElementById("options_id").addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.switchMenu(DiceCup.MenuPage.options);
        });
        // Creates the online container in the corner of the main menu to see directly if the client is connected and his id
        let onlineContainer = document.createElement("div");
        onlineContainer.id = "onlineContainer_id";
        menuDiv.appendChild(onlineContainer);
        let statusText = document.createElement("span");
        statusText.id = "onlineStatus_id";
        statusText.innerHTML = DiceCup.client.id ? "status: online" : "status: offline";
        onlineContainer.appendChild(statusText);
        let clientText = document.createElement("span");
        clientText.id = "onlineClient_id";
        clientText.innerHTML = DiceCup.client.id ? "client_id: " + DiceCup.client.id : "client_id: undefined";
        onlineContainer.appendChild(clientText);
    }
    DiceCup.mainMenu = mainMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // -- Variable declaration --
    // Stores the username if the player decides to change it
    DiceCup.username = "";
    // Creates a new submenu for the multiplayer lobby with empty container and content
    function multiplayerMenu() {
        new DiceCup.SubMenu(DiceCup.MenuPage.multiplayerLobby, "multiplayerLobby", document.getElementById("playerName_id").placeholder + "'s " + DiceCup.language.menu.multiplayer.lobby.title);
        document.getElementById("multiplayerLobbyMenuReturnButton_id").addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.switchMenu(DiceCup.MenuPage.multiplayer);
        });
        let settingsButton = document.createElement("button");
        settingsButton.id = "multiplayerLobbySettingsButton_id";
        settingsButton.classList.add("gameMenuButtons");
        settingsButton.classList.add("diceCupButtons");
        document.getElementById("multiplayerLobbyMenuLeftButtonArea_id").appendChild(settingsButton);
        let settingsIcon = document.createElement("img");
        settingsIcon.classList.add("diceCupButtonsIcons");
        settingsIcon.src = "Game/Assets/images/menuButtons/settings.svg";
        settingsButton.appendChild(settingsIcon);
        settingsButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.host && DiceCup.switchMenu(DiceCup.MenuPage.multiplayerGameOptions);
        });
    }
    DiceCup.multiplayerMenu = multiplayerMenu;
    // Creates different buttons depending if the player is the host or a guest.
    // Host can change the lobby settings and start the game. Guests have a ready button.
    function createLobbyButtons(_host, _ready) {
        if (_host) {
            while (document.getElementById("multiplayerLobbyMenuRightButtonArea_id").childNodes.length > 0) {
                document.getElementById("multiplayerLobbyMenuRightButtonArea_id").removeChild(document.getElementById("multiplayerLobbyMenuRightButtonArea_id").lastChild);
            }
            let startButton = document.createElement("button");
            startButton.id = "multiplayerLobbyStartButton_id";
            startButton.classList.add("gameMenuStartButtons");
            startButton.classList.add("gameMenuButtons");
            startButton.classList.add("diceCupButtons");
            startButton.innerHTML = DiceCup.language.menu.multiplayer.lobby.start_button;
            document.getElementById("multiplayerLobbyMenuRightButtonArea_id").appendChild(startButton);
        }
        else {
            while (document.getElementById("multiplayerLobbyMenuRightButtonArea_id").childNodes.length > 0) {
                document.getElementById("multiplayerLobbyMenuRightButtonArea_id").removeChild(document.getElementById("multiplayerLobbyMenuRightButtonArea_id").lastChild);
            }
            let readyButton = document.createElement("button");
            readyButton.id = "multiplayerLobbyReadyButton_id";
            readyButton.classList.add("gameMenuStartButtons");
            readyButton.classList.add("gameMenuButtons");
            readyButton.classList.add("diceCupButtons");
            document.getElementById("multiplayerLobbyMenuRightButtonArea_id").appendChild(readyButton);
            document.getElementById("multiplayerLobbyReadyButton_id").addEventListener("click", () => {
                DiceCup.playSFX(DiceCup.buttonClick);
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.CLIENT_READY, route: FudgeNet.ROUTE.SERVER });
            });
            _ready ? document.getElementById("multiplayerLobbyReadyButton_id").innerHTML = DiceCup.language.menu.multiplayer.lobby.ready_button : document.getElementById("multiplayerLobbyReadyButton_id").innerHTML = DiceCup.language.menu.multiplayer.lobby.not_ready_button;
        }
    }
    // Creates a player container with given attributes to fill with name and if the player is ready or not
    function createPlayerPortrait(_client, _name, _id, _ready) {
        let playerContainer = document.createElement("div");
        playerContainer.id = "playerContainer_id_" + _id;
        playerContainer.classList.add("lobbyContainer");
        playerContainer.classList.add("waitContainer");
        playerContainer.style.order = "0";
        document.getElementById("multiplayerLobbyMenuContent_id").appendChild(playerContainer);
        let playerDiv = document.createElement("button");
        playerDiv.id = "playerPortrait_id_" + _id;
        playerDiv.classList.add("lobbyPortrait");
        playerDiv.classList.add("lobbyPortrait_active");
        playerDiv.classList.add("diceCupButtons");
        playerContainer.appendChild(playerDiv);
        let youIndicator = document.createElement("div");
        youIndicator.id = "playerIndicator_id";
        youIndicator.classList.add("youIndicator");
        playerDiv.appendChild(youIndicator);
        let playerRemove = document.createElement("button");
        playerRemove.id = "playerRemove_id_" + _id;
        playerRemove.classList.add("removeButton");
        playerDiv.appendChild(playerRemove);
        document.getElementById("playerRemove_id_0").style.display = "none";
        playerRemove.addEventListener("click", () => DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_LEAVE, route: FudgeNet.ROUTE.SERVER, content: { leaver_id: _client, host: false, kicked: true } }));
        let botRemoveIcon = document.createElement("img");
        botRemoveIcon.classList.add("removeButtonIcons");
        botRemoveIcon.src = "Game/Assets/images/menuButtons/minus.svg";
        playerRemove.appendChild(botRemoveIcon);
        let playerIcons = document.createElement("img");
        playerIcons.classList.add("lobbyPortraitIcons");
        playerIcons.src = _id == 0 ? "Game/Assets/images/menuButtons/host.svg" : "Game/Assets/images/menuButtons/player.svg";
        playerDiv.appendChild(playerIcons);
        let nameInputContainer = document.createElement("div");
        nameInputContainer.id = "nameInputContainer_id_" + _id;
        nameInputContainer.classList.add("nameInputContainer");
        playerContainer.appendChild(nameInputContainer);
        let playerName = document.createElement("input");
        playerName.id = "multiplayerName_id_" + _id;
        playerName.classList.add("nameInputs");
        playerName.value = _name ?? _client;
        playerName.setAttribute("client_id", _client);
        playerName.readOnly = true;
        nameInputContainer.appendChild(playerName);
        // If the player isn't ready its visualized with a transparent container
        if (!_ready) {
            playerDiv.classList.add("lobbyPortrait_inactive");
            playerIcons.classList.add("lobbyPortraitIcons_inactive");
            playerName.classList.add("lobbyPortrait_inactive");
        }
        // So that the player can recognize himself more quickly, he is marked with an white dot on his container.
        // The player can only change his name
        if (playerName.getAttribute("client_id") == DiceCup.client.id) {
            let nameInputButton = document.createElement("button");
            nameInputButton.id = "nameInputButton_id";
            nameInputButton.classList.add("nameInputsButtons");
            nameInputButton.innerHTML = "✔";
            nameInputContainer.appendChild(nameInputButton);
            nameInputButton.addEventListener("click", () => {
                DiceCup.playSFX(DiceCup.buttonClick);
                nameInputButton.style.display = "none";
                playerName.classList.remove("nameInputsFocused");
                DiceCup.username = playerName.value;
            });
            document.getElementById("nameInputButton_id").addEventListener("click", DiceCup.hndEvent);
            playerName.readOnly = false;
            playerName.addEventListener("click", () => { nameInputButton.style.display = "block"; playerName.classList.add("nameInputsFocused"); });
        }
        else {
            youIndicator.style.visibility = "hidden";
        }
    }
    // Creates an empty container as placeholder until players joins the room
    function createWaitPortrait(_id) {
        let waitContainer = document.createElement("div");
        waitContainer.id = "multiplayerLobbyWaitContainer_id_" + _id;
        waitContainer.classList.add("waitContainer");
        waitContainer.classList.add("lobbyContainer");
        waitContainer.style.order = "2";
        document.getElementById("multiplayerLobbyMenuContent_id").appendChild(waitContainer);
        let waitPlayerDiv = document.createElement("button");
        waitPlayerDiv.classList.add("lobbyPortrait");
        waitPlayerDiv.classList.add("lobbyPortrait_inactive");
        waitPlayerDiv.classList.add("diceCupButtons");
        waitContainer.appendChild(waitPlayerDiv);
        let addIcons = document.createElement("img");
        addIcons.classList.add("lobbyPortraitIcons_inactive");
        addIcons.src = "Game/Assets/images/menuButtons/player.svg";
        waitPlayerDiv.appendChild(addIcons);
        let playerName = document.createElement("div");
        playerName.id = "playerName_id";
        playerName.classList.add("nameInputs");
        playerName.classList.add("lobbyPortrait_inactive");
        playerName.innerHTML = DiceCup.language.menu.multiplayer.lobby.waiting;
        waitContainer.appendChild(playerName);
    }
    // Checks if there are min 2 players in the lobby and everybody is ready to start the game
    function checkLobbyStart(_everybodyReady, _lobbySize) {
        let startButton = document.getElementById("multiplayerLobbyStartButton_id");
        if (!_everybodyReady) {
            startButton.addEventListener("click", () => {
                document.getElementById("multiplayerLobbyAlert_id").innerHTML = DiceCup.language.menu.alerts.not_ready;
                ƒ.Time.game.setTimer(1000, 1, () => { document.getElementById("multiplayerLobbyAlert_id").innerHTML = ""; });
                DiceCup.playSFX(DiceCup.buttonClick);
            });
        }
        else if (_lobbySize < 2) {
            startButton.addEventListener("click", () => {
                document.getElementById("multiplayerLobbyAlert_id").innerHTML = DiceCup.language.menu.alerts.min_player;
                ƒ.Time.game.setTimer(1000, 1, () => { document.getElementById("multiplayerLobbyAlert_id").innerHTML = ""; });
                DiceCup.playSFX(DiceCup.buttonClick);
            });
        }
        else {
            startButton.addEventListener("click", () => {
                DiceCup.playSFX(DiceCup.buttonClick);
            });
            startButton.addEventListener("click", DiceCup.hndEvent);
        }
    }
    // Everytime a player joins the room it will be updated for everyone in the lobby
    function joinRoom(_message) {
        // Switches to multiplayer lobby menu page and updates the lobby name to host name plus lobby
        DiceCup.switchMenu(DiceCup.MenuPage.multiplayerLobby);
        document.getElementById("multiplayerLobbyMenuTitle_id").innerHTML = _message.content.name;
        // Removes the old unupdated version of the lobby so it can be renewed
        while (document.getElementById("multiplayerLobbyMenuContent_id").childNodes.length > 0) {
            document.getElementById("multiplayerLobbyMenuContent_id").removeChild(document.getElementById("multiplayerLobbyMenuContent_id").lastChild);
        }
        // Creates the lobby buttons depending if the player is host or guest
        createLobbyButtons(DiceCup.host, Object.values(_message.content.clients)[Object.keys(_message.content.clients).indexOf(DiceCup.client.id)].ready);
        // Creates playercontainer with attributes with all connected clients
        for (let i = 0; i < Object.keys(_message.content.clients).length; i++) {
            createPlayerPortrait(Object.keys(_message.content.clients)[i].toString(), Object.values(_message.content.clients)[i].name, i, Object.values(_message.content.clients)[i].ready);
            if (DiceCup.host == false) {
                document.getElementById("playerRemove_id_" + i).style.display = "none";
            }
        }
        // Fills the unused spots with wait containers
        for (let j = 0; j < (6 - Object.keys(_message.content.clients).length); j++) {
            createWaitPortrait(j);
        }
        // Stores all ready states of each player
        let allReady = [];
        for (let index = 0; index < Object.values(_message.content.clients).length; index++) {
            allReady[index] = Object.values(_message.content.clients)[index].ready;
        }
        // Checks all conditions so the host could start the game
        if (DiceCup.host) {
            checkLobbyStart(allReady.every(x => x), Object.keys(_message.content.clients).length);
        }
    }
    DiceCup.joinRoom = joinRoom;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // -- Variable declaration --
    // Stores the last clicked/tapped room to join
    DiceCup.focusedIdRoom = "";
    // Creates a submenu for the server list with empty containers and content
    function multiplayerServers() {
        new DiceCup.SubMenu(DiceCup.MenuPage.multiplayer, "multiplayer", DiceCup.language.menu.multiplayer.list.title);
        let renewButton = document.createElement("button");
        renewButton.id = "multiplayerRenewButton_id";
        renewButton.classList.add("gameMenuButtons");
        renewButton.classList.add("diceCupButtons");
        document.getElementById("multiplayerMenuLeftButtonArea_id").appendChild(renewButton);
        let renewIcon = document.createElement("img");
        renewIcon.classList.add("diceCupButtonsIcons");
        renewIcon.src = "Game/Assets/images/menuButtons/renew.svg";
        renewButton.appendChild(renewIcon);
        renewButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            document.getElementById("multiplayerContentContainer_id").scrollTo(0, 0);
        });
        let createButton = document.createElement("button");
        createButton.id = "multiplayerCreateButton_id";
        createButton.classList.add("gameMenuStartButtons");
        createButton.classList.add("gameMenuButtons");
        createButton.classList.add("diceCupButtons");
        createButton.innerHTML = DiceCup.language.menu.multiplayer.list.create_button;
        DiceCup.client.id ? createButton.disabled = false : createButton.disabled = true;
        document.getElementById("multiplayerMenuRightButtonArea_id").appendChild(createButton);
        createButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.switchMenu(DiceCup.MenuPage.multiplayerLobby);
        });
        let joinButton = document.createElement("button");
        joinButton.id = "multiplayerJoinButton_id";
        joinButton.classList.add("gameMenuStartButtons");
        joinButton.classList.add("gameMenuButtons");
        joinButton.classList.add("diceCupButtons");
        joinButton.innerHTML = DiceCup.language.menu.multiplayer.list.join_button;
        DiceCup.client.id ? joinButton.disabled = false : joinButton.disabled = true;
        document.getElementById("multiplayerMenuRightButtonArea_id").appendChild(joinButton);
        joinButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
        });
        if (!DiceCup.client.id) {
            document.getElementById("multiplayerAlert_id").innerHTML = DiceCup.language.menu.alerts.offline;
        }
        let contentContainer = document.createElement("div");
        contentContainer.id = "multiplayerContentContainer_id";
        document.getElementById("multiplayerMenuContent_id").appendChild(contentContainer);
        let serverList = document.createElement("div");
        serverList.id = "serverListRow_id_header";
        serverList.classList.add("serverListRow");
        contentContainer.appendChild(serverList);
        initList();
    }
    DiceCup.multiplayerServers = multiplayerServers;
    // Creates the gridlayout for the rows and cols of the serverlist content
    function initList() {
        let serverList = document.getElementById("serverListRow_id_header");
        let playerCountContainer = document.createElement("div");
        playerCountContainer.id = "playerCountContainer_id_header";
        playerCountContainer.classList.add("serverListContainer");
        playerCountContainer.classList.add("serverListHeader");
        serverList.appendChild(playerCountContainer);
        let nameContainer = document.createElement("div");
        nameContainer.id = "nameContainer_id_header";
        nameContainer.classList.add("serverListContainer");
        nameContainer.classList.add("serverListHeader");
        serverList.appendChild(nameContainer);
        let gamemodeContainer = document.createElement("div");
        gamemodeContainer.id = "gamemodeContainer_id_header";
        gamemodeContainer.classList.add("serverListContainer");
        gamemodeContainer.classList.add("serverListHeader");
        serverList.appendChild(gamemodeContainer);
        let lockedContainer = document.createElement("div");
        lockedContainer.id = "lockedContainer_id_header";
        lockedContainer.classList.add("serverListContainer");
        lockedContainer.classList.add("serverListHeader");
        serverList.appendChild(lockedContainer);
        let playerCount = document.createElement("img");
        playerCount.id = "playerCount_id";
        playerCount.classList.add("serverListIcons");
        playerCount.src = "Game/Assets/images/serverlistIcons/playercount.svg";
        playerCountContainer.appendChild(playerCount);
        let name = document.createElement("img");
        name.id = "room_id";
        name.classList.add("serverListIcons");
        name.src = "Game/Assets/images/serverlistIcons/servername.svg";
        nameContainer.appendChild(name);
        let gamemode = document.createElement("img");
        gamemode.id = "gamemode_id";
        gamemode.classList.add("serverListIcons");
        gamemode.src = "Game/Assets/images/serverlistIcons/gamemode.svg";
        gamemodeContainer.appendChild(gamemode);
        let locked = document.createElement("img");
        locked.id = "locked_id";
        locked.classList.add("serverListIcons");
        locked.src = "Game/Assets/images/serverlistIcons/lock.svg";
        lockedContainer.appendChild(locked);
    }
    // Shows the password input field if the room is private and password secured
    function passwordInput() {
        let passwordInputContainer = document.createElement("div");
        passwordInputContainer.id = "passwordInputContainer_id";
        passwordInputContainer.classList.add("passwordInputContainer");
        document.getElementById("multiplayerMenu_id").appendChild(passwordInputContainer);
        let passwordTitle = document.createElement("span");
        passwordTitle.classList.add("passwordTitle");
        passwordTitle.innerHTML = DiceCup.language.menu.multiplayer.list.password;
        passwordInputContainer.appendChild(passwordTitle);
        let inputArea = document.createElement("div");
        inputArea.classList.add("passwordInputArea");
        passwordInputContainer.appendChild(inputArea);
        let returnButton = document.createElement("button");
        returnButton.id = "passwordReturnButton_id";
        returnButton.classList.add("diceCupButtons");
        returnButton.classList.add("passwordReturnButton");
        inputArea.appendChild(returnButton);
        let returnIcon = document.createElement("img");
        returnIcon.classList.add("diceCupButtonsIcons");
        returnIcon.src = "Game/Assets/images/menuButtons/return.svg";
        returnButton.appendChild(returnIcon);
        returnButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            document.getElementById("passwordInputContainer_id").remove();
        });
        returnButton.addEventListener("click", DiceCup.hndEvent);
        let inputContainer = document.createElement("input");
        inputContainer.maxLength = 4;
        inputContainer.id = "passwordInput_id";
        inputContainer.classList.add("inputContainer");
        inputArea.appendChild(inputContainer);
        let joinButton = document.createElement("button");
        joinButton.id = "passwordJoinButton_id";
        joinButton.classList.add("passwordJoinButton");
        joinButton.classList.add("diceCupButtons");
        joinButton.innerHTML = DiceCup.language.menu.multiplayer.list.join_button;
        inputArea.appendChild(joinButton);
        joinButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
        });
        joinButton.addEventListener("click", DiceCup.hndEvent);
        let passwordAlert = document.createElement("span");
        passwordAlert.id = "passwordAlert_id";
        passwordInputContainer.appendChild(passwordAlert);
    }
    DiceCup.passwordInput = passwordInput;
    // Fills the serverlist with all available rooms
    async function getRooms(_message) {
        while (document.getElementById("multiplayerContentContainer_id").childNodes.length > 1) {
            document.getElementById("multiplayerContentContainer_id").removeChild(document.getElementById("multiplayerContentContainer_id").lastChild);
        }
        for (let i = _message.content.rooms.length - 1; i > 0; i--) {
            let serverList = document.createElement("button");
            serverList.id = "serverListRow_id_" + i;
            serverList.classList.add("serverListRow");
            document.getElementById("multiplayerContentContainer_id").appendChild(serverList);
            serverList.addEventListener("click", () => DiceCup.focusedIdRoom = _message.content.rooms[i]);
            let playerCountContainer = document.createElement("div");
            playerCountContainer.id = "playerCountContainer_id_" + i;
            playerCountContainer.classList.add("serverListContainer");
            serverList.appendChild(playerCountContainer);
            let nameContainer = document.createElement("div");
            nameContainer.id = "nameContainer_id_" + i;
            nameContainer.classList.add("serverListContainer");
            serverList.appendChild(nameContainer);
            let gamemodeContainer = document.createElement("div");
            gamemodeContainer.id = "gamemodeContainer_id_" + i;
            gamemodeContainer.classList.add("serverListContainer");
            serverList.appendChild(gamemodeContainer);
            let lockedContainer = document.createElement("div");
            lockedContainer.id = "lockedContainer_id_" + i;
            lockedContainer.classList.add("serverListContainer");
            serverList.appendChild(lockedContainer);
            if (_message.content.private[i]) {
                let locked = document.createElement("img");
                locked.id = "locked_id" + i;
                locked.classList.add("serverListIcons");
                locked.src = "Game/Assets/images/serverlistIcons/lock.svg";
                lockedContainer.appendChild(locked);
            }
            let playerCount = document.createElement("span");
            playerCount.id = "playerCount_id_" + i;
            playerCount.innerHTML = (_message.content.clients[i] != "" ? _message.content.clients[i].split(",").length.toString() : "0") + "/6";
            playerCountContainer.appendChild(playerCount);
            let game = document.createElement("span");
            game.id = "room_id_" + i;
            game.innerHTML = _message.content.roomNames[i];
            nameContainer.appendChild(game);
            let gamemode = document.createElement("span");
            gamemode.id = "gamemode_id_" + i;
            gamemode.classList.add("multiplayerGamemode");
            gamemode.innerHTML = DiceCup.gamemodeTranslation(_message.content.gamemode[i]);
            gamemodeContainer.appendChild(gamemode);
            let locked = document.createElement("img");
            locked.id = "locked_id_" + i;
            lockedContainer.appendChild(locked);
        }
    }
    DiceCup.getRooms = getRooms;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // -- Variable declaration --
    // Stores the password for the multiplayer room
    DiceCup.roomPassword = "";
    // Creates a Submenu with setting options for the current singleplayer game
    function multiplayerGameOptions() {
        new DiceCup.SubMenu(DiceCup.MenuPage.multiplayerGameOptions, "multiplayerGameOptions", DiceCup.language.menu.gamesettings.title);
        document.getElementById("multiplayerGameOptionsMenuReturnButton_id").addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.switchMenu(DiceCup.MenuPage.multiplayerLobby);
        });
        let contentContainer = document.createElement("div");
        contentContainer.id = "multiplayergameOptionsContentContainer";
        contentContainer.classList.add("gameOptionsContentContainer");
        contentContainer.classList.add("lobbyContainer");
        document.getElementById("multiplayerGameOptionsMenuContent_id").appendChild(contentContainer);
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                let gridContainer = document.createElement("div");
                gridContainer.id = "multiplayerGameOptionsGrid_id_" + row + "_" + col;
                gridContainer.classList.add("gameOptionsRow_" + row);
                gridContainer.classList.add("gameOptionsColumn_" + col);
                contentContainer.appendChild(gridContainer);
            }
        }
        if (localStorage.getItem("privateRoom")) {
            if (localStorage.getItem("privateRoom") == "true") {
                DiceCup.privateRoom = true;
            }
            else if (localStorage.getItem("privateRoom") == "false") {
                DiceCup.privateRoom = false;
            }
        }
        else {
            DiceCup.privateRoom = false;
        }
        // Creates the controls for the room privacy (public or private and password secured)
        let roomPasswordTag = document.createElement("span");
        roomPasswordTag.id = "multiplayerGameOptionsRoomPasswordTag_id";
        roomPasswordTag.innerHTML = DiceCup.language.menu.gamesettings.password_switch;
        document.getElementById("multiplayerGameOptionsGrid_id_0_0").appendChild(roomPasswordTag);
        let roomPasswordContainer = document.createElement("div");
        roomPasswordContainer.id = "multiplayerGameOptionsRoomPasswordContainer_id";
        document.getElementById("multiplayerGameOptionsGrid_id_0_1").appendChild(roomPasswordContainer);
        let passwordCheckbox = document.createElement("input");
        passwordCheckbox.type = "checkbox";
        passwordCheckbox.checked = DiceCup.privateRoom;
        roomPasswordContainer.appendChild(passwordCheckbox);
        // Generates a random 4 digit number as the password for the room
        let passwordTag = document.createElement("span");
        passwordTag.id = "multiplayerGameOptionsPasswordTag2_id";
        passwordTag.innerHTML = DiceCup.language.menu.gamesettings.password;
        document.getElementById("multiplayerGameOptionsGrid_id_1_0").appendChild(passwordTag);
        let passwordContainer = document.createElement("div");
        passwordContainer.id = "multiplayerGameOptionsPasswordContainer2_id";
        DiceCup.roomPassword = (Math.floor(Math.random() * 8999) + 1000).toString();
        passwordContainer.innerHTML = DiceCup.roomPassword;
        document.getElementById("multiplayerGameOptionsGrid_id_1_1").appendChild(passwordContainer);
        passwordCheckbox.addEventListener("change", function () {
            if (this.checked) {
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_PASSWORD, route: FudgeNet.ROUTE.SERVER, content: { private: true, password: DiceCup.roomPassword } });
                DiceCup.privateRoom = true;
                localStorage.setItem("privateRoom", DiceCup.privateRoom.toString());
            }
            else {
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_PASSWORD, route: FudgeNet.ROUTE.SERVER, content: { private: false } });
                DiceCup.privateRoom = false;
                localStorage.setItem("privateRoom", DiceCup.privateRoom.toString());
            }
        });
        // Creates the control for the round time
        let roundTimerTag = document.createElement("span");
        roundTimerTag.id = "multiplayerGameOptionsRoundTimer_id";
        roundTimerTag.innerHTML = "Round Timer";
        document.getElementById("multiplayerGameOptionsGrid_id_2_0").appendChild(roundTimerTag);
        let roundTimerContainer = document.createElement("div");
        roundTimerContainer.id = "multiplayerGameOptionsRoundTimerContainer_id";
        roundTimerContainer.classList.add("gameOptionsRoundTimerContainer");
        document.getElementById("multiplayerGameOptionsGrid_id_2_1").appendChild(roundTimerContainer);
        let roundTimerButtonLeft = document.createElement("button");
        roundTimerButtonLeft.classList.add("optionsSwitchVolume");
        roundTimerContainer.appendChild(roundTimerButtonLeft);
        let roundTimerButtonLeftIcon = document.createElement("img");
        roundTimerButtonLeftIcon.classList.add("optionsSwitchVolumeIcons");
        roundTimerButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        roundTimerButtonLeft.appendChild(roundTimerButtonLeftIcon);
        let roundTimeControl = document.createElement("span");
        roundTimeControl.id = "multiplayerGameOptionsRoundTimerControl_id";
        roundTimeControl.classList.add("gameOptionsRoundTimerControl");
        roundTimeControl.innerHTML = DiceCup.roundTimer + " seconds";
        roundTimerContainer.appendChild(roundTimeControl);
        let roundTimerButtonRight = document.createElement("button");
        roundTimerButtonRight.classList.add("optionsSwitchVolume");
        roundTimerContainer.appendChild(roundTimerButtonRight);
        let roundTimerButtonRightIcon = document.createElement("img");
        roundTimerButtonRightIcon.classList.add("optionsSwitchVolumeIcons");
        roundTimerButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        roundTimerButtonRight.appendChild(roundTimerButtonRightIcon);
        roundTimerButtonRight.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (DiceCup.roundTimer < 5) {
                DiceCup.roundTimer += 0.5;
                roundTimeControl.innerHTML = DiceCup.roundTimer + " seconds";
                roundTimerButtonLeft.disabled = false;
                roundTimerButtonLeftIcon.style.opacity = "100%";
            }
            if (DiceCup.roundTimer == 5) {
                roundTimerButtonRight.disabled = true;
                roundTimerButtonRightIcon.style.opacity = "0";
                changeGamemode(2);
            }
            if (DiceCup.roundTimer == 3) {
                changeGamemode(0);
            }
            localStorage.setItem("roundTimer", DiceCup.roundTimer.toString());
        });
        roundTimerButtonLeft.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (DiceCup.roundTimer > 1) {
                DiceCup.roundTimer -= 0.5;
                roundTimeControl.innerHTML = DiceCup.roundTimer + " seconds";
                roundTimerButtonRight.disabled = false;
                roundTimerButtonRightIcon.style.opacity = "100%";
            }
            if (DiceCup.roundTimer == 1) {
                roundTimerButtonLeft.disabled = true;
                roundTimerButtonLeftIcon.style.opacity = "0";
                changeGamemode(1);
            }
            if (DiceCup.roundTimer == 3) {
                changeGamemode(0);
            }
            localStorage.setItem("roundTimer", DiceCup.roundTimer.toString());
        });
        if (DiceCup.roundTimer == 5) {
            roundTimerButtonRight.disabled = true;
            roundTimerButtonRightIcon.style.opacity = "0";
        }
        else if (DiceCup.roundTimer == 1) {
            roundTimerButtonLeft.disabled = true;
            roundTimerButtonLeftIcon.style.opacity = "0";
        }
        else if (DiceCup.roundTimer == 3) {
            changeGamemode(0);
        }
    }
    DiceCup.multiplayerGameOptions = multiplayerGameOptions;
    // Sends the changed option to every other connected client in this room
    function changeGamemode(_gamemode) {
        DiceCup.gameMode = _gamemode;
        localStorage.setItem("gamemode", DiceCup.gameMode.toString());
        DiceCup.client.dispatch({ command: FudgeNet.COMMAND.CHANGE_GAMEMODE, route: FudgeNet.ROUTE.SERVER, content: { gamemode: _gamemode } });
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // -- Variable declaration --
    // Variables for music and sound effect volumes
    DiceCup.sfxVolume = localStorage.getItem("volume") ? parseInt(localStorage.getItem("volume")) : 50;
    DiceCup.musicVolume = localStorage.getItem("musicVolume") ? parseInt(localStorage.getItem("musicVolume")) : 50;
    // Creates a submenu for the options screen where the player can change settings related to the whole application like volume, language or game settings
    function optionsMenu() {
        new DiceCup.SubMenu(DiceCup.MenuPage.options, "options", DiceCup.language.menu.settings.title);
        let contentContainer = document.createElement("div");
        contentContainer.id = "optionsContentContainer_id";
        contentContainer.classList.add("lobbyContainer");
        document.getElementById("optionsMenuContent_id").appendChild(contentContainer);
        // Creates a reset button to return to default factory settings
        let resetButton = document.createElement("button");
        resetButton.id = "optionsStartButton_id";
        resetButton.classList.add("gameMenuStartButtons");
        resetButton.classList.add("gameMenuButtons");
        resetButton.classList.add("diceCupButtons");
        resetButton.innerHTML = DiceCup.language.menu.settings.reset_button;
        document.getElementById("optionsMenuRightButtonArea_id").appendChild(resetButton);
        resetButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            localStorage.clear();
            localStorage.setItem("optionsMenu", "true");
            location.reload();
        });
        // Creates the gridlayout for the content
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 2; col++) {
                let gridContainer = document.createElement("div");
                gridContainer.id = "optionsGrid_id_" + row + "_" + col;
                gridContainer.classList.add("optionsRow_" + row);
                gridContainer.classList.add("optionsColumn_" + col);
                contentContainer.appendChild(gridContainer);
            }
        }
        // Creates the music volume controls
        let musicControlTag = document.createElement("span");
        musicControlTag.id = "optionsSoundControlTag_id";
        musicControlTag.innerHTML = DiceCup.language.menu.settings.volume.music;
        document.getElementById("optionsGrid_id_0_0").appendChild(musicControlTag);
        let musicControlContainer = document.createElement("div");
        musicControlContainer.id = "optionsSoundControlContainer_id";
        document.getElementById("optionsGrid_id_0_1").appendChild(musicControlContainer);
        let musicSwitchButtonLeft = document.createElement("button");
        musicSwitchButtonLeft.classList.add("optionsSwitchVolume");
        musicControlContainer.appendChild(musicSwitchButtonLeft);
        let musicSwitchButtonLeftIcon = document.createElement("img");
        musicSwitchButtonLeftIcon.classList.add("optionsSwitchVolumeIcons");
        musicSwitchButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        musicSwitchButtonLeft.appendChild(musicSwitchButtonLeftIcon);
        let musicControl = document.createElement("span");
        musicControl.id = "optionsSoundControl_id";
        musicControl.innerHTML = DiceCup.musicVolume + "%";
        musicControlContainer.appendChild(musicControl);
        let musicSwitchButtonRight = document.createElement("button");
        musicSwitchButtonRight.classList.add("optionsSwitchVolume");
        musicControlContainer.appendChild(musicSwitchButtonRight);
        let musicSwitchButtonRightIcon = document.createElement("img");
        musicSwitchButtonRightIcon.classList.add("optionsSwitchVolumeIcons");
        musicSwitchButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        musicSwitchButtonRight.appendChild(musicSwitchButtonRightIcon);
        musicSwitchButtonRight.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (DiceCup.musicVolume < 100) {
                DiceCup.musicVolume += 10;
                musicControl.innerHTML = DiceCup.musicVolume + "%";
                musicSwitchButtonLeft.disabled = false;
                musicSwitchButtonLeftIcon.style.opacity = "100%";
                DiceCup.changeVolume(0);
            }
            if (DiceCup.musicVolume == 100) {
                musicSwitchButtonRight.disabled = false;
                musicSwitchButtonRightIcon.style.opacity = "0";
            }
            localStorage.setItem("musicVolume", DiceCup.musicVolume.toString());
        });
        musicSwitchButtonLeft.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (DiceCup.musicVolume > 0) {
                DiceCup.musicVolume -= 10;
                musicControl.innerHTML = DiceCup.musicVolume + "%";
                musicSwitchButtonRight.disabled = false;
                musicSwitchButtonRightIcon.style.opacity = "100%";
                DiceCup.changeVolume(0);
            }
            if (DiceCup.musicVolume == 0) {
                musicSwitchButtonLeft.disabled = false;
                musicSwitchButtonLeftIcon.style.opacity = "0";
            }
            localStorage.setItem("musicVolume", DiceCup.musicVolume.toString());
        });
        if (DiceCup.musicVolume == 100) {
            musicSwitchButtonRight.disabled = false;
            musicSwitchButtonRightIcon.style.opacity = "0";
        }
        else if (DiceCup.musicVolume == 0) {
            musicSwitchButtonLeft.disabled = false;
            musicSwitchButtonLeftIcon.style.opacity = "0";
        }
        // Creates the sfx volume controls
        let soundControlTag = document.createElement("span");
        soundControlTag.id = "optionsSoundControlTag_id";
        soundControlTag.innerHTML = DiceCup.language.menu.settings.volume.sfx;
        document.getElementById("optionsGrid_id_1_0").appendChild(soundControlTag);
        let soundControlContainer = document.createElement("div");
        soundControlContainer.id = "optionsSoundControlContainer_id";
        document.getElementById("optionsGrid_id_1_1").appendChild(soundControlContainer);
        let switchButtonLeft = document.createElement("button");
        switchButtonLeft.classList.add("optionsSwitchVolume");
        soundControlContainer.appendChild(switchButtonLeft);
        let switchButtonLeftIcon = document.createElement("img");
        switchButtonLeftIcon.classList.add("optionsSwitchVolumeIcons");
        switchButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        switchButtonLeft.appendChild(switchButtonLeftIcon);
        let soundControl = document.createElement("span");
        soundControl.id = "optionsSoundControl_id";
        soundControl.innerHTML = DiceCup.sfxVolume + "%";
        soundControlContainer.appendChild(soundControl);
        let switchButtonRight = document.createElement("button");
        switchButtonRight.classList.add("optionsSwitchVolume");
        soundControlContainer.appendChild(switchButtonRight);
        let switchButtonRightIcon = document.createElement("img");
        switchButtonRightIcon.classList.add("optionsSwitchVolumeIcons");
        switchButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        switchButtonRight.appendChild(switchButtonRightIcon);
        switchButtonRight.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (DiceCup.sfxVolume < 100) {
                DiceCup.sfxVolume += 10;
                soundControl.innerHTML = DiceCup.sfxVolume + "%";
                switchButtonLeft.disabled = false;
                switchButtonLeftIcon.style.opacity = "100%";
                DiceCup.changeVolume(1);
            }
            if (DiceCup.sfxVolume == 100) {
                switchButtonRight.disabled = true;
                switchButtonRightIcon.style.opacity = "0";
            }
            localStorage.setItem("volume", DiceCup.sfxVolume.toString());
        });
        switchButtonLeft.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (DiceCup.sfxVolume > 0) {
                DiceCup.sfxVolume -= 10;
                soundControl.innerHTML = DiceCup.sfxVolume + "%";
                switchButtonRight.disabled = false;
                switchButtonRightIcon.style.opacity = "100%";
                DiceCup.changeVolume(1);
            }
            if (DiceCup.sfxVolume == 0) {
                switchButtonLeft.disabled = true;
                switchButtonLeftIcon.style.opacity = "0";
            }
            localStorage.setItem("volume", DiceCup.sfxVolume.toString());
        });
        if (DiceCup.sfxVolume == 100) {
            switchButtonRight.disabled = true;
            switchButtonRightIcon.style.opacity = "0";
        }
        else if (DiceCup.sfxVolume == 0) {
            switchButtonLeft.disabled = true;
            switchButtonLeftIcon.style.opacity = "0";
        }
        // Creates the language switch controls
        let languageTag = document.createElement("span");
        languageTag.id = "optionsLanguageTag_id";
        languageTag.innerHTML = DiceCup.language.menu.settings.language.title;
        document.getElementById("optionsGrid_id_2_0").appendChild(languageTag);
        let languageControlContainer = document.createElement("div");
        languageControlContainer.id = "optionsLanguageContainer_id";
        document.getElementById("optionsGrid_id_2_1").appendChild(languageControlContainer);
        let languageControlButton = document.createElement("button");
        languageControlButton.id = "optionsLanguageButton_id";
        languageControlButton.innerHTML = DiceCup.languageTranslation(DiceCup.currentLanguage) + " ▾";
        languageControlContainer.appendChild(languageControlButton);
        let languageControlMenu = document.createElement("div");
        languageControlMenu.classList.add("optionsLanguageMenu");
        languageControlButton.appendChild(languageControlMenu);
        for (let i = 0; i < Object.values(DiceCup.Languages).length; i++) {
            let languageControlButton = document.createElement("button");
            languageControlButton.classList.add("optionsLanguageMenuContent");
            languageControlButton.innerHTML = DiceCup.languageTranslation(Object.values(DiceCup.Languages)[i]);
            languageControlMenu.appendChild(languageControlButton);
            languageControlButton.addEventListener("click", () => {
                DiceCup.playSFX(DiceCup.buttonClick);
                localStorage.setItem("language", Object.values(DiceCup.Languages)[i]);
                localStorage.setItem("optionsMenu", "true");
                location.reload();
            });
        }
        languageControlButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            languageControlMenu.classList.contains("optionsShowLanguages") ? languageControlMenu.classList.remove("optionsShowLanguages") : languageControlMenu.classList.add("optionsShowLanguages");
        });
        // Creates the controls for the hud visibility
        let helpCategory = document.createElement("span");
        helpCategory.id = "optionsHelpCategory_id";
        helpCategory.innerHTML = DiceCup.language.menu.settings.help_category_hud.title;
        document.getElementById("optionsGrid_id_3_0").appendChild(helpCategory);
        let helpCategoryContainer = document.createElement("div");
        helpCategoryContainer.id = "optionsHelpCategoryContainer_id";
        document.getElementById("optionsGrid_id_3_1").appendChild(helpCategoryContainer);
        let helpCategoryCheckbox = document.createElement("input");
        helpCategoryCheckbox.type = "checkbox";
        if (localStorage.getItem("helpCategoryHud")) {
            if (localStorage.getItem("helpCategoryHud") === "true") {
                helpCategoryCheckbox.checked = true;
                DiceCup.helpCategoryHud = true;
            }
            else if (localStorage.getItem("helpCategoryHud") === "false") {
                helpCategoryCheckbox.checked = false;
                DiceCup.helpCategoryHud = false;
            }
        }
        else {
            helpCategoryCheckbox.checked = true;
        }
        helpCategoryContainer.appendChild(helpCategoryCheckbox);
        helpCategoryCheckbox.addEventListener("change", function () {
            if (this.checked) {
                DiceCup.helpCategoryHud = true;
                localStorage.setItem("helpCategoryHud", "true");
            }
            else {
                DiceCup.helpCategoryHud = false;
                localStorage.setItem("helpCategoryHud", "false");
            }
        });
    }
    DiceCup.optionsMenu = optionsMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // -- Variable declaration --
    // Object for the bot settings (names and difficulties)
    let botSettings;
    // Determines the first bot so it can't be removed, because the game needs min one bot
    let firstBot = 0;
    // Determines how many bots are added or removed from the lobby
    let botCount = 0;
    // Determines the chosen difficulty for each bot
    let chosenDifficulty = 1;
    // Stores all names for the game settings
    let allNames = [];
    // Creates a submenu for the singleplayer lobby with localstorage saved settings or min one bot and random names
    function singleplayerMenu() {
        new DiceCup.SubMenu(DiceCup.MenuPage.singleplayer, "singleplayer", DiceCup.language.menu.singleplayer.lobby.title);
        let localCount = JSON.parse(localStorage.getItem("difficulties")) ?? [1];
        let botCounter = localCount.length ?? localCount[0];
        // Creates Player, Bot and Add Containers
        createPlayerPortrait();
        for (let index = 0; index < botCounter; index++) {
            createBotPortrait();
        }
        for (let index = 0; index < (5 - botCounter); index++) {
            createAddPortrait();
        }
        let settingsButton = document.createElement("button");
        settingsButton.id = "singleplayerSettingsButton_id";
        settingsButton.classList.add("gameMenuButtons");
        settingsButton.classList.add("diceCupButtons");
        document.getElementById("singleplayerMenuLeftButtonArea_id").appendChild(settingsButton);
        let settingsIcon = document.createElement("img");
        settingsIcon.classList.add("diceCupButtonsIcons");
        settingsIcon.src = "Game/Assets/images/menuButtons/settings.svg";
        settingsButton.appendChild(settingsIcon);
        settingsButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.switchMenu(DiceCup.MenuPage.singleplayerGameOptions);
        });
        let startButton = document.createElement("button");
        startButton.id = "singleplayerStartButton_id";
        startButton.classList.add("gameMenuStartButtons");
        startButton.classList.add("gameMenuButtons");
        startButton.classList.add("diceCupButtons");
        startButton.innerHTML = DiceCup.language.menu.singleplayer.lobby.start_button;
        document.getElementById("singleplayerMenuRightButtonArea_id").appendChild(startButton);
        startButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.nextTrack(1);
            createGameSettings();
        });
    }
    DiceCup.singleplayerMenu = singleplayerMenu;
    // Creates and checks the gamesettings if the player wants to start the game
    function createGameSettings() {
        botSettings = [];
        let ids = [];
        // Gets the bot placeholders at names at first
        for (let i = 0, idCounter = 0; i < 5; i++) {
            if (document.getElementById("botName_id_" + i)) {
                ids[idCounter] = document.getElementById("botName_id_" + i).placeholder;
                idCounter++;
            }
        }
        // Pushes them into the bot settings object with preset settings
        for (let i = 0; i < ids.length; i++) {
            botSettings.push({ botName: ids[i], difficulty: DiceCup.BotDifficulty.easy });
        }
        // Initialize the game settings object with the playername and botsettings
        DiceCup.gameSettings_sp = { playerName: document.getElementById("playerName_id").placeholder, bot: botSettings };
        // Gets the playername from the input field
        if (document.getElementById("playerName_id").value) {
            DiceCup.gameSettings_sp.playerName = document.getElementById("playerName_id").value;
        }
        // Gets the new bot names and set difficulties from the input fields
        ids = [];
        for (let i = 0, idCounter = 0; i < 5; i++) {
            if (document.getElementById("botName_id_" + i)) {
                if (document.getElementById("botName_id_" + i).value) {
                    botSettings[idCounter].botName = document.getElementById("botName_id_" + i).value;
                }
                if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == DiceCup.language.menu.singleplayer.lobby.difficulties.easy) {
                    botSettings[idCounter].difficulty = DiceCup.BotDifficulty.easy;
                }
                else if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == DiceCup.language.menu.singleplayer.lobby.difficulties.normal) {
                    botSettings[idCounter].difficulty = DiceCup.BotDifficulty.normal;
                }
                else if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == DiceCup.language.menu.singleplayer.lobby.difficulties.hard) {
                    botSettings[idCounter].difficulty = DiceCup.BotDifficulty.hard;
                }
                idCounter++;
            }
        }
        // Pushes all names in a seperated array
        let playerNames = [DiceCup.gameSettings_sp.playerName];
        for (let index = 0; index < DiceCup.gameSettings_sp.bot.length; index++) {
            playerNames.push(DiceCup.gameSettings_sp.bot[index].botName);
        }
        // Checks the playername and if the check returns true all game settings are saved in localstorage for next game creation
        // Some enums and booleans get changed and the game starts with gamestate change
        if (checkPlayernames(playerNames)) {
            DiceCup.hideMenu();
            localStorage.setItem("playernames", JSON.stringify(playerNames));
            localStorage.setItem("difficulties", JSON.stringify(botSettings.map(elem => elem.difficulty)));
            DiceCup.playerMode = DiceCup.PlayerMode.singlelpayer;
            DiceCup.inGame = true;
            DiceCup.changeGameState(DiceCup.GameState.init);
        }
    }
    // Checks the playernames with regular expressions for invalid tokens and identical names 
    function checkPlayernames(_names) {
        let doubles = _names.filter((item, index) => _names.indexOf(item) !== index);
        for (let i = 0; i < _names.length; i++) {
            if (!/^[A-Za-z0-9_]*$/.test(_names[i])) {
                document.getElementById("singleplayerAlert_id").innerHTML = "Only alphabetic and numeric tokens!";
                ƒ.Time.game.setTimer(1000, 1, () => { document.getElementById("singleplayerAlert_id").innerHTML = ""; });
                return false;
            }
            if (doubles.length != 0) {
                document.getElementById("singleplayerAlert_id").innerHTML = "No identical names!";
                ƒ.Time.game.setTimer(1000, 1, () => { document.getElementById("singleplayerAlert_id").innerHTML = ""; });
                return false;
            }
        }
        return true;
    }
    // Collects all names and checks them directly with the input of the player
    function collectNames() {
        allNames = [];
        if (document.getElementById("playerName_id")) {
            if (document.getElementById("playerName_id").value != "") {
                allNames.push(document.getElementById("playerName_id").value);
            }
            else {
                allNames.push(document.getElementById("playerName_id").placeholder);
            }
        }
        for (let i = 0; i < 5; i++) {
            if (document.getElementById("botName_id_" + i)) {
                if (document.getElementById("botName_id_" + i).value != "") {
                    allNames.push(document.getElementById("botName_id_" + i).value);
                }
                else {
                    allNames.push(document.getElementById("botName_id_" + i).placeholder);
                }
            }
        }
        checkPlayernames(allNames);
    }
    // Creates a player container with localstorage savefiles or factory settings
    function createPlayerPortrait() {
        let playerContainer = document.createElement("div");
        playerContainer.id = "playerContainer_id";
        playerContainer.classList.add("lobbyContainer");
        playerContainer.style.order = "0";
        document.getElementById("singleplayerMenuContent_id").appendChild(playerContainer);
        let playerDiv = document.createElement("button");
        playerDiv.id = "playerPortrait_id";
        playerDiv.classList.add("lobbyPortrait");
        playerDiv.classList.add("lobbyPortrait_active");
        playerDiv.classList.add("diceCupButtons");
        playerContainer.appendChild(playerDiv);
        let playerIcons = document.createElement("img");
        playerIcons.classList.add("lobbyPortraitIcons");
        playerIcons.src = "Game/Assets/images/menuButtons/player.svg";
        playerDiv.appendChild(playerIcons);
        let nameInputContainer = document.createElement("div");
        nameInputContainer.id = "nameInputContainer_id";
        nameInputContainer.classList.add("nameInputContainer");
        playerContainer.appendChild(nameInputContainer);
        let playerName = document.createElement("input");
        playerName.id = "playerName_id";
        playerName.classList.add("nameInputs");
        let playernames = JSON.parse(localStorage.getItem("playernames")) ?? [DiceCup.language.menu.player];
        playerName.placeholder = playernames[0];
        nameInputContainer.appendChild(playerName);
        let nameInputButton = document.createElement("button");
        nameInputButton.id = "nameInputButton_id_player";
        nameInputButton.classList.add("nameInputsButtons");
        nameInputButton.innerHTML = "✔";
        nameInputContainer.appendChild(nameInputButton);
        playerName.addEventListener("click", () => { nameInputButton.style.display = "block"; playerName.classList.add("nameInputsFocused"); });
        nameInputButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            nameInputButton.style.display = "none";
            playerName.classList.remove("nameInputsFocused");
            collectNames();
        });
        let difficultySwitchHidden = document.createElement("div");
        difficultySwitchHidden.classList.add("difficultySwitch");
        difficultySwitchHidden.style.visibility = "hidden";
        playerContainer.appendChild(difficultySwitchHidden);
    }
    // Creates a bot container with localstorage savefiles or factory settings
    function createBotPortrait() {
        let botContainer = document.createElement("div");
        botContainer.id = "botContainer_id_" + botCount;
        botContainer.classList.add("botContainer");
        botContainer.classList.add("lobbyContainer");
        botContainer.style.order = "1";
        document.getElementById("singleplayerMenuContent_id").appendChild(botContainer);
        let botDiv = document.createElement("button");
        botDiv.id = "botPortrait_id_" + botCount;
        botDiv.classList.add("lobbyPortrait");
        botDiv.classList.add("lobbyPortrait_active");
        botDiv.classList.add("diceCupButtons");
        botDiv.disabled = true;
        botContainer.appendChild(botDiv);
        // Creates the remove bot button on every container except the first bot
        if (firstBot > 0) {
            let botRemove = document.createElement("button");
            botRemove.id = "botRemove_id_" + botCount;
            botRemove.classList.add("removeButton");
            botDiv.appendChild(botRemove);
            botRemove.addEventListener("click", () => { DiceCup.playSFX(DiceCup.buttonClick); });
            botRemove.addEventListener("click", handleRemoveBot);
            let botRemoveIcon = document.createElement("img");
            botRemoveIcon.classList.add("removeButtonIcons");
            botRemoveIcon.src = "Game/Assets/images/menuButtons/minus.svg";
            botRemove.appendChild(botRemoveIcon);
        }
        let botIcons = document.createElement("img");
        botIcons.classList.add("lobbyPortraitIcons");
        botIcons.src = "Game/Assets/images/menuButtons/bot.svg";
        botDiv.appendChild(botIcons);
        let nameInputContainer = document.createElement("div");
        nameInputContainer.id = "nameInputContainer_id" + botCount;
        nameInputContainer.classList.add("nameInputContainer");
        botContainer.appendChild(nameInputContainer);
        let botName = document.createElement("input");
        botName.id = "botName_id_" + botCount;
        let localBots = botCount + 1;
        let playernames = JSON.parse(localStorage.getItem("playernames")) ?? [];
        botName.placeholder = playernames[localBots] ?? "Agent" + Math.floor((Math.random() * 99));
        botName.classList.add("nameInputs");
        nameInputContainer.appendChild(botName);
        // Creates the input field with random generated bot names or selfmade names
        let nameInputButton = document.createElement("button");
        nameInputButton.id = "nameInputButton_id_" + botCount;
        nameInputButton.classList.add("nameInputsButtons");
        nameInputButton.innerHTML = "✔";
        nameInputContainer.appendChild(nameInputButton);
        botName.addEventListener("click", () => { nameInputButton.style.display = "block"; botName.classList.add("nameInputsFocused"); });
        nameInputButton.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            nameInputButton.style.display = "none";
            botName.classList.remove("nameInputsFocused");
            collectNames();
        });
        // Creates the difficulty switch to change the difficulty for each bot
        let difficultySwitch = document.createElement("div");
        difficultySwitch.classList.add("difficultySwitch");
        botContainer.appendChild(difficultySwitch);
        let switchButtonLeft = document.createElement("button");
        switchButtonLeft.classList.add("switchDifficulty");
        difficultySwitch.appendChild(switchButtonLeft);
        let switchButtonLeftIcon = document.createElement("img");
        switchButtonLeftIcon.classList.add("switchButtonIcons");
        switchButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        switchButtonLeft.appendChild(switchButtonLeftIcon);
        let difficultySwitchText = document.createElement("div");
        difficultySwitchText.classList.add("switchDifficultyText");
        // difficultySwitchText.classList.add("scrollContainer");
        difficultySwitch.appendChild(difficultySwitchText);
        let difficultyText = document.createElement("span");
        // difficultyText.classList.add("scrollText");
        difficultyText.id = "switchDifficultyText_id_" + botCount;
        let difficulties = JSON.parse(localStorage.getItem("difficulties")) ?? [];
        difficultyText.innerHTML = DiceCup.difficultyTranslation(DiceCup.BotDifficulty[parseInt(difficulties[botCount])]) ?? DiceCup.difficultyTranslation(DiceCup.BotDifficulty[chosenDifficulty]);
        difficultySwitchText.appendChild(difficultyText);
        let switchButtonRight = document.createElement("button");
        switchButtonRight.classList.add("switchDifficulty");
        difficultySwitch.appendChild(switchButtonRight);
        let switchButtonRightIcon = document.createElement("img");
        switchButtonRightIcon.classList.add("switchButtonIcons");
        switchButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        switchButtonRight.appendChild(switchButtonRightIcon);
        switchButtonRight.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (chosenDifficulty < 2) {
                chosenDifficulty++;
            }
            else {
                chosenDifficulty = 0;
            }
            difficultyText.innerHTML = DiceCup.difficultyTranslation(DiceCup.BotDifficulty[chosenDifficulty]);
        });
        switchButtonLeft.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (chosenDifficulty > 0) {
                chosenDifficulty--;
            }
            else {
                chosenDifficulty = 2;
            }
            difficultyText.innerHTML = DiceCup.difficultyTranslation(DiceCup.BotDifficulty[chosenDifficulty]);
        });
        botCount++;
        firstBot++;
    }
    // Creates an add button to add more bots
    function createAddPortrait() {
        let addContainer = document.createElement("div");
        addContainer.classList.add("addContainer");
        addContainer.classList.add("lobbyContainer");
        addContainer.style.order = "2";
        document.getElementById("singleplayerMenuContent_id").appendChild(addContainer);
        let addPlayerDiv = document.createElement("button");
        addPlayerDiv.classList.add("lobbyPortrait");
        addPlayerDiv.classList.add("lobbyPortrait_inactive");
        addPlayerDiv.classList.add("diceCupButtons");
        addContainer.appendChild(addPlayerDiv);
        let addIcons = document.createElement("img");
        addIcons.classList.add("lobbyPortraitIcons");
        addIcons.src = "Game/Assets/images/menuButtons/plus.svg";
        addPlayerDiv.appendChild(addIcons);
        addPlayerDiv.addEventListener("click", handleAddBot);
        addPlayerDiv.addEventListener("click", () => DiceCup.playSFX(DiceCup.buttonClick));
    }
    // Adds a bot to the game and visualizes it with a new bot container
    function handleAddBot(_event) {
        firstBot++;
        this.parentElement.remove();
        createBotPortrait();
    }
    // Removes a bot to the game and visualizes it with a new add button
    function handleRemoveBot(_event) {
        firstBot--;
        botCount--;
        this.parentElement.parentElement.remove();
        createAddPortrait();
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // -- Variable declaration --
    // Creates a Submenu with setting options for the current multiplayer game
    function singleplayerGameOptions() {
        new DiceCup.SubMenu(DiceCup.MenuPage.singleplayerGameOptions, "singleplayerGameOptions", DiceCup.language.menu.gamesettings.title);
        document.getElementById("singleplayerGameOptionsMenuReturnButton_id").addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            DiceCup.switchMenu(DiceCup.MenuPage.singleplayer);
        });
        let contentContainer = document.createElement("div");
        contentContainer.id = "singleplayergameOptionsContentContainer";
        contentContainer.classList.add("gameOptionsContentContainer");
        contentContainer.classList.add("lobbyContainer");
        document.getElementById("singleplayerGameOptionsMenuContent_id").appendChild(contentContainer);
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                let gridContainer = document.createElement("div");
                gridContainer.id = "singleplayerGameOptionsGrid_id_" + row + "_" + col;
                gridContainer.classList.add("gameOptionsRow_" + row);
                gridContainer.classList.add("gameOptionsColumn_" + col);
                contentContainer.appendChild(gridContainer);
            }
        }
        // Creates the control of the round time
        let roundTimerTag = document.createElement("span");
        roundTimerTag.id = "singleplayerGameOptionsRoundTimer_id";
        roundTimerTag.innerHTML = DiceCup.language.menu.gamesettings.round_timer;
        document.getElementById("singleplayerGameOptionsGrid_id_0_0").appendChild(roundTimerTag);
        let roundTimerContainer = document.createElement("div");
        roundTimerContainer.id = "singleplayerGameOptionsRoundTimerContainer_id";
        roundTimerContainer.classList.add("gameOptionsRoundTimerContainer");
        document.getElementById("singleplayerGameOptionsGrid_id_0_1").appendChild(roundTimerContainer);
        let roundTimerButtonLeft = document.createElement("button");
        roundTimerButtonLeft.classList.add("optionsSwitchVolume");
        roundTimerContainer.appendChild(roundTimerButtonLeft);
        let roundTimerButtonLeftIcon = document.createElement("img");
        roundTimerButtonLeftIcon.classList.add("optionsSwitchVolumeIcons");
        roundTimerButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        roundTimerButtonLeft.appendChild(roundTimerButtonLeftIcon);
        let roundTimeControl = document.createElement("span");
        roundTimeControl.id = "singleplayerGameOptionsRoundTimerControl_id";
        roundTimeControl.classList.add("gameOptionsRoundTimerControl");
        roundTimeControl.innerHTML = DiceCup.roundTimer + "&nbsp;" + DiceCup.language.menu.gamesettings.round_timer_unit;
        roundTimerContainer.appendChild(roundTimeControl);
        let roundTimerButtonRight = document.createElement("button");
        roundTimerButtonRight.classList.add("optionsSwitchVolume");
        roundTimerContainer.appendChild(roundTimerButtonRight);
        let roundTimerButtonRightIcon = document.createElement("img");
        roundTimerButtonRightIcon.classList.add("optionsSwitchVolumeIcons");
        roundTimerButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        roundTimerButtonRight.appendChild(roundTimerButtonRightIcon);
        roundTimerButtonRight.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (DiceCup.roundTimer < 5) {
                DiceCup.roundTimer += 0.5;
                roundTimeControl.innerHTML = DiceCup.roundTimer + "&nbsp;" + DiceCup.language.menu.gamesettings.round_timer_unit;
                roundTimerButtonLeft.disabled = false;
                roundTimerButtonLeftIcon.style.opacity = "100%";
            }
            if (DiceCup.roundTimer == 5) {
                roundTimerButtonRight.disabled = true;
                roundTimerButtonRightIcon.style.opacity = "0";
                DiceCup.gameMode = DiceCup.GameMode.slow;
                localStorage.setItem("gamemode", DiceCup.gameMode.toString());
            }
            if (DiceCup.roundTimer == 3) {
                DiceCup.gameMode = DiceCup.GameMode.normal;
                localStorage.setItem("gamemode", DiceCup.gameMode.toString());
            }
            localStorage.setItem("roundTimer", DiceCup.roundTimer.toString());
        });
        roundTimerButtonLeft.addEventListener("click", () => {
            DiceCup.playSFX(DiceCup.buttonClick);
            if (DiceCup.roundTimer > 1) {
                DiceCup.roundTimer -= 0.5;
                roundTimeControl.innerHTML = DiceCup.roundTimer + "&nbsp;" + DiceCup.language.menu.gamesettings.round_timer_unit;
                roundTimerButtonRight.disabled = false;
                roundTimerButtonRightIcon.style.opacity = "100%";
            }
            if (DiceCup.roundTimer == 1) {
                roundTimerButtonLeft.disabled = true;
                roundTimerButtonLeftIcon.style.opacity = "0";
                DiceCup.gameMode = DiceCup.GameMode.fast;
                localStorage.setItem("gamemode", DiceCup.gameMode.toString());
            }
            if (DiceCup.roundTimer == 3) {
                DiceCup.gameMode = DiceCup.GameMode.normal;
                localStorage.setItem("gamemode", DiceCup.gameMode.toString());
            }
            localStorage.setItem("roundTimer", DiceCup.roundTimer.toString());
        });
        if (DiceCup.roundTimer == 5) {
            roundTimerButtonRight.disabled = true;
            roundTimerButtonRightIcon.style.opacity = "0";
            DiceCup.gameMode = DiceCup.GameMode.slow;
            localStorage.setItem("gamemode", DiceCup.gameMode.toString());
        }
        else if (DiceCup.roundTimer == 1) {
            roundTimerButtonLeft.disabled = true;
            roundTimerButtonLeftIcon.style.opacity = "0";
            DiceCup.gameMode = DiceCup.GameMode.fast;
            localStorage.setItem("gamemode", DiceCup.gameMode.toString());
        }
        else if (DiceCup.roundTimer == 3) {
            DiceCup.gameMode = DiceCup.GameMode.normal;
            localStorage.setItem("gamemode", DiceCup.gameMode.toString());
        }
        if (localStorage.getItem("botMode")) {
            DiceCup.botMode = parseInt(localStorage.getItem("botMode"));
        }
        else {
            DiceCup.botMode = 0;
        }
        // Creates the control of the botmode
        let botCatTag = document.createElement("span");
        botCatTag.id = "singleplayerGameOptionsBotCatTag_id";
        botCatTag.innerHTML = DiceCup.language.menu.gamesettings.bot_pick_same_cat;
        document.getElementById("singleplayerGameOptionsGrid_id_1_0").appendChild(botCatTag);
        let botCatContainer = document.createElement("div");
        botCatContainer.id = "singleplayerGameOptionsBotCatContainer_id";
        document.getElementById("singleplayerGameOptionsGrid_id_1_1").appendChild(botCatContainer);
        let botCatCheckbox = document.createElement("input");
        botCatCheckbox.type = "checkbox";
        botCatCheckbox.checked = DiceCup.botMode == 0 ? true : false;
        botCatContainer.appendChild(botCatCheckbox);
        botCatCheckbox.addEventListener("change", function () {
            if (this.checked) {
                DiceCup.botMode = 0;
                localStorage.setItem("botMode", DiceCup.botMode.toString());
            }
            else {
                DiceCup.botMode = 1;
                localStorage.setItem("botMode", DiceCup.botMode.toString());
            }
        });
    }
    DiceCup.singleplayerGameOptions = singleplayerGameOptions;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class Bot {
        // -- Variable declaration --
        // Dice of current round
        dices;
        // Left categories for each bot to pick
        freeCategories = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        // Counter of left categories
        categoryCounter = 12;
        // Bots difficulty setting to determine how its picking its category
        difficulty;
        // Bots given name
        name;
        // Determines the bot mode if the bot can pick the same category as the player in the same round
        mode;
        // Sets the variables inside the constructor
        constructor(_name, _difficulty, _dices, _mode) {
            this.name = _name;
            this.dices = _dices;
            this.difficulty = _difficulty;
            this.mode = _mode;
        }
        // Validates every category and sends these values into the Probabilities Class where a table sorted from best to worst category for each round is calculated
        // The returned table will be given into the difficulty selection where the chosen difficulty has its impact on
        async botsTurn() {
            let pickedCategory = 0;
            let values = [];
            for (let i = 0; i < this.freeCategories.length; i++) {
                let valuation = new DiceCup.Valuation(this.freeCategories[i], DiceCup.dices, false);
                values[i] = [];
                values[i][0] = this.freeCategories[i];
                values[i][1] = valuation.chooseScoringCategory();
            }
            let prob = new DiceCup.Probabilities(DiceCup.dices, values, this.freeCategories);
            let allProb = await prob.fillProbabilities();
            pickedCategory = this.chooseDifficulty(allProb);
            this.botValuation(pickedCategory);
            let tempArray = this.freeCategories.filter((element) => element !== pickedCategory);
            this.freeCategories = tempArray;
            this.categoryCounter--;
        }
        // The chosen bot difficulty determines how the bot chooses from the sorted table with all categories
        // The table gets every round shorter because the used categories will be removed
        chooseDifficulty(_categories) {
            let pickedCategory = 0;
            switch (this.difficulty) {
                case DiceCup.BotDifficulty.easy:
                    pickedCategory = this.botEasy(_categories);
                    break;
                case DiceCup.BotDifficulty.normal:
                    pickedCategory = this.botMedium(_categories);
                    break;
                case DiceCup.BotDifficulty.hard:
                    pickedCategory = this.botHard(_categories);
                    break;
            }
            return pickedCategory;
        }
        // The easy bot picks a random category
        botEasy(_categories) {
            let cat = _categories[(Math.floor((Math.random() * this.categoryCounter)))].category;
            if (this.mode == 1) {
                while (cat == DiceCup.lastPickedCategory && DiceCup.roundCounter < 12) {
                    cat = _categories[(Math.floor((Math.random() * this.categoryCounter)))].category;
                }
            }
            return cat;
        }
        // The medium bot picks a random category from the better half of the table
        botMedium(_categories) {
            let cat = _categories[Math.floor((Math.random() * this.categoryCounter) / 2)].category;
            if (this.mode == 1) {
                while (cat == DiceCup.lastPickedCategory && DiceCup.roundCounter < 12) {
                    cat = _categories[Math.floor((Math.random() * this.categoryCounter) / 2)].category;
                }
            }
            return cat;
        }
        // The hard bot picks a random category from the better quarter of the table
        botHard(_categories) {
            let cat = _categories[Math.floor((Math.random() * this.categoryCounter) / 4)].category;
            if (this.mode == 1) {
                while (cat == DiceCup.lastPickedCategory && DiceCup.roundCounter < 12) {
                    cat = _categories[Math.floor((Math.random() * this.categoryCounter) / 4)].category;
                }
            }
            return cat;
        }
        // Validates the picked category and updates the summary table
        botValuation(_category) {
            let valuation = new DiceCup.Valuation(_category, DiceCup.dices, false);
            let value = valuation.chooseScoringCategory();
            DiceCup.updateSummary(value, _category, this.name);
        }
    }
    DiceCup.Bot = Bot;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    class Dice {
        // -- Variable declaration --
        // Color of this dice
        color;
        // Value of this dice
        value;
        // Nodes, Graphs and Components of the seperate parts of the dice model
        graph = DiceCup.viewport.getBranch();
        diceNode = this.graph.getChildrenByName("Dices")[0];
        diceGraph;
        diceInst;
        diceMat;
        diceRig;
        dots;
        dotsMat;
        // Multiplayer: Host sends dice and Guests get dice
        sendDice = [];
        getDice = { value: 0, rotation: new ƒ.Vector3(0, 0, 0), translation: new ƒ.Vector3(0, 0, 0) };
        // Random translation and rotation to throw in the background of the main menu
        arenaWidth = 3;
        arenaHeigth = 2;
        arenaTranslation = new ƒ.Vector3((Math.random() * this.arenaWidth) - this.arenaWidth / 2, Math.random() * 5 + 3, (Math.random() * this.arenaHeigth) - this.arenaHeigth / 2);
        arenaRotation = new ƒ.Vector3(Math.random() * 360, (Math.random() * 360), (Math.random() * 360));
        // Dice sizes
        bigDice = 0.12;
        smallDice = 0.1;
        // Distance between multiple dice so that they can't be inside each other and flicker or glitch
        diceDistance = 0.1;
        // Constructor to initialize a new dice
        constructor(_colorRGBA, _color, _rollDiceMode, _hostDice) {
            this.color = _color;
            this.initDice(_colorRGBA, _rollDiceMode, _hostDice);
        }
        // Rolls a random dice number between 1 to 6
        roll() {
            this.value = Math.floor((Math.random() * 6) + 1);
            return this.value;
        }
        // Initialize Dice and its components
        async initDice(_colorRGBA, _rollDiceMode, _hostDice) {
            this.diceGraph = ƒ.Project.resources["Graph|2023-05-10T12:08:54.682Z|33820"];
            this.diceInst = await ƒ.Project.createGraphInstance(this.diceGraph);
            this.diceMat = this.diceInst.getComponent(ƒ.ComponentMaterial);
            this.diceRig = this.diceInst.getComponent(ƒ.ComponentRigidbody);
            this.dots = this.diceInst.getChildren();
            this.dotsMat = this.dots.map(dot => dot.getComponent(ƒ.ComponentMaterial));
            // Handles sound collision detection
            this.diceRig.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, this.handleDiceCollision);
            // let corners: ƒ.Node[] = [];
            // for (let i = 1, j = 0; i <=4 ; i++, j++) {
            //     corners[j] = this.diceInst.getChildrenByName("Corner_" + i)[0];
            // }
            // corners.map(corner => corner.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.handleDiceCollision));
            // this.diceRig.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.handleDiceCollision);
            // Singleplayer: Rolls the dice
            // Multiplayer: Gets the dice translation, rotation and value from the host
            if (_rollDiceMode == 3) {
                this.getDice.translation.x = _hostDice.translation.data[0];
                this.getDice.translation.y = _hostDice.translation.data[1];
                this.getDice.translation.z = _hostDice.translation.data[2];
                this.getDice.rotation.x = _hostDice.rotation.data[0];
                this.getDice.rotation.y = _hostDice.rotation.data[1];
                this.getDice.rotation.z = _hostDice.rotation.data[2];
                this.getDice.value = _hostDice.value;
                this.value = this.getDice.value;
            }
            else {
                this.value = this.roll();
            }
            // Scales, rolls and gives the dice the right color
            this.scaleDice(_colorRGBA);
            this.rollDice(_rollDiceMode);
            this.colorDice(_colorRGBA);
            this.diceNode.addChild(this.diceInst);
        }
        // Validates the dice in different modes.
        // Mode 0: The dice get a gold color with black dots
        // Mode 1: Nothing changes, the dice keeps its own colors
        async validateDice() {
            let validateMode = 1;
            switch (validateMode) {
                case 0:
                    let diceColors = await DiceCup.loadDiceColors();
                    this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[8].r), this.convertDiceColor(diceColors[8].g), this.convertDiceColor(diceColors[8].b), diceColors[8].a);
                    this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[9].r), this.convertDiceColor(diceColors[9].g), this.convertDiceColor(diceColors[9].b), diceColors[9].a); });
                    break;
                case 1:
                    this.diceMat.clrPrimary.a = 1;
                    this.dotsMat.map(dot => { dot.clrPrimary.a = 1; });
                    break;
                default:
                    break;
            }
        }
        // All dice get transparent to not interfere with the visible validation 
        // Because they were not used in the validation they stay transparent and the used ones will get color in validateDice()
        transparentDice() {
            let tempDices = this.diceNode.getChildren();
            let tempMat = tempDices.map(dice => dice.getComponent(ƒ.ComponentMaterial));
            let tempDots = tempDices.map(dice => dice.getChildren());
            let tempDotsMat = tempDots.map(dot => dot.map(dot => dot.getComponent(ƒ.ComponentMaterial)));
            tempMat.map(dice => dice.clrPrimary.a = 0.2);
            tempDotsMat.map(dot => dot.map(dot => dot.clrPrimary.a = 0.2));
        }
        // Rolls the physical 3d model dice
        // Sets the translation and rotation in every used mode
        async rollDice(_mode) {
            this.diceRig.activate(false);
            switch (_mode) {
                case 0:
                    this.diceInst.mtxLocal.translation = this.arenaTranslation;
                    this.diceInst.mtxLocal.rotation = this.arenaRotation;
                    break;
                case 1:
                    await this.rotateDice(this.diceInst);
                    await this.translateDice(this.diceInst);
                    break;
                case 2:
                    this.diceInst.mtxLocal.translation = new ƒ.Vector3((Math.random() * 2) - 1, Math.random() * 3 + 3, (Math.random() * 2) - 1);
                    this.diceInst.mtxLocal.rotation = this.arenaRotation;
                    break;
                case 3:
                    this.diceInst.mtxLocal.rotation = this.getDice.rotation;
                    this.diceInst.mtxLocal.translation = this.getDice.translation;
                    break;
                default:
                    break;
            }
            this.diceRig.activate(true);
        }
        // Places the dice and checks if there is already a dice placed or not
        async translateDice(_node) {
            let tempVec = new ƒ.Vector3((Math.random() * this.arenaWidth) - this.arenaWidth / 2, _node.mtxLocal.scaling.x + 0.1, (Math.random() * this.arenaHeigth) - this.arenaHeigth / 2);
            if (DiceCup.usedTranslations.map(vec => ƒ.Vector3.DIFFERENCE(vec, tempVec).magnitude).some(diff => diff < this.bigDice + this.diceDistance)) {
                this.translateDice(_node);
            }
            else {
                DiceCup.usedTranslations.push(tempVec);
                _node.mtxLocal.translation = tempVec;
            }
            this.clearUsedArrays();
        }
        // Rotates the dice model in 90 degrees in specific axes to get the rolled value visible on the dice model too
        // In order for this to always work, each dice model must look in the same direction with its dice numbers
        // The Y Axis rotates random to get different angles
        async rotateDice(_node) {
            let randomRotate = Math.random() * 360;
            switch (this.value) {
                case 1:
                    _node.mtxLocal.rotateY(randomRotate);
                    break;
                case 2:
                    _node.mtxLocal.rotateY(randomRotate);
                    _node.mtxLocal.rotateX(90);
                    break;
                case 3:
                    _node.mtxLocal.rotateY(randomRotate);
                    _node.mtxLocal.rotateZ(90);
                    break;
                case 4:
                    _node.mtxLocal.rotateY(randomRotate);
                    _node.mtxLocal.rotateZ(-90);
                    break;
                case 5:
                    _node.mtxLocal.rotateY(randomRotate);
                    _node.mtxLocal.rotateX(-90);
                    break;
                case 6:
                    _node.mtxLocal.rotateY(randomRotate);
                    _node.mtxLocal.rotateX(180);
                    break;
                default:
                    break;
            }
            DiceCup.usedRotations.push(_node.mtxLocal.rotation);
            this.clearUsedArrays();
        }
        // Scales the dice into small and big dices like in the original game depending which color the dice have
        async scaleDice(_colorRGBA) {
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_colorRGBA.id == DiceCup.DiceColor.white || _colorRGBA.id == DiceCup.DiceColor.green || _colorRGBA.id == DiceCup.DiceColor.yellow) {
                this.diceInst.mtxLocal.scaling = new ƒ.Vector3(this.smallDice, this.smallDice, this.smallDice);
            }
            else {
                this.diceInst.mtxLocal.scaling = new ƒ.Vector3(this.bigDice, this.bigDice, this.bigDice);
            }
        }
        // Gives the Dice the correct color for its body and dots
        async colorDice(_colorRGBA) {
            let diceColors = await DiceCup.loadDiceColors();
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_colorRGBA.id == DiceCup.DiceColor.white || _colorRGBA.id == DiceCup.DiceColor.green || _colorRGBA.id == DiceCup.DiceColor.yellow) {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[6].r), this.convertDiceColor(diceColors[6].g), this.convertDiceColor(diceColors[6].b), diceColors[6].a); });
            }
            else {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[7].r), this.convertDiceColor(diceColors[7].g), this.convertDiceColor(diceColors[7].b), diceColors[7].a); });
            }
        }
        // Converts rgb colors (0-255) into Fudge color format (0-1)
        convertDiceColor(_value) {
            let value;
            value = (_value / 2.55) / 100;
            return value;
        }
        // Host sends the value, translation and rotation of each dice to the server so all players see the same constellation
        async sendDiceToServer() {
            if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer && DiceCup.host == true) {
                for (let index = 0; index < DiceCup.dices.length; index++) {
                    this.sendDice[index] = { value: 0, rotation: new ƒ.Vector3(0, 0, 0), translation: new ƒ.Vector3(0, 0, 0) };
                    this.sendDice[index].value = DiceCup.dices[index].value;
                    this.sendDice[index].translation = DiceCup.usedTranslations[index];
                    this.sendDice[index].rotation = DiceCup.usedRotations[index];
                }
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.SEND_DICE, route: FudgeNet.ROUTE.SERVER, content: { dice: this.sendDice } });
            }
        }
        // Handles the collision sound when a dice hits another object
        handleDiceCollision(_event) {
            let soundArray = ["Audio|2023-05-15T13:12:43.528Z|46162", "Audio|2023-05-15T14:58:38.658Z|39413", "Audio|2023-05-15T14:58:49.349Z|84065", "Audio|2023-05-15T14:59:11.270Z|83758", "Audio|2023-05-15T14:59:11.270Z|83758"];
            DiceCup.playSFX(soundArray[Math.floor(Math.random() * soundArray.length)]);
        }
        // Clears all used Arrays afters every round
        async clearUsedArrays() {
            if (DiceCup.usedTranslations.length == DiceCup.dices.length && DiceCup.usedRotations.length == DiceCup.dices.length) {
                await this.sendDiceToServer();
                DiceCup.usedTranslations = [];
                DiceCup.usedRotations = [];
            }
        }
    }
    DiceCup.Dice = Dice;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class Probabilities {
        // -- Variable declaration --
        // Stores all values of current round
        values = [];
        // Stores the left categories so already used categories doesn't get calculated
        freeCategories = [];
        // Dice of current round
        dices;
        // Stores the whole table with all needed attributes for calculation and visibility
        allProbs = [];
        // Stores already calculated calculation so that it doesn't need to calculate everytime from new (for perfomance reasons)
        diceCupProbs = new Map();
        // Constructor for initializing a new probability calculation for the current round
        constructor(_dices, _values, _freeCategories) {
            this.dices = _dices;
            this.values = _values;
            this.freeCategories = _freeCategories;
        }
        // Fills and sorts the allProbs table with all needed attributes for each bots valuation
        async fillProbabilities() {
            for (let i = 0; i < this.freeCategories.length; i++) {
                this.allProbs.push({ name: null, category: null, points: null, probability: null, value: null });
                this.allProbs[i].points = this.values[i][1];
                this.allProbs[i].name = DiceCup.ScoringCategory[this.freeCategories[i]];
                this.allProbs[i].category = this.freeCategories[i];
                this.allProbs[i].probability = this.values[i][1] == 0 ? null : this.chooseProbabilities(this.freeCategories[i]);
            }
            await this.sortProbabilities();
            console.log(DiceCup.dices);
            console.log(this.allProbs);
            return this.allProbs;
        }
        // Chooses the calculation type for each different category
        chooseProbabilities(_category) {
            let prob = 0;
            switch (_category) {
                case DiceCup.ScoringCategory.fours:
                case DiceCup.ScoringCategory.fives:
                case DiceCup.ScoringCategory.sixes:
                    prob = this.numberProbabilities(_category);
                    break;
                case DiceCup.ScoringCategory.white:
                case DiceCup.ScoringCategory.black:
                case DiceCup.ScoringCategory.red:
                case DiceCup.ScoringCategory.blue:
                case DiceCup.ScoringCategory.green:
                case DiceCup.ScoringCategory.yellow:
                    prob = this.colorProbabilities(_category);
                    break;
                case DiceCup.ScoringCategory.doubles:
                    prob = this.doublesProbabilities(_category);
                    break;
                case DiceCup.ScoringCategory.oneToThree:
                    prob = this.oneToThreeProbabilities(_category);
                    break;
                case DiceCup.ScoringCategory.diceCup:
                    prob = this.diceCupProbabilities(_category);
                    break;
            }
            return prob;
        }
        // Calculates the probabilities for Fours, Fives and Sixes
        numberProbabilities(_category) {
            let diceValues = this.dices.map((element) => element.value);
            let results = [];
            diceValues.forEach(function (x) { results[x] = (results[x] || 0) + 1; });
            let power = results[_category + 4];
            let opposite = 12 - results[_category + 4];
            return ((1 / 6) ** power) * ((5 / 6) ** opposite) * this.binomial(12, power) * 100;
        }
        // Calculates the sum probabilities for all color categories
        colorProbabilities(_category) {
            let dice_numbers = [1, 2, 3, 4, 5, 6];
            let category = this.values.map((cat) => cat[0]);
            let counter = category.indexOf(_category);
            return this.sumProbabilities(2, this.values[counter][1], dice_numbers) * 100;
        }
        // Calculates the probability for doubles in the same color
        doublesProbabilities(_category) {
            let category = this.values.map((cat) => cat[0]);
            let counter = category.indexOf(_category);
            let power = (this.values[counter][1] / 10);
            let opposite = 6 - (this.values[counter][1] / 10);
            return ((1 / 6) ** power) * ((5 / 6) ** opposite) * this.binomial(6, power) * 100;
        }
        // Calculates the sum probability for 1,2,3-Category
        oneToThreeProbabilities(_category) {
            let dice_numbers = [1, 2, 3];
            let category = this.values.map((cat) => cat[0]);
            let counter = category.indexOf(_category);
            let power = 0;
            this.dices.map((value) => {
                if (value.value < 4) {
                    power++;
                }
            });
            let opposite = 12 - power;
            return ((1 / 2) ** power) * ((1 / 2) ** opposite) * this.binomial(12, power) * this.sumProbabilities(power, this.values[counter][1], dice_numbers) * 100;
        }
        // Calculates the sum probabilities for Dice Cup (all 12 dice)
        diceCupProbabilities(_category) {
            let dice_numbers = [1, 2, 3, 4, 5, 6];
            let category = this.values.map((cat) => cat[0]);
            let counter = category.indexOf(_category);
            return this.sumProbabilities(10, this.values[counter][1], dice_numbers) * 100;
        }
        // Calculates the sum probabilites for a specific sum with n dices and used dice numbers (specific for 1,2,3)
        sumProbabilities(_nDices, _sum, _diceNumbers) {
            const calculate = (nDices, sum, dice_numbers) => {
                if (nDices == 1) {
                    return dice_numbers.includes(sum) ? 1 / 6 : 0;
                }
                return dice_numbers.reduce((acc, i) => acc + this.sumProbabilities(nDices - 1, sum - i, dice_numbers) * this.sumProbabilities(1, i, dice_numbers), 0);
            };
            let key = JSON.stringify([_nDices, _sum, _diceNumbers]);
            if (!this.diceCupProbs.has(key))
                this.diceCupProbs.set(key, calculate(_nDices, _sum, _diceNumbers));
            return this.diceCupProbs.get(key);
        }
        // Sorts the table primary for the value and secondary the points 
        async sortProbabilities() {
            await this.balanceCategories();
            this.allProbs = this.allProbs.sort(function (a, b) {
                if (a.value < b.value)
                    return 1;
                if (a.value > b.value)
                    return -1;
                if (a.value == b.value) {
                    if (a.points < b.points)
                        return 1;
                    if (a.points > b.points)
                        return -1;
                }
                return 0;
            });
        }
        // Balances the categories with their expected values and a multiplier
        async balanceCategories() {
            // All calculated expected values for each category
            let expectedValue_Fours = 8;
            let expectedValue_Fives = 10;
            let expectedValue_Sixes = 12;
            let expectedValue_Color = 7;
            let expectedValue_Doubles = 10;
            let expectedValue_OneToThree = 18;
            let expectedValue_DiceCup = 42;
            // Used Multiplier for each category
            let multiplier_Fours = 0.6;
            let multiplier_Fives = 0.6;
            let multiplier_Sixes = 0.6;
            let multiplier_Color = 1;
            let multiplier_Doubles = 0.3;
            let multiplier_OneToThree = 0.4;
            let multiplier_DiceCup = 0.1;
            // Value calculation
            // Value = (Multiplier * Expected Value) + (Points - Expected Value)
            this.allProbs.map(function (elem) {
                if (elem.category == DiceCup.ScoringCategory.fours) {
                    elem.value = (multiplier_Fours * expectedValue_Fours) + (elem.points - expectedValue_Fours);
                }
                else if (elem.category == DiceCup.ScoringCategory.fives) {
                    elem.value = (multiplier_Fives * expectedValue_Fives) + (elem.points - expectedValue_Fives);
                }
                else if (elem.category == DiceCup.ScoringCategory.sixes) {
                    elem.value = (multiplier_Sixes * expectedValue_Sixes) + (elem.points - expectedValue_Sixes);
                }
                else if (elem.category == DiceCup.ScoringCategory.doubles) {
                    elem.value = (multiplier_Doubles * expectedValue_Doubles) + (elem.points - expectedValue_Doubles);
                }
                else if (elem.category == DiceCup.ScoringCategory.oneToThree) {
                    elem.value = (multiplier_OneToThree * expectedValue_OneToThree) + (elem.points - expectedValue_OneToThree);
                }
                else if (elem.category == DiceCup.ScoringCategory.diceCup) {
                    elem.value = (multiplier_DiceCup * expectedValue_DiceCup) + (elem.points - expectedValue_DiceCup);
                }
                else {
                    elem.value = (multiplier_Color * expectedValue_Color) + (elem.points - expectedValue_Color);
                }
                if (elem.points == 0) {
                    elem.value = Number.NEGATIVE_INFINITY;
                }
            });
        }
        // Calculates the binomial coefficient for the probability calculation
        binomial(_n, _k) {
            var coeff = 1;
            for (var x = _n - _k + 1; x <= _n; x++)
                coeff *= x;
            for (x = 1; x <= _k; x++)
                coeff /= x;
            return coeff;
        }
    }
    DiceCup.Probabilities = Probabilities;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class SubMenu {
        // -- Variable declaration --
        // Stores the menu page
        menu;
        // Stores the menu page id
        id;
        // Stores the wanted title for this submenu
        title;
        // Constructor for creating an empty submenu template
        constructor(_menu, _id, _title) {
            this.menu = _menu;
            this.id = _id;
            this.title = _title;
            this.createSubMenu();
        }
        // Creates an empty submenu with given attributes to fill in its own function (gameMenus folder)
        createSubMenu() {
            // Creates simple construct with background and title, content and button area (top to bottom)
            let background = document.createElement("div");
            background.id = this.menu;
            background.classList.add("gameMenus");
            background.classList.add("subGameMenus");
            background.style.visibility = "hidden";
            document.getElementById("gameMenu_id").appendChild(background);
            let title = document.createElement("span");
            title.id = this.id + "MenuTitle_id";
            title.classList.add("gameMenuTitles");
            title.innerHTML = this.title;
            background.appendChild(title);
            let content = document.createElement("div");
            content.id = this.id + "MenuContent_id";
            content.classList.add("gameMenuContent");
            background.appendChild(content);
            // Creates simple button area with important standard buttons like a back button to get to the main menu
            let buttonArea = document.createElement("div");
            buttonArea.id = this.id + "MenuButtons_id";
            buttonArea.classList.add("gameMenuButtonArea");
            background.appendChild(buttonArea);
            let leftButtonArea = document.createElement("div");
            leftButtonArea.id = this.id + "MenuLeftButtonArea_id";
            leftButtonArea.classList.add("gameMenuLeftButtonArea");
            buttonArea.appendChild(leftButtonArea);
            let midButtonArea = document.createElement("div");
            midButtonArea.id = this.id + "MenuMidButtonArea_id";
            midButtonArea.classList.add("gameMenuMidButtonArea");
            buttonArea.appendChild(midButtonArea);
            let alert = document.createElement("span");
            alert.id = this.id + "Alert_id";
            alert.classList.add("gameMenuAlert");
            midButtonArea.appendChild(alert);
            let rightButtonArea = document.createElement("div");
            rightButtonArea.id = this.id + "MenuRightButtonArea_id";
            rightButtonArea.classList.add("gameMenuRightButtonArea");
            buttonArea.appendChild(rightButtonArea);
            let returnButton = document.createElement("button");
            returnButton.id = this.id + "MenuReturnButton_id";
            returnButton.classList.add("gameMenuButtons");
            returnButton.classList.add("diceCupButtons");
            leftButtonArea.appendChild(returnButton);
            let returnIcon = document.createElement("img");
            returnIcon.classList.add("diceCupButtonsIcons");
            returnIcon.src = "Game/Assets/images/menuButtons/return.svg";
            returnButton.appendChild(returnIcon);
            returnButton.addEventListener("click", () => {
                DiceCup.playSFX(DiceCup.buttonClick);
                DiceCup.switchMenu(DiceCup.MenuPage.main);
            });
        }
    }
    DiceCup.SubMenu = SubMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    class TimerBar {
        // -- Variable declaration --
        // The given time the timer is starting
        time;
        // To shrink the given div percentual
        percentage;
        // The div id which is used as a visible timer
        elementID;
        // The timer id to start and reset the timer
        timerID;
        // Constructor to create a simple visual timer bar
        constructor(_id, _time) {
            this.elementID = _id;
            this.time = _time;
            this.timerID = ƒ.Time.game.setTimer(1000, this.time, (_event) => { this.getTimerPercentage(_event.count - 1); });
        }
        // Resets the timer if wanted before the timer is ending by himself
        resetTimer() {
            ƒ.Time.game.deleteTimer(this.timerID);
            document.getElementById(this.elementID).style.width = "100%";
        }
        // Shrinks the visual timer bar (html element)
        getTimerPercentage(_count) {
            document.getElementById(this.elementID).style.transition = "width 1s linear";
            this.percentage = (_count * 100) / this.time;
            document.getElementById(this.elementID).style.width = this.percentage + "%";
            if (document.getElementById(this.elementID).style.width == "0%") {
                ƒ.Time.game.setTimer(1000, 1, () => document.getElementById(this.elementID).style.width = "100%");
            }
        }
    }
    DiceCup.TimerBar = TimerBar;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class Valuation {
        // -- Variable declaration --
        // Stores the chosen scoring category
        scoringCategory;
        // Dice of current round
        dices;
        // For checking if the valuation is wanted by a real player or bot (only real players valuation will be visualized with highlighting)
        player;
        // Constructor to prompt a valuation for a specific category with the given dice of the current round
        constructor(_category, _dices, _player) {
            this.dices = _dices;
            this.scoringCategory = _category;
            this.player = _player;
        }
        // Chooses the calculation type for the different categories
        chooseScoringCategory() {
            let value;
            switch (this.scoringCategory) {
                case DiceCup.ScoringCategory.fours:
                    value = this.calculateNumber(4);
                    break;
                case DiceCup.ScoringCategory.fives:
                    value = this.calculateNumber(5);
                    break;
                case DiceCup.ScoringCategory.sixes:
                    value = this.calculateNumber(6);
                    break;
                case DiceCup.ScoringCategory.white:
                    value = this.calculateColor(DiceCup.DiceColor.white);
                    break;
                case DiceCup.ScoringCategory.black:
                    value = this.calculateColor(DiceCup.DiceColor.black);
                    break;
                case DiceCup.ScoringCategory.red:
                    value = this.calculateColor(DiceCup.DiceColor.red);
                    break;
                case DiceCup.ScoringCategory.blue:
                    value = this.calculateColor(DiceCup.DiceColor.blue);
                    break;
                case DiceCup.ScoringCategory.green:
                    value = this.calculateColor(DiceCup.DiceColor.green);
                    break;
                case DiceCup.ScoringCategory.yellow:
                    value = this.calculateColor(DiceCup.DiceColor.yellow);
                    break;
                case DiceCup.ScoringCategory.doubles:
                    value = this.calculateDoubles();
                    break;
                case DiceCup.ScoringCategory.oneToThree:
                    value = this.calculateNumber(1, 2, 3);
                    break;
                case DiceCup.ScoringCategory.diceCup:
                    value = this.calculateDiceCup();
                    break;
            }
            return value;
        }
        // Calculates the number based categories where one specific dice value is wanted (fours, fives, sixes and 1,2,3)
        // Sums up all values ​​of a specific dice number
        calculateNumber(_number, _number2, _number3) {
            let value = 0;
            this.player && this.dices[value].transparentDice();
            for (let i = 0; i < this.dices.length; i++) {
                if (this.dices[i].value === _number || this.dices[i].value === _number2 || this.dices[i].value === _number3) {
                    value += this.dices[i].value;
                    this.player && this.dices[i].validateDice();
                }
            }
            return value;
        }
        // Calculates the color based categories where only one dice color is valued (black, white, red etc.)
        // Takes both dice and sums up their values
        calculateColor(_color) {
            let value = 0;
            this.player && this.dices[value].transparentDice();
            for (let i = 0; i < this.dices.length; i++) {
                if (this.dices[i].color === _color) {
                    value += this.dices[i].value;
                    this.player && this.dices[i].validateDice();
                }
            }
            return value;
        }
        // Calculates the doubles in the same color category
        // If a double is found in the same color, 10 points are added each double
        calculateDoubles() {
            let value = 0;
            this.player && this.dices[value].transparentDice();
            for (let i = 0; i < this.dices.length - 1; i++) {
                if (this.dices[i].color === this.dices[i + 1].color && this.dices[i].value === this.dices[i + 1].value) {
                    value += 10;
                    this.player && this.dices[i].validateDice();
                    this.player && this.dices[i + 1].validateDice();
                }
            }
            return value;
        }
        // Calculates Dice Cup
        // Sums up all 12 dice
        calculateDiceCup() {
            let value = 0;
            this.player && this.dices[value].transparentDice();
            for (let i = 0; i < this.dices.length; i++) {
                value += this.dices[i].value;
                this.player && this.dices[i].validateDice();
            }
            return value;
        }
    }
    DiceCup.Valuation = Valuation;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // Switches between all game state phases in its order and resets the wakelock timer every call.
    async function changeGameState(_gameState) {
        switch (_gameState) {
            case DiceCup.GameState.menu:
                DiceCup.switchMenu(DiceCup.MenuPage.main);
                DiceCup.backgroundMusic(true);
                DiceCup.changeViewportState(DiceCup.ViewportState.menu);
                break;
            case DiceCup.GameState.init:
                DiceCup.initHud();
                DiceCup.initCategories();
                DiceCup.initSummary();
                DiceCup.initPlacements();
                changeGameState(DiceCup.GameState.ready);
                break;
            case DiceCup.GameState.ready:
                DiceCup.startTransition();
                DiceCup.changeViewportState(DiceCup.ViewportState.transition);
                await DiceCup.rollDices();
                break;
            case DiceCup.GameState.counting:
                DiceCup.changeViewportState(DiceCup.ViewportState.game);
                DiceCup.round();
                break;
            case DiceCup.GameState.choosing:
                DiceCup.showCategories();
                break;
            case DiceCup.GameState.validating:
                DiceCup.validateRound();
                break;
            case DiceCup.GameState.summary:
                DiceCup.showSummary();
                break;
            case DiceCup.GameState.placement:
                DiceCup.updatePlacements();
                DiceCup.showPlacements();
                break;
        }
        DiceCup.resetWakeLock();
    }
    DiceCup.changeGameState = changeGameState;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // Changes the viewport state for the different camera angles and perspectives
    async function changeViewportState(_viewportState) {
        switch (_viewportState) {
            case DiceCup.ViewportState.menu:
                await menuViewport();
                break;
            case DiceCup.ViewportState.transition:
                await transitionViewport();
                break;
            case DiceCup.ViewportState.game:
                await gameViewport();
                break;
        }
        DiceCup.viewportState = _viewportState;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, DiceCup.update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }
    DiceCup.changeViewportState = changeViewportState;
    // Changes the camera and arena for the main menu background
    // Rotates the camera in the update function
    async function menuViewport() {
        let diceColors = await DiceCup.loadDiceColors();
        DiceCup.changeFloor(false);
        DiceCup.activateCover(false);
        DiceCup.viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 0.4, -3);
        for (let i = 0, color = 0; i < DiceCup.dicesLength; i++, color += 0.5) {
            new DiceCup.Dice(diceColors[Math.floor(color)], Math.floor(color), 2);
        }
    }
    // For possible transition animations with tracking shots
    async function transitionViewport() {
        // let response: Response = await fetch("Game/Script/Data/diceColors.json");
        // let diceColors: RgbaDao[] = await response.json();
        // changeFloor(false);
        // activateCover(false);
        // viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 0.8, -5);
        // for (let i = 0, color = 0; i < dicesLength; i++, color+=0.5) {
        //     dices.push(new Dice(diceColors[Math.floor(color)], Math.floor(color), 2));
        // }
    }
    // Changes the arena and camera perspective for ingame situations
    async function gameViewport() {
        DiceCup.viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 4, -2.5);
        DiceCup.viewport.camera.mtxPivot.rotation = new ƒ.Vector3(60, 0, 0);
        DiceCup.changeFloor(true);
        DiceCup.activateCover(true);
    }
})(DiceCup || (DiceCup = {}));
///<reference path="../../../../Library/Net/Build/Client/FudgeClient.d.ts"/>
var DiceCup;
///<reference path="../../../../Library/Net/Build/Client/FudgeClient.d.ts"/>
(function (DiceCup) {
    var ƒ = FudgeCore;
    var ƒClient = FudgeNet.FudgeClient;
    ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);
    // Create a FudgeClient for this browser tab
    DiceCup.client = new ƒClient();
    DiceCup.host = false;
    DiceCup.currentRoom = "Lobby";
    // Keep a list of known clients, updated with information from the server
    let clientsKnown = {};
    // Tries to connect to the server when the application is loaded
    window.addEventListener("load", connectToServer);
    // Starts the client and all the connected event listeners
    async function startClient() {
        console.log(DiceCup.client);
        console.log("Client started...");
        document.getElementById("multiplayer_id").addEventListener("click", hndEvent);
        document.getElementById("multiplayerRenewButton_id").addEventListener("click", hndEvent);
        document.getElementById("multiplayerJoinButton_id").addEventListener("click", hndEvent);
        document.getElementById("multiplayerCreateButton_id").addEventListener("click", hndEvent);
        document.getElementById("multiplayerLobbyMenuReturnButton_id").addEventListener("click", hndEvent);
        if (DiceCup.playerMode == DiceCup.PlayerMode.multiplayer) {
            document.getElementById("replayButton_id").addEventListener("click", hndEvent);
        }
    }
    DiceCup.startClient = startClient;
    // Handles all messages depending on which button has been pressed
    async function hndEvent(_event) {
        if (!(_event.target instanceof HTMLButtonElement))
            return;
        let command = _event.target.id;
        switch (command) {
            case "multiplayerRenewButton_id":
            case "passwordReturnButton_id":
            case "multiplayer_id":
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_LIST, route: FudgeNet.ROUTE.SERVER });
                break;
            case "multiplayerCreateButton_id":
                if (DiceCup.privateRoom) {
                    DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_CREATE, route: FudgeNet.ROUTE.SERVER, content: { gamemode: DiceCup.gameMode, privateRoom: DiceCup.privateRoom, roomPassword: DiceCup.roomPassword } });
                }
                else {
                    DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_CREATE, route: FudgeNet.ROUTE.SERVER, content: { gamemode: DiceCup.gameMode, privateRoom: DiceCup.privateRoom } });
                }
                break;
            case "multiplayerJoinButton_id":
                DiceCup.currentRoom = DiceCup.focusedIdRoom;
                console.log("Enter", DiceCup.focusedIdRoom);
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_ENTER, route: FudgeNet.ROUTE.SERVER, content: { room: DiceCup.currentRoom, host: false } });
                break;
            case "multiplayerLobbyMenuReturnButton_id":
                DiceCup.currentRoom = "Lobby";
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_LEAVE, route: FudgeNet.ROUTE.SERVER, content: { leaver_id: DiceCup.client.id, host: DiceCup.host } });
                break;
            case "nameInputButton_id":
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ASSIGN_USERNAME, route: FudgeNet.ROUTE.SERVER, content: { username: DiceCup.username } });
                break;
            case "passwordJoinButton_id":
                DiceCup.currentRoom = DiceCup.focusedIdRoom;
                console.log("Enter", DiceCup.focusedIdRoom);
                let password = document.getElementById("passwordInput_id").value;
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_ENTER, route: FudgeNet.ROUTE.SERVER, content: { room: DiceCup.currentRoom, host: false, password: password } });
                break;
            case "multiplayerLobbyStartButton_id":
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.START_GAME, route: FudgeNet.ROUTE.SERVER, content: { roundTimer: DiceCup.roundTimer } });
                break;
        }
    }
    DiceCup.hndEvent = hndEvent;
    // Connects to the server with the given url (local: localhost; online: render)
    async function connectToServer(_event) {
        // let domServer: string = "ws://localhost:9001";
        let domServer = "wss://dice-cup.onrender.com";
        try {
            // connect to a server with the given url
            DiceCup.client.connectToServer(domServer);
            await delay(1000);
            DiceCup.client.addEventListener(FudgeNet.EVENT.MESSAGE_RECEIVED, receiveMessage);
        }
        catch (_error) {
            console.log(_error);
            console.log("Make sure, FudgeServer is running and accessable");
        }
    }
    // Distinguishes between the different cases when receiving a message from the server
    async function receiveMessage(_event) {
        if (_event instanceof MessageEvent) {
            let message = JSON.parse(_event.data);
            if (message.command != FudgeNet.COMMAND.SERVER_HEARTBEAT && message.command != FudgeNet.COMMAND.CLIENT_HEARTBEAT)
                showMessage(message);
            switch (message.command) {
                case FudgeNet.COMMAND.SERVER_HEARTBEAT:
                    await command_serverHeartbeat();
                    break;
                case FudgeNet.COMMAND.CLIENT_HEARTBEAT:
                    await command_clientHeartbeat(message);
                    break;
                case FudgeNet.COMMAND.DISCONNECT_PEERS:
                    await command_disconnectPeers();
                    break;
                case FudgeNet.COMMAND.ROOM_LIST:
                    await command_roomList(message);
                    break;
                case FudgeNet.COMMAND.ROOM_CREATE:
                    await command_roomCreate(message);
                    break;
                case FudgeNet.COMMAND.ROOM_RENAME:
                    await command_roomRename(message);
                    break;
                case FudgeNet.COMMAND.ROOM_ENTER:
                    await command_roomEnter(message);
                    break;
                case FudgeNet.COMMAND.ROOM_LEAVE:
                    await command_roomLeave(message);
                    break;
                case FudgeNet.COMMAND.ROOM_INFO:
                    await command_roomInfo(message);
                    break;
                case FudgeNet.COMMAND.CLIENT_READY:
                    await command_clientReady();
                    break;
                case FudgeNet.COMMAND.ASSIGN_USERNAME:
                    await command_assignUsername(message);
                    break;
                case FudgeNet.COMMAND.START_GAME:
                    await command_startGame(message);
                    break;
                case FudgeNet.COMMAND.SEND_DICE:
                    await command_sendDice(message);
                    break;
                case FudgeNet.COMMAND.SEND_SCORE:
                    await command_sendScore(message);
                    break;
                case FudgeNet.COMMAND.SKIP_SUMMARY:
                    await command_skipSummary();
                    break;
                default:
                    break;
            }
            return;
        }
        else
            console.table(_event);
    }
    // Creates the server heartbeat when the server is succesfully working
    async function command_serverHeartbeat() {
        DiceCup.client.dispatch({ idRoom: DiceCup.currentRoom, command: FudgeNet.COMMAND.CLIENT_HEARTBEAT });
    }
    // Creates the client heartbeat when the client is succesfully connected to the server
    async function command_clientHeartbeat(_message) {
        let span = document.querySelector(`#${_message.idSource} span`);
        blink(span);
    }
    // Disconnects the peers
    async function command_disconnectPeers() {
        DiceCup.client.disconnectPeers();
    }
    // If the server returns the room list the client creates the server list with all available rooms
    async function command_roomList(_message) {
        DiceCup.getRooms(_message);
    }
    // If the client wants to create a room he is entering the room right after the server creates the new room
    async function command_roomCreate(_message) {
        console.log("Created room", _message.content.room);
        DiceCup.host = _message.content.host;
        DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_ENTER, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room, host: DiceCup.host } });
    }
    // If the client renamed the room the server sends the new room information so the name updates for everybody
    async function command_roomRename(_message) {
        DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
    }
    // If the client tries to enter a room the server returns the room privacy, if an password is needed and if its still available
    // If the room has a password the user need to fill the right password into the password input field
    async function command_roomEnter(_message) {
        let alertPassword = document.getElementById("passwordAlert_id");
        let alertMessageList = document.getElementById("multiplayerAlert_id");
        // If room is still available and not expired due to server list only updates on actions
        if (_message.content.expired != true) {
            // If the room has a password the client must input a password
            // If the room has no password the client enters the room and updates the room info for everyone
            if (_message.content.private == true) {
                DiceCup.passwordInput();
            }
            else {
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
            }
            // If the entered password is incorrect the client gets an alert
            // If the entered password is correct the password input field gets removed
            if (_message.content.correctPassword == false) {
                if (alertPassword) {
                    alertPassword.innerHTML = DiceCup.language.menu.alerts.wrong_password;
                    ƒ.Time.game.setTimer(1000, 1, () => { alertPassword.innerHTML = ""; });
                }
            }
            else if (_message.content.correctPassword == true) {
                if (document.getElementById("passwordInputContainer_id")) {
                    document.getElementById("passwordInputContainer_id").remove();
                }
            }
            // If the room has already started the game no client can join this room while ingame and gets an alert
            if (_message.content.ingame == true) {
                alertMessageList.innerHTML = DiceCup.language.menu.alerts.ingame;
                ƒ.Time.game.setTimer(1000, 1, () => { alertMessageList.innerHTML = ""; });
            }
        }
        else {
            alertMessageList.innerHTML = DiceCup.language.menu.alerts.room_unavailable;
            ƒ.Time.game.setTimer(1000, 1, () => { alertMessageList.innerHTML = ""; });
            alertPassword.innerHTML = DiceCup.language.menu.alerts.room_unavailable;
            ƒ.Time.game.setTimer(1000, 1, () => { alertPassword.innerHTML = ""; });
        }
    }
    // If the client leaves the room on purpose or gets kicked it updates the room info for everybody and updates the server list for the client
    async function command_roomLeave(_message) {
        // If somebody in the clients room leaves and its not the client himself it updates the room info if they are still in the lobby
        // If the game already starts the gamesettings get adjusted and if the leaver was the host a new host is chosen, so the game can continue without problems
        if (_message.content.leaver == false) {
            if (!DiceCup.inGame) {
                DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
            }
            else {
                changeGameSettings();
            }
        }
        else {
            // If the client is the leaver he updates his server list
            DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_LIST, route: FudgeNet.ROUTE.SERVER });
        }
        // If the client is the leaver because he got kicked he switches to the server list and updates it
        if (_message.content.kicked == true) {
            DiceCup.switchMenu(DiceCup.MenuPage.multiplayer);
            DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_LIST, route: FudgeNet.ROUTE.SERVER });
        }
        // If the client was the host he is not anymore
        _message.content.newHost == DiceCup.client.id ? DiceCup.host = true : DiceCup.host = false;
    }
    // Returns all needed information about a specific room to create the multiplayer lobby
    async function command_roomInfo(_message) {
        if (_message.content.room != "Lobby") {
            DiceCup.joinRoom(_message);
        }
    }
    // Returns and updates the clients ready state so everybody sees who is ready and who not
    async function command_clientReady() {
        DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: DiceCup.currentRoom } });
    }
    // Returns the new username and checks whether it meets all requirements or not
    async function command_assignUsername(_message) {
        checkUsername(_message);
    }
    // Only the host can start the game and changes some variables for ingame purposes
    async function command_startGame(_message) {
        DiceCup.playerMode = DiceCup.PlayerMode.multiplayer;
        DiceCup.inGame = true;
        await setGameSettings(_message);
        DiceCup.hideMenu();
        DiceCup.changeGameState(DiceCup.GameState.init);
    }
    // Only the host sends the dice to everyone else. The guests get the rolled dice
    async function command_sendDice(_message) {
        console.log(_message);
        if (!DiceCup.host) {
            DiceCup.getRolledDices(_message);
        }
    }
    // Everyone in the room sends the score to the server so everybody has a full table to visualize on the client.
    // In the meantime the alert "waiting for other players" is shown until everybody got all scores consisting of name, category and points
    async function command_sendScore(_message) {
        console.log(_message);
        for (let index = 0; index < _message.content.value.length; index++) {
            DiceCup.updateSummary(_message.content.value[index], _message.content.index[index], _message.content.name[index]);
        }
        if (document.getElementById("waitAlert_id")) {
            document.getElementById("waitAlert_id").remove();
        }
        DiceCup.changeGameState(DiceCup.GameState.summary);
    }
    // Updates the skip counter if someone wants to skip the summary phase
    async function command_skipSummary() {
        DiceCup.updateSummarySkipCounter();
    }
    // If the client leaves the room he is doing it by himself with another attribute
    function clientLeavesRoom() {
        DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_LEAVE, route: FudgeNet.ROUTE.SERVER, content: { leaver_id: DiceCup.client.id, host: DiceCup.host } });
    }
    DiceCup.clientLeavesRoom = clientLeavesRoom;
    // Sets the gamesettings from lobby content and lobby settings to create the current game
    async function setGameSettings(_message) {
        DiceCup.roundTimer = parseInt(_message.content.roundTimer);
        DiceCup.gameSettings_mp = { playerNames: ["", "", "", "", "", ""] };
        let playerNumber = Object.keys(_message.content.clients).length;
        for (let index = 0; index < playerNumber; index++) {
            Object.values(_message.content.clients)[index].name ? DiceCup.gameSettings_mp.playerNames[index] = Object.values(_message.content.clients)[index].name : DiceCup.gameSettings_mp.playerNames[index] = Object.values(_message.content.clients)[index].id;
            if (DiceCup.client.id == Object.values(_message.content.clients)[index].id) {
                DiceCup.clientPlayerNumber = index;
            }
        }
        DiceCup.numberOfPlayers = DiceCup.gameSettings_mp.playerNames.filter(name => name != "").length;
    }
    // Adjusts the gamesettings while ingame and someone leaves
    function changeGameSettings() {
        DiceCup.numberOfPlayers--;
    }
    // Checks the username for length, already in use and invalid tokens
    function checkUsername(_message) {
        let alertMessageLobby = document.getElementById("multiplayerLobbyAlert_id");
        if (_message.content.message == "valid") {
            DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
            if (_message.idSource == DiceCup.client.id) {
                DiceCup.host && DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_RENAME, route: FudgeNet.ROUTE.SERVER });
            }
        }
        else if (_message.content.message == "alreadyTaken") {
            alertMessageLobby.innerHTML = DiceCup.language.menu.alerts.identical_names;
            ƒ.Time.game.setTimer(1000, 1, () => { alertMessageLobby.innerHTML = ""; });
            DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
        }
        else if (_message.content.message == "invalidTokens") {
            alertMessageLobby.innerHTML = DiceCup.language.menu.alerts.invalid_tokes;
            ƒ.Time.game.setTimer(1000, 1, () => { alertMessageLobby.innerHTML = ""; });
            DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
        }
        else if (_message.content.message == "invalidLength") {
            alertMessageLobby.innerHTML = DiceCup.language.menu.alerts.invalid_length;
            ƒ.Time.game.setTimer(1000, 1, () => { alertMessageLobby.innerHTML = ""; });
            DiceCup.client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
        }
    }
    // Creates a delay
    function delay(_milisec) {
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, _milisec);
        });
    }
    // Creates a blink
    function blink(_span) {
        let newSpan = document.createElement("span");
        newSpan.textContent = (parseInt(_span.textContent) + 1).toString().padStart(3, "0");
        _span.parentElement.replaceChild(newSpan, _span);
    }
    // Shows the messages in the console 
    function showMessage(_message) {
        console.table(_message);
        if (_message.command)
            return;
        let received = document.forms[1].querySelector("textarea#received");
        let line = (_message.route || "toPeer") + " > " + _message.idSource + "(" + clientsKnown[_message.idSource].name + "):" + JSON.stringify(_message.content);
        received.value = line + "\n" + received.value;
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // Switches to the chosen languages
    async function chooseLanguage(_language) {
        let response = await fetch("Game/Script/Data/languages/" + _language + ".json");
        DiceCup.language = await response.json();
    }
    DiceCup.chooseLanguage = chooseLanguage;
    // Translates the langauges
    function languageTranslation(_language) {
        switch (_language) {
            case DiceCup.Languages.english:
                return DiceCup.language.menu.settings.language.english;
            case DiceCup.Languages.german:
                return DiceCup.language.menu.settings.language.german;
        }
    }
    DiceCup.languageTranslation = languageTranslation;
    // Translates the bot difficulties
    function difficultyTranslation(_difficulty) {
        let diff_lang;
        switch (_difficulty) {
            case DiceCup.BotDifficulty[DiceCup.BotDifficulty.easy]:
                diff_lang = DiceCup.language.menu.singleplayer.lobby.difficulties.easy;
                break;
            case DiceCup.BotDifficulty[DiceCup.BotDifficulty.normal]:
                diff_lang = DiceCup.language.menu.singleplayer.lobby.difficulties.normal;
                break;
            case DiceCup.BotDifficulty[DiceCup.BotDifficulty.hard]:
                diff_lang = DiceCup.language.menu.singleplayer.lobby.difficulties.hard;
                break;
            default:
                break;
        }
        return diff_lang;
    }
    DiceCup.difficultyTranslation = difficultyTranslation;
    // Translates the gamemodes
    function gamemodeTranslation(_gamemode) {
        switch (_gamemode) {
            case DiceCup.GameMode.normal:
                return DiceCup.language.menu.gamemodes.normal;
            case DiceCup.GameMode.fast:
                return DiceCup.language.menu.gamemodes.fast;
            case DiceCup.GameMode.slow:
                return DiceCup.language.menu.gamemodes.slow;
            default:
                return DiceCup.language.menu.gamemodes.normal;
        }
    }
    DiceCup.gamemodeTranslation = gamemodeTranslation;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    // Resizes the mobile screen so the small virutal browser viewport creates a bad resolution
    async function resizeScreenresolution() {
        let width = document.documentElement.clientWidth * window.devicePixelRatio;
        let testviewport = document.querySelector("meta[name=viewport]");
        testviewport.setAttribute('content', 'width=' + width + ', minimum-scale: 1');
        document.documentElement.style.transform = 'scale( 1 / window.devicePixelRatio )';
        document.documentElement.style.transformOrigin = 'top left';
    }
    DiceCup.resizeScreenresolution = resizeScreenresolution;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    // -- Variable declaration --
    // Stores the wakelock object
    let wakeLock = null;
    // The timer id to reset and delete the timer
    let timerID;
    // Enables the wakelock so the screen doesn't go in standby
    async function enableWakeLock() {
        if ("wakeLock" in navigator) {
            // @ts-ignore
            wakeLock = await navigator.wakeLock.request("screen");
            resetWakeLock();
        }
        return (wakeLock != null);
    }
    DiceCup.enableWakeLock = enableWakeLock;
    // Disables the wakelock if the phone wasn't touched in a while so the phone can go in standby
    function disableWakeLock() {
        wakeLock && wakeLock.release().then(() => { wakeLock = null; });
    }
    DiceCup.disableWakeLock = disableWakeLock;
    // Resets the wakelock everytime an action is performed so the screen doesn#t go in standby while playing
    function resetWakeLock() {
        timerID && ƒ.Time.game.deleteTimer(timerID);
        timerID = ƒ.Time.game.setTimer(30000, 1, disableWakeLock);
    }
    DiceCup.resetWakeLock = resetWakeLock;
})(DiceCup || (DiceCup = {}));
//# sourceMappingURL=Script.js.map