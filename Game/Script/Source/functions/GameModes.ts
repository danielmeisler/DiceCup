namespace DiceCup{

    export function getGameModeTranslation(_gamemode: number): string {
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