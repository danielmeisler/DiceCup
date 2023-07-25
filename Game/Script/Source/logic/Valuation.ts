namespace DiceCup {
    export class Valuation {
    
        // -- Variable declaration --

        // Stores the chosen scoring category
        private scoringCategory: ScoringCategory;
        // Dice of current round
        private dices: Dice[];
        // For checking if the valuation is wanted by a real player or bot (only real players valuation will be visualized with highlighting)
        private player: boolean;
    
        // Constructor to prompt a valuation for a specific category with the given dice of the current round
        constructor(_category: ScoringCategory, _dices: Dice[], _player: boolean) {
            this.dices = _dices;
            this.scoringCategory = _category;
            this.player = _player;
        }

        // Chooses the calculation type for the different categories
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

        // Calculates the number based categories where one specific dice value is wanted (fours, fives, sixes and 1,2,3)
        // Sums up all values ​​of a specific dice number
        private calculateNumber(_number: number, _number2?: number, _number3?: number): number {
            let value: number = 0;
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
        private calculateColor(_color: DiceColor): number {
            let value: number = 0;
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
        private calculateDoubles(): number {
            let value: number = 0;
            this.player && this.dices[value].transparentDice();

            for (let i = 0; i < this.dices.length-1; i++) {
                if (this.dices[i].color === this.dices[i+1].color && this.dices[i].value === this.dices[i+1].value) {
                    value += 10;
                    this.player && this.dices[i].validateDice();
                    this.player && this.dices[i + 1].validateDice();
                }
            }

            return value;
        }

        // Calculates Dice Cup
        // Sums up all 12 dice
        private calculateDiceCup(): number {
            let value: number = 0;
            this.player && this.dices[value].transparentDice();

            for (let i = 0; i < this.dices.length; i++) {
                value += this.dices[i].value;
                this.player && this.dices[i].validateDice();
            }

            return value;
        }

    }
}