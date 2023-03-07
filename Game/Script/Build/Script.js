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
    ƒ.Debug.info("Dice Cup is running!");
    let viewport;
    window.addEventListener("load", start);
    //document.addEventListener("interactiveViewportStarted", <EventListener>start);
    // function start(_event: CustomEvent): void {
    let dices = [];
    DiceCup.highscore = 0;
    function start(_event) {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("../../serviceWorker.js");
        }
        //viewport = _event.detail;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        document.getElementById("play").addEventListener("click", () => {
            document.getElementById("mainMenu").style.display = "none";
            //document.getElementById("game").style.display = "none"; 
            game();
        });
    }
    function game() {
        console.clear();
        dices = [];
        if (document.getElementById("gameDiv2")) {
            document.getElementById("gameDiv2").style.visibility = "hidden";
        }
        if (!document.getElementById("gameDiv1")) {
            let gameDiv = document.createElement("div");
            gameDiv.id = "gameDiv1";
            document.getElementById("game").appendChild(gameDiv);
            for (let i = 0; i < 6; i++) {
                dices.push(new DiceCup.Dice(i));
                dices.push(new DiceCup.Dice(i));
            }
            for (let i = 0; i < 12; i++) {
                let diceDiv = document.createElement("div");
                diceDiv.classList.add("diceDiv");
                diceDiv.id = "diceContainer" + i;
                diceDiv.innerHTML = dices[i].value.toString();
                diceDiv.style.background = DiceCup.DiceColor[dices[i].color].toString();
                document.getElementById("gameDiv1").appendChild(diceDiv);
            }
            console.log("Augen auf ...");
            ƒ.Time.game.setTimer(3000, 1, gameValidate);
        }
    }
    function gameValidate() {
        document.getElementById("gameDiv1").remove();
        console.log("Becher drauf!");
        if (document.getElementById("gameDiv2")) {
            document.getElementById("gameDiv2").style.visibility = "visible";
            for (let i = 0; i < 12; i++) {
                let valuationDiv = document.getElementById("valuationContainer" + i);
                valuationDiv.addEventListener("click", () => { new DiceCup.Valuation(i, dices), game(), console.log("Total: " + DiceCup.highscore), valuationDiv.disabled = true, valuationDiv.style.backgroundColor = "black", valuationDiv.style.color = "gray"; });
            }
        }
        else {
            let gameDiv2 = document.createElement("div");
            gameDiv2.id = "gameDiv2";
            document.getElementById("game").appendChild(gameDiv2);
            for (let i = 0; i < 12; i++) {
                let valuationDiv = document.createElement("button");
                valuationDiv.classList.add("valuationDiv");
                valuationDiv.id = "valuationContainer" + i;
                valuationDiv.innerHTML = DiceCup.ScoringCategory[i];
                document.getElementById("gameDiv2").appendChild(valuationDiv);
                valuationDiv.addEventListener("click", () => { new DiceCup.Valuation(i, dices), game(), console.log("Total: " + DiceCup.highscore), valuationDiv.disabled = true, valuationDiv.style.backgroundColor = "black", valuationDiv.style.color = "gray"; });
            }
        }
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
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