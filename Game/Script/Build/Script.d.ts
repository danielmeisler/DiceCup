declare namespace DiceCup {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace DiceCup {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let dices: Dice[];
    let highscore: number;
}
declare namespace DiceCup {
    class Bot {
        dices: Dice[];
        private usedCategories;
        private usedCategoryIndex;
        difficulty: BotDifficulty;
        name: string;
        constructor(_name: string, _difficulty: BotDifficulty, _dices: Dice[]);
        chooseDifficulty(_difficulty: BotDifficulty): void;
        botEasy(): void;
        private botValuation;
    }
}
declare namespace DiceCup {
    class Dice {
        color: DiceColor;
        value: number;
        constructor(_color: DiceColor);
        roll(): number;
    }
}
declare namespace DiceCup {
    function initViewport(): Promise<void>;
    let bot: Bot;
    let bot2: Bot;
    function initGame(): void;
}
declare namespace DiceCup {
    class Hud {
        static initHud(): Promise<void>;
    }
}
declare namespace DiceCup {
    class Valuation {
        scoringCategory: ScoringCategory;
        dices: Dice[];
        constructor(_category: ScoringCategory, _dices: Dice[]);
        chooseScoringCategory(_scoringCategory: ScoringCategory): void;
        calculateNumber(_number: number, _number2?: number, _number3?: number): number;
        calculateColor(_color: DiceColor): number;
        calculateDoubles(): number;
        calculateDiceCup(): number;
    }
}
declare namespace DiceCup {
    enum BotDifficulty {
        easy = 0,
        medium = 1,
        hard = 2
    }
}
declare namespace DiceCup {
    enum DiceColor {
        white = 0,
        black = 1,
        red = 2,
        blue = 3,
        green = 4,
        yellow = 5
    }
}
declare namespace DiceCup {
    enum MenuPages {
        main = "mainMenu_id",
        singleplayer = "singleplayerMenu_id",
        multiplayer = "multiplayerMenu_id",
        shop = "shopMenu_id",
        help = "helpMenu_id",
        options = "optionsMenu_id"
    }
}
declare namespace DiceCup {
    enum ScoringCategory {
        fours = 0,
        fives = 1,
        sixes = 2,
        white = 3,
        black = 4,
        red = 5,
        blue = 6,
        green = 7,
        yellow = 8,
        doubles = 9,
        oneToThree = 10,
        diceCup = 11
    }
}
declare namespace DiceCup {
    function gameMenu(): void;
}
declare namespace DiceCup {
    function mainMenu(): void;
    function switchMenu(_thisMenuID: MenuPages, _toMenuID: MenuPages): void;
}
declare namespace DiceCup {
    function playMenu(): void;
}
declare namespace DiceCup {
    interface ScoringCategoryDao {
        image: string;
        category: ScoringCategory;
    }
}
