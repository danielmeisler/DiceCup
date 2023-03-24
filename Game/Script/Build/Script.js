"use strict";
var DiceCup;
(function (DiceCup) {
    class Bot {
        dices;
        usedCategories = new Array(12);
        usedCategoryIndex = 0;
        difficulty;
        name;
        constructor(_name, _difficulty, _dices) {
            this.name = _name;
            this.difficulty = _difficulty;
            this.dices = _dices;
        }
        chooseDifficulty(_difficulty) {
            switch (_difficulty) {
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
            let randomCategory = Math.floor((Math.random() * 12) + 1);
            if (this.usedCategories.includes(randomCategory)) {
                this.botEasy();
            }
            else {
                this.usedCategories[this.usedCategoryIndex] = randomCategory;
                this.usedCategoryIndex++;
                console.log(this.usedCategories);
                this.botValuation(randomCategory);
            }
        }
        botValuation(_category) {
            new DiceCup.Valuation(_category, DiceCup.dices);
        }
    }
    DiceCup.Bot = Bot;
})(DiceCup || (DiceCup = {}));
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
    function initGame() {
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        DiceCup.dices = [];
        let gameDiv = document.createElement("div");
        gameDiv.id = "rollingDiv_id";
        document.getElementById("game").appendChild(gameDiv);
        for (let i = 0; i < 6; i++) {
            DiceCup.dices.push(new DiceCup.Dice(i));
            DiceCup.dices.push(new DiceCup.Dice(i));
        }
        for (let i = 0; i < 12; i++) {
            let diceDiv = document.createElement("div");
            diceDiv.classList.add("diceDiv");
            diceDiv.id = "diceContainer_id_" + i;
            diceDiv.innerHTML = DiceCup.dices[i].value.toString();
            diceDiv.style.background = DiceCup.DiceColor[DiceCup.dices[i].color].toString();
            document.getElementById("rollingDiv").appendChild(diceDiv);
        }
        DiceCup.bot = new DiceCup.Bot("Agent", DiceCup.BotDifficulty.easy, DiceCup.dices);
        DiceCup.bot2 = new DiceCup.Bot("Spion", DiceCup.BotDifficulty.easy, DiceCup.dices);
        console.log("Augen auf ...");
        ƒ.Time.game.setTimer(3000, 1, () => { gameValidate(); });
    }
    DiceCup.initGame = initGame;
    function rollDices() {
        DiceCup.dices = [];
        for (let i = 0; i < 6; i++) {
            DiceCup.dices.push(new DiceCup.Dice(i));
            DiceCup.dices.push(new DiceCup.Dice(i));
        }
        for (let i = 0; i < 12; i++) {
            let diceDiv = document.createElement("div");
            diceDiv.classList.add("diceDiv");
            diceDiv.id = "diceContainer_id_" + i;
            diceDiv.innerHTML = DiceCup.dices[i].value.toString();
            diceDiv.style.background = DiceCup.DiceColor[DiceCup.dices[i].color].toString();
            document.getElementById("rollingDiv").appendChild(diceDiv);
        }
        console.log("Augen auf ...");
        ƒ.Time.game.setTimer(3000, 1, gameValidate);
    }
    function gameValidate() {
        for (let i = 0; i < 12; i++)
            document.getElementById("diceContainer" + i).remove();
        document.getElementById("valuation0").classList.add("valuationShow");
        document.getElementById("valuation0").addEventListener("click", handleValidate);
        console.log("Becher drauf!");
        for (let i = 0; i < 12; i++) {
            let valuationDiv = document.getElementById("valuation" + i);
            valuationDiv.setAttribute("index", i.toString());
            valuationDiv.classList.add("valuationShow");
            valuationDiv.addEventListener("click", handleValidate);
        }
    }
    function handleValidate(_event) {
        new DiceCup.Valuation(parseInt(_event.currentTarget.getAttribute("index")), DiceCup.dices);
        DiceCup.bot.botEasy();
        DiceCup.bot2.botEasy();
        this.disabled = true;
        this.style.backgroundColor = "black";
        this.style.color = "gray";
        this.classList.remove("valuationShow");
        this.classList.add("valuationHidden");
        console.log("Total: " + DiceCup.highscore);
        rollDices();
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        DiceCup.viewport.draw();
        //ƒ.AudioManager.default.update();
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class Hud {
        static async initHud() {
            let response = await fetch("Game/Script/Source/data/scoringCategories.json");
            let categories = await response.json();
            let domHud = document.createElement("div");
            domHud.id = "hud_id";
            document.querySelector("body").appendChild(domHud);
            let valuationContainer = document.createElement("div");
            valuationContainer.id = "valuationContainer_id";
            domHud.appendChild(valuationContainer);
            for (let i = 0; i < 12; i++) {
                let valuationButton = document.createElement("button");
                valuationButton.classList.add("valuationButton");
                valuationButton.id = "valuation_id_" + i;
                valuationButton.style.zIndex = "2";
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
    }
    DiceCup.Hud = Hud;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Dice Cup is running!");
    document.addEventListener("interactiveViewportStarted", start);
    DiceCup.dices = [];
    DiceCup.highscore = 0;
    function start(_event) {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("../../serviceWorker.js");
        }
        DiceCup.viewport = _event.detail;
        DiceCup.mainMenu();
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    function mainMenu() {
        let menuDiv = document.createElement("div");
        menuDiv.id = "mainMenu_id";
        menuDiv.classList.add("gameMenus");
        document.querySelector("body").appendChild(menuDiv);
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
            menuButtons.id = menuButtonIds[i];
            buttonDiv.appendChild(menuButtons);
            let menuIcons = document.createElement("img");
            menuIcons.classList.add("menuButtonsIcons");
            menuIcons.src = menuButtonIconPaths[i];
            menuButtons.appendChild(menuIcons);
        }
        document.getElementById("play_id").addEventListener("click", () => {
            hideMenu("mainMenu_id");
            // Hud.initHud();
            // initViewport();
            // initGame();
            DiceCup.playMenu();
        });
        document.getElementById("shop_id").addEventListener("click", () => {
            hideMenu("mainMenu_id");
        });
        document.getElementById("help_id").addEventListener("click", () => {
            hideMenu("mainMenu_id");
        });
        document.getElementById("options_id").addEventListener("click", () => {
            hideMenu("mainMenu_id");
        });
    }
    DiceCup.mainMenu = mainMenu;
    function hideMenu(_menuID) {
        document.getElementById(_menuID).style.display = "none";
    }
    function showMenu(_menuID) {
        document.getElementById(_menuID).style.display = "visible";
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    function playMenu() {
        let spMenu = document.createElement("div");
        spMenu.id = "singleplayerMenu_id";
        spMenu.classList.add("gameMenus");
        document.querySelector("body").appendChild(spMenu);
        let spMenuTitle = document.createElement("div");
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
    }
    DiceCup.playMenu = playMenu;
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
        botContainer.id = "botContainer_id";
        botContainer.classList.add("lobbyContainer");
        botContainer.style.order = "1";
        document.getElementById("lobbyPortraits_id").appendChild(botContainer);
        let botDiv = document.createElement("button");
        botDiv.id = "botPortrait_id";
        botDiv.classList.add("lobbyPortrait");
        botDiv.classList.add("lobbyPortrait_active");
        botDiv.disabled = true;
        botContainer.appendChild(botDiv);
        let botRemove = document.createElement("button");
        botRemove.id = "botRemove_id";
        botRemove.classList.add("botRemove");
        botDiv.appendChild(botRemove);
        botRemove.addEventListener("click", handleRemovePlayer);
        let botRemoveIcon = document.createElement("img");
        botRemoveIcon.classList.add("botRemoveIcons");
        botRemoveIcon.src = "Game/Assets/images/menuButtons/minus.svg";
        botRemove.appendChild(botRemoveIcon);
        let botIcons = document.createElement("img");
        botIcons.classList.add("lobbyPortraitIcons");
        botIcons.src = "Game/Assets/images/menuButtons/bot.svg";
        botDiv.appendChild(botIcons);
        let botName = document.createElement("input");
        botName.id = "botName_id";
        botName.placeholder = "Agent";
        botName.classList.add("nameInputs");
        botContainer.appendChild(botName);
        let difficultySwitch = document.createElement("div");
        difficultySwitch.classList.add("difficultySwitch");
        botContainer.appendChild(difficultySwitch);
        let switchButtonLeft = document.createElement("button");
        switchButtonLeft.classList.add("switchDifficulty");
        switchButtonLeft.innerHTML = "◄";
        difficultySwitch.appendChild(switchButtonLeft);
        let chosenDifficulty = 0;
        let difficultySwitchText = document.createElement("div");
        difficultySwitchText.classList.add("switchDifficultyText");
        difficultySwitchText.innerHTML = DiceCup.BotDifficulty[chosenDifficulty];
        difficultySwitch.appendChild(difficultySwitchText);
        let switchButtonRight = document.createElement("button");
        switchButtonRight.classList.add("switchDifficulty");
        switchButtonRight.innerHTML = "►";
        difficultySwitch.appendChild(switchButtonRight);
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
        addContainer.id = "addContainer_id";
        addContainer.classList.add("lobbyContainer");
        addContainer.style.order = "2";
        document.getElementById("lobbyPortraits_id").appendChild(addContainer);
        let addPlayerDiv = document.createElement("button");
        addPlayerDiv.classList.add("lobbyPortrait");
        addPlayerDiv.classList.add("lobbyPortrait_inactive");
        addContainer.appendChild(addPlayerDiv);
        let addIcons = document.createElement("img");
        addIcons.classList.add("lobbyPortraitIcons");
        addIcons.src = "Game/Assets/images/menuButtons/plus.svg";
        addPlayerDiv.appendChild(addIcons);
        addPlayerDiv.addEventListener("click", handleAddPlayer);
    }
    function handleAddPlayer(_event) {
        this.parentElement.remove();
        createBotPortrait();
    }
    function handleRemovePlayer(_event) {
        this.parentElement.parentElement.remove();
        createAddPortrait();
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class Valuation {
        scoringCategory;
        dices;
        constructor(_category, _dices) {
            this.dices = _dices;
            this.scoringCategory = _category;
            this.chooseScoringCategory(this.scoringCategory);
        }
        chooseScoringCategory(_scoringCategory) {
            switch (_scoringCategory) {
                case DiceCup.ScoringCategory.fours:
                    this.calculateNumber(4);
                    break;
                case DiceCup.ScoringCategory.fives:
                    this.calculateNumber(5);
                    break;
                case DiceCup.ScoringCategory.sixes:
                    this.calculateNumber(6);
                    break;
                case DiceCup.ScoringCategory.white:
                    this.calculateColor(DiceCup.DiceColor.white);
                    break;
                case DiceCup.ScoringCategory.black:
                    this.calculateColor(DiceCup.DiceColor.black);
                    break;
                case DiceCup.ScoringCategory.red:
                    this.calculateColor(DiceCup.DiceColor.red);
                    break;
                case DiceCup.ScoringCategory.blue:
                    this.calculateColor(DiceCup.DiceColor.blue);
                    break;
                case DiceCup.ScoringCategory.green:
                    this.calculateColor(DiceCup.DiceColor.green);
                    break;
                case DiceCup.ScoringCategory.yellow:
                    this.calculateColor(DiceCup.DiceColor.yellow);
                    break;
                case DiceCup.ScoringCategory.doubles:
                    this.calculateDoubles();
                    break;
                case DiceCup.ScoringCategory.oneToThree:
                    this.calculateNumber(1, 2, 3);
                    break;
                case DiceCup.ScoringCategory.diceCup:
                    this.calculateDiceCup();
                    break;
            }
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
//# sourceMappingURL=Script.js.map