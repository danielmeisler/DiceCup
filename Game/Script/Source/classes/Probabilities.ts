namespace DiceCup {
    export class Probabilities {

        private values: number[] = [];
        private freeCategories: number[] = []
        private dices: Dice[];
        private allProbs: ProbabilitiesDao[] = [];
        private diceCupProbs = new Map();

        constructor(_dices: Dice[], _values: number[], _freeCategories: number[]) {
            this.dices = _dices;
            this.values = _values;
            this.freeCategories = _freeCategories;
        }

        public fillProbabilities(): ProbabilitiesDao[] {
            for (let i = 0; i < this.freeCategories.length; i++) {
                this.allProbs.push({stringCategory: null, category: null, points: null, probability: null, value: null});
                this.allProbs[i].points = this.values[i];
                this.allProbs[i].stringCategory = ScoringCategory[this.freeCategories[i]];
                this.allProbs[i].category = this.freeCategories[i];
                this.allProbs[i].probability = this.values[i] == 0 ? null : this.chooseProbabilities(this.freeCategories[i]);
            }
            this.sortProbabilities();
            console.log(dices);
            console.log(this.allProbs);
            return this.allProbs;
        }

        private chooseProbabilities(_category: ScoringCategory): number {
            let prob: number = 0;
            switch (_category) {
                case ScoringCategory.fours:
                case ScoringCategory.fives:
                case ScoringCategory.sixes:
                    prob = this.numberProbabilities(_category);
                    break;
                case ScoringCategory.white:
                case ScoringCategory.black:
                case ScoringCategory.red:
                case ScoringCategory.blue:
                case ScoringCategory.green:
                case ScoringCategory.yellow:
                    prob = this.colorProbabilities(_category);
                    break;
                case ScoringCategory.doubles:
                    prob =  this.doublesProbabilities(_category);
                    break;
                case ScoringCategory.oneToThree:
                    prob = this.oneToThreeProbabilities(_category);
                    break;
                case ScoringCategory.diceCup:
                    prob = this.diceCupProbabilities(_category);
                    break;
            }
            return prob;
        }

        private numberProbabilities(_category: number): number {
            let diceValues: number[] = this.dices.map((element) => element.value);
            let results: number[] = [];
            diceValues.forEach(function (x) { results[x] = (results[x] || 0) + 1; });
            let power: number = results[_category + 4];
            let opposite: number = 12 - results[_category + 4];
            return ((1/6) ** power) * ((5/6) ** opposite) * this.binomial(12, power) * 100; 
        }

        private colorProbabilities(_category: number): number {
            let dice_numbers: number[] = [1, 2, 3, 4, 5, 6];
            return this.sumProbabilities(2, this.values[_category], dice_numbers) * 100;
        }

        private doublesProbabilities(_category: number): number {
            let power: number = (this.values[_category] / 10);
            let opposite: number = 6 - (this.values[_category] / 10);
            return ((1/6) ** power) * ((5/6) ** opposite) * this.binomial(6, power) * 100;
        }

        private oneToThreeProbabilities(_category: number): number {
            let dice_numbers: number[] = [1, 2, 3];   
            let power: number = 0;
            this.dices.map((value) => {
                if (value.value < 4) {
                    power++;
                }
            })
            let opposite: number = 12 - power;
            return ((1/2) ** power) * ((1/2) ** opposite) * this.binomial(12, power) * this.sumProbabilities(power, this.values[_category], dice_numbers) * 100;
        }

        private diceCupProbabilities(_category: number): number {
            let dice_numbers: number[] = [1, 2, 3, 4, 5, 6];
            return this.sumProbabilities(12, this.values[_category], dice_numbers) * 100;
        }

        private sumProbabilities(nDices: number, sum: number, dice_numbers: number[]): number{
            const calculate = (nDices: number, sum: number): number => {
              if (nDices == 1) {
                return dice_numbers.includes(sum) ? 1 / 6 : 0;
              }
                return dice_numbers.reduce((acc, i) => acc + this.sumProbabilities(nDices - 1, sum - i, dice_numbers) * this.sumProbabilities(1, i, dice_numbers), 0);
            }
            let key = JSON.stringify([nDices, sum]);

            if (!this.diceCupProbs.has(key))
            this.diceCupProbs.set(key, calculate(nDices, sum));
    
            return this.diceCupProbs.get(key);
        }

        private sortProbabilities(): void {
            this.allProbs.map(function(elem) {
                elem.value = elem.points;

                if (elem.category == ScoringCategory.fours) {
                    elem.value -= 8;
                } else if (elem.category == ScoringCategory.fives) {
                    elem.value -= 10;
                } else if (elem.category == ScoringCategory.sixes) {
                    elem.value -= 12;
                } else if (elem.category == ScoringCategory.doubles) {
                    elem.value /= 5;
                } else if (elem.category == ScoringCategory.oneToThree) {
                    elem.value -= 12;
                } else if (elem.category == ScoringCategory.diceCup) {
                    elem.value -= 42;
                } else {
                    elem.value -= 7;
                }
                
                if (elem.points == 0) {
                    elem.value = Number.NEGATIVE_INFINITY;
                }
            })
            this.allProbs.sort( function(a,b){
                if(a.value < b.value) return 1;
                if(a.value > b.value) return -1;
                if(a.value == b.value) {
                    if(a.points < b.points) return 1;
                    if(a.points > b.points) return -1;
                }
                return 0;
            });
        }

        private binomial(n: number, k: number): number {
           var coeff = 1;
           for (var x = n-k+1; x <= n; x++) coeff *= x;
           for (x = 1; x <= k; x++) coeff /= x;
           return coeff;
       }
    }
}