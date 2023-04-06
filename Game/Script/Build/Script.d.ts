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
    let firstRound: boolean;
    let highscore: number;
    let roundCounter: number;
}
declare namespace DiceCup {
    class Bot {
        dices: Dice[];
        private usedCategories;
        difficulty: BotDifficulty;
        name: string;
        constructor(_name: string, _difficulty: BotDifficulty, _dices: Dice[]);
        chooseDifficulty(): void;
        botEasy(): void;
        botMedium(): void;
        botHard(): void;
        botValuation(_category: number): void;
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
    let gameSettings: SinglePlayerSettingsDao;
    function changeGameState(_gameState: GameState): void;
    function initViewport(): Promise<void>;
    function initGame(): void;
    function rollDices(): void;
    function gameValidate(): void;
    function update(_event: Event): void;
}
declare namespace DiceCup {
    class Valuation {
        scoringCategory: ScoringCategory;
        dices: Dice[];
        constructor(_category: ScoringCategory, _dices: Dice[]);
        chooseScoringCategory(): number;
        calculateNumber(_number: number, _number2?: number, _number3?: number): number;
        calculateColor(_color: DiceColor): number;
        calculateDoubles(): number;
        calculateDiceCup(): number;
    }
}
declare namespace DiceCup {
    function initCategories(): Promise<void>;
    function showCategories(): void;
    function hideCategories(): void;
}
declare namespace DiceCup {
    function initHud(): Promise<void>;
    function showHud(): void;
    function hideHudCategory(_id: number): void;
}
declare namespace DiceCup {
    function initPlacements(): void;
    function updatePlacements(): void;
    function showPlacements(): void;
    function hidePlacements(): void;
}
declare namespace DiceCup {
    function initSummary(): Promise<void>;
    function updateSummary(_points: number, _category: number, _name: string): void;
    function showSummary(): void;
    function hideSummary(): void;
}
declare namespace DiceCup {
    function initTransition(): void;
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
    enum GameState {
        menu = 0,
        init = 1,
        ready = 2,
        counting = 3,
        choosing = 4,
        validating = 5,
        summary = 6,
        placement = 7
    }
}
declare namespace DiceCup {
    enum MenuPages {
        main = "mainMenu_id",
        singleplayer = "singleplayerMenu_id",
        multiplayer = "multiplayerMenu_id",
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
    function initMenu(): void;
    function switchMenu(_toMenuID: MenuPages): void;
    function hideMenu(): void;
}
declare namespace DiceCup {
    function mainMenu(): void;
}
declare namespace DiceCup {
    function multiplayerMenu(): void;
}
declare namespace DiceCup {
    function optionsMenu(): void;
}
declare namespace DiceCup {
    function singleplayerMenu(): void;
}
declare namespace DiceCup {
    interface BotDao {
        botName: string;
        difficulty: BotDifficulty;
    }
}
declare namespace DiceCup {
    interface ScoringCategoryDao {
        image: string;
        category: ScoringCategory;
    }
}
declare namespace DiceCup {
    interface SinglePlayerSettingsDao {
        playerName: string;
        bot: BotDao[];
    }
}
