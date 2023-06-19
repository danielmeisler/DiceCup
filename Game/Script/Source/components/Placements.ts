namespace DiceCup {
    import ƒ = FudgeCore;

    let place: number = 0;

    export function initPlacements(): void {
        let background: HTMLDivElement = document.createElement("div");
        background.id = "placementsBackground_id";
        document.getElementById("DiceCup").appendChild(background);

        let container: HTMLDivElement = document.createElement("div");
        container.classList.add("placementsHidden");
        container.id = "placementsContainer_id";
        background.appendChild(container);

        let placementTitle: HTMLSpanElement = document.createElement("span");
        placementTitle.id = "placementsTitle_id";
        placementTitle.innerHTML = language.game.placements.title;
        container.appendChild(placementTitle);

        let placementPortraits: HTMLDivElement = document.createElement("div");
        placementPortraits.id = "placementsPortraits_id";
        container.appendChild(placementPortraits);

        createPlacements();

        let placementsBottomArea: HTMLDivElement = document.createElement("div");
        placementsBottomArea.id = "placementsBottomArea_id";
        container.appendChild(placementsBottomArea);

        let replayButton: HTMLButtonElement = document.createElement("button");
        replayButton.id = "replayButton_id";
        replayButton.classList.add("diceCupButtons");
        placementsBottomArea.appendChild(replayButton);

        let replayButtonImage: HTMLImageElement = document.createElement("img");
        replayButtonImage.classList.add("diceCupButtonsIcons");
        replayButtonImage.src = "Game/Assets/images/menuButtons/renew.svg";
        replayButton.appendChild(replayButtonImage);

        replayButton.addEventListener("click", () => {
            playSFX(buttonClick);
            gameOver(MenuPage.singleplayer);
        });

        let placementPhrase: HTMLSpanElement = document.createElement("span");
        placementPhrase.id = "placementsPhrase_id";
        placementsBottomArea.appendChild(placementPhrase);

        let nextButton: HTMLButtonElement = document.createElement("button");
        nextButton.id = "nextButton_id";
        nextButton.classList.add("diceCupButtons");
        placementsBottomArea.appendChild(nextButton);

        let nextButtonImage: HTMLImageElement = document.createElement("img");
        nextButtonImage.classList.add("diceCupButtonsIcons");
        nextButtonImage.src = "Game/Assets/images/menuButtons/home.svg";
        nextButton.appendChild(nextButtonImage);

        nextButton.addEventListener("click", () => {
            playSFX(buttonClick);
            gameOver(MenuPage.main);
        });

        visibility("hidden");
    }

    function createPlacements(): void {
        for (let i = 0; i < 6; i++) {
            let placementsContainer: HTMLDivElement = document.createElement("div");
            placementsContainer.id = "placementsContainer_id_" + i;
            placementsContainer.classList.add("placementsContainer");
            document.getElementById("placementsPortraits_id").appendChild(placementsContainer);

            let placementsDiv: HTMLDivElement = document.createElement("div");
            placementsDiv.id = "placementsPlayerPortrait_id_" + i;
            placementsDiv.classList.add("placementsPortrait");
            placementsDiv.classList.add("diceCupButtons");
            placementsContainer.appendChild(placementsDiv);

            let playerIcons: HTMLImageElement = document.createElement("img");
            playerIcons.id = "placementsPlayerIcons_id_" + i;
            playerIcons.classList.add("placementsPortraitIcons");
            playerIcons.src = "Game/Assets/images/menuButtons/bot.svg";
            placementsDiv.appendChild(playerIcons);

            let playerName: HTMLDivElement = document.createElement("div");
            playerName.id = "playerName_id_" + i;
            playerName.classList.add("placementsNames");
            placementsContainer.appendChild(playerName);

            let points: HTMLDivElement = document.createElement("div");
            points.id = "placementsPoints_id_" + i;
            points.classList.add("placementsPoints");
            placementsContainer.appendChild(points);

            let placement: HTMLDivElement = document.createElement("div");
            placement.id = "placementsOrder_id_" + i;
            placement.classList.add("placementsOrder");
            placementsDiv.appendChild(placement);
        }
    }

    export function updatePlacements(): void {
        let name: string[] = [];
        let points: number[] = [];
        let bots: BotDao[] = [];
        if (playerMode == PlayerMode.singlelpayer) {
            bots = gameSettings_sp.bot;
            console.log(playerNames);
        } else if (playerMode == PlayerMode.multiplayer) {
            playerNames = playerNames.filter(name => name != "");
            console.log(playerNames);
        }

        for (let i = 0; i < playerNames.length; i++) {
            name[i] = document.querySelector("#summaryText_id_" + playerNames[i] + "_playerNames").innerHTML;
            points[i] = parseInt(document.querySelector("#summaryText_id_" + playerNames[i] + "_sum").innerHTML);
        }
        console.log(name);

        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points.length; j++) {
                if (points[j] < points[j+1]) {
                    [points[j], points[j+1]] = [points[j+1], points[j]];
                    [name[j], name[j+1]] = [name[j+1], name[j]];
                }
            }
        }

        for (let i = 0; i < 6; i++) {
            if (i >= playerNames.length) {
                document.getElementById("placementsContainer_id_" + i).style.display = "none";
            }
        }

        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < bots.length; j++) {
                if (name[i] == bots[j].botName) {
                    (<HTMLImageElement>document.getElementById("placementsPlayerIcons_id_" + i)).src = "Game/Assets/images/menuButtons/bot.svg";
                    break;
                } else {
                    (<HTMLImageElement>document.getElementById("placementsPlayerIcons_id_" + i)).src = "Game/Assets/images/menuButtons/player.svg";
                }
            }
            document.getElementById("playerName_id_" + i).innerHTML = name[i];
            document.getElementById("placementsPoints_id_" + i).innerHTML = points[i].toString();
            document.getElementById("placementsOrder_id_" + i).innerHTML = (i + 1).toString();

            if (playerMode == PlayerMode.singlelpayer) {
                if (name[i] == gameSettings_sp.playerName) {
                    place = i + 1;
                    document.getElementById("placementsPhrase_id").innerHTML = language.game.placements.placement.part_1 + " " + place + ". " +  language.game.placements.placement.part_2;
                }
            } else if (playerMode == PlayerMode.multiplayer) {
                if (name[i] == gameSettings_mp.playerNames[clientPlayerNumber]) {
                    place = i + 1;
                    document.getElementById("placementsPhrase_id").innerHTML = language.game.placements.placement.part_1 + " " + place + ". " +  language.game.placements.placement.part_2;
                }
            }

        }
    }

    export function showPlacements() {
        document.getElementById("placementsContainer_id").classList.add("placementsShown");
        document.getElementById("placementsContainer_id").classList.remove("placementsHidden");
        document.getElementById("placementsBackground_id").classList.add("emptyBackground");
        document.getElementById("placementsBackground_id").style.zIndex = "10";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible"), placementsSounds() });
    }

    export function hidePlacements() {
        document.getElementById("placementsContainer_id").classList.remove("placementsShown");
        document.getElementById("placementsContainer_id").classList.add("placementsHidden");
        document.getElementById("placementsBackground_id").classList.remove("emptyBackground");
        document.getElementById("placementsBackground_id").style.zIndex = "0";
        // hideHud
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden") });
    }

    function visibility(_visibility: string) {
        document.getElementById("placementsBackground_id").style.visibility = _visibility;
    }   

    function placementsSounds(): void {
        playSFX("Audio|2023-05-18T21:20:15.907Z|47241");
    }
}