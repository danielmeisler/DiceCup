namespace DiceCup {
    export class Valuation {
    
        public scoringCategory: ScoringCategory;
        public dices: Dice[];
    
        constructor(_category: ScoringCategory, _dices: Dice[]) {
            this.dices = _dices;
            this.scoringCategory = _category;
            // this.chooseScoringCategory(this.scoringCategory);
        }

        public chooseScoringCategory(): number {
            let value: number;
            switch (this.scoringCategory) {
                case ScoringCategory.fours:
                    value = this.calculateNumber(4);
                    hideHudCategory(this.scoringCategory);
                    break;
                case ScoringCategory.fives:
                    value = this.calculateNumber(5);
                    hideHudCategory(this.scoringCategory);
                    break;
                case ScoringCategory.sixes:
                    value = this.calculateNumber(6);
                    hideHudCategory(this.scoringCategory);
                    break;

                case ScoringCategory.white:
                    value = this.calculateColor(DiceColor.white);
                    hideHudCategory(this.scoringCategory);
                    break;
                case ScoringCategory.black:
                    value = this.calculateColor(DiceColor.black);
                    hideHudCategory(this.scoringCategory);
                    break;  
                case ScoringCategory.red:
                    value = this.calculateColor(DiceColor.red);
                    hideHudCategory(this.scoringCategory);
                    break;
                case ScoringCategory.blue:
                    value = this.calculateColor(DiceColor.blue);
                    hideHudCategory(this.scoringCategory);
                    break;
                case ScoringCategory.green:
                    value = this.calculateColor(DiceColor.green);
                    hideHudCategory(this.scoringCategory);
                    break;
                case ScoringCategory.yellow:
                    value = this.calculateColor(DiceColor.yellow);
                    hideHudCategory(this.scoringCategory);
                    break;

                case ScoringCategory.doubles:
                    value = this.calculateDoubles();
                    hideHudCategory(this.scoringCategory);
                    break;
                case ScoringCategory.oneToThree:
                    value = this.calculateNumber(1, 2, 3);
                    hideHudCategory(this.scoringCategory);
                    break;
                case ScoringCategory.diceCup:
                    value = this.calculateDiceCup();
                    hideHudCategory(this.scoringCategory);
                    break;
            }
            return value;
        }


        public calculateNumber(_number: number, _number2?: number, _number3?: number): number {
            let value: number = 0;

            for (let i = 0; i < this.dices.length; i++) {
                if (this.dices[i].value === _number || this.dices[i].value === _number2 || this.dices[i].value === _number3) {
                    value += this.dices[i].value;
                    document.getElementById("diceContainer_id_" + i).style.border = "1vh ridge gold";
                }
            }

            if (_number2 && _number3){ 
                console.log(_number + "" + _number2 + "" + _number3 + ": " + value);
            } else {
                console.log(_number + ": " + value);
            }

            highscore += value;
            return value;
        }

        public calculateColor(_color: DiceColor): number {
            let value: number = 0;

            for (let i = 0; i < this.dices.length; i++) {
                if (this.dices[i].color === _color) {
                    value += this.dices[i].value;
                    document.getElementById("diceContainer_id_" + i).style.border = "1vh ridge gold";
                }
            }

            highscore += value;
            console.log(DiceColor[_color] + " color: " + value);
            return value;
        }
        
        public calculateDoubles(): number {
            let value: number = 0;

            for (let i = 0; i < this.dices.length-1; i++) {
                if (this.dices[i].color === this.dices[i+1].color && this.dices[i].value === this.dices[i+1].value) {
                    value += 10;
                    
                    let double: number = i + 1;
                    document.getElementById("diceContainer_id_" + i).style.border = "1vh ridge gold";
                    document.getElementById("diceContainer_id_" + double).style.border = "1vh ridge gold";
                }
            }

            highscore += value;
            console.log("Doubles: " + value);
            return value;
        }

        public calculateDiceCup(): number {
            let value: number = 0;

            for (let i = 0; i < this.dices.length; i++) {
                value += this.dices[i].value;
                document.getElementById("diceContainer_id_" + i).style.border = "1vh ridge gold";
            }

            highscore += value;
            console.log("DiceCup: " + value);
            return value;
        }

    }
}