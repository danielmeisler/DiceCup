namespace DiceCup {
    import ƒ = FudgeCore;

    // -- Variable declaration --

    // Gets all playernames for the summary table
    export let playerNames: string[] = [];
    // Stores the last points so it can be highlighted
    export let lastPoints: string[] = [];
    // The time for the summary phase
    let summaryTime: number = 20;
    // The skip counter skips the summary phase if skipcounter is as high as the max player length
    let skipCounter: number = 0;
    // Timer ID of the category timer so we can delete it etc.
    let timerID: number;
    // TimerBar object to visualize the time and reset it
    let timerBar: TimerBar;

    // Initialize the summary table construct with empty content
    export async function initSummary(): Promise<void> {
        let summaryContent: string[][] = await createSummaryContent();

        let background: HTMLDivElement = document.createElement("div");
        background.id = "summaryBackground_id";
        document.getElementById("DiceCup").appendChild(background);

        // Singleplayer: Skip phase with click/tap an screen
        // Multiplayer works with timers and skip option
        if (playerMode == PlayerMode.singlelpayer) {
            background.addEventListener("click", hideSummary);
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

        // Creates a grid with 7 rows and 14 columns
        // 7 Rows -> Header Row with icons and headlines and max 6 player names
        // 14 Columns -> 1 Playernames column, 1 sum column, 12 categories columns
        for (let row = 0; row < 7; row++) {
                for (let col = 0; col < 14; col++) {
                let gridDiv: HTMLDivElement = document.createElement("div");
                gridDiv.classList.add("summaryRow_" + row);
                gridDiv.classList.add("summaryColumn_" + col);
                gridDiv.id = "summaryGrid_id_" + row + "_" + col;
                content.appendChild(gridDiv);

                // If: Creates the icon container for the category cells between row 0 col 2-13
                // Else: Creates text span elements for the content like points and names
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
                    if (row == 0 && col == 0) {
                        text.id = "summaryText_skipCounter_id";
                    }
                }
                
            }
        }

        document.getElementById("summaryText_skipCounter_id").innerHTML = language.game.summary.skip;

        // Visualize the summary timer in the free left top corner cell
        let timer: HTMLDivElement = document.createElement("div");
        timer.id = "summaryTimer_id";
        document.getElementById("summaryGrid_id_0_0").appendChild(timer);
        if (playerMode == PlayerMode.singlelpayer) {
            document.getElementById("summaryTimer_id").style.visibility = "hidden";
        }

        visibility("hidden");
    }

    // Creates the content of the summary table at the beginning of the game with the playernames
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
        return content;
    }

    // Handles the summary table after everyround in single- and multiplayer differently. Singleplayer updates the table directly and multiplayer sends a message to all players.
    export function handleSummary(_value: number, _index: number): void {
        if (playerMode == PlayerMode.singlelpayer) {
            updateSummary(_value, _index, gameSettings_sp.playerName);
        } else if (playerMode == PlayerMode.multiplayer) {
            client.dispatch({ command: FudgeNet.COMMAND.SEND_SCORE, route: FudgeNet.ROUTE.SERVER, content: { value: _value, index: _index, name: gameSettings_mp.playerNames[clientPlayerNumber]} });
        }
    }

    // Updates the table every round with picked category and the earned points for each player
    export function updateSummary(_points: number, _category: number, _name: string): void {
        // Removes the highlights the last picked category and earned points
        if (playerMode == PlayerMode.singlelpayer) {
            if (lastPoints.length - playerNames.length >= 0) {
                document.getElementById(lastPoints[lastPoints.length - playerNames.length]).classList.remove("summaryHighlight");
            }
        } else if (playerMode == PlayerMode.multiplayer) {
            if (lastPoints.length - numberOfPlayers >= 0) {
                document.getElementById(lastPoints[lastPoints.length - numberOfPlayers]).classList.remove("summaryHighlight");
            }
        }

        // Add the points to the right cell and highlights the current picked category and earned points
        document.getElementById("summaryText_id_" + _name + "_" + ScoringCategory[_category]).innerHTML = _points.toString();
        document.getElementById("summaryText_id_" + _name + "_" + ScoringCategory[_category]).classList.add("summaryHighlight");
        lastPoints.push("summaryText_id_" + _name + "_" + ScoringCategory[_category]);

        // Sum up all previous earned points
        let temp: number = 0;
        if (document.getElementById("summaryText_id_" + _name + "_sum").innerHTML) {
            temp = parseInt(document.getElementById("summaryText_id_" + _name + "_sum").innerHTML);
        }
        _points += temp;
        document.getElementById("summaryText_id_" + _name + "_sum").innerHTML = _points.toString();
    }

    // Updates the visualized skip counter everytime a player wants to skip the phase
    export function updateSummarySkipCounter(): void {
        skipCounter++;
        document.getElementById("summaryText_skipCounter_id").innerHTML = skipCounter + "/" + numberOfPlayers;

        if (skipCounter == numberOfPlayers) {
            hideSummary();
        }
    }

    // Shows the summary table every round
    export function showSummary(): void { 
        document.getElementById("summaryContainer_id").classList.add("summaryShown");
        document.getElementById("summaryContainer_id").classList.remove("summaryHidden");
        document.getElementById("summaryBackground_id").classList.add("emptyBackground");
        document.getElementById("summaryBackground_id").style.zIndex = "10";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible") });
        if (playerMode == PlayerMode.multiplayer) {
            timerBar = new TimerBar("summaryTimer_id", summaryTime);
            timerID = ƒ.Time.game.setTimer(summaryTime * 1000, 1, () => { 
                    hideSummary();
            });
            document.getElementById("summaryBackground_id").addEventListener("click", skip );
        }
    }

    // Hides the summary table and checks which round the game is in
    export function hideSummary(): void {
        document.getElementById("summaryContainer_id").classList.remove("summaryShown");
        document.getElementById("summaryContainer_id").classList.add("summaryHidden");
        document.getElementById("summaryBackground_id").classList.remove("emptyBackground");
        document.getElementById("summaryBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden") });
        ƒ.Time.game.deleteTimer(timerID);
        if (playerMode ?? PlayerMode.multiplayer) {
            timerBar.resetTimer();
        }
        resetSkip();
        lastRound();
    }
    
    // Sends a message to the server if the player wants to skip this phase. Removes the event listener so the player just can vote once
    function skip(_event: Event): void {
        client.dispatch({ command: FudgeNet.COMMAND.SKIP_SUMMARY, route: FudgeNet.ROUTE.SERVER });
        document.getElementById("summaryBackground_id").removeEventListener("click", skip);
    }

    // Resets the skip counter
    function resetSkip(): void {
        skipCounter = 0;
        document.getElementById("summaryText_skipCounter_id").innerHTML = language.game.summary.skip;
    }

    // Toggles the visibility of the summary table
    function visibility(_visibility: string): void {
        document.getElementById("summaryBackground_id").style.visibility = _visibility;
    }
}