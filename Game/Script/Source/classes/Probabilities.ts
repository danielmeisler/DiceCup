namespace DiceCup {
    export class Probabilities {

        private values: number[] = [];
        private dices: Dice[];
        private allProbs: ProbabilitiesDao[] = [];
        private diceCupProbs = new Map();

        constructor(_dices: Dice[], _values: number[]) {
            this.dices = _dices;
            this.values = _values;
            this.fillProbabilities();
        }

        public fillProbabilities(): void {
            for (let i = 0; i < Object.keys(ScoringCategory).length / 2; i++) {
                this.allProbs.push({category: "", points: 0, probability: 0});
                this.allProbs[i].category = ScoringCategory[i];
            }
            this.numberProbabilities();
            this.colorProbabilities();
            this.doublesProbabilities();
            this.oneTwoThreeProbabilities();
            this.diceCupProbabilities();

            console.log(this.allProbs);
        }

        private numberProbabilities(): void {
            let diceValues: number[] = this.dices.map((element) => element.value);
            let results: number[] = [];
            diceValues.forEach(function (x) { results[x] = (results[x] || 0) + 1; });

            for (let cat = ScoringCategory.fours, diceValues_456 = 4; cat <= ScoringCategory.sixes; cat++, diceValues_456++) {
                if (results[diceValues_456]) {
                    let power: number = results[diceValues_456];
                    let opposite: number = 12 - results[diceValues_456];
                    this.allProbs[cat].probability = (((1/6) ** power) * ((5/6) ** opposite)) * 100;
                    this.allProbs[cat].points = this.values[cat];
                }
            }
        }

        private colorProbabilities(): void {
            for (let cat = ScoringCategory.white; cat <= ScoringCategory.yellow; cat++) {
                this.allProbs[cat].points = this.values[cat];
                this.allProbs[cat].probability = this.sumProbabilities(2, this.values[cat]) * 100;
            }
        }

        private doublesProbabilities(): void {
            let power: number = (this.values[ScoringCategory.doubles] / 10);
            let opposite: number = 6 - (this.values[ScoringCategory.doubles] / 10);
            this.allProbs[ScoringCategory.doubles].probability = (((1/6) ** power) * ((5/6) ** opposite)) * 100;
            this.allProbs[ScoringCategory.doubles].points = this.values[ScoringCategory.doubles];
        }

        private oneTwoThreeProbabilities(): void {
            let counter: number = 0;
            this.dices.map((value) => {
                if (value.value < 4) {
                    counter++;
                }
            })
            this.allProbs[ScoringCategory.oneToThree].probability = ((1/2) ** counter) * 100;
            this.allProbs[ScoringCategory.oneToThree].points = this.values[ScoringCategory.oneToThree];
        }

        private diceCupProbabilities(): void {
            this.allProbs[ScoringCategory.diceCup].points = this.values[ScoringCategory.diceCup];
            this.allProbs[ScoringCategory.diceCup].probability = this.sumProbabilities(10, this.values[ScoringCategory.diceCup]) * 100;
        }

        private sumProbabilities(nDices: number, sum: number): number{
            let dice_numbers: number[] = [1,2,3,4,5,6];
          
            const calculate = (nDices: number, sum: number): number => {
              if (nDices == 1) {
                return dice_numbers.includes(sum) ? 1 / 6 : 0;
              }
                return dice_numbers.reduce((acc, i) => acc + this.sumProbabilities(nDices - 1, sum - i) * this.sumProbabilities(1, i), 0);
            }
            let key = JSON.stringify([nDices, sum]);

            if (!this.diceCupProbs.has(key))
            this.diceCupProbs.set(key, calculate(nDices, sum));
    
            return this.diceCupProbs.get(key);
        }
    }
}