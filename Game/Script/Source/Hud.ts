namespace DiceCup {

    export class Hud {

        public static async initHud(): Promise<void> {
          let response: Response = await fetch("Game/Script/Source/data/scoringCategories.json");
          let categories: ScoringCategoryDao[] = await response.json();

          let domHud: HTMLDivElement = document.querySelector("div#hud");
          let valuationContainer: HTMLDivElement = document.createElement("div");
          valuationContainer.id = "valuationContainer";
          domHud.appendChild(valuationContainer);

          for (let i: number = 0; i < 12; i++) {
            let valuationButton: HTMLButtonElement = document.createElement("button");
            valuationButton.classList.add("valuationButton");
            valuationButton.id = "valuation" + i;
            valuationButton.style.zIndex = "2";
            valuationContainer.appendChild(valuationButton);

            let icon: HTMLElement = document.createElement("div");
            icon.classList.add("valuationIcon");
            valuationButton.appendChild(icon);

            let valuationImage: HTMLImageElement = document.createElement("img");
            valuationImage.src = categories[i].image;
            valuationImage.classList.add("valuationImage");
            valuationImage.id = "valuationImage" + i;
            icon.appendChild(valuationImage);

            let score: HTMLElement = document.createElement("div");
            score.classList.add("valuationScore");
            valuationButton.appendChild(score);
          }
    
        }

    }
}