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
    function start(_event) {
        DiceCup.viewport = _event.detail;
        let diceCup = document.createElement("div");
        diceCup.id = "DiceCup";
        document.querySelector("body").appendChild(diceCup);
        DiceCup.enableWakeLock();
        DiceCup.initMenu();
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    class Bot {
        dices;
        freeCategories = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        categoryCounter = 12;
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
                    this.botMedium();
                    break;
                case DiceCup.BotDifficulty.hard:
                    this.botHard();
                    break;
            }
        }
        botEasy() {
            console.log("EASY BOT");
            let randomCategory = this.freeCategories[(Math.floor((Math.random() * this.categoryCounter)))];
            let tempArray = this.freeCategories.filter((element) => element !== randomCategory);
            this.freeCategories = tempArray;
            this.botValuation(randomCategory);
            this.categoryCounter--;
        }
        botMedium() {
            console.log("MEDIUM BOT");
            //LOGIC
            let values = [];
            for (let i = 0; i < this.freeCategories.length; i++) {
                let valuation = new DiceCup.Valuation(this.freeCategories[i], DiceCup.dices);
                values[i] = valuation.chooseScoringCategory();
            }
            console.log(values);
            new DiceCup.Probabilities(DiceCup.dices, values);
            // prob.numberProbabilities(values);
            // prob.colorProbabilities(values);
            // this.botValuation(randomCategory);
            // let tempArray: number[] = this.freeCategories.filter((element) => element !== randomCategory);
            // this.freeCategories = tempArray;
            this.categoryCounter--;
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
    class Probabilities {
        values = [];
        dices;
        allProbs = [];
        diceCupProbs = new Map();
        constructor(_dices, _values) {
            this.dices = _dices;
            this.values = _values;
            this.fillProbabilities();
        }
        fillProbabilities() {
            for (let i = 0; i < Object.keys(DiceCup.ScoringCategory).length / 2; i++) {
                this.allProbs.push({ category: "", points: 0, probability: 0 });
                this.allProbs[i].category = DiceCup.ScoringCategory[i];
            }
            this.numberProbabilities();
            this.colorProbabilities();
            this.doublesProbabilities();
            this.oneTwoThreeProbabilities();
            this.diceCupProbabilities();
            console.log(this.allProbs);
        }
        numberProbabilities() {
            let diceValues = this.dices.map((element) => element.value);
            let results = [];
            diceValues.forEach(function (x) { results[x] = (results[x] || 0) + 1; });
            for (let cat = DiceCup.ScoringCategory.fours, diceValues_456 = 4; cat <= DiceCup.ScoringCategory.sixes; cat++, diceValues_456++) {
                if (results[diceValues_456]) {
                    this.allProbs[cat].points = this.values[cat];
                    this.allProbs[cat].probability = ((1 / 6) ** results[diceValues_456]) * 100;
                }
            }
        }
        colorProbabilities() {
            for (let cat = DiceCup.ScoringCategory.white; cat <= DiceCup.ScoringCategory.yellow; cat++) {
                this.allProbs[cat].points = this.values[cat];
                this.allProbs[cat].probability = this.sumProbabilities(2, this.values[cat]) * 100;
            }
        }
        doublesProbabilities() {
            let power = (this.values[DiceCup.ScoringCategory.doubles] / 10);
            let opposite = 6 - (this.values[DiceCup.ScoringCategory.doubles] / 10);
            this.allProbs[DiceCup.ScoringCategory.doubles].probability = (((1 / 6) ** power) * ((5 / 6) ** opposite)) * 100;
            this.allProbs[DiceCup.ScoringCategory.doubles].points = this.values[DiceCup.ScoringCategory.doubles];
        }
        oneTwoThreeProbabilities() {
            let counter = 0;
            this.dices.map((value) => {
                if (value.value < 4) {
                    counter++;
                }
            });
            this.allProbs[DiceCup.ScoringCategory.oneToThree].probability = ((1 / 2) ** counter) * 100;
            this.allProbs[DiceCup.ScoringCategory.oneToThree].points = this.values[DiceCup.ScoringCategory.oneToThree];
        }
        diceCupProbabilities() {
            this.allProbs[DiceCup.ScoringCategory.diceCup].points = this.values[DiceCup.ScoringCategory.diceCup];
            this.allProbs[DiceCup.ScoringCategory.diceCup].probability = this.sumProbabilities(10, this.values[DiceCup.ScoringCategory.diceCup]) * 100;
        }
        sumProbabilities(nDices, sum) {
            let dice_numbers = [1, 2, 3, 4, 5, 6];
            const calculate = (nDices, sum) => {
                if (nDices == 1) {
                    return dice_numbers.includes(sum) ? 1 / 6 : 0;
                }
                return dice_numbers.reduce((acc, i) => acc + this.sumProbabilities(nDices - 1, sum - i) * this.sumProbabilities(1, i), 0);
            };
            let key = JSON.stringify([nDices, sum]);
            if (!this.diceCupProbs.has(key))
                this.diceCupProbs.set(key, calculate(nDices, sum));
            return this.diceCupProbs.get(key);
        }
    }
    DiceCup.Probabilities = Probabilities;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class SubMenu {
        menu;
        id;
        title;
        constructor(_menu, _id, _title) {
            this.menu = _menu;
            this.id = _id;
            this.title = _title;
            this.createSubMenu();
        }
        createSubMenu() {
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
            let buttonArea = document.createElement("div");
            buttonArea.id = this.id + "MenuButtons_id";
            buttonArea.classList.add("gameMenuButtonArea");
            background.appendChild(buttonArea);
            let leftButtonArea = document.createElement("div");
            leftButtonArea.id = this.id + "MenuLeftButtonArea_id";
            leftButtonArea.classList.add("gameMenuLeftButtonArea");
            buttonArea.appendChild(leftButtonArea);
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
        time;
        percentage;
        id;
        // private newWidth: number;
        constructor(_id, _time) {
            this.id = _id;
            this.time = _time;
            ƒ.Time.game.setTimer(1000, this.time, (_event) => { this.getTimerPercentage(_event.count - 1); });
        }
        resetTimer() {
            ƒ.Time.game.setTimer(1000, 1, () => document.getElementById(this.id).style.width = "100%");
        }
        getTimerPercentage(_count) {
            // let width: number = document.getElementById("categoryTimer_id").offsetWidth;
            // this.newWidth = (this.percentage * width) / 100;
            // console.log(this.newWidth);
            document.getElementById(this.id).style.transition = "width 1s linear";
            this.percentage = (_count * 100) / this.time;
            document.getElementById(this.id).style.width = this.percentage + "%";
        }
    }
    DiceCup.TimerBar = TimerBar;
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
        let timer = document.createElement("div");
        timer.id = "categoryTimer_id";
        header.appendChild(timer);
        let title = document.createElement("span");
        title.id = "categoryTitle_id";
        title.innerHTML = "Choose a category";
        header.appendChild(title);
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
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible"), new DiceCup.TimerBar("categoryTimer_id", 5); });
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
        let timerContainer = document.createElement("div");
        timerContainer.id = "hudTimerContainer_id";
        domHud.appendChild(timerContainer);
        let timer = document.createElement("div");
        timer.id = "hudTimer_id";
        timerContainer.appendChild(timer);
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
        replayButtonImage.classList.add("diceCupButtonsIcons");
        replayButtonImage.src = "Game/Assets/images/menuButtons/renew.svg";
        replayButton.appendChild(replayButtonImage);
        replayButton.addEventListener("click", () => {
            DiceCup.gameOver();
            DiceCup.switchMenu(DiceCup.MenuPage.singleplayer);
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
        nextButtonImage.src = "Game/Assets/images/menuButtons/play.svg";
        nextButton.appendChild(nextButtonImage);
        nextButton.addEventListener("click", () => {
            DiceCup.gameOver();
            DiceCup.switchMenu(DiceCup.MenuPage.main);
        });
        visibility("hidden");
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
        for (let i = 0; i < DiceCup.playerNames.length; i++) {
            name[i] = document.querySelector("#summaryText_id_" + DiceCup.playerNames[i] + "_playerNames").innerHTML;
            points[i] = parseInt(document.querySelector("#summaryText_id_" + DiceCup.playerNames[i] + "_sum").innerHTML);
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
            if (i >= DiceCup.playerNames.length) {
                document.getElementById("placementsContainer_id_" + i).style.display = "none";
            }
        }
        for (let i = 0; i < points.length; i++) {
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
            document.getElementById("placementsPoints_id_" + i).innerHTML = points[i].toString();
            document.getElementById("placementsOrder_id_" + i).innerHTML = (i + 1).toString();
            if (name[i] == DiceCup.gameSettings.playerName) {
                document.getElementById("placementsPhrase_id").innerHTML = "You are " + (i + 1) + ". place!";
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
    DiceCup.playerNames = [];
    DiceCup.lastPoints = [];
    async function initSummary() {
        let summaryContent = await createSummaryContent();
        let background = document.createElement("div");
        background.id = "summaryBackground_id";
        background.addEventListener("click", hideSummary);
        document.getElementById("DiceCup").appendChild(background);
        let container = document.createElement("div");
        container.classList.add("summaryHidden");
        container.id = "summaryContainer_id";
        background.appendChild(container);
        let content = document.createElement("div");
        content.id = "summaryContent_id";
        container.appendChild(content);
        let colIds = ["playerNames"];
        colIds[1] = "sum";
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 14; col++) {
                let gridDiv = document.createElement("div");
                gridDiv.classList.add("summaryRow_" + row);
                gridDiv.classList.add("summaryColumn_" + col);
                gridDiv.id = "summaryGrid_id_" + row + "_" + col;
                content.appendChild(gridDiv);
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
        DiceCup.playerNames = [DiceCup.gameSettings.playerName];
        for (let index = 0; index < DiceCup.gameSettings.bot.length; index++) {
            DiceCup.playerNames.push(DiceCup.gameSettings.bot[index].botName);
        }
        for (let row = 0; row < 7; row++) {
            content[row] = [];
            for (let col = 0; col < 14; col++) {
                content[row][col] = "";
                if (col > 1 && col < 14) {
                    content[0][col] = categories[col - 2].image;
                }
                else if (col == 1) {
                    content[0][col] = "Sum";
                }
            }
            if (row > 0 && row < DiceCup.playerNames.length + 1) {
                content[row][0] = DiceCup.playerNames[row - 1];
            }
        }
        console.log(content);
        return content;
    }
    function updateSummary(_points, _category, _name) {
        if (DiceCup.lastPoints.length - DiceCup.playerNames.length >= 0) {
            document.getElementById(DiceCup.lastPoints[DiceCup.lastPoints.length - DiceCup.playerNames.length]).classList.remove("summaryHighlight");
        }
        document.getElementById("summaryText_id_" + _name + "_" + DiceCup.ScoringCategory[_category]).innerHTML = _points.toString();
        document.getElementById("summaryText_id_" + _name + "_" + DiceCup.ScoringCategory[_category]).classList.add("summaryHighlight");
        DiceCup.lastPoints.push("summaryText_id_" + _name + "_" + DiceCup.ScoringCategory[_category]);
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
        if (DiceCup.roundCounter <= DiceCup.maxRounds) {
            DiceCup.changeGameState(DiceCup.GameState.ready);
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
    let counter = 0;
    let shortTime = 1000;
    let longTime = 2000;
    function startTransition() {
        let container = document.createElement("div");
        container.classList.add("startTransitionContainer");
        container.id = "startTransitionContainer";
        document.getElementById("DiceCup").appendChild(container);
        let phrase = ["Round " + DiceCup.roundCounter, "3", "2", "1", "GO!"];
        transition(phrase);
    }
    DiceCup.startTransition = startTransition;
    function transition(_phrase) {
        if (document.getElementById("startTransitionText_id_0")) {
            while (document.getElementById("startTransitionContainer").firstChild) {
                document.getElementById("startTransitionContainer").removeChild(document.getElementById("startTransitionContainer").lastChild);
            }
        }
        if (counter < _phrase.length) {
            for (let i = 0; i < _phrase[counter].length; i++) {
                let text = document.createElement("span");
                text.id = "startTransitionText_id_" + i;
                text.animate([
                    { transform: "translateY(0)", offset: 0 },
                    { transform: "translateY(-20px)", offset: 0.2 },
                    { transform: "translateY(0)", offset: 0.4 },
                    { transform: "translateY(0)", offset: 1 },
                ], {
                    duration: 1000,
                    iterations: Infinity,
                    delay: 100 * i
                });
                if (_phrase[counter][i] == " ") {
                    text.innerHTML = "&nbsp";
                }
                else {
                    text.innerHTML = _phrase[counter][i];
                }
                document.getElementById("startTransitionContainer").appendChild(text);
            }
            counter++;
            if (_phrase[counter - 1].length <= 3) {
                ƒ.Time.game.setTimer(shortTime, 1, () => { transition(_phrase); });
            }
            else {
                ƒ.Time.game.setTimer(longTime, 1, () => { transition(_phrase); });
            }
        }
        else {
            counter = 0;
            DiceCup.roundCounter++;
            document.getElementById("startTransitionContainer").remove();
            DiceCup.changeGameState(DiceCup.GameState.counting);
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
    let MenuPage;
    (function (MenuPage) {
        MenuPage["main"] = "mainMenu_id";
        MenuPage["singleplayer"] = "singleplayerMenu_id";
        MenuPage["multiplayer"] = "multiplayerMenu_id";
        MenuPage["multiplayerLobby"] = "multiplayerLobby_id";
        MenuPage["options"] = "optionsMenu_id";
        MenuPage["help"] = "helpMenu_id";
    })(MenuPage = DiceCup.MenuPage || (DiceCup.MenuPage = {}));
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
    var ƒ = FudgeCore;
    DiceCup.dices = [];
    DiceCup.firstRound = true;
    DiceCup.highscore = 0;
    DiceCup.roundTimer = 3;
    DiceCup.roundCounter = 1;
    DiceCup.maxRounds = 12;
    let bots = [];
    let gameTimer;
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
    function round() {
        console.clear();
        if (DiceCup.firstRound == true) {
            createBots(DiceCup.gameSettings.bot);
            let gameDiv = document.createElement("div");
            gameDiv.id = "rollingDiv_id";
            document.getElementById("game").appendChild(gameDiv);
            DiceCup.firstRound = false;
        }
        else {
            gameTimer.resetTimer();
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
        gameTimer = new DiceCup.TimerBar("hudTimer_id", DiceCup.roundTimer);
        ƒ.Time.game.setTimer(DiceCup.roundTimer * 1000, 1, () => { DiceCup.changeGameState(DiceCup.GameState.choosing); });
    }
    DiceCup.round = round;
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        DiceCup.viewport.draw();
        //ƒ.AudioManager.default.update();
    }
    DiceCup.update = update;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    function gameOver() {
        DiceCup.lastPoints = [];
        DiceCup.firstRound = true;
        DiceCup.roundCounter = 1;
        DiceCup.playerNames = [];
        DiceCup.gameSettings = { playerName: "", bot: [] };
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
    function changeGameState(_gameState) {
        switch (_gameState) {
            case DiceCup.GameState.menu:
                DiceCup.switchMenu(DiceCup.MenuPage.main);
                break;
            case DiceCup.GameState.init:
                DiceCup.initHud();
                DiceCup.initCategories();
                DiceCup.initSummary();
                DiceCup.initViewport();
                DiceCup.initPlacements();
                changeGameState(DiceCup.GameState.ready);
                break;
            case DiceCup.GameState.ready:
                DiceCup.startTransition();
                break;
            case DiceCup.GameState.counting:
                DiceCup.round();
                break;
            case DiceCup.GameState.choosing:
                DiceCup.showCategories();
                break;
            case DiceCup.GameState.validating:
                // validateRound();
                break;
            case DiceCup.GameState.summary:
                DiceCup.showSummary();
                break;
            case DiceCup.GameState.placement:
                DiceCup.updatePlacements();
                DiceCup.showPlacements();
                break;
        }
        DiceCup.resetTimer();
    }
    DiceCup.changeGameState = changeGameState;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    let wakeLock = null;
    let timer;
    async function enableWakeLock() {
        if ("wakeLock" in navigator) {
            // @ts-ignore
            wakeLock = await navigator.wakeLock.request("screen");
            resetTimer();
        }
        return (wakeLock != null);
    }
    DiceCup.enableWakeLock = enableWakeLock;
    function disableWakeLock() {
        wakeLock && wakeLock.release().then(() => { wakeLock = null; });
    }
    DiceCup.disableWakeLock = disableWakeLock;
    function resetTimer() {
        timer && ƒ.Time.game.deleteTimer(timer);
        timer = ƒ.Time.game.setTimer(30000, 1, disableWakeLock);
    }
    DiceCup.resetTimer = resetTimer;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let menuIds = Object.values(DiceCup.MenuPage);
    function initMenu() {
        DiceCup.mainMenu();
        DiceCup.singleplayerMenu();
        DiceCup.multiplayerServers();
        DiceCup.multiplayerMenu();
        DiceCup.optionsMenu();
        DiceCup.helpMenu();
        switchMenu(DiceCup.MenuPage.main);
    }
    DiceCup.initMenu = initMenu;
    function switchMenu(_toMenuID) {
        hideMenu();
        document.getElementById(_toMenuID).style.zIndex = "10";
        document.getElementById(_toMenuID).style.visibility = "visible";
    }
    DiceCup.switchMenu = switchMenu;
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
    function helpMenu() {
        new DiceCup.SubMenu(DiceCup.MenuPage.help, "help", "HOW TO PLAY");
    }
    DiceCup.helpMenu = helpMenu;
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
        menuDiv.id = DiceCup.MenuPage.main;
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
        let menuButtonIds = ["play_id", "shop_id", "help_id", "options_id"];
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
            DiceCup.switchMenu(DiceCup.MenuPage.singleplayer);
        });
        document.getElementById("shop_id").addEventListener("click", () => {
            DiceCup.switchMenu(DiceCup.MenuPage.multiplayer);
        });
        document.getElementById("help_id").addEventListener("click", () => {
            DiceCup.switchMenu(DiceCup.MenuPage.help);
        });
        document.getElementById("options_id").addEventListener("click", () => {
            DiceCup.switchMenu(DiceCup.MenuPage.options);
        });
    }
    DiceCup.mainMenu = mainMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let playerCounter = 0;
    function multiplayerMenu() {
        new DiceCup.SubMenu(DiceCup.MenuPage.multiplayerLobby, "multiplayerLobby", "LOBBY");
        document.getElementById("multiplayerLobbyMenuReturnButton_id").addEventListener("click", () => {
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
        });
        let startButton = document.createElement("button");
        startButton.id = "multiplayerLobbyStartButton_id";
        startButton.classList.add("gameMenuStartButtons");
        startButton.classList.add("gameMenuButtons");
        startButton.classList.add("diceCupButtons");
        startButton.innerHTML = "START";
        document.getElementById("multiplayerLobbyMenuRightButtonArea_id").appendChild(startButton);
        startButton.addEventListener("click", () => {
            DiceCup.hideMenu();
            // createGameSettings();
        });
        createPlayerPortrait();
        for (let i = 0; i < 5; i++) {
            createWaitPortrait();
        }
    }
    DiceCup.multiplayerMenu = multiplayerMenu;
    function createPlayerPortrait() {
        let playerContainer = document.createElement("div");
        playerContainer.id = "playerContainer_id";
        playerContainer.classList.add("lobbyContainer");
        playerContainer.classList.add("waitContainer");
        playerContainer.style.order = "0";
        document.getElementById("multiplayerLobbyMenuContent_id").appendChild(playerContainer);
        let playerDiv = document.createElement("button");
        playerDiv.id = "playerPortrait_id";
        playerDiv.classList.add("lobbyPortrait");
        playerDiv.classList.add("lobbyPortrait_active");
        playerDiv.classList.add("diceCupButtons");
        playerContainer.appendChild(playerDiv);
        if (playerCounter > 0) {
            let playerRemove = document.createElement("button");
            playerRemove.id = "playerRemove_id_" + playerCounter;
            playerRemove.classList.add("removeButton");
            playerDiv.appendChild(playerRemove);
            // playerRemove.addEventListener("click", );
            let botRemoveIcon = document.createElement("img");
            botRemoveIcon.classList.add("removeButtonIcons");
            botRemoveIcon.src = "Game/Assets/images/menuButtons/minus.svg";
            playerRemove.appendChild(botRemoveIcon);
        }
        let playerIcons = document.createElement("img");
        playerIcons.classList.add("lobbyPortraitIcons");
        playerIcons.src = "Game/Assets/images/menuButtons/player.svg";
        playerDiv.appendChild(playerIcons);
        let playerName = document.createElement("input");
        playerName.id = "playerName_id";
        playerName.classList.add("nameInputs");
        playerName.placeholder = "Player";
        playerContainer.appendChild(playerName);
        playerCounter++;
    }
    function createWaitPortrait() {
        let waitContainer = document.createElement("div");
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
        playerName.innerHTML = "Waiting...";
        waitContainer.appendChild(playerName);
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    function multiplayerServers() {
        new DiceCup.SubMenu(DiceCup.MenuPage.multiplayer, "multiplayer", "MULTIPLAYER");
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
            DiceCup.hideMenu();
        });
        let createButton = document.createElement("button");
        createButton.id = "multiplayerCreateButton_id";
        createButton.classList.add("gameMenuStartButtons");
        createButton.classList.add("gameMenuButtons");
        createButton.classList.add("diceCupButtons");
        createButton.innerHTML = "CREATE";
        document.getElementById("multiplayerMenuRightButtonArea_id").appendChild(createButton);
        createButton.addEventListener("click", () => {
            DiceCup.switchMenu(DiceCup.MenuPage.multiplayerLobby);
        });
        let joinButton = document.createElement("button");
        joinButton.id = "multiplayerJoinButton_id";
        joinButton.classList.add("gameMenuStartButtons");
        joinButton.classList.add("gameMenuButtons");
        joinButton.classList.add("diceCupButtons");
        joinButton.innerHTML = "JOIN";
        document.getElementById("multiplayerMenuRightButtonArea_id").appendChild(joinButton);
        joinButton.addEventListener("click", () => {
            // createGameSettings();
        });
    }
    DiceCup.multiplayerServers = multiplayerServers;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    function optionsMenu() {
        new DiceCup.SubMenu(DiceCup.MenuPage.options, "options", "OPTIONS");
    }
    DiceCup.optionsMenu = optionsMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    let botSettings;
    let botCounter = 0;
    function singleplayerMenu() {
        new DiceCup.SubMenu(DiceCup.MenuPage.singleplayer, "singleplayer", "SINGLEPLAYER");
        createPlayerPortrait();
        createBotPortrait();
        for (let index = 0; index < 4; index++) {
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
        });
        let startButton = document.createElement("button");
        startButton.id = "singleplayerStartButton_id";
        startButton.classList.add("gameMenuStartButtons");
        startButton.classList.add("gameMenuButtons");
        startButton.classList.add("diceCupButtons");
        startButton.innerHTML = "START";
        document.getElementById("singleplayerMenuRightButtonArea_id").appendChild(startButton);
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
        document.getElementById("singleplayerMenuContent_id").appendChild(botContainer);
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
            botRemove.classList.add("removeButton");
            botDiv.appendChild(botRemove);
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
        let botName = document.createElement("input");
        botName.id = "botName_id_" + botCounter;
        botName.placeholder = "Agent_" + Math.floor((Math.random() * 99));
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