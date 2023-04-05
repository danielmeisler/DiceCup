namespace DiceCup {
    export class Valuation {
    
        public scoringCategory: ScoringCategory;
        public dices: Dice[];
    
        constructor(_category: ScoringCategory, _dices: Dice[]) {
            this.dices = _dices;
            this.scoringCategory = _category;
        }

        public chooseScoringCategory(): number {
            let value: number;
            switch (this.scoringCategory) {
                case ScoringCategory.fours:
                    value = this.calculateNumber(4);
                    break;
                case ScoringCategory.fives:
                    value = this.calculateNumber(5);
                    break;
                case ScoringCategory.sixes:
                    value = this.calculateNumber(6);
                    break;

                case ScoringCategory.white:
                    value = this.calculateColor(DiceColor.white);
                    break;
                case ScoringCategory.black:
                    value = this.calculateColor(DiceColor.black);
                    break;  
                case ScoringCategory.red:
                    value = this.calculateColor(DiceColor.red);
                    break;
                case ScoringCategory.blue:
                    value = this.calculateColor(DiceColor.blue);
                    break;
                case ScoringCategory.green:
                    value = this.calculateColor(DiceColor.green);
                    break;
                case ScoringCategory.yellow:
                    value = this.calculateColor(DiceColor.yellow);
                    break;

                case ScoringCategory.doubles:
                    value = this.calculateDoubles();
                    break;
                case ScoringCategory.oneToThree:
                    value = this.calculateNumber(1, 2, 3);
                    break;
                case ScoringCategory.diceCup:
                    value = this.calculateDiceCup();
                    break;
            }
            return value;
        }


        public calculateNumber(_number: number, _number2?: number, _number3?: number): number {
            let value: number = 0;

            for (let i = 0; i < this.dices.length; i++) {
                if (this.dices[i].value === _number || this.dices[i].value === _number2 || this.dices[i].value === _number3) {
                    value += this.dices[i].value;
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
            }

            highscore += value;
            console.log("DiceCup: " + value);
            return value;
        }

    }
}