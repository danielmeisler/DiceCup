namespace DiceCup {
    import ƒ = FudgeCore;

    export async function initSummary() {
        let summaryContent: string[][] = await createSummaryContent();

        let background: HTMLDivElement = document.createElement("div");
        background.id = "summaryBackground_id";
        document.getElementById("DiceCup").appendChild(background);

        let container: HTMLDivElement = document.createElement("div");
        container.classList.add("summaryHidden");
        container.id = "summaryContainer_id";
        background.appendChild(container);

        let content: HTMLDivElement = document.createElement("div");
        content.id = "summaryContent_id";
        container.appendChild(content);

        let colIds: string[] = ["playerNames"];
        colIds[13] = "sum";

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
                    img.src = summaryContent[0][col];
                    imgContainer.appendChild(img);

                    colIds[col] = ScoringCategory[col - 1];
                } else {
                    let text: HTMLSpanElement = document.createElement("span");
                    text.id = "summaryText_id_" + summaryContent[row][0] + "_" + colIds[col];
                    text.classList.add("summaryText");
                    text.innerHTML = summaryContent[row][col];
                    gridDiv.appendChild(text);
                    if (row == 0) {
                        text.classList.add("headerCol");
                    } else if (col == 0) {
                        text.classList.add("headerRow");
                    }
                }
                
            }
        }

        visibility("hidden");
    }

    async function createSummaryContent(): Promise<string[][]> {
        let response: Response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories: ScoringCategoryDao[] = await response.json();
        let content: string[][] = [];
        let playerNames: string[] = [gameSettings.playerName];

        for (let index = 0; index < gameSettings.bot.length; index++) {
            playerNames.push(gameSettings.bot[index].botName);
        }

        for (let row = 0; row < 7; row++) {
            content[row] = [];
            for (let col = 0; col < 14; col++) {
                content[row][col] = "";
                if(col > 0 && col < 13) {
                    content[0][col] = categories[col - 1].image;
                } else if (col == 13) {
                    content[0][col] = "Sum";
                }
            }
            if(row > 0 && row < playerNames.length + 1) {
                content[row][0] = playerNames[row - 1];
            }
        }
        console.log(content);
        return content;
    }

    export function updateSummary(_points: number, _category: number, _name: string): void {
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 14; col++) {
                document.getElementById("summaryText_id_" + _name + "_" + ScoringCategory[_category]).innerHTML = _points.toString();
            }
        }
        let temp: number = 0;
        if (document.getElementById("summaryText_id_" + _name + "_sum").innerHTML) {
            temp = parseInt(document.getElementById("summaryText_id_" + _name + "_sum").innerHTML);
        }
        _points += temp;
        document.getElementById("summaryText_id_" + _name + "_sum").innerHTML = _points.toString();
        console.log("summaryText_id_" + _name + "_" + ScoringCategory[_category]);
    }

    export function showSummary() { 
        document.getElementById("summaryContainer_id").classList.add("summaryShown");
        document.getElementById("summaryContainer_id").classList.remove("summaryHidden");
        document.getElementById("summaryBackground_id").classList.add("emptyBackground");
        document.getElementById("summaryBackground_id").style.zIndex = "10";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible") });
        ƒ.Time.game.setTimer(5000, 1, () => { hideSummary() });
    }

    export function hideSummary() {
        document.getElementById("summaryContainer_id").classList.remove("summaryShown");
        document.getElementById("summaryContainer_id").classList.add("summaryHidden");
        document.getElementById("summaryBackground_id").classList.remove("emptyBackground");
        document.getElementById("summaryBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden") });
        if (roundCounter <= 12) {
            changeGameState(GameState.ready);
        } else {
            changeGameState(GameState.placement);
        }
    }

    function visibility(_visibility: string) {
        document.getElementById("summaryBackground_id").style.visibility = _visibility;
    }
}