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
            this.checkProbabilities();
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

        private checkProbabilities(): void {
            let dices: number[] = [1, 2, 3, 4, 5, 6];
            let sum: number[] = [];
            let probabilities: number[] = [];

            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                    sum.push(dices[i] + dices[j]);
                }
            }

            
        }

    }
}