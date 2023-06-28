/// <reference path="../../../Library/Net/Build/Client/FudgeClient.d.ts" />
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
    let viewportState: ViewportState;
    let currentLanguage: Languages;
    let playerMode: PlayerMode;
    let inGame: boolean;
    let helpCategoryHud: boolean;
    let categoriesLength: number;
    let dicesLength: number;
}
declare namespace DiceCup {
    class Bot {
        dices: Dice[];
        private freeCategories;
        private categoryCounter;
        private difficulty;
        private name;
        constructor(_name: string, _difficulty: BotDifficulty, _dices: Dice[]);
        botsTurn(): void;
        private chooseDifficulty;
        private botEasy;
        private botMedium;
        private botHard;
        private botValuation;
    }
}
declare namespace DiceCup {
    class Dice {
        private graph;
        private diceNode;
        private diceGraph;
        private diceInst;
        private diceMat;
        private diceRig;
        private dots;
        private dotsMat;
        private sendDice;
        private getDice;
        private arenaTranslation;
        private arenaRotation;
        private bigDice;
        private smallDice;
        color: DiceColor;
        value: number;
        constructor(_colorRGBA: RgbaDao, _color: DiceColor, _rollDiceMode?: number, _hostDice?: FudgeNet.Message);
        roll(): number;
        private initDice;
        private sendDiceToServer;
        validateDices(): Promise<void>;
        transparentDices(): void;
        private rollDices;
        private translateDice;
        private rotateDice;
        private scaleDices;
        private colorDices;
        private convertDiceColor;
        private handleDiceCollision;
        private clearUsedArrays;
    }
}
declare namespace DiceCup {
    class Probabilities {
        private values;
        private freeCategories;
        private dices;
        private allProbs;
        private diceCupProbs;
        constructor(_dices: Dice[], _values: number[][], _freeCategories: number[]);
        fillProbabilities(): ProbabilitiesDao[];
        private chooseProbabilities;
        private numberProbabilities;
        private colorProbabilities;
        private doublesProbabilities;
        private oneToThreeProbabilities;
        private diceCupProbabilities;
        private sumProbabilities;
        private sortProbabilities;
        private balanceCategories;
        private binomial;
    }
}
declare namespace DiceCup {
    class SubMenu {
        private menu;
        private id;
        private title;
        constructor(_menu: MenuPage, _id: string, _title: string);
        createSubMenu(): void;
    }
}
declare namespace DiceCup {
    class TimerBar {
        private time;
        private percentage;
        private id;
        constructor(_id: string, _time: number);
        resetTimer(): void;
        private getTimerPercentage;
    }
}
declare namespace DiceCup {
    class Valuation {
        private scoringCategory;
        private dices;
        private player;
        constructor(_category: ScoringCategory, _dices: Dice[], _player: boolean);
        chooseScoringCategory(): number;
        private calculateNumber;
        private calculateColor;
        private calculateDoubles;
        private calculateDiceCup;
    }
}
declare namespace DiceCup {
    let freePlayerCategories: number[];
    function initCategories(): Promise<void>;
    function showCategories(): Promise<void>;
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
    let playerNames: string[];
    let lastPoints: string[];
    function initSummary(): Promise<void>;
    function handleSummary(_value: number, _index: number): void;
    function updateSummary(_points: number, _category: number, _name: string): void;
    function showSummary(): void;
    function hideSummary(): void;
}
declare namespace DiceCup {
    function startTransition(): void;
}
declare namespace DiceCup {
    function validateRound(): void;
    function waitForPlayerValidation(): void;
}
declare namespace DiceCup {
    enum BotDifficulty {
        easy = 0,
        normal = 1,
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
    enum Languages {
        english = "english",
        german = "german"
    }
}
declare namespace DiceCup {
    enum MenuPage {
        main = "mainMenu_id",
        singleplayer = "singleplayerMenu_id",
        singleplayerGameOptions = "singleplayerGameOptions_id",
        multiplayer = "multiplayerMenu_id",
        multiplayerLobby = "multiplayerLobby_id",
        multiplayerGameOptions = "multiplayerGameOptions_id",
        options = "optionsMenu_id",
        help = "helpMenu_id"
    }
}
declare namespace DiceCup {
    enum PlayerMode {
        singlelpayer = 0,
        multiplayer = 1
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
    enum ViewportState {
        menu = 0,
        transition = 1,
        game = 2
    }
}
declare namespace DiceCup {
    function changeFloor(_change: boolean): void;
    function activateCover(_change: boolean): void;
}
declare namespace DiceCup {
    import ƒ = FudgeCore;
    let dices: Dice[];
    let roundTimer: number;
    let roundCounter: number;
    let maxRounds: number;
    let gameSettings_sp: SinglePlayerSettingsDao;
    let gameSettings_mp: MultiPlayerSettingsDao;
    let usedTranslations: ƒ.Vector3[];
    let usedRotations: ƒ.Vector3[];
    function loadDiceColors(): Promise<RgbaDao[]>;
    function rollDices(_message?: FudgeNet.Message): Promise<void>;
    function getRolledDices(_message: FudgeNet.Message): Promise<void>;
    function round(): Promise<void>;
    function lastRound(): void;
}
declare namespace DiceCup {
    function gameOver(_return: MenuPage): void;
}
declare namespace DiceCup {
    function changeGameState(_gameState: GameState): Promise<void>;
}
declare namespace DiceCup {
    let buttonClick: string;
    function initBackgroundMusic(_track: number): Promise<void>;
    function backgroundMusic(_on: boolean): void;
    function nextTrack(_track: number): void;
    function changeVolume(_mode: number): void;
    function playSFX(_sfx: string): void;
    function muteAll(): void;
}
declare namespace DiceCup {
    function update(_event: Event): void;
}
declare namespace DiceCup {
    function changeViewportState(_viewportState: ViewportState): Promise<void>;
}
declare namespace DiceCup {
    function initMenu(): Promise<void>;
    function switchMenu(_toMenuID: MenuPage): void;
    function hideMenu(): void;
}
declare namespace DiceCup {
    function helpMenu(): void;
}
declare namespace DiceCup {
    function mainMenu(): void;
}
declare namespace DiceCup {
    let username: string;
    function multiplayerMenu(): void;
    function joinRoom(_message: FudgeNet.Message): void;
}
declare namespace DiceCup {
    let focusedIdRoom: string;
    function multiplayerServers(): void;
    function passwordInput(): void;
    function getRooms(_message: FudgeNet.Message): Promise<void>;
}
declare namespace DiceCup {
    let roomPassword: string;
    function multiplayerGameOptions(): void;
}
declare namespace DiceCup {
    let sfxVolume: number;
    let musicVolume: number;
    function optionsMenu(): void;
}
declare namespace DiceCup {
    function singleplayerMenu(): void;
}
declare namespace DiceCup {
    function singleplayerGameOptions(): void;
}
declare namespace DiceCup {
    interface BotDao {
        botName: string;
        difficulty: BotDifficulty;
    }
}
declare namespace DiceCup {
    interface LanguageDao {
        menu: {
            singleplayer: {
                lobby: {
                    title: string;
                    start_button: string;
                    difficulties: {
                        easy: string;
                        normal: string;
                        hard: string;
                    };
                };
            };
            multiplayer: {
                list: {
                    title: string;
                    create_button: string;
                    join_button: string;
                    password: string;
                };
                lobby: {
                    title: string;
                    waiting: string;
                    start_button: string;
                    ready_button: string;
                    not_ready_button: string;
                };
            };
            help: {
                title: string;
                page: string;
                page_1: {
                    title: string;
                    content: string;
                };
                page_2: {
                    title: string;
                    content: string;
                };
                page_3: {
                    title: string;
                    content: string;
                };
                page_4: {
                    title: string;
                    content: string;
                };
            };
            settings: {
                title: string;
                reset_button: string;
                volume: {
                    music: string;
                    sfx: string;
                };
                language: {
                    title: string;
                    english: string;
                    german: string;
                };
                help_category_hud: {
                    title: string;
                };
            };
            gamesettings: {
                title: string;
                password_switch: string;
                password: string;
                round_timer: string;
                round_timer_unit: string;
            };
            player: string;
            alerts: {
                invalid_tokes: string;
                invalid_length: string;
                identical_names: string;
                room_unavailable: string;
                ingame: string;
                waiting: string;
                offline: string;
                wrong_password: string;
                not_ready: string;
                min_player: string;
            };
        };
        game: {
            transition: {
                phrase_1: string;
                phrase_2: string;
                phrase_3: string;
            };
            categories: {
                title: string;
            };
            summary: {
                sum: string;
            };
            validation: {
                wait_for_validation: string;
            };
            placements: {
                title: string;
                placement: {
                    part_1: string;
                    part_2: string;
                };
            };
        };
    }
}
declare namespace DiceCup {
    interface MultiPlayerSettingsDao {
        playerNames: string[];
    }
}
declare namespace DiceCup {
    interface ProbabilitiesDao {
        name: string;
        category: ScoringCategory;
        points: number;
        probability: number;
        value: number;
    }
}
declare namespace DiceCup {
    interface RgbaDao {
        name: string;
        id: DiceColor;
        r: number;
        g: number;
        b: number;
        a: number;
    }
}
declare namespace DiceCup {
    interface ScoringCategoryDao {
        image: string;
        category: ScoringCategory;
    }
}
declare namespace DiceCup {
    import ƒ = FudgeCore;
    interface SendDiceDao {
        value: number;
        translation: ƒ.Vector3;
        rotation: ƒ.Vector3;
    }
}
declare namespace DiceCup {
    interface SinglePlayerSettingsDao {
        playerName: string;
        bot: BotDao[];
    }
}
declare namespace DiceCup {
    import ƒClient = FudgeNet.FudgeClient;
    let client: ƒClient;
    let host: boolean;
    let clientPlayerNumber: number;
    let numberOfPlayers: number;
    let currentRoom: string;
    function startClient(): Promise<void>;
    function hndEvent(_event: Event): Promise<void>;
    function clientLeavesRoom(): void;
}
declare namespace DiceCup {
    let language: LanguageDao;
    function chooseLanguage(_language: Languages): Promise<void>;
    function translateLanguages(_language: Languages): string;
}
declare namespace DiceCup {
    function enableWakeLock(): Promise<boolean>;
    function disableWakeLock(): void;
    function resetTimer(): void;
}
