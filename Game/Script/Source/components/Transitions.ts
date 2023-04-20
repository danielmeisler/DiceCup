namespace DiceCup {
    import ƒ = FudgeCore;
    let counter: number = 0;
    let shortTime: number = 1000;
    let longTime: number = 2000;

    export function startTransition(): void {
        let container: HTMLDivElement = document.createElement("div");
        container.classList.add("startTransitionContainer");
        container.id = "startTransitionContainer";
        document.getElementById("DiceCup").appendChild(container);

        let phrase: string[] = ["Round " + roundCounter, "3", "2", "1", "GO!"];
        transition(phrase);
    }

    function transition(_phrase: string[]): void {
        if (document.getElementById("startTransitionText_id_0")) {
            while (document.getElementById("startTransitionContainer").firstChild) {
                document.getElementById("startTransitionContainer").removeChild(document.getElementById("startTransitionContainer").lastChild);
              }
        }

        if (counter < _phrase.length) {
                for (let i = 0; i < _phrase[counter].length; i++) {
                    let text: HTMLSpanElement = document.createElement("span");
                    text.id = "startTransitionText_id_" + i;
                    text.animate(
                        [
                            { transform: "translateY(0)", offset: 0},
                            { transform: "translateY(-20px)", offset: 0.2},
                            { transform: "translateY(0)", offset: 0.4},
                            { transform: "translateY(0)", offset: 1},
                        ],{
                            duration: 1000, 
                            iterations: Infinity, 
                            delay: 100 * i
                        }
                    );
                    if (_phrase[counter][i] == " ") {
                        text.innerHTML = "&nbsp";
                    } else {
                        text.innerHTML = _phrase[counter][i];
                    }
                    document.getElementById("startTransitionContainer").appendChild(text);
                }
                counter++;
                if (_phrase[counter - 1].length <= 3) {
                    ƒ.Time.game.setTimer(shortTime, 1, () => { transition(_phrase) });
                } else {
                    ƒ.Time.game.setTimer(longTime, 1, () => { transition(_phrase) });
                }

        } else {
            counter = 0;
            roundCounter++;
            document.getElementById("startTransitionContainer").remove();
            changeGameState(GameState.counting);
        }
    }
}