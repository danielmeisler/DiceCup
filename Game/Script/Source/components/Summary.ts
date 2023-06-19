namespace DiceCup {
    import ƒ = FudgeCore;

    export let playerNames: string[] = [];
    export let lastPoints: string[] = [];
    let summaryTime: number = 5;
    let timerID: number;

    export async function initSummary() {
        let summaryContent: string[][] = await createSummaryContent();

        let background: HTMLDivElement = document.createElement("div");
        background.id = "summaryBackground_id";
        document.getElementById("DiceCup").appendChild(background);

        if (playerMode == PlayerMode.singlelpayer) {
            background.addEventListener("click", hideSummary);
            background.addEventListener("click", () => ƒ.Time.game.deleteTimer(timerID));
        }

        let container: HTMLDivElement = document.createElement("div");
        container.classList.add("summaryHidden");
        container.id = "summaryContainer_id";
        background.appendChild(container);

        let content: HTMLDivElement = document.createElement("div");
        content.id = "summaryContent_id";
        container.appendChild(content);

        let colIds: string[] = ["playerNames"];
        colIds[1] = "sum";

        for (let row = 0; row < 7; row++) {
                for (let col = 0; col < 14; col++) {
                let gridDiv: HTMLDivElement = document.createElement("div");
                gridDiv.classList.add("summaryRow_" + row);
                gridDiv.classList.add("summaryColumn_" + col);
                gridDiv.id = "summaryGrid_id_" + row + "_" + col;
                content.appendChild(gridDiv);

                if (row == 0 && col > 1 && col < 14) {
                    let imgContainer: HTMLDivElement = document.createElement("div");
                    imgContainer.classList.add("summaryImgContainer");
                    gridDiv.appendChild(imgContainer);

                    let img: HTMLImageElement = document.createElement("img");
                    img.id = "summaryImg_id_" + (col - 2);
                    img.classList.add("summaryImg");
                    img.src = summaryContent[0][col];
                    imgContainer.appendChild(img);

                    colIds[col] = ScoringCategory[col - 2];
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
                    } else if (col == 1) {
                        text.classList.add("sumRow");
                    }
                }
                
            }
        }

        let timer: HTMLDivElement = document.createElement("div");
        timer.id = "summaryTimer_id";
        document.getElementById("summaryGrid_id_0_0").appendChild(timer);

        visibility("hidden");
    }

    async function createSummaryContent(): Promise<string[][]> {
        let response: Response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories: ScoringCategoryDao[] = await response.json();
        let content: string[][] = [];

        if (playerMode == PlayerMode.singlelpayer) {
            playerNames = [gameSettings_sp.playerName];
            for (let index = 0; index < gameSettings_sp.bot.length; index++) {
                playerNames.push(gameSettings_sp.bot[index].botName);
            }
        } else if (playerMode == PlayerMode.multiplayer) {
            for (let index = 0; index < gameSettings_mp.playerNames.length; index++) {
                playerNames.push(gameSettings_mp.playerNames[index]);
            }

        }

        for (let row = 0; row < 7; row++) {
            content[row] = [];
            for (let col = 0; col < 14; col++) {
                content[row][col] = "";
                if(col > 1 && col < 14) {
                    content[0][col] = categories[col - 2].image;
                } else if (col == 1) {
                    content[0][col] = language.game.summary.sum;
                }
            }
            if(row > 0 && row < playerNames.length + 1) {
                content[row][0] = playerNames[row - 1];
            }
        }
        console.log(content);
        return content;
    }

    export function handleSummary(_value: number, _index: number): void{
        if (playerMode == PlayerMode.singlelpayer) {
            updateSummary(_value, _index, gameSettings_sp.playerName);
        } else if (playerMode == PlayerMode.multiplayer) {
            client.dispatch({ command: FudgeNet.COMMAND.SEND_SCORE, route: FudgeNet.ROUTE.SERVER, content: { value: _value, index: _index, name: gameSettings_mp.playerNames[clientPlayerNumber]} });
        }
    }

    export function updateSummary(_points: number, _category: number, _name: string): void {
        if (playerMode == PlayerMode.singlelpayer) {
            if (lastPoints.length - playerNames.length >= 0) {
                document.getElementById(lastPoints[lastPoints.length - playerNames.length]).classList.remove("summaryHighlight");
            }
        } else if (playerMode == PlayerMode.multiplayer) {
            if (lastPoints.length - numberOfPlayers >= 0) {
                document.getElementById(lastPoints[lastPoints.length - numberOfPlayers]).classList.remove("summaryHighlight");
            }
        }

        console.log(_points);
        console.log(_name);
        document.getElementById("summaryText_id_" + _name + "_" + ScoringCategory[_category]).innerHTML = _points.toString();
        document.getElementById("summaryText_id_" + _name + "_" + ScoringCategory[_category]).classList.add("summaryHighlight");
        lastPoints.push("summaryText_id_" + _name + "_" + ScoringCategory[_category]);

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
        new TimerBar("summaryTimer_id", summaryTime);
        timerID = ƒ.Time.game.setTimer(summaryTime * 1000, 1, () => { 
                hideSummary();
        });
    }

    export function hideSummary() {
        document.getElementById("summaryContainer_id").classList.remove("summaryShown");
        document.getElementById("summaryContainer_id").classList.add("summaryHidden");
        document.getElementById("summaryBackground_id").classList.remove("emptyBackground");
        document.getElementById("summaryBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden") });
        changeGameState(GameState.ready);
    }

    function visibility(_visibility: string) {
        document.getElementById("summaryBackground_id").style.visibility = _visibility;
    }
}