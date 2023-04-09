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
    document.addEventListener("interactiveViewportStarted", start);
    DiceCup.dices = [];
    DiceCup.firstRound = true;
    DiceCup.highscore = 0;
    function start(_event) {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("../../serviceWorker.js");
        }
        DiceCup.viewport = _event.detail;
        let diceCup = document.createElement("div");
        diceCup.id = "DiceCup";
        document.querySelector("body").appendChild(diceCup);
        DiceCup.initMenu();
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    class Bot {
        dices;
        usedCategories = [];
        difficulty;
        name;
        constructor(_name, _difficulty, _dices) {
            this.name = _name;
            this.difficulty = _difficulty;
            this.dices = _dices;
        }
        chooseDifficulty() {
            switch (this.difficulty) {
                case DiceCup.BotDifficulty.easy:
                    this.botEasy();
                    break;
                case DiceCup.BotDifficulty.medium:
                    break;
                case DiceCup.BotDifficulty.hard:
                    break;
            }
        }
        botEasy() {
            console.log("EASY BOT");
            let randomCategory = Math.floor((Math.random() * 12));
            if (this.usedCategories.includes(randomCategory)) {
                this.botEasy();
            }
            else {
                this.usedCategories.push(randomCategory);
                console.log(this.usedCategories);
                this.botValuation(randomCategory);
            }
        }
        botMedium() {
            console.log("MEDIUM BOT");
        }
        botHard() {
            console.log("HARD BOT");
        }
        botValuation(_category) {
            let valuation = new DiceCup.Valuation(_category, DiceCup.dices);
            let value = valuation.chooseScoringCategory();
            ƒ.Time.game.setTimer(2000, 1, () => { DiceCup.updateSummary(value, _category, this.name); });
        }
    }
    DiceCup.Bot = Bot;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class Dice {
        color;
        value;
        constructor(_color) {
            this.color = _color;
            this.value = this.roll();
        }
        roll() {
            return Math.floor((Math.random() * 6) + 1);
        }
    }
    DiceCup.Dice = Dice;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    let bots = [];
    function changeGameState(_gameState) {
        switch (_gameState) {
            case DiceCup.GameState.menu:
                DiceCup.switchMenu(DiceCup.MenuPages.main);
                break;
            case DiceCup.GameState.init:
                DiceCup.initHud();
                DiceCup.initCategories();
                DiceCup.initSummary();
                initViewport();
                DiceCup.initTransition();
                DiceCup.initPlacements();
                break;
            case DiceCup.GameState.ready:
                DiceCup.initTransition();
                break;
            case DiceCup.GameState.counting:
                // showSummary();
                initGame();
                break;
            case DiceCup.GameState.choosing:
                DiceCup.showCategories();
                break;
            case DiceCup.GameState.validating:
                // validateRound();
                break;
            case DiceCup.GameState.summary:
                DiceCup.showSummary();
                // updatePlacements()
                // showPlacements();
                break;
            case DiceCup.GameState.placement:
                DiceCup.updatePlacements();
                DiceCup.showPlacements();
                break;
        }
    }
    DiceCup.changeGameState = changeGameState;
    async function initViewport() {
        DiceCup.viewport.camera.mtxPivot.translateZ(10);
        DiceCup.viewport.camera.mtxPivot.rotateY(180);
        DiceCup.viewport.camera.mtxPivot.translateX(1);
        DiceCup.viewport.camera.mtxPivot.translateY(1);
        let graph = DiceCup.viewport.getBranch();
        let dice = graph.getChildrenByName("Dice")[0];
        console.log(dice.mtxLocal.translation);
    }
    DiceCup.initViewport = initViewport;
    function createBots(_bots) {
        bots = [];
        for (let index = 0; index < _bots.length; index++) {
            bots[index] = new DiceCup.Bot(_bots[index].botName, _bots[index].difficulty, DiceCup.dices);
        }
        return bots;
    }
    function initGame() {
        console.clear();
        if (DiceCup.firstRound == true) {
            createBots(DiceCup.gameSettings.bot);
            let gameDiv = document.createElement("div");
            gameDiv.id = "rollingDiv_id";
            document.getElementById("game").appendChild(gameDiv);
            DiceCup.firstRound = false;
        }
        else {
            for (let i = 0; i < 12; i++) {
                document.getElementById("diceContainer_id_" + i).remove();
            }
        }
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        // initCategories();
        DiceCup.dices = [];
        for (let i = 0; i < 6; i++) {
            DiceCup.dices.push(new DiceCup.Dice(i));
            DiceCup.dices.push(new DiceCup.Dice(i));
        }
        for (let i = 0; i < 12; i++) {
            let diceDiv = document.createElement("div");
            diceDiv.classList.add("diceDiv");
            diceDiv.id = "diceContainer_id_" + i;
            diceDiv.classList.add("diceCategory_" + DiceCup.DiceColor[DiceCup.dices[i].color]);
            diceDiv.innerHTML = DiceCup.dices[i].value.toString();
            diceDiv.style.background = DiceCup.DiceColor[DiceCup.dices[i].color].toString();
            document.getElementById("rollingDiv_id").appendChild(diceDiv);
            // document.getElementById("valuation_id_" + i).classList.add("valuationShow");
        }
        for (let index = 0; index < bots.length; index++) {
            bots[index].chooseDifficulty();
        }
        console.log("Augen auf ...");
        ƒ.Time.game.setTimer(3000, 1, () => { changeGameState(DiceCup.GameState.choosing); });
    }
    DiceCup.initGame = initGame;
    function rollDices() {
        DiceCup.dices = [];
        for (let i = 0; i < 6; i++) {
            DiceCup.dices.push(new DiceCup.Dice(i));
            DiceCup.dices.push(new DiceCup.Dice(i));
        }
        for (let i = 0; i < 12; i++) {
            document.getElementById("diceContainer_id_" + i).remove();
            let diceDiv = document.createElement("div");
            diceDiv.classList.add("diceDiv");
            diceDiv.classList.add("diceCategory_" + DiceCup.DiceColor[DiceCup.dices[i].color]);
            diceDiv.id = "diceContainer_id_" + i;
            diceDiv.innerHTML = DiceCup.dices[i].value.toString();
            diceDiv.style.background = DiceCup.DiceColor[DiceCup.dices[i].color].toString();
            document.getElementById("rollingDiv_id").appendChild(diceDiv);
        }
        console.log("Augen auf ...");
        ƒ.Time.game.setTimer(3000, 1, () => { changeGameState(DiceCup.GameState.choosing); });
    }
    DiceCup.rollDices = rollDices;
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        DiceCup.viewport.draw();
        //ƒ.AudioManager.default.update();
    }
    DiceCup.update = update;
    function gameOver() {
        DiceCup.firstRound = true;
        while (document.getElementById("DiceCup").childNodes.length > 1) {
            document.getElementById("DiceCup").removeChild(document.getElementById("DiceCup").lastChild);
        }
        while (document.getElementById("game").firstChild) {
            document.getElementById("game").removeChild(document.getElementById("game").lastChild);
        }
    }
    DiceCup.gameOver = gameOver;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class Valuation {
        scoringCategory;
        dices;
        constructor(_category, _dices) {
            this.dices = _dices;
            this.scoringCategory = _category;
        }
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
        calculateNumber(_number, _number2, _number3) {
            let value = 0;
            for (let i = 0; i < this.dices.length; i++) {
                if (this.dices[i].value === _number || this.dices[i].value === _number2 || this.dices[i].value === _number3) {
                    value += this.dices[i].value;
                }
            }
            if (_number2 && _number3) {
                console.log(_number + "" + _number2 + "" + _number3 + ": " + value);
            }
            else {
                console.log(_number + ": " + value);
            }
            DiceCup.highscore += value;
            return value;
        }
        calculateColor(_color) {
            let value = 0;
            for (let i = 0; i < this.dices.length; i++) {
                if (this.dices[i].color === _color) {
                    value += this.dices[i].value;
                }
            }
            DiceCup.highscore += value;
            console.log(DiceCup.DiceColor[_color] + " color: " + value);
            return value;
        }
        calculateDoubles() {
            let value = 0;
            for (let i = 0; i < this.dices.length - 1; i++) {
                if (this.dices[i].color === this.dices[i + 1].color && this.dices[i].value === this.dices[i + 1].value) {
                    value += 10;
                }
            }
            DiceCup.highscore += value;
            console.log("Doubles: " + value);
            return value;
        }
        calculateDiceCup() {
            let value = 0;
            for (let i = 0; i < this.dices.length; i++) {
                value += this.dices[i].value;
            }
            DiceCup.highscore += value;
            console.log("DiceCup: " + value);
            return value;
        }
    }
    DiceCup.Valuation = Valuation;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
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
        let title = document.createElement("span");
        title.id = "categoryTitle_id";
        title.innerHTML = "Choose a category";
        header.appendChild(title);
        let timer = document.createElement("div");
        timer.id = "categoryTimer_id";
        header.appendChild(timer);
        let content = document.createElement("div");
        content.id = "categoryContent_id";
        container.appendChild(content);
        for (let i = 0; i < 12; i++) {
            let button = document.createElement("button");
            button.classList.add("categoryButtons");
            button.classList.add("diceCupButtons");
            button.id = "categoryButtons_id_" + i;
            button.setAttribute("index", i.toString());
            button.addEventListener("click", handleCategory);
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
    function showCategories() {
        document.getElementById("categoryContainer_id").classList.add("categoriesShown");
        document.getElementById("categoryContainer_id").classList.remove("categoriesHidden");
        document.getElementById("categoryBackground_id").classList.add("emptyBackground");
        document.getElementById("categoryBackground_id").style.zIndex = "10";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible"); });
    }
    DiceCup.showCategories = showCategories;
    function hideCategories() {
        document.getElementById("categoryContainer_id").classList.remove("categoriesShown");
        document.getElementById("categoryContainer_id").classList.add("categoriesHidden");
        document.getElementById("categoryBackground_id").classList.remove("emptyBackground");
        document.getElementById("categoryBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden"); });
    }
    DiceCup.hideCategories = hideCategories;
    function handleCategory(_event) {
        let index = parseInt(_event.currentTarget.getAttribute("index"));
        document.getElementById("categoryImage_i_" + _event.currentTarget.getAttribute("index")).classList.add("categoryImagesTransparent");
        this.disabled = true;
        hideCategories();
        ƒ.Time.game.setTimer(2000, 1, () => { addPointsToButton(index); });
    }
    function addPointsToButton(_index) {
        let valuation = new DiceCup.Valuation(_index, DiceCup.dices);
        let value = valuation.chooseScoringCategory();
        document.getElementById("categoryPoints_id_" + _index).innerHTML = value.toString();
        document.getElementById("categoryImage_i_" + _index).classList.add("categoryImagesTransparent");
        DiceCup.hideHudCategory(_index);
        DiceCup.updateSummary(value, _index, DiceCup.gameSettings.playerName);
        ƒ.Time.game.setTimer(2000, 1, () => { DiceCup.changeGameState(DiceCup.GameState.summary); });
    }
    function visibility(_visibility) {
        document.getElementById("categoryBackground_id").style.visibility = _visibility;
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    async function initHud() {
        let response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories = await response.json();
        let domHud = document.createElement("div");
        domHud.id = "hud_id";
        document.getElementById("DiceCup").appendChild(domHud);
        let valuationContainer = document.createElement("div");
        valuationContainer.id = "valuationContainer_id";
        domHud.appendChild(valuationContainer);
        for (let i = 0; i < 12; i++) {
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
    // HIDE/SHOW HUD WENN WIEDER REIN ODER RAUS AUS DEM GAME
    function showHud() {
        for (let i = 0; i < 12; i++) {
            document.getElementById("valuation_id_" + i).classList.remove("valuationHidden");
            document.getElementById("valuation_id_" + i).classList.add("valuationShow");
        }
    }
    DiceCup.showHud = showHud;
    function hideHudCategory(_id) {
        document.getElementById("valuation_id_" + _id).classList.remove("valuationShow");
        document.getElementById("valuation_id_" + _id).classList.add("valuationHidden");
    }
    DiceCup.hideHudCategory = hideHudCategory;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
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
        placementTitle.innerHTML = "CONGRATULATIONS!";
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
        replayButtonImage.classList.add("buttonAreaIcons");
        replayButtonImage.src = "Game/Assets/images/menuButtons/renew.svg";
        replayButton.appendChild(replayButtonImage);
        replayButton.addEventListener("click", () => {
            DiceCup.gameOver();
            DiceCup.switchMenu(DiceCup.MenuPages.singleplayer);
        });
        let placementPhrase = document.createElement("span");
        placementPhrase.id = "placementsPhrase_id";
        placementsBottomArea.appendChild(placementPhrase);
        let nextButton = document.createElement("button");
        nextButton.id = "nextButton_id";
        nextButton.classList.add("diceCupButtons");
        placementsBottomArea.appendChild(nextButton);
        let nextButtonImage = document.createElement("img");
        nextButtonImage.classList.add("buttonAreaIcons");
        nextButtonImage.src = "Game/Assets/images/menuButtons/play.svg";
        nextButton.appendChild(nextButtonImage);
        nextButton.addEventListener("click", () => {
            DiceCup.gameOver();
            DiceCup.switchMenu(DiceCup.MenuPages.main);
        });
    }
    DiceCup.initPlacements = initPlacements;
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
    function updatePlacements() {
        let name = [];
        let points = [];
        let bots = DiceCup.gameSettings.bot;
        for (let i = 1; i < 7; i++) {
            name[i - 1] = document.querySelector("#summaryGrid_id_" + i + "_0 > span").innerHTML;
            points[i - 1] = parseInt(document.querySelector("#summaryGrid_id_" + i + "_13 > span").innerHTML);
        }
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points.length; j++) {
                if (points[j] < points[j + 1]) {
                    [points[j], points[j + 1]] = [points[j + 1], points[j]];
                    [name[j], name[j + 1]] = [name[j + 1], name[j]];
                }
            }
        }
        for (let i = 0; i < 6; i++) {
            if (name[i] == "") {
                document.getElementById("placementsContainer_id_" + i).style.display = "none";
            }
            else {
                for (let j = 0; j < bots.length; j++) {
                    if (name[i] == bots[j].botName) {
                        document.getElementById("placementsPlayerIcons_id_" + i).src = "Game/Assets/images/menuButtons/bot.svg";
                        break;
                    }
                    else {
                        document.getElementById("placementsPlayerIcons_id_" + i).src = "Game/Assets/images/menuButtons/player.svg";
                    }
                }
                document.getElementById("playerName_id_" + i).innerHTML = name[i];
                document.getElementById("placementsOrder_id_" + i).innerHTML = (i + 1).toString();
                document.getElementById("placementsPoints_id_" + i).innerHTML = points[i].toString();
                if (name[i] == DiceCup.gameSettings.playerName) {
                    document.getElementById("placementsPhrase_id").innerHTML = "You are " + (i + 1) + ". place!";
                }
            }
        }
    }
    DiceCup.updatePlacements = updatePlacements;
    function showPlacements() {
        document.getElementById("placementsContainer_id").classList.add("placementsShown");
        document.getElementById("placementsContainer_id").classList.remove("placementsHidden");
        document.getElementById("placementsBackground_id").classList.add("emptyBackground");
        document.getElementById("placementsBackground_id").style.zIndex = "10";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible"); });
    }
    DiceCup.showPlacements = showPlacements;
    function hidePlacements() {
        document.getElementById("placementsContainer_id").classList.remove("placementsShown");
        document.getElementById("placementsContainer_id").classList.add("placementsHidden");
        document.getElementById("placementsBackground_id").classList.remove("emptyBackground");
        document.getElementById("placementsBackground_id").style.zIndex = "0";
        // hideHud
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden"); });
    }
    DiceCup.hidePlacements = hidePlacements;
    function visibility(_visibility) {
        document.getElementById("placementsBackground_id").style.visibility = _visibility;
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    async function initSummary() {
        DiceCup.roundCounter = 0;
        let summaryContent = await createSummaryContent();
        let background = document.createElement("div");
        background.id = "summaryBackground_id";
        document.getElementById("DiceCup").appendChild(background);
        let container = document.createElement("div");
        container.classList.add("summaryHidden");
        container.id = "summaryContainer_id";
        background.appendChild(container);
        let content = document.createElement("div");
        content.id = "summaryContent_id";
        container.appendChild(content);
        let colIds = ["playerNames"];
        colIds[13] = "sum";
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 14; col++) {
                let gridDiv = document.createElement("div");
                gridDiv.classList.add("summaryRow_" + row);
                gridDiv.classList.add("summaryColumn_" + col);
                gridDiv.id = "summaryGrid_id_" + row + "_" + col;
                content.appendChild(gridDiv);
                if (row == 0 && col > 0 && col < 13) {
                    let imgContainer = document.createElement("div");
                    imgContainer.classList.add("summaryImgContainer");
                    gridDiv.appendChild(imgContainer);
                    let img = document.createElement("img");
                    img.id = "summaryImg_id_" + col;
                    img.classList.add("summaryImg");
                    img.src = summaryContent[0][col];
                    imgContainer.appendChild(img);
                    colIds[col] = DiceCup.ScoringCategory[col - 1];
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
                }
            }
        }
        visibility("hidden");
    }
    DiceCup.initSummary = initSummary;
    async function createSummaryContent() {
        let response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories = await response.json();
        let content = [];
        let playerNames = [DiceCup.gameSettings.playerName];
        for (let index = 0; index < DiceCup.gameSettings.bot.length; index++) {
            playerNames.push(DiceCup.gameSettings.bot[index].botName);
        }
        for (let row = 0; row < 7; row++) {
            content[row] = [];
            for (let col = 0; col < 14; col++) {
                content[row][col] = "";
                if (col > 0 && col < 13) {
                    content[0][col] = categories[col - 1].image;
                }
                else if (col == 13) {
                    content[0][col] = "Sum";
                }
            }
            if (row > 0 && row < playerNames.length + 1) {
                content[row][0] = playerNames[row - 1];
            }
        }
        console.log(content);
        return content;
    }
    function updateSummary(_points, _category, _name) {
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 14; col++) {
                document.getElementById("summaryText_id_" + _name + "_" + DiceCup.ScoringCategory[_category]).innerHTML = _points.toString();
            }
        }
        let temp = 0;
        if (document.getElementById("summaryText_id_" + _name + "_sum").innerHTML) {
            temp = parseInt(document.getElementById("summaryText_id_" + _name + "_sum").innerHTML);
        }
        _points += temp;
        document.getElementById("summaryText_id_" + _name + "_sum").innerHTML = _points.toString();
        console.log("summaryText_id_" + _name + "_" + DiceCup.ScoringCategory[_category]);
    }
    DiceCup.updateSummary = updateSummary;
    function showSummary() {
        document.getElementById("summaryContainer_id").classList.add("summaryShown");
        document.getElementById("summaryContainer_id").classList.remove("summaryHidden");
        document.getElementById("summaryBackground_id").classList.add("emptyBackground");
        document.getElementById("summaryBackground_id").style.zIndex = "10";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible"); });
        ƒ.Time.game.setTimer(5000, 1, () => { hideSummary(); });
    }
    DiceCup.showSummary = showSummary;
    function hideSummary() {
        document.getElementById("summaryContainer_id").classList.remove("summaryShown");
        document.getElementById("summaryContainer_id").classList.add("summaryHidden");
        document.getElementById("summaryBackground_id").classList.remove("emptyBackground");
        document.getElementById("summaryBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden"); });
        if (DiceCup.roundCounter < 11) {
            DiceCup.changeGameState(DiceCup.GameState.ready);
            DiceCup.roundCounter++;
            console.log("Round: " + DiceCup.roundCounter + 1);
        }
        else {
            DiceCup.changeGameState(DiceCup.GameState.placement);
        }
    }
    DiceCup.hideSummary = hideSummary;
    function visibility(_visibility) {
        document.getElementById("summaryBackground_id").style.visibility = _visibility;
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    let firstPhrase = ["G", "a", "m", "e", "&nbsp", "S", "t", "a", "r", "t", "s"];
    let countDown = ["&nbsp3", "&nbsp2", "&nbsp1", "&nbspGO!"];
    let transitionCounter;
    function initTransition() {
        let container = document.createElement("div");
        container.classList.add("startTransitionContainer");
        container.id = "startTransitionContainer";
        document.getElementById("DiceCup").appendChild(container);
        transitionCounter = -1;
        transition();
    }
    DiceCup.initTransition = initTransition;
    function transition() {
        if (transitionCounter == -1) {
            for (let i = 0; i < firstPhrase.length; i++) {
                let text = document.createElement("span");
                text.id = "startTransitionText_id_" + i;
                text.style.setProperty("--i", i.toString());
                text.innerHTML = firstPhrase[i];
                document.getElementById("startTransitionContainer").appendChild(text);
            }
            transitionCounter++;
            ƒ.Time.game.setTimer(3000, 1, () => { transition(); });
        }
        else {
            let id = firstPhrase.length + transitionCounter;
            if (transitionCounter == 0) {
                for (let i = 0; i < firstPhrase.length; i++) {
                    document.getElementById("startTransitionText_id_" + i).remove();
                }
            }
            else {
                let lastId = id - 1;
                document.getElementById("startTransitionText_id_" + lastId).innerHTML = "";
            }
            let text = document.createElement("span");
            text.id = "startTransitionText_id_" + id;
            text.style.setProperty("--i", transitionCounter.toString());
            text.innerHTML = countDown[transitionCounter];
            document.getElementById("startTransitionContainer").appendChild(text);
            transitionCounter++;
            if (transitionCounter == countDown.length + 1) {
                document.getElementById("startTransitionContainer").remove();
                DiceCup.changeGameState(DiceCup.GameState.counting);
            }
            else {
                ƒ.Time.game.setTimer(1000, 1, () => { transition(); });
            }
        }
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let BotDifficulty;
    (function (BotDifficulty) {
        BotDifficulty[BotDifficulty["easy"] = 0] = "easy";
        BotDifficulty[BotDifficulty["medium"] = 1] = "medium";
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
    let MenuPages;
    (function (MenuPages) {
        MenuPages["main"] = "mainMenu_id";
        MenuPages["singleplayer"] = "singleplayerMenu_id";
        MenuPages["multiplayer"] = "multiplayerMenu_id";
        MenuPages["options"] = "optionsMenu_id";
    })(MenuPages = DiceCup.MenuPages || (DiceCup.MenuPages = {}));
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
    let menuIds = Object.values(DiceCup.MenuPages);
    function initMenu() {
        DiceCup.mainMenu();
        DiceCup.singleplayerMenu();
        DiceCup.multiplayerMenu();
        DiceCup.optionsMenu();
        switchMenu(DiceCup.MenuPages.main);
    }
    DiceCup.initMenu = initMenu;
    function switchMenu(_toMenuID) {
        hideMenu();
        document.getElementById(_toMenuID).style.zIndex = "10";
        document.getElementById(_toMenuID).style.visibility = "visible";
    }
    DiceCup.switchMenu = switchMenu;
    function hideMenu() {
        for (let index = 0; index < Object.values(DiceCup.MenuPages).length; index++) {
            document.getElementById(menuIds[index]).style.visibility = "hidden";
            document.getElementById(menuIds[index]).style.zIndex = "0";
        }
    }
    DiceCup.hideMenu = hideMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    function mainMenu() {
        let gameMenuDiv = document.createElement("div");
        gameMenuDiv.id = "gameMenu_id";
        gameMenuDiv.classList.add("gameMenus");
        gameMenuDiv.style.visibility = "hidden";
        document.getElementById("DiceCup").appendChild(gameMenuDiv);
        let menuDiv = document.createElement("div");
        menuDiv.id = DiceCup.MenuPages.main;
        menuDiv.classList.add("gameMenus");
        gameMenuDiv.appendChild(menuDiv);
        let logoDiv = document.createElement("div");
        logoDiv.id = "logoContainer_id";
        menuDiv.appendChild(logoDiv);
        let logoImage = document.createElement("img");
        logoImage.id = "logo_id";
        logoImage.src = "Game/Assets/images/temp_logo.png";
        logoDiv.appendChild(logoImage);
        let buttonDiv = document.createElement("div");
        buttonDiv.id = "buttonContainer_id";
        menuDiv.appendChild(buttonDiv);
        let menuButtonIds = ["play_id", "help_id", "shop_id", "options_id"];
        let menuButtonIconPaths = ["Game/Assets/images/menuButtons/play.svg", "Game/Assets/images/menuButtons/shop.svg", "Game/Assets/images/menuButtons/help.svg", "Game/Assets/images/menuButtons/settings.svg"];
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
        document.getElementById("play_id").addEventListener("click", () => {
            DiceCup.switchMenu(DiceCup.MenuPages.singleplayer);
        });
        // document.getElementById("shop_id").addEventListener("click", () => {
        //     switchMenu(MenuPages.main, MenuPages.shop);
        // });
        // document.getElementById("help_id").addEventListener("click", () => {
        //     switchMenu(MenuPages.main, MenuPages.help);
        // });
        document.getElementById("options_id").addEventListener("click", () => {
            DiceCup.switchMenu(DiceCup.MenuPages.options);
        });
    }
    DiceCup.mainMenu = mainMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    function multiplayerMenu() {
        let mpMenu = document.createElement("div");
        mpMenu.id = DiceCup.MenuPages.multiplayer;
        mpMenu.classList.add("gameMenus");
        mpMenu.style.visibility = "hidden";
        document.getElementById("gameMenu_id").appendChild(mpMenu);
    }
    DiceCup.multiplayerMenu = multiplayerMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    function optionsMenu() {
        let optionMenu = document.createElement("div");
        optionMenu.id = DiceCup.MenuPages.options;
        optionMenu.classList.add("gameMenus");
        optionMenu.style.visibility = "hidden";
        document.getElementById("gameMenu_id").appendChild(optionMenu);
    }
    DiceCup.optionsMenu = optionsMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let botSettings;
    let botCounter = 0;
    function singleplayerMenu() {
        let spMenu = document.createElement("div");
        spMenu.id = DiceCup.MenuPages.singleplayer;
        spMenu.classList.add("gameMenus");
        spMenu.style.visibility = "hidden";
        document.getElementById("gameMenu_id").appendChild(spMenu);
        let spMenuTitle = document.createElement("span");
        spMenuTitle.id = "singlePlayerMenuTitle_id";
        spMenuTitle.innerHTML = "SINGLEPLAYER";
        spMenu.appendChild(spMenuTitle);
        let lobbyPortraits = document.createElement("div");
        lobbyPortraits.id = "lobbyPortraits_id";
        spMenu.appendChild(lobbyPortraits);
        createPlayerPortrait();
        createBotPortrait();
        for (let index = 0; index < 4; index++) {
            createAddPortrait();
        }
        let buttonArea = document.createElement("div");
        buttonArea.id = "buttonArea_id";
        spMenu.appendChild(buttonArea);
        let leftButtonArea = document.createElement("div");
        leftButtonArea.id = "leftButtonArea_id";
        buttonArea.appendChild(leftButtonArea);
        let rightButtonArea = document.createElement("div");
        rightButtonArea.id = "rightButtonArea_id";
        buttonArea.appendChild(rightButtonArea);
        let returnButton = document.createElement("button");
        returnButton.id = "returnButton_id";
        returnButton.classList.add("buttonArea");
        returnButton.classList.add("diceCupButtons");
        leftButtonArea.appendChild(returnButton);
        let returnIcon = document.createElement("img");
        returnIcon.classList.add("buttonAreaIcons");
        returnIcon.src = "Game/Assets/images/menuButtons/return.svg";
        returnButton.appendChild(returnIcon);
        returnButton.addEventListener("click", () => {
            DiceCup.switchMenu(DiceCup.MenuPages.main);
        });
        let settingsButton = document.createElement("button");
        settingsButton.id = "settingsButton_id";
        settingsButton.classList.add("buttonArea");
        settingsButton.classList.add("diceCupButtons");
        leftButtonArea.appendChild(settingsButton);
        let settingsIcon = document.createElement("img");
        settingsIcon.classList.add("buttonAreaIcons");
        settingsIcon.src = "Game/Assets/images/menuButtons/settings.svg";
        settingsButton.appendChild(settingsIcon);
        let startButton = document.createElement("button");
        startButton.id = "startButton_id";
        startButton.classList.add("buttonArea");
        startButton.classList.add("diceCupButtons");
        startButton.innerHTML = "START";
        rightButtonArea.appendChild(startButton);
        startButton.addEventListener("click", () => {
            DiceCup.hideMenu();
            createGameSettings();
        });
    }
    DiceCup.singleplayerMenu = singleplayerMenu;
    function createGameSettings() {
        let bots = document.querySelectorAll(".botContainer").length;
        botSettings = [];
        for (let i = 0; i < bots; i++) {
            botSettings.push({ botName: document.getElementById("botName_id_" + i).placeholder, difficulty: DiceCup.BotDifficulty.easy });
        }
        DiceCup.gameSettings = { playerName: document.getElementById("playerName_id").placeholder, bot: botSettings };
        if (document.getElementById("playerName_id").value) {
            DiceCup.gameSettings.playerName = document.getElementById("playerName_id").value;
        }
        for (let i = 0; i < bots; i++) {
            if (document.getElementById("botName_id_" + i).value) {
                botSettings[i].botName = document.getElementById("botName_id_" + i).value;
            }
            if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == DiceCup.BotDifficulty[0]) {
                botSettings[i].difficulty = DiceCup.BotDifficulty.easy;
            }
            else if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == DiceCup.BotDifficulty[1]) {
                botSettings[i].difficulty = DiceCup.BotDifficulty.medium;
            }
            else if (document.getElementById("switchDifficultyText_id_" + i).innerHTML == DiceCup.BotDifficulty[2]) {
                botSettings[i].difficulty = DiceCup.BotDifficulty.hard;
            }
        }
        DiceCup.changeGameState(DiceCup.GameState.init);
    }
    function createPlayerPortrait() {
        let playerContainer = document.createElement("div");
        playerContainer.id = "playerContainer_id";
        playerContainer.classList.add("lobbyContainer");
        playerContainer.style.order = "0";
        document.getElementById("lobbyPortraits_id").appendChild(playerContainer);
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
        let playerName = document.createElement("input");
        playerName.id = "playerName_id";
        playerName.classList.add("nameInputs");
        playerName.placeholder = "Player";
        playerContainer.appendChild(playerName);
        let difficultySwitchHidden = document.createElement("div");
        difficultySwitchHidden.classList.add("difficultySwitch");
        difficultySwitchHidden.style.visibility = "hidden";
        playerContainer.appendChild(difficultySwitchHidden);
    }
    function createBotPortrait() {
        let botContainer = document.createElement("div");
        botContainer.id = "botContainer_id_" + botCounter;
        botContainer.classList.add("botContainer");
        botContainer.classList.add("lobbyContainer");
        botContainer.style.order = "1";
        document.getElementById("lobbyPortraits_id").appendChild(botContainer);
        let botDiv = document.createElement("button");
        botDiv.id = "botPortrait_id_" + botCounter;
        botDiv.classList.add("lobbyPortrait");
        botDiv.classList.add("lobbyPortrait_active");
        botDiv.classList.add("diceCupButtons");
        botDiv.disabled = true;
        botContainer.appendChild(botDiv);
        if (botCounter > 0) {
            let botRemove = document.createElement("button");
            botRemove.id = "botRemove_id_" + botCounter;
            botRemove.classList.add("botRemove");
            botDiv.appendChild(botRemove);
            botRemove.addEventListener("click", handleRemoveBot);
            let botRemoveIcon = document.createElement("img");
            botRemoveIcon.classList.add("botRemoveIcons");
            botRemoveIcon.src = "Game/Assets/images/menuButtons/minus.svg";
            botRemove.appendChild(botRemoveIcon);
        }
        let botIcons = document.createElement("img");
        botIcons.classList.add("lobbyPortraitIcons");
        botIcons.src = "Game/Assets/images/menuButtons/bot.svg";
        botDiv.appendChild(botIcons);
        let botName = document.createElement("input");
        botName.id = "botName_id_" + botCounter;
        botName.placeholder = "Agent_" + botCounter;
        botName.classList.add("nameInputs");
        botContainer.appendChild(botName);
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
        let chosenDifficulty = 0;
        let difficultySwitchText = document.createElement("div");
        difficultySwitchText.classList.add("switchDifficultyText");
        difficultySwitchText.id = "switchDifficultyText_id_" + botCounter;
        difficultySwitchText.innerHTML = DiceCup.BotDifficulty[chosenDifficulty];
        difficultySwitch.appendChild(difficultySwitchText);
        let switchButtonRight = document.createElement("button");
        switchButtonRight.classList.add("switchDifficulty");
        difficultySwitch.appendChild(switchButtonRight);
        let switchButtonRightIcon = document.createElement("img");
        switchButtonRightIcon.classList.add("switchButtonIcons");
        switchButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        switchButtonRight.appendChild(switchButtonRightIcon);
        switchButtonRight.addEventListener("click", () => {
            if (chosenDifficulty < 2) {
                chosenDifficulty++;
            }
            else {
                chosenDifficulty = 0;
            }
            difficultySwitchText.innerHTML = DiceCup.BotDifficulty[chosenDifficulty];
        });
        switchButtonLeft.addEventListener("click", () => {
            if (chosenDifficulty > 0) {
                chosenDifficulty--;
            }
            else {
                chosenDifficulty = 2;
            }
            difficultySwitchText.innerHTML = DiceCup.BotDifficulty[chosenDifficulty];
        });
    }
    function createAddPortrait() {
        let addContainer = document.createElement("div");
        addContainer.classList.add("addContainer");
        addContainer.classList.add("lobbyContainer");
        addContainer.style.order = "2";
        document.getElementById("lobbyPortraits_id").appendChild(addContainer);
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
    }
    function handleAddBot(_event) {
        botCounter++;
        this.parentElement.remove();
        createBotPortrait();
    }
    function handleRemoveBot(_event) {
        botCounter--;
        this.parentElement.parentElement.remove();
        createAddPortrait();
    }
})(DiceCup || (DiceCup = {}));
//# sourceMappingURL=Script.js.map