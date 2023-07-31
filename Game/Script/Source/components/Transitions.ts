namespace DiceCup {
    import ƒ = FudgeCore;

    // -- Variable declaration --

    // A counter to determine if all transition phrases are finished or not
    let counter: number = 0;
    // The time for each phrase shown in the transition. Longer phrases get more time
    let shortTime: number = 1000;
    // let longTime: number = 2000;
    // The span element where the phrases are shown 
    let text: HTMLSpanElement;

    // Starts the transition in which the container gets created and the transition starts
    export function startTransition(): void {
        let container: HTMLDivElement = document.createElement("div");
        container.classList.add("startTransitionContainer");
        container.id = "startTransitionContainer";
        document.getElementById("DiceCup").appendChild(container);

        text = document.createElement("span");
        text.id = "startTransitionText_id";
        document.getElementById("startTransitionContainer").appendChild(text);

        let phrase: string[] = [language.game.transition.phrase_1 + roundCounter, language.game.transition.phrase_2, language.game.transition.phrase_3];
        transition(phrase);
    }

    // Recursive function until it finished all given phrases for the transition
    // Resets the counter, removes the container and changes the gamestate in the last loop
    function transition(_phrase: string[]): void {
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