namespace DiceCup {

        export async function initHud(): Promise<void> {
          let response: Response = await fetch("Game/Script/Data/scoringCategories.json");
          let categories: ScoringCategoryDao[] = await response.json();

          let domHud: HTMLDivElement = document.createElement("div");
          domHud.id = "hud_id";
          document.querySelector("body").appendChild(domHud);

          let valuationContainer: HTMLDivElement = document.createElement("div");
          valuationContainer.id = "valuationContainer_id";
          domHud.appendChild(valuationContainer);

          for (let i: number = 0; i < 12; i++) {
            let valuationButton: HTMLDivElement = document.createElement("div");
            valuationButton.classList.add("valuation");
            valuationButton.id = "valuation_id_" + i;
            valuationContainer.appendChild(valuationButton);

            let icon: HTMLElement = document.createElement("div");
            icon.classList.add("valuationIcon");
            valuationButton.appendChild(icon);

            let valuationImage: HTMLImageElement = document.createElement("img");
            valuationImage.src = categories[i].image;
            valuationImage.classList.add("valuationImage");
            valuationImage.id = "valuationImage_i_" + i;
            icon.appendChild(valuationImage);

            let score: HTMLElement = document.createElement("div");
            score.classList.add("valuationScore");
            valuationButton.appendChild(score);
          }
    
        }

}