namespace DiceCup {

    export async function initHud(): Promise<void> {
        let response: Response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories: ScoringCategoryDao[] = await response.json();

        let domHud: HTMLDivElement = document.createElement("div");
        domHud.id = "hud_id";
        document.getElementById("DiceCup").appendChild(domHud);

        let timerContainer: HTMLDivElement = document.createElement("div");
        timerContainer.id = "hudTimerContainer_id";
        domHud.appendChild(timerContainer);

        let timer: HTMLDivElement = document.createElement("div");
        timer.id = "hudTimer_id";
        timerContainer.appendChild(timer);

        let valuationContainer: HTMLDivElement = document.createElement("div");
        valuationContainer.id = "valuationContainer_id";
        valuationContainer.style.visibility = helpCategoryHud ? "visibie" : "hidden";
        domHud.appendChild(valuationContainer);

        for (let i: number = 0; i < 12; i++) {
            let valuationButton: HTMLDivElement = document.createElement("div");
            valuationButton.classList.add("valuation");
            valuationButton.classList.add("valuationShow");
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

    export function showHud(): void {
        for (let i: number = 0; i < 12; i++) {
        document.getElementById("valuation_id_" + i).classList.remove("valuationHidden");
        document.getElementById("valuation_id_" + i).classList.add("valuationShow");
        }
    }

    export function hideHudCategory(_id: number): void {
        document.getElementById("valuation_id_" + _id).classList.remove("valuationShow");
        document.getElementById("valuation_id_" + _id).classList.add("valuationHidden");
    }
}