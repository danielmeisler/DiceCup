namespace DiceCup {
    export class Bot {
    
        difficulty: BotDifficulty;
        public dices: Dice[];

        constructor(_difficulty: BotDifficulty, _dices: Dice[]) {
            this.difficulty = _difficulty;
            this.dices = _dices;
            this.chooseDifficulty(this.difficulty);
        }

        public chooseDifficulty(_difficulty: BotDifficulty): void {
            switch (_difficulty) {
                case BotDifficulty.easy:
                    let randomCategory: number = Math.floor((Math.random() * 12) + 1);
                    new Valuation(randomCategory, dices);
                    break;
                case BotDifficulty.medium:
                
                    break;
                case BotDifficulty.hard:
                    
                    break;
            }
        }
    }
}