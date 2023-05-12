namespace DiceCup {

    export let language: LanguageDao;

    export async function chooseLanguage(_language: Languages): Promise<void> {
        let response: Response = await fetch("Game/Script/Data/languages/" + _language +".json");
        language = await response.json();
    }

    export function translateLanguages(_language: Languages): string {
        switch (_language) {
            case Languages.english:
                return language.menu.settings.language.english;
            case Languages.german:
                return language.menu.settings.language.german;
        }
    }
}