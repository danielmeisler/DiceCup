namespace DiceCup {
    import ƒ = FudgeCore;
    let counter: number = 0;
    let shortTime: number = 1000;
    // let longTime: number = 2000;

    export function startTransition(): void {
        let container: HTMLDivElement = document.createElement("div");
        container.classList.add("startTransitionContainer");
        container.id = "startTransitionContainer";
        document.getElementById("DiceCup").appendChild(container);

        let phrase: string[] = [language.game.transition.phrase_1 + roundCounter, language.game.transition.phrase_2, language.game.transition.phrase_3];
        transition(phrase);
    }

    function transition(_phrase: string[]): void {
        if (document.getElementById("startTransitionText_id")) {
            document.getElementById("startTransitionText_id").remove();
        }

        let text: HTMLSpanElement = document.createElement("span");
        text.id = "startTransitionText_id";
        document.getElementById("startTransitionContainer").appendChild(text);

        if (counter < _phrase.length) {
            text.innerHTML = _phrase[counter];
            counter++;
            ƒ.Time.game.setTimer(shortTime, 1, () => { transition(_phrase) });
            playSFX("Audio|2023-05-17T13:53:32.977Z|22534");
        } else {
            playSFX("Audio|2023-05-17T13:53:59.644Z|31971");
            counter = 0;
            document.getElementById("startTransitionContainer").remove();
            changeGameState(GameState.counting);
        }
    }
}