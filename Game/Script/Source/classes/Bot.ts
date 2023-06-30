namespace DiceCup {
    export class Bot {
        
        public dices: Dice[];
        private freeCategories: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        private categoryCounter: number = 12;
        private difficulty: BotDifficulty;
        private name: string;
        private mode: number;

        constructor(_name: string, _difficulty: BotDifficulty, _dices: Dice[], _mode: number) {
            this.name = _name;
            this.dices = _dices;
            this.difficulty = _difficulty;
            this.mode = _mode;
        }

        public async botsTurn(): Promise<void> {
            let pickedCategory: number = 0;
            let values: number[][] = [];
            for (let i = 0; i < this.freeCategories.length; i++) {
                let valuation: Valuation = new Valuation(this.freeCategories[i], dices, false);
                values[i] = [];
                values[i][0] = this.freeCategories[i];
                values[i][1] = valuation.chooseScoringCategory();
            }
            let prob = new Probabilities(dices, values, this.freeCategories);
            let allProb: ProbabilitiesDao[] = await prob.fillProbabilities();
            pickedCategory = this.chooseDifficulty(allProb);
            this.botValuation(pickedCategory);
            let tempArray: number[] = this.freeCategories.filter((element) => element !== pickedCategory);
            this.freeCategories = tempArray;
            this.categoryCounter--;
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
            let cat: number = _categories[(Math.floor((Math.random() * this.categoryCounter)))].category;
            if (this.mode == 1) {
                while (cat == lastPickedCategorie && roundCounter < 12) {
                    cat = _categories[(Math.floor((Math.random() * this.categoryCounter)))].category;
                }
            }
            return cat;
        }

        private botMedium(_categories: ProbabilitiesDao[]): number{
            let cat: number = _categories[Math.floor((Math.random() * this.categoryCounter) / 2)].category;
            if (this.mode == 1) {
                while (cat == lastPickedCategorie && roundCounter < 12) {
                    cat = _categories[Math.floor((Math.random() * this.categoryCounter) / 2)].category;
                }
            }
            return cat;
        }

        private botHard(_categories: ProbabilitiesDao[]): number {
            let cat: number = _categories[Math.floor((Math.random() * this.categoryCounter) / 4)].category;
            if (this.mode == 1) {
                while (cat == lastPickedCategorie && roundCounter < 12) {
                    cat = _categories[Math.floor((Math.random() * this.categoryCounter) / 4)].category;
                }
            }
            return cat;
        }

        private botValuation(_category: number): void {
            let valuation: Valuation = new Valuation(_category, dices, false);
            let value: number = valuation.chooseScoringCategory();
            updateSummary(value, _category, this.name);
        }

    }
}