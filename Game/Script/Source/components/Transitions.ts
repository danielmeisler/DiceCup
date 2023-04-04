namespace DiceCup {
    import ƒ = FudgeCore;
    let firstPhrase: string[] = ["G", "a", "m", "e", "&nbsp", "S", "t", "a", "r", "t", "s"];
    let countDown: string[] = ["&nbsp3", "&nbsp2", "&nbsp1", "&nbspGO!"];
    let transitionCounter: number = -1;

    export function initTransition(): void {
        let container: HTMLDivElement = document.createElement("div");
        container.classList.add("startTransitionContainer");
        container.id = "startTransitionContainer";
        document.querySelector("body").appendChild(container);

        transition();
    }

    function transition(): void {
        if (transitionCounter == -1) {
            for (let i = 0; i < firstPhrase.length; i++) {
                let text: HTMLSpanElement = document.createElement("span");
                text.id = "startTransitionText_id_" + i;
                text.style.setProperty("--i", i.toString())
                text.innerHTML = firstPhrase[i];
                document.getElementById("startTransitionContainer").appendChild(text);
            }
            transitionCounter++;
            ƒ.Time.game.setTimer(3000, 1, () => { transition() });
        } else {
            let id: number = firstPhrase.length + transitionCounter;
            if (transitionCounter == 0) {
                for (let i = 0; i < firstPhrase.length; i++) {
                    document.getElementById("startTransitionText_id_" + i).remove();
                }
            } else {
                let lastId: number = id - 1;
                document.getElementById("startTransitionText_id_" + lastId).innerHTML = "";
            }
            let text: HTMLSpanElement = document.createElement("span");
            text.id = "startTransitionText_id_" + id;
            text.style.setProperty("--i", transitionCounter.toString())
            text.innerHTML = countDown[transitionCounter];
            document.getElementById("startTransitionContainer").appendChild(text);
            transitionCounter++;
            if (transitionCounter == countDown.length + 1) {
                document.getElementById("startTransitionContainer").remove();
                changeGameState(GameState.counting);
            } else {
                ƒ.Time.game.setTimer(1000, 1, () => { transition() });
            }
            
        }
    }
}