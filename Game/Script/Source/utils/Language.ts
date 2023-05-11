namespace DiceCup {

    export let language: LanguageDao;

    export async function chooseLanguage(_language: Languages): Promise<void> {
        let response: Response = await fetch("Game/Script/Data/languages/" + _language +".json");
        language = await response.json();
    }

}