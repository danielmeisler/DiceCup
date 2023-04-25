namespace DiceCup {
    export class Probabilities {

        private values: number[] = [];
        private dices: Dice[];
        private allProbs: ProbabilitiesDao[] = [];

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
                    this.allProbs[cat].points = this.values[cat];
                    this.allProbs[cat].probability = Math.round((((1/6) ** results[diceValues_456]) * 100) * 100) / 100;
                }
            }
        }

        private colorProbabilities(): void {

            // for (let cat = ScoringCategory.white; cat <= ScoringCategory.yellow; cat++) {
            //     this.allProbs[cat].points = this.values[cat];
            //     this.allProbs[cat].probability = Math.round((this.sumProbabilities(12, this.values[cat]) * 100) * 100) / 100;
            // }

            let dices: number[] = [1, 2, 3, 4, 5, 6];
            let sum: number[] = [];
            let nonFilteredSum: number[] = [];
            let results: number[] = [];
            let probabilities: number[] = [];

            for (let i = 0; i < dices.length; i++) {
                for (let j = 0; j < dices.length; j++) {
                    nonFilteredSum.push(dices[i] + dices[j]);
                }
            }

            sum = nonFilteredSum.filter(function(elem, index, self) {return index === self.indexOf(elem)});
            nonFilteredSum.forEach(function (x) { results[x] = (results[x] || 0) + 1; });
            results = results.filter(Number);

            for (let i = 0; i < sum.length; i++) {
                probabilities[i] = (results[i] * 100) / nonFilteredSum.length;
                probabilities[i] = Math.round(probabilities[i] * 100) / 100;
            }

            for (let cat = ScoringCategory.white; cat <= ScoringCategory.yellow; cat++) {
                for (let i = 0; i < sum.length; i++) {
                    if (sum[i] == this.values[cat]) {
                        this.allProbs[cat].points = this.values[cat];
                        this.allProbs[cat].probability = probabilities[i];
                    }
                }
            }
        }

        private doublesProbabilities(): void {
            this.allProbs[ScoringCategory.doubles].points = this.values[ScoringCategory.doubles];
            this.allProbs[ScoringCategory.doubles].probability = Math.round((((1/6) ** (this.values[ScoringCategory.doubles] / 10)) * 100) * 100) / 100;
        }

        private oneTwoThreeProbabilities(): void {
            let counter: number = 0;
            this.dices.map((value) => {
                if (value.value < 4) {
                    counter++;
                }
            })
            this.allProbs[ScoringCategory.oneToThree].probability = Math.round((((1/2) ** counter) * 100) * 100) / 100;
            this.allProbs[ScoringCategory.oneToThree].points = this.values[ScoringCategory.oneToThree];
        }

        private diceCupProbabilities(): void {
            this.allProbs[ScoringCategory.diceCup].points = this.values[ScoringCategory.diceCup];
            this.allProbs[ScoringCategory.diceCup].probability = Math.round((this.sumProbabilities(12, this.values[ScoringCategory.diceCup]) * 100) * 100) / 100;
        }
        
        private sumProbabilities(nDices: number, sum: number): number {
            let dices: number[] = [1, 2, 3, 4, 5, 6];

            if(nDices == 1){
                return dices.includes(sum) ? 1 / 6 : 0;
            }

            return dices.reduce((acc, i) => acc + this.sumProbabilities(nDices - 1, sum - i) * this.sumProbabilities(1, i), 0);
    
        }
    }
}