namespace DiceCup {
    export class Bot {
        
        public dices: Dice[];
        private usedCategories: number[] = new Array(12);
        private usedCategoryIndex: number = 0;
        difficulty: BotDifficulty;
        name: string;

        constructor(_name: string, _difficulty: BotDifficulty, _dices: Dice[]) {
            this.name = _name;
            this.difficulty = _difficulty;
            this.dices = _dices;
        }

        public chooseDifficulty(_difficulty: BotDifficulty): void {
            switch (_difficulty) {
                case BotDifficulty.easy:
                    this.botEasy();
                    break;
                case BotDifficulty.medium:
                
                    break;
                case BotDifficulty.hard:
                    
                    break;
            }
        }

        public botEasy(): void{
            console.log("EASY BOT");
            let randomCategory: number = Math.floor((Math.random() * 12) + 1);

            if (this.usedCategories.includes(randomCategory)) {
                this.botEasy();
            } else {
                this.usedCategories[this.usedCategoryIndex] = randomCategory;
                this.usedCategoryIndex++;
                console.log(this.usedCategories);
                this.botValuation(randomCategory);
            }
        }

        public botMedium(): void{
            console.log("MEDIUM BOT");
   
        }

        public botHard(): void{
            console.log("HARD BOT");

        }

        private botValuation(_category: number): void {
            new Valuation(_category, dices);
        }
    }
}