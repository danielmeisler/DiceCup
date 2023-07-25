namespace DiceCup {
    export class Bot {
        
        // -- Variable declaration --

        // Dice of current round
        public dices: Dice[];
        // Left categories for each bot to pick
        private freeCategories: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        // Counter of left categories
        private categoryCounter: number = 12;
        // Bots difficulty setting to determine how its picking its category
        private difficulty: BotDifficulty;
        // Bots given name
        private name: string;
        // Determines the bot mode if the bot can pick the same category as the player in the same round
        private mode: number;

        // Sets the variables inside the constructor
        constructor(_name: string, _difficulty: BotDifficulty, _dices: Dice[], _mode: number) {
            this.name = _name;
            this.dices = _dices;
            this.difficulty = _difficulty;
            this.mode = _mode;
        }

        // Validates every category and sends these values into the Probabilities Class where a table sorted from best to worst category for each round is calculated
        // The returned table will be given into the difficulty selection where the chosen difficulty has its impact on
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

        // The chosen bot difficulty determines how the bot chooses from the sorted table with all categories
        // The table gets every round shorter because the used categories will be removed
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

        // The easy bot picks a random category
        private botEasy(_categories: ProbabilitiesDao[]): number{
            let cat: number = _categories[(Math.floor((Math.random() * this.categoryCounter)))].category;
            if (this.mode == 1) {
                while (cat == lastPickedCategory && roundCounter < 12) {
                    cat = _categories[(Math.floor((Math.random() * this.categoryCounter)))].category;
                }
            }
            return cat;
        }

        // The medium bot picks a random category from the better half of the table
        private botMedium(_categories: ProbabilitiesDao[]): number{
            let cat: number = _categories[Math.floor((Math.random() * this.categoryCounter) / 2)].category;
            if (this.mode == 1) {
                while (cat == lastPickedCategory && roundCounter < 12) {
                    cat = _categories[Math.floor((Math.random() * this.categoryCounter) / 2)].category;
                }
            }
            return cat;
        }

        // The hard bot picks a random category from the better quarter of the table
        private botHard(_categories: ProbabilitiesDao[]): number {
            let cat: number = _categories[Math.floor((Math.random() * this.categoryCounter) / 4)].category;
            if (this.mode == 1) {
                while (cat == lastPickedCategory && roundCounter < 12) {
                    cat = _categories[Math.floor((Math.random() * this.categoryCounter) / 4)].category;
                }
            }
            return cat;
        }

        // Validates the picked category and updates the summary table
        private botValuation(_category: number): void {
            let valuation: Valuation = new Valuation(_category, dices, false);
            let value: number = valuation.chooseScoringCategory();
            updateSummary(value, _category, this.name);
        }

    }
}