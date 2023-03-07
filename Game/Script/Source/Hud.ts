namespace DiceCup {

    export class Hud {

        public static async initHud(): Promise<void> {
          let domHud: HTMLDivElement = document.querySelector("div#hud");
          let valuationContainer: HTMLDivElement = document.createElement("div");
          valuationContainer.id = "valuationContainer";
          domHud.appendChild(valuationContainer);

          for (let i: number = 0; i < 12; i++) {
            let valuationButton: HTMLButtonElement = document.createElement("button");
            valuationButton.classList.add("valuationButton");
            valuationButton.id = "valuation" + i;
            valuationContainer.appendChild(valuationButton);

            let icon: HTMLElement = document.createElement("div");
            icon.classList.add("valuationIcon");
            valuationButton.appendChild(icon);

            icon.innerHTML = ScoringCategory[i];

            let score: HTMLElement = document.createElement("div");
            score.classList.add("valuationScore");
            valuationButton.appendChild(score);
          }
    
        }

    }
}