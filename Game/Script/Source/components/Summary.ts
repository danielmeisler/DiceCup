namespace DiceCup {
    import ƒ = FudgeCore;

    export async function initSummary() {
        let response: Response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories: ScoringCategoryDao[] = await response.json();

        let background: HTMLDivElement = document.createElement("div");
        background.id = "summaryBackground_id";
        document.querySelector("body").appendChild(background);

        let container: HTMLDivElement = document.createElement("div");
        container.classList.add("summaryHidden");
        container.id = "summaryContainer_id";
        background.appendChild(container);

        let content: HTMLDivElement = document.createElement("div");
        content.id = "summaryContent_id";
        container.appendChild(content);

        let imgCounter: number = 0;

        for (let row = 0; row < 7; row++) {
                for (let col = 0; col < 14; col++) {
                let gridDiv: HTMLDivElement = document.createElement("div");
                gridDiv.classList.add("summaryRow_" + row);
                gridDiv.classList.add("summaryColumn_" + col);
                gridDiv.id = "summaryGrid_id_" + row + "_" + col;
                content.appendChild(gridDiv);

                if (row == 0 && col > 0 && col < 13) {
                    let imgContainer: HTMLDivElement = document.createElement("div");
                    imgContainer.classList.add("summaryImgContainer");
                    gridDiv.appendChild(imgContainer);

                    let img: HTMLImageElement = document.createElement("img");
                    img.id = "summaryImg_id_" + col;
                    img.classList.add("summaryImg");
                    img.src = categories[imgCounter].image;
                    imgContainer.appendChild(img);

                    imgCounter++;
                }

                if (row == 0 && col > 0 && col < 13) {

                }
            }
        }

        

        visibility("hidden");
    }

    export function showSummary() {
        document.getElementById("summaryContainer_id").classList.add("summaryShown");
        document.getElementById("summaryContainer_id").classList.remove("summaryHidden");
        document.getElementById("summaryBackground_id").classList.add("emptyBackground");
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible") });
    }

    export function hideSummary() {
        document.getElementById("summaryContainer_id").classList.remove("summaryShown");
        document.getElementById("summaryContainer_id").classList.add("summaryHidden");
        document.getElementById("summaryBackground_id").classList.remove("emptyBackground");
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden") });
    }

    function visibility(_visibility: string) {
        document.getElementById("summaryBackground_id").style.visibility = _visibility;
    }
}