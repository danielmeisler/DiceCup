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
        DiceCup.enableWakeLock();
        load();
    }
    async function load() {
        let diceCup = document.createElement("div");
        diceCup.id = "DiceCup";
        document.querySelector("body").appendChild(diceCup);
        let graph = DiceCup.viewport.getBranch();
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.AudioManager.default.listenTo(graph);
        DiceCup.currentLanguage = localStorage.getItem("language") || DiceCup.Languages.english;
        DiceCup.initBackgroundMusic(0);
        await DiceCup.chooseLanguage(DiceCup.currentLanguage);
        DiceCup.changeViewportState(DiceCup.ViewportState.menu);
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
            this.dices = _dices;
            this.difficulty = _difficulty;
        }
        botsTurn() {
            let pickedCategory = 0;
            let values = [];
            for (let i = 0; i < this.freeCategories.length; i++) {
                let valuation = new DiceCup.Valuation(this.freeCategories[i], DiceCup.dices, false);
                values[i] = [];
                values[i][0] = this.freeCategories[i];
                values[i][1] = valuation.chooseScoringCategory();
            }
            let prob = new DiceCup.Probabilities(DiceCup.dices, values, this.freeCategories);
            let allProb = prob.fillProbabilities();
            pickedCategory = this.chooseDifficulty(allProb);
            this.botValuation(pickedCategory);
            let tempArray = this.freeCategories.filter((element) => element !== pickedCategory);
            this.freeCategories = tempArray;
            this.categoryCounter--;
            console.log(this.freeCategories);
        }
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
        botEasy(_categories) {
            return (_categories[(Math.floor((Math.random() * this.categoryCounter)))].category);
        }
        botMedium(_categories) {
            return (_categories[Math.floor((Math.random() * this.categoryCounter) / 2)].category);
        }
        botHard(_categories) {
            return (_categories[Math.floor((Math.random() * this.categoryCounter) / 4)].category);
        }
        botValuation(_category) {
            let valuation = new DiceCup.Valuation(_category, DiceCup.dices, false);
            let value = valuation.chooseScoringCategory();
            ƒ.Time.game.setTimer(2000, 1, () => { DiceCup.updateSummary(value, _category, this.name); });
        }
    }
    DiceCup.Bot = Bot;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    class Dice {
        graph = DiceCup.viewport.getBranch();
        diceNode = this.graph.getChildrenByName("Dices")[0];
        diceGraph;
        diceInst;
        diceMat;
        diceRig;
        dots;
        dotsMat;
        arenaTranslation = new ƒ.Vector3((Math.random() * 6) - 3, Math.random() * 5 + 3, (Math.random() * 4) - 1.5);
        arenaRotation = new ƒ.Vector3(Math.random() * 360, (Math.random() * 360), (Math.random() * 360));
        bigDice = 0.3;
        smallDice = 0.265;
        color;
        value;
        constructor(_colorRGBA, _color, _rollDiceMode) {
            this.color = _color;
            this.value = this.roll();
            this.initDice(_colorRGBA, _rollDiceMode);
        }
        roll() {
            this.value = Math.floor((Math.random() * 6) + 1);
            return this.value;
        }
        async initDice(_colorRGBA, _rollDiceMode) {
            this.diceGraph = ƒ.Project.resources["Graph|2023-05-10T12:08:54.682Z|33820"];
            this.diceInst = await ƒ.Project.createGraphInstance(this.diceGraph);
            this.diceMat = this.diceInst.getComponent(ƒ.ComponentMaterial);
            this.diceRig = this.diceInst.getComponent(ƒ.ComponentRigidbody);
            this.dots = this.diceInst.getChildren();
            this.dotsMat = this.dots.map(dot => dot.getComponent(ƒ.ComponentMaterial));
            let test = [];
            for (let i = 1, j = 0; i <= 8; i++, j++) {
                test[j] = this.diceInst.getChildrenByName("Corner_" + i)[0];
            }
            test.map(corner => corner.getComponent(ƒ.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, this.handleDiceCollision));
            // console.log(test)
            // this.diceRig.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.handleDiceCollision);
            this.scaleDices(_colorRGBA);
            this.rollDices(_rollDiceMode);
            this.colorDices(_colorRGBA);
            this.diceNode.addChild(this.diceInst);
        }
        validateDices() {
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(224), this.convertDiceColor(187), this.convertDiceColor(0), 1);
            this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(0, 0, 0, 1); });
        }
        transparentDices() {
            let tempDices = this.diceNode.getChildren();
            let tempMat = tempDices.map(dice => dice.getComponent(ƒ.ComponentMaterial));
            let tempDots = tempDices.map(dice => dice.getChildren());
            let tempDotsMat = tempDots.map(dot => dot.map(dot => dot.getComponent(ƒ.ComponentMaterial)));
            tempMat.map(dice => dice.clrPrimary.a = 0.2);
            tempDotsMat.map(dot => dot.map(dot => dot.clrPrimary.a = 0.2));
        }
        rollDices(_mode) {
            this.diceRig.activate(false);
            switch (_mode) {
                case 0:
                    this.diceInst.mtxLocal.translation = this.arenaTranslation;
                    this.diceInst.mtxLocal.rotation = this.arenaRotation;
                    break;
                case 1:
                    this.rotateDice(this.diceInst);
                    this.translateDice(this.diceInst);
                    break;
                case 2:
                    this.diceInst.mtxLocal.translation = new ƒ.Vector3((Math.random() * 2) - 1, Math.random() * 3 + 3, (Math.random() * 2) - 1);
                    this.diceInst.mtxLocal.rotation = this.arenaRotation;
                    break;
                default:
                    break;
            }
            this.diceRig.activate(true);
        }
        translateDice(_node) {
            let tempVec = new ƒ.Vector3((Math.random() * 6) - 3, _node.mtxLocal.scaling.x + 0.01, (Math.random() * 4) - 1.5);
            if (DiceCup.usedTranslations.map(vec => ƒ.Vector3.DIFFERENCE(vec, tempVec).magnitude).some(diff => diff < this.smallDice)) {
                console.log("ZU NAH");
                this.translateDice(_node);
            }
            else {
                DiceCup.usedTranslations.push(tempVec);
                _node.mtxLocal.translation = tempVec;
            }
            if (DiceCup.usedTranslations.length == DiceCup.dices.length) {
                DiceCup.usedTranslations = [];
            }
        }
        rotateDice(_node) {
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
        }
        async scaleDices(_colorRGBA) {
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_colorRGBA.name == DiceCup.DiceColor.white || _colorRGBA.name == DiceCup.DiceColor.green || _colorRGBA.name == DiceCup.DiceColor.yellow) {
                this.diceInst.mtxLocal.scaling = new ƒ.Vector3(this.smallDice, this.smallDice, this.smallDice);
            }
            else {
                this.diceInst.mtxLocal.scaling = new ƒ.Vector3(this.bigDice, this.bigDice, this.bigDice);
            }
        }
        async colorDices(_colorRGBA) {
            let diceColors = await DiceCup.loadDiceColors();
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_colorRGBA.name == DiceCup.DiceColor.white || _colorRGBA.name == DiceCup.DiceColor.green || _colorRGBA.name == DiceCup.DiceColor.yellow) {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[diceColors.length - 2].r), this.convertDiceColor(diceColors[diceColors.length - 2].g), diceColors[diceColors.length - 2].b, diceColors[diceColors.length - 2].a); });
            }
            else {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[diceColors.length - 1].r), this.convertDiceColor(diceColors[diceColors.length - 1].g), diceColors[diceColors.length - 1].b, diceColors[diceColors.length - 1].a); });
            }
        }
        convertDiceColor(_value) {
            let value;
            value = (_value / 2.55) / 100;
            return value;
        }
        handleDiceCollision(_event) {
            // let collisionNode: ƒ.Node = _event.cmpRigidbody.node;
            let soundArray = ["Audio|2023-05-15T13:12:43.528Z|46162", "Audio|2023-05-15T14:58:38.658Z|39413", "Audio|2023-05-15T14:58:49.349Z|84065", "Audio|2023-05-15T14:59:11.270Z|83758", "Audio|2023-05-15T14:59:11.270Z|83758"];
            DiceCup.playSFX(soundArray[Math.floor(Math.random() * soundArray.length)]);
        }
    }
    DiceCup.Dice = Dice;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class Probabilities {
        values = [];
        freeCategories = [];
        dices;
        allProbs = [];
        diceCupProbs = new Map();
        constructor(_dices, _values, _freeCategories) {
            this.dices = _dices;
            this.values = _values;
            this.freeCategories = _freeCategories;
        }
        fillProbabilities() {
            for (let i = 0; i < this.freeCategories.length; i++) {
                this.allProbs.push({ stringCategory: null, category: null, points: null, probability: null, value: null });
                this.allProbs[i].points = this.values[i][1];
                this.allProbs[i].stringCategory = DiceCup.ScoringCategory[this.freeCategories[i]];
                this.allProbs[i].category = this.freeCategories[i];
                this.allProbs[i].probability = this.values[i][1] == 0 ? null : this.chooseProbabilities(this.freeCategories[i]);
            }
            this.sortProbabilities();
            console.log(DiceCup.dices);
            console.log(this.allProbs);
            return this.allProbs;
        }
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
        numberProbabilities(_category) {
            let diceValues = this.dices.map((element) => element.value);
            let results = [];
            diceValues.forEach(function (x) { results[x] = (results[x] || 0) + 1; });
            let power = results[_category + 4];
            let opposite = 12 - results[_category + 4];
            return ((1 / 6) ** power) * ((5 / 6) ** opposite) * this.binomial(12, power) * 100;
        }
        colorProbabilities(_category) {
            let dice_numbers = [1, 2, 3, 4, 5, 6];
            let category = this.values.map((cat) => cat[0]);
            let counter = category.indexOf(_category);
            return this.sumProbabilities(2, this.values[counter][1], dice_numbers) * 100;
        }
        doublesProbabilities(_category) {
            let category = this.values.map((cat) => cat[0]);
            let counter = category.indexOf(_category);
            let power = (this.values[counter][1] / 10);
            let opposite = 6 - (this.values[counter][1] / 10);
            return ((1 / 6) ** power) * ((5 / 6) ** opposite) * this.binomial(6, power) * 100;
        }
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
        diceCupProbabilities(_category) {
            let dice_numbers = [1, 2, 3, 4, 5, 6];
            let category = this.values.map((cat) => cat[0]);
            let counter = category.indexOf(_category);
            return this.sumProbabilities(10, this.values[counter][1], dice_numbers) * 100;
        }
        sumProbabilities(nDices, sum, dice_numbers) {
            const calculate = (nDices, sum, dice_numbers) => {
                if (nDices == 1) {
                    return dice_numbers.includes(sum) ? 1 / 6 : 0;
                }
                return dice_numbers.reduce((acc, i) => acc + this.sumProbabilities(nDices - 1, sum - i, dice_numbers) * this.sumProbabilities(1, i, dice_numbers), 0);
            };
            let key = JSON.stringify([nDices, sum, dice_numbers]);
            if (!this.diceCupProbs.has(key))
                this.diceCupProbs.set(key, calculate(nDices, sum, dice_numbers));
            return this.diceCupProbs.get(key);
        }
        sortProbabilities() {
            this.allProbs.map(function (elem) {
                elem.value = elem.points;
                if (elem.category == DiceCup.ScoringCategory.fours) {
                    elem.value -= 8;
                }
                else if (elem.category == DiceCup.ScoringCategory.fives) {
                    elem.value -= 10;
                }
                else if (elem.category == DiceCup.ScoringCategory.sixes) {
                    elem.value -= 12;
                }
                else if (elem.category == DiceCup.ScoringCategory.doubles) {
                    elem.value /= 5;
                }
                else if (elem.category == DiceCup.ScoringCategory.oneToThree) {
                    elem.value -= 12;
                }
                else if (elem.category == DiceCup.ScoringCategory.diceCup) {
                    elem.value -= 42;
                }
                else {
                    elem.value -= 7;
                }
                if (elem.points == 0) {
                    elem.value = Number.NEGATIVE_INFINITY;
                }
            });
            this.allProbs.sort(function (a, b) {
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
        binomial(n, k) {
            var coeff = 1;
            for (var x = n - k + 1; x <= n; x++)
                coeff *= x;
            for (x = 1; x <= k; x++)
                coeff /= x;
            return coeff;
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
        }
        getTimerPercentage(_count) {
            // let width: number = document.getElementById("categoryTimer_id").offsetWidth;
            // this.newWidth = (this.percentage * width) / 100;
            // console.log(this.newWidth);
            document.getElementById(this.id).style.transition = "width 1s linear";
            this.percentage = (_count * 100) / this.time;
            document.getElementById(this.id).style.width = this.percentage + "%";
            if (document.getElementById(this.id).style.width == "0%") {
                ƒ.Time.game.setTimer(1000, 1, () => document.getElementById(this.id).style.width = "100%");
            }
        }
    }
    DiceCup.TimerBar = TimerBar;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    class Valuation {
        scoringCategory;
        dices;
        player;
        constructor(_category, _dices, _player) {
            this.dices = _dices;
            this.scoringCategory = _category;
            this.player = _player;
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
            this.player && DiceCup.dices[value].transparentDices();
            for (let i = 0; i < this.dices.length; i++) {
                if (this.dices[i].value === _number || this.dices[i].value === _number2 || this.dices[i].value === _number3) {
                    value += this.dices[i].value;
                    this.player && this.dices[i].validateDices();
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
            this.player && DiceCup.dices[value].transparentDices();
            for (let i = 0; i < this.dices.length; i++) {
                if (this.dices[i].color === _color) {
                    value += this.dices[i].value;
                    this.player && this.dices[i].validateDices();
                }
            }
            DiceCup.highscore += value;
            console.log(DiceCup.DiceColor[_color] + " color: " + value);
            return value;
        }
        calculateDoubles() {
            let value = 0;
            this.player && DiceCup.dices[value].transparentDices();
            for (let i = 0; i < this.dices.length - 1; i++) {
                if (this.dices[i].color === this.dices[i + 1].color && this.dices[i].value === this.dices[i + 1].value) {
                    value += 10;
                    this.player && this.dices[i].validateDices();
                    this.player && this.dices[i + 1].validateDices();
                }
            }
            DiceCup.highscore += value;
            console.log("Doubles: " + value);
            return value;
        }
        calculateDiceCup() {
            let value = 0;
            this.player && DiceCup.dices[value].transparentDices();
            for (let i = 0; i < this.dices.length; i++) {
                value += this.dices[i].value;
                this.player && this.dices[i].validateDices();
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
        title.innerHTML = DiceCup.language.game.categories.title;
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
        let valuation = new DiceCup.Valuation(_index, DiceCup.dices, true);
        let value = valuation.chooseScoringCategory();
        document.getElementById("categoryPoints_id_" + _index).innerHTML = value.toString();
        document.getElementById("categoryImage_i_" + _index).classList.add("categoryImagesTransparent");
        DiceCup.hideHudCategory(_index);
        DiceCup.updateSummary(value, _index, DiceCup.gameSettings.playerName);
        DiceCup.changeGameState(DiceCup.GameState.validating);
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
            DiceCup.gameOver(DiceCup.MenuPage.singleplayer);
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
            DiceCup.gameOver(DiceCup.MenuPage.main);
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
                document.getElementById("placementsPhrase_id").innerHTML = DiceCup.language.game.placements.alerts.part_1 + " " + (i + 1) + ". " + DiceCup.language.game.placements.alerts.part_2;
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
                    content[0][col] = DiceCup.language.game.summary.sum;
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
        // ƒ.Time.game.setTimer(5000, 1, () => { hideSummary() });
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
        let phrase = [DiceCup.language.game.transition.phrase_1 + DiceCup.roundCounter, DiceCup.language.game.transition.phrase_2, DiceCup.language.game.transition.phrase_3];
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
    var ƒ = FudgeCore;
    function validateRound() {
        ƒ.Time.game.setTimer(2000, 1, () => { DiceCup.changeGameState(DiceCup.GameState.summary); });
    }
    DiceCup.validateRound = validateRound;
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
    let ViewportState;
    (function (ViewportState) {
        ViewportState[ViewportState["menu"] = 0] = "menu";
        ViewportState[ViewportState["transition"] = 1] = "transition";
        ViewportState[ViewportState["game"] = 2] = "game";
    })(ViewportState = DiceCup.ViewportState || (DiceCup.ViewportState = {}));
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    function changeFloor(_change) {
        let graph = DiceCup.viewport.getBranch();
        let arena = graph.getChildrenByName("Arena")[0];
        let game_floor = arena.getChildrenByName("Floor_game")[0];
        let menu_floor = arena.getChildrenByName("Floor_menu")[0];
        game_floor.activate(_change);
        menu_floor.activate(!_change);
    }
    DiceCup.changeFloor = changeFloor;
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
    DiceCup.dices = [];
    DiceCup.firstRound = true;
    DiceCup.highscore = 0;
    DiceCup.roundTimer = 3;
    DiceCup.roundCounter = 1;
    DiceCup.maxRounds = 12;
    DiceCup.usedTranslations = [];
    let bots = [];
    function createBots(_bots) {
        bots = [];
        console.log(DiceCup.dices);
        for (let index = 0; index < _bots.length; index++) {
            bots[index] = new DiceCup.Bot(_bots[index].botName, _bots[index].difficulty, DiceCup.dices);
        }
        return bots;
    }
    async function loadDiceColors() {
        let response = await fetch("Game/Script/Data/diceColors.json");
        let diceColors = await response.json();
        return diceColors;
    }
    DiceCup.loadDiceColors = loadDiceColors;
    async function rollDices() {
        let diceColors = await loadDiceColors();
        let graph = DiceCup.viewport.getBranch();
        let diceNode = graph.getChildrenByName("Dices")[0];
        diceNode.removeAllChildren();
        DiceCup.dices = [];
        for (let i = 0, color = 0; i < 12; i++, color += 0.5) {
            DiceCup.dices.push(new DiceCup.Dice(diceColors[Math.floor(color)], Math.floor(color), 1));
        }
    }
    DiceCup.rollDices = rollDices;
    async function round() {
        console.clear();
        if (DiceCup.firstRound == true) {
            createBots(DiceCup.gameSettings.bot);
            DiceCup.firstRound = false;
        }
        for (let index = 0; index < bots.length; index++) {
            bots[index].botsTurn();
        }
        new DiceCup.TimerBar("hudTimer_id", DiceCup.roundTimer);
        ƒ.Time.game.setTimer(DiceCup.roundTimer * 1000, 1, () => { DiceCup.changeGameState(DiceCup.GameState.choosing); });
    }
    DiceCup.round = round;
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        switch (DiceCup.viewportState) {
            case DiceCup.ViewportState.menu:
                DiceCup.viewport.camera.mtxPivot.lookAt(new ƒ.Vector3(0, 0.75, 0));
                DiceCup.viewport.camera.mtxPivot.translateX(0.02);
                break;
            default:
                break;
        }
        DiceCup.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    DiceCup.update = update;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    function gameOver(_return) {
        DiceCup.lastPoints = [];
        DiceCup.firstRound = true;
        DiceCup.roundCounter = 1;
        DiceCup.playerNames = [];
        DiceCup.gameSettings = { playerName: "", bot: [] };
        DiceCup.changeViewportState(DiceCup.ViewportState.menu);
        let graph = DiceCup.viewport.getBranch();
        let diceNode = graph.getChildrenByName("Dices")[0];
        diceNode.removeAllChildren();
        while (document.getElementById("DiceCup").childNodes.length > 1) {
            document.getElementById("DiceCup").removeChild(document.getElementById("DiceCup").lastChild);
        }
        DiceCup.switchMenu(_return);
    }
    DiceCup.gameOver = gameOver;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
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
                DiceCup.round();
                DiceCup.changeViewportState(DiceCup.ViewportState.game);
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
        DiceCup.resetTimer();
    }
    DiceCup.changeGameState = changeGameState;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    let backgroundAudio;
    function initBackgroundMusic(_track) {
        let soundArray = ["Audio|2023-05-15T19:01:45.890Z|78438"];
        let track = ƒ.Project.resources[soundArray[_track]];
        backgroundAudio = new ƒ.ComponentAudio(track, true, false);
        backgroundAudio.connect(true);
        backgroundAudio.volume = setVolume(DiceCup.musicVolume);
        backgroundAudio.setAudio(track);
        backgroundMusic(true);
    }
    DiceCup.initBackgroundMusic = initBackgroundMusic;
    function backgroundMusic(_on) {
        backgroundAudio.play(_on);
    }
    DiceCup.backgroundMusic = backgroundMusic;
    function nextTrack(_track) {
        backgroundMusic(false);
        initBackgroundMusic(_track);
    }
    DiceCup.nextTrack = nextTrack;
    function changeVolume() {
        backgroundAudio.volume = setVolume(DiceCup.musicVolume);
    }
    DiceCup.changeVolume = changeVolume;
    function playSFX(_sfx) {
        let cmpAudio;
        let audio = ƒ.Project.resources[_sfx];
        cmpAudio = new ƒ.ComponentAudio(audio, false, false);
        cmpAudio.connect(true);
        cmpAudio.volume = setVolume(DiceCup.sfxVolume);
        cmpAudio.setAudio(audio);
        cmpAudio.play(true);
    }
    DiceCup.playSFX = playSFX;
    function setVolume(_volume) {
        return _volume /= 1000;
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    function changeViewportState(_viewportState) {
        switch (_viewportState) {
            case DiceCup.ViewportState.menu:
                menuViewport();
                break;
            case DiceCup.ViewportState.transition:
                transitionViewport();
                break;
            case DiceCup.ViewportState.game:
                gameViewport();
                break;
        }
        DiceCup.viewportState = _viewportState;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, DiceCup.update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }
    DiceCup.changeViewportState = changeViewportState;
    async function menuViewport() {
        let diceColors = await DiceCup.loadDiceColors();
        DiceCup.changeFloor(false);
        DiceCup.activateCover(false);
        DiceCup.viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 0.75, -5);
        for (let i = 0, color = 0; i < 12; i++, color += 0.5) {
            new DiceCup.Dice(diceColors[Math.floor(color)], Math.floor(color), 2);
        }
    }
    async function transitionViewport() {
        // let response: Response = await fetch("Game/Script/Data/diceColors.json");
        // let diceColors: RgbaDao[] = await response.json();
        // changeFloor(false);
        // activateCover(false);
        // viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 0.8, -5);
        // for (let i = 0, color = 0; i < 12; i++, color+=0.5) {
        //     dices.push(new Dice(diceColors[Math.floor(color)], Math.floor(color), 2));
        // }
    }
    async function gameViewport() {
        DiceCup.viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 8, -4);
        DiceCup.viewport.camera.mtxPivot.rotation = new ƒ.Vector3(60, 0, 0);
        DiceCup.changeFloor(true);
        DiceCup.activateCover(true);
    }
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
        if (localStorage.getItem("optionsMenu")) {
            switchMenu(DiceCup.MenuPage.options);
            localStorage.removeItem("optionsMenu");
        }
        else {
            switchMenu(DiceCup.MenuPage.main);
        }
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
        new DiceCup.SubMenu(DiceCup.MenuPage.help, "help", DiceCup.language.menu.help.title);
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
        let menuButtonIds = ["play_id", "shop_id", "help_id", "options_id"];
        let menuButtonIconPaths = ["Game/Assets/images/menuButtons/play.svg", "Game/Assets/images/menuButtons/multiplayer.svg", "Game/Assets/images/menuButtons/help.svg", "Game/Assets/images/menuButtons/settings.svg"];
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
        new DiceCup.SubMenu(DiceCup.MenuPage.multiplayerLobby, "multiplayerLobby", document.getElementById("playerName_id").placeholder + "'s " + DiceCup.language.menu.multiplayer.lobby.title);
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
        startButton.innerHTML = DiceCup.language.menu.multiplayer.lobby.start_button;
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
        playerName.placeholder = DiceCup.language.menu.player;
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
        playerName.innerHTML = DiceCup.language.menu.multiplayer.lobby.waiting;
        waitContainer.appendChild(playerName);
    }
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
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
            DiceCup.hideMenu();
        });
        let createButton = document.createElement("button");
        createButton.id = "multiplayerCreateButton_id";
        createButton.classList.add("gameMenuStartButtons");
        createButton.classList.add("gameMenuButtons");
        createButton.classList.add("diceCupButtons");
        createButton.innerHTML = DiceCup.language.menu.multiplayer.list.create_button;
        document.getElementById("multiplayerMenuRightButtonArea_id").appendChild(createButton);
        createButton.addEventListener("click", () => {
            DiceCup.switchMenu(DiceCup.MenuPage.multiplayerLobby);
        });
        let joinButton = document.createElement("button");
        joinButton.id = "multiplayerJoinButton_id";
        joinButton.classList.add("gameMenuStartButtons");
        joinButton.classList.add("gameMenuButtons");
        joinButton.classList.add("diceCupButtons");
        joinButton.innerHTML = DiceCup.language.menu.multiplayer.list.join_button;
        document.getElementById("multiplayerMenuRightButtonArea_id").appendChild(joinButton);
        joinButton.addEventListener("click", () => {
            // createGameSettings();
        });
    }
    DiceCup.multiplayerServers = multiplayerServers;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    DiceCup.sfxVolume = localStorage.getItem("volume") ? parseInt(localStorage.getItem("volume")) : 50;
    DiceCup.musicVolume = localStorage.getItem("musicVolume") ? parseInt(localStorage.getItem("musicVolume")) : 50;
    function optionsMenu() {
        new DiceCup.SubMenu(DiceCup.MenuPage.options, "options", DiceCup.language.menu.settings.title);
        let contentContainer = document.createElement("div");
        contentContainer.id = "optionsContentContainer_id";
        contentContainer.classList.add("lobbyContainer");
        document.getElementById("optionsMenuContent_id").appendChild(contentContainer);
        let resetButton = document.createElement("button");
        resetButton.id = "optionsStartButton_id";
        resetButton.classList.add("gameMenuStartButtons");
        resetButton.classList.add("gameMenuButtons");
        resetButton.classList.add("diceCupButtons");
        resetButton.innerHTML = DiceCup.language.menu.settings.reset_button;
        document.getElementById("optionsMenuRightButtonArea_id").appendChild(resetButton);
        resetButton.addEventListener("click", () => {
            localStorage.clear();
            localStorage.setItem("optionsMenu", "true");
            location.reload();
        });
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                let gridContainer = document.createElement("div");
                gridContainer.id = "optionsGrid_id_" + row + "_" + col;
                gridContainer.classList.add("optionsRow_" + row);
                gridContainer.classList.add("optionsColumn_" + col);
                contentContainer.appendChild(gridContainer);
            }
        }
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
            if (DiceCup.musicVolume < 100) {
                DiceCup.musicVolume += 10;
                musicControl.innerHTML = DiceCup.musicVolume + "%";
                musicSwitchButtonLeft.style.visibility = "visible";
                DiceCup.changeVolume();
            }
            if (DiceCup.musicVolume == 100) {
                musicSwitchButtonRight.style.visibility = "hidden";
            }
            localStorage.setItem("musicVolume", DiceCup.musicVolume.toString());
        });
        musicSwitchButtonLeft.addEventListener("click", () => {
            if (DiceCup.musicVolume > 0) {
                DiceCup.musicVolume -= 10;
                musicControl.innerHTML = DiceCup.musicVolume + "%";
                musicSwitchButtonRight.style.visibility = "visible";
                DiceCup.changeVolume();
            }
            if (DiceCup.musicVolume == 0) {
                musicSwitchButtonLeft.style.visibility = "hidden";
            }
            localStorage.setItem("musicVolume", DiceCup.musicVolume.toString());
        });
        if (DiceCup.musicVolume == 100) {
            musicSwitchButtonRight.style.visibility = "hidden";
        }
        else if (DiceCup.musicVolume == 0) {
            musicSwitchButtonLeft.style.visibility = "hidden";
        }
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
            if (DiceCup.sfxVolume < 100) {
                DiceCup.sfxVolume += 10;
                soundControl.innerHTML = DiceCup.sfxVolume + "%";
                switchButtonLeft.style.visibility = "visible";
                DiceCup.changeVolume();
            }
            if (DiceCup.sfxVolume == 100) {
                switchButtonRight.style.visibility = "hidden";
            }
            localStorage.setItem("volume", DiceCup.sfxVolume.toString());
        });
        switchButtonLeft.addEventListener("click", () => {
            if (DiceCup.sfxVolume > 0) {
                DiceCup.sfxVolume -= 10;
                soundControl.innerHTML = DiceCup.sfxVolume + "%";
                switchButtonRight.style.visibility = "visible";
                DiceCup.changeVolume();
            }
            if (DiceCup.sfxVolume == 0) {
                switchButtonLeft.style.visibility = "hidden";
            }
            localStorage.setItem("volume", DiceCup.sfxVolume.toString());
        });
        if (DiceCup.sfxVolume == 100) {
            switchButtonRight.style.visibility = "hidden";
        }
        else if (DiceCup.sfxVolume == 0) {
            switchButtonLeft.style.visibility = "hidden";
        }
        let languageTag = document.createElement("span");
        languageTag.id = "optionsLanguageTag_id";
        languageTag.innerHTML = DiceCup.language.menu.settings.language.title;
        document.getElementById("optionsGrid_id_2_0").appendChild(languageTag);
        let languageControlContainer = document.createElement("div");
        languageControlContainer.id = "optionsLanguageContainer_id";
        document.getElementById("optionsGrid_id_2_1").appendChild(languageControlContainer);
        let languageControlButton = document.createElement("button");
        languageControlButton.id = "optionsLanguageButton_id";
        languageControlButton.innerHTML = DiceCup.translateLanguages(DiceCup.currentLanguage) + " ▾";
        languageControlContainer.appendChild(languageControlButton);
        let languageControlMenu = document.createElement("div");
        languageControlMenu.classList.add("optionsLanguageMenu");
        languageControlButton.appendChild(languageControlMenu);
        for (let i = 0; i < Object.values(DiceCup.Languages).length; i++) {
            let languageControlButton = document.createElement("button");
            languageControlButton.classList.add("optionsLanguageMenuContent");
            languageControlButton.innerHTML = DiceCup.translateLanguages(Object.values(DiceCup.Languages)[i]);
            languageControlMenu.appendChild(languageControlButton);
            languageControlButton.addEventListener("click", () => { localStorage.setItem("language", Object.values(DiceCup.Languages)[i]), localStorage.setItem("optionsMenu", "true"), location.reload(); });
        }
        languageControlButton.addEventListener("click", () => { languageControlMenu.classList.contains("optionsShowLanguages") ? languageControlMenu.classList.remove("optionsShowLanguages") : languageControlMenu.classList.add("optionsShowLanguages"); });
    }
    DiceCup.optionsMenu = optionsMenu;
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    var ƒ = FudgeCore;
    let botSettings;
    let firstBot = 0;
    let botCount = 0;
    let chosenDifficulty = 1;
    function singleplayerMenu() {
        new DiceCup.SubMenu(DiceCup.MenuPage.singleplayer, "singleplayer", DiceCup.language.menu.singleplayer.lobby.title);
        let localCount = JSON.parse(localStorage.getItem("difficulties")) ?? [1];
        let botCounter = localCount.length ?? localCount[0];
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
        });
        let startButton = document.createElement("button");
        startButton.id = "singleplayerStartButton_id";
        startButton.classList.add("gameMenuStartButtons");
        startButton.classList.add("gameMenuButtons");
        startButton.classList.add("diceCupButtons");
        startButton.innerHTML = DiceCup.language.menu.singleplayer.lobby.start_button;
        document.getElementById("singleplayerMenuRightButtonArea_id").appendChild(startButton);
        startButton.addEventListener("click", () => {
            createGameSettings();
        });
    }
    DiceCup.singleplayerMenu = singleplayerMenu;
    function createGameSettings() {
        // let bots: number = document.querySelectorAll(".botContainer").length;
        botSettings = [];
        let ids = [];
        for (let i = 0, idCounter = 0; i < 5; i++) {
            if (document.getElementById("botName_id_" + i)) {
                ids[idCounter] = document.getElementById("botName_id_" + i).placeholder;
                idCounter++;
            }
        }
        for (let i = 0; i < ids.length; i++) {
            botSettings.push({ botName: ids[i], difficulty: DiceCup.BotDifficulty.easy });
        }
        DiceCup.gameSettings = { playerName: document.getElementById("playerName_id").placeholder, bot: botSettings };
        if (document.getElementById("playerName_id").value) {
            DiceCup.gameSettings.playerName = document.getElementById("playerName_id").value;
        }
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
        let playerNames = [DiceCup.gameSettings.playerName];
        for (let index = 0; index < DiceCup.gameSettings.bot.length; index++) {
            playerNames.push(DiceCup.gameSettings.bot[index].botName);
        }
        if (!checkPlayernames(playerNames)) {
            ƒ.Time.game.setTimer(1000, 1, () => { document.getElementById("singleplayerAlert_id").innerHTML = ""; });
        }
        else {
            DiceCup.hideMenu();
            localStorage.setItem("playernames", JSON.stringify(playerNames));
            localStorage.setItem("difficulties", JSON.stringify(botSettings.map(elem => elem.difficulty)));
            DiceCup.changeGameState(DiceCup.GameState.init);
        }
    }
    function checkPlayernames(_names) {
        let doubles = _names.filter((item, index) => _names.indexOf(item) !== index);
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
        let playernames = JSON.parse(localStorage.getItem("playernames")) ?? [DiceCup.language.menu.player];
        playerName.placeholder = playernames[0];
        playerContainer.appendChild(playerName);
        let difficultySwitchHidden = document.createElement("div");
        difficultySwitchHidden.classList.add("difficultySwitch");
        difficultySwitchHidden.style.visibility = "hidden";
        playerContainer.appendChild(difficultySwitchHidden);
    }
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
        if (firstBot > 0) {
            let botRemove = document.createElement("button");
            botRemove.id = "botRemove_id_" + botCount;
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
        botName.id = "botName_id_" + botCount;
        let localBots = botCount + 1;
        let playernames = JSON.parse(localStorage.getItem("playernames")) ?? [];
        botName.placeholder = playernames[localBots] ?? "Agent" + Math.floor((Math.random() * 99));
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
        let difficultySwitchText = document.createElement("div");
        difficultySwitchText.classList.add("switchDifficultyText");
        // difficultySwitchText.classList.add("scrollContainer");
        difficultySwitch.appendChild(difficultySwitchText);
        let difficultyText = document.createElement("span");
        // difficultyText.classList.add("scrollText");
        difficultyText.id = "switchDifficultyText_id_" + botCount;
        let difficulties = JSON.parse(localStorage.getItem("difficulties")) ?? [];
        difficultyText.innerHTML = DiceCup.BotDifficulty[parseInt(difficulties[botCount])] ?? DiceCup.BotDifficulty[chosenDifficulty];
        difficultySwitchText.appendChild(difficultyText);
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
            difficultyText.innerHTML = difficultyLanguage(DiceCup.BotDifficulty[chosenDifficulty]);
        });
        switchButtonLeft.addEventListener("click", () => {
            if (chosenDifficulty > 0) {
                chosenDifficulty--;
            }
            else {
                chosenDifficulty = 2;
            }
            difficultyText.innerHTML = difficultyLanguage(DiceCup.BotDifficulty[chosenDifficulty]);
        });
        botCount++;
        firstBot++;
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
        firstBot++;
        this.parentElement.remove();
        createBotPortrait();
    }
    function handleRemoveBot(_event) {
        firstBot--;
        botCount--;
        this.parentElement.parentElement.remove();
        createAddPortrait();
    }
    function difficultyLanguage(_difficulty) {
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
})(DiceCup || (DiceCup = {}));
var DiceCup;
(function (DiceCup) {
    async function chooseLanguage(_language) {
        let response = await fetch("Game/Script/Data/languages/" + _language + ".json");
        DiceCup.language = await response.json();
    }
    DiceCup.chooseLanguage = chooseLanguage;
    function translateLanguages(_language) {
        switch (_language) {
            case DiceCup.Languages.english:
                return DiceCup.language.menu.settings.language.english;
            case DiceCup.Languages.german:
                return DiceCup.language.menu.settings.language.german;
        }
    }
    DiceCup.translateLanguages = translateLanguages;
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
//# sourceMappingURL=Script.js.map