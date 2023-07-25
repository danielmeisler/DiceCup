namespace DiceCup {

    // Stores the current language
    export let language: LanguageDao;

    // Switches to the chosen languages
    export async function chooseLanguage(_language: Languages): Promise<void> {
        let response: Response = await fetch("Game/Script/Data/languages/" + _language +".json");
        language = await response.json();
    }

    // Translates the langauges
    export function languageTranslation(_language: Languages): string {
        switch (_language) {
            case Languages.english:
                return language.menu.settings.language.english;
            case Languages.german:
                return language.menu.settings.language.german;
        }
    }

    // Translates the bot difficulties
    export function difficultyTranslation(_difficulty: string): string {
        let diff_lang: string;
        switch (_difficulty) {
            case BotDifficulty[BotDifficulty.easy]:
                diff_lang = language.menu.singleplayer.lobby.difficulties.easy;
                break;
            case BotDifficulty[BotDifficulty.normal]:
                diff_lang = language.menu.singleplayer.lobby.difficulties.normal;
                break;
            case BotDifficulty[BotDifficulty.hard]:
                diff_lang = language.menu.singleplayer.lobby.difficulties.hard;
                break;
            default:
                break;
        }
        return diff_lang;
    }

    // Translates the gamemodes
    export function gamemodeTranslation(_gamemode: number): string {
        switch (_gamemode) {
            case GameMode.normal:
                return language.menu.gamemodes.normal
            case GameMode.fast:
                return language.menu.gamemodes.fast
            case GameMode.slow:
                return language.menu.gamemodes.slow
            default:
                return language.menu.gamemodes.normal
        }
    }
}