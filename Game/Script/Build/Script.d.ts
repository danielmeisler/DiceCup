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
    class Dice {
        color: DiceColor;
        value: number;
        constructor(_color: DiceColor);
        roll(): number;
    }
}
declare namespace DiceCup {
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
