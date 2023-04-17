namespace DiceCup {
    import ƒ = FudgeCore;
    export class Bot {
        
        public dices: Dice[];
        private usedCategories: number[] = [];
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
            let randomCategory: number = Math.floor((Math.random() * 12));

            if (this.usedCategories.includes(randomCategory)) {
                this.botEasy();
            } else {
                this.usedCategories.push(randomCategory);
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

        public botValuation(_category: number): void {
            let valuation: Valuation = new Valuation(_category, dices);
            let value: number = valuation.chooseScoringCategory();
            ƒ.Time.game.setTimer(2000, 1, () => { updateSummary(value, _category, this.name)});
        }

    }
}