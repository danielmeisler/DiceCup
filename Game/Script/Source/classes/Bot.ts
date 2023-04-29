namespace DiceCup {
    import ƒ = FudgeCore;
    export class Bot {
        
        public dices: Dice[];
        private freeCategories: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        private categoryCounter: number = 12;
        private difficulty: BotDifficulty;
        private name: string;

        constructor(_name: string, _difficulty: BotDifficulty, _dices: Dice[]) {
            this.name = _name;
            this.dices = _dices;
            this.difficulty = _difficulty;
        }

        public botsTurn(): void {
            let pickedCategory: number = 0;
            let values: number[] = [];
            for (let i = 0; i < this.freeCategories.length; i++) {
                let valuation: Valuation = new Valuation(this.freeCategories[i], dices);
                values[i] = valuation.chooseScoringCategory();
            }
            let prob = new Probabilities(dices, values, this.freeCategories);
            let allProb: ProbabilitiesDao[] = prob.fillProbabilities();
            pickedCategory = this.chooseDifficulty(allProb);
            this.botValuation(pickedCategory);
            let tempArray: number[] = this.freeCategories.filter((element) => element !== pickedCategory);
            this.freeCategories = tempArray;
            this.categoryCounter--;
            console.log(this.freeCategories);
        }

        private chooseDifficulty(_categories: ProbabilitiesDao[]): number {
            let pickedCategory: number = 0;
            switch (this.difficulty) {
                case BotDifficulty.easy:
                    pickedCategory = this.botEasy(_categories);
                    break;
                case BotDifficulty.normal:
                    pickedCategory = this.botMedium(_categories);
                    break;
                case BotDifficulty.hard:
                    pickedCategory = this.botHard(_categories);
                    break;
            }
            return pickedCategory;
        }

        private botEasy(_categories: ProbabilitiesDao[]): number{
            return (_categories[(Math.floor((Math.random() * this.categoryCounter)))].category);
        }

        private botMedium(_categories: ProbabilitiesDao[]): number{
            return (_categories[Math.floor((Math.random() * this.categoryCounter) / 2)].category);
        }

        private botHard(_categories: ProbabilitiesDao[]): number{
            return (_categories[Math.floor((Math.random() * this.categoryCounter) / 4)].category);
        }

        private botValuation(_category: number): void {
            let valuation: Valuation = new Valuation(_category, dices);
            let value: number = valuation.chooseScoringCategory();
            ƒ.Time.game.setTimer(2000, 1, () => { updateSummary(value, _category, this.name)});
        }

    }
}