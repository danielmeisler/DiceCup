namespace DiceCup {
    import ƒ = FudgeCore;
    export class Bot {
        
        public dices: Dice[];
        private freeCategories: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        private categoryCounter: number = 12;
        difficulty: BotDifficulty;
        name: string;

        constructor(_name: string, _difficulty: BotDifficulty, _dices: Dice[]) {
            this.name = _name;
            this.difficulty = _difficulty;
            this.dices = _dices;
        }

        public chooseDifficulty(): void {
            switch (this.difficulty) {
                case BotDifficulty.easy:
                    this.botEasy();
                    break;
                case BotDifficulty.medium:
                    this.botMedium();
                    break;
                case BotDifficulty.hard:
                    this.botHard();
                    break;
            }
        }

        public botEasy(): void{
            console.log("EASY BOT");
            let randomCategory: number = this.freeCategories[(Math.floor((Math.random() * this.categoryCounter)))];
            let tempArray: number[] = this.freeCategories.filter((element) => element !== randomCategory);
            this.freeCategories = tempArray;
            this.botValuation(randomCategory);
            this.categoryCounter--;
        }

        public botMedium(): void{
            console.log("MEDIUM BOT");


            //LOGIC
            let values: number[] = [];
            for (let i = 0; i < this.freeCategories.length; i++) {
                let valuation: Valuation = new Valuation(this.freeCategories[i], dices);
                values[i] = valuation.chooseScoringCategory();
            }

            console.log(values);
            this.checkProbabilities(values);
            // this.botValuation(randomCategory);
            // let tempArray: number[] = this.freeCategories.filter((element) => element !== randomCategory);
            // this.freeCategories = tempArray;
            this.categoryCounter--;
        }

        public botHard(): void{
            console.log("HARD BOT");

        }

        private botValuation(_category: number): void {
            let valuation: Valuation = new Valuation(_category, dices);
            let value: number = valuation.chooseScoringCategory();
            ƒ.Time.game.setTimer(2000, 1, () => { updateSummary(value, _category, this.name)});
        }

        private checkProbabilities(_values: number[]): void {
            let sum: number[] = [];
            let results: number[] = [];
            let probabilities: number[] = [];
            let sumProb: number[][] = [];
            let values: number[][] = [];
            let positive: number[][] = [];
            let negative: number[][] = [];
            let combined: number[][] = [];

            let tempSum: number[] = this.chooseCategoryProbabilities();

            sum = tempSum.filter(function(elem, index, self) {return index === self.indexOf(elem)});
            tempSum.forEach(function (x) { results[x] = (results[x] || 0) + 1; });
            results = results.filter(Number);

            for (let i = 0; i < sum.length; i++) {
                probabilities[i] = (results[i] * 100) / tempSum.length;
                probabilities[i] = (Number)(probabilities[i].toFixed(2));
                if (i < (sum.length / 2) - 1) {
                    sumProb[i] = [sum[i], -probabilities[i]];
                } else {
                    sumProb[i] = [sum[i], probabilities[i]];
                }
            }

            for (let j = 3; j <= 8; j++) {
                for (let i = 0; i < sumProb.length; i++) {
                    if (sumProb[i][0] == _values[j]) {
                        values.push([_values[j], sumProb[i][1]]);
                    }
                }
            }

            for (let i = 0; i < values.length; i++) {
                positive[i] = [];
                negative[i] = [];
                if (values[i][1] > 0) {
                    positive[i].push(values[i][0], values[i][1]);
                } else {
                    negative[i].push(values[i][0], values[i][1]);
                }
            }
            
            positive = positive.filter(function(x) {return (x.join('').length !== 0)});
            negative = negative.filter(function(x) {return (x.join('').length !== 0)});
            positive.sort((a, b) => { return a[1] - b[1]});
            negative.sort((a, b) => { return a[1] - b[1]});
            combined = positive.concat(negative);
            console.log(combined);
        }

        private chooseCategoryProbabilities(): number[] {
            let dices: number[] = [1, 2, 3, 4, 5, 6];
            let sum: number[] = [];

            
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                        sum.push(dices[i] + dices[j]);
                }
            }

            // for (let i = 0; i < 6; i++) {
            //     for (let j = 0; j < 6; j++) {
            //         for (let k = 0; k < 6; k++) {
            //             sum.push(dices[i] + dices[j] + dices[k]);
            //         }
            //     }
            // }

            return sum;
        }
    }
}