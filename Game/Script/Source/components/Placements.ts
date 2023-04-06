namespace DiceCup {
    import ƒ = FudgeCore;

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
        placementTitle.innerHTML = "CONGRATULATIONS!";
        container.appendChild(placementTitle);

        let placementPortraits: HTMLDivElement = document.createElement("div");
        placementPortraits.id = "placementPortraits_id";
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
        replayButtonImage.classList.add("buttonAreaIcons");
        replayButtonImage.src = "Game/Assets/images/menuButtons/renew.svg";
        replayButton.appendChild(replayButtonImage);

        replayButton.addEventListener("click", () => {
            hidePlacements();
            switchMenu(MenuPages.singleplayer);
        });

        let placementPhrase: HTMLSpanElement = document.createElement("span");
        placementPhrase.id = "placementPhrase_id";
        placementPhrase.innerHTML = "You are " + "ERSTER" + " place!";
        placementsBottomArea.appendChild(placementPhrase);

        let nextButton: HTMLButtonElement = document.createElement("button");
        nextButton.id = "nextButton_id";
        nextButton.classList.add("diceCupButtons");
        placementsBottomArea.appendChild(nextButton);

        let nextButtonImage: HTMLImageElement = document.createElement("img");
        nextButtonImage.classList.add("buttonAreaIcons");
        nextButtonImage.src = "Game/Assets/images/menuButtons/play.svg";
        nextButton.appendChild(nextButtonImage);

        nextButton.addEventListener("click", () => {
            switchMenu(MenuPages.main);
        });
    }

    function createPlacements(): void {
        for (let i = 0; i < 6; i++) {
            let placementsContainer: HTMLDivElement = document.createElement("div");
            placementsContainer.id = "placementsContainer_id_" + i;
            placementsContainer.classList.add("placementsContainer");
            document.getElementById("placementPortraits_id").appendChild(placementsContainer);

            let placementsDiv: HTMLDivElement = document.createElement("div");
            placementsDiv.id = "placementsPlayerPortrait_id_" + i;
            placementsDiv.classList.add("placementsPortrait");
            placementsDiv.classList.add("diceCupButtons");
            placementsContainer.appendChild(placementsDiv);

            let playerIcons: HTMLImageElement = document.createElement("img");
            playerIcons.classList.add("placementsPortraitIcons");
            playerIcons.src = "Game/Assets/images/menuButtons/player.svg";
            placementsDiv.appendChild(playerIcons);

            let playerName: HTMLDivElement = document.createElement("div");
            playerName.id = "playerName_id_" + i;
            playerName.classList.add("placementNames");
            playerName.innerHTML = "Player";
            placementsContainer.appendChild(playerName);

            let placement: HTMLDivElement = document.createElement("div");
            placement.classList.add("placementOrder");
            placement.innerHTML = i + 1 + "." + " 202";
            placementsContainer.appendChild(placement);
        }
    }

    export function updatePlacements(): void {

    }

    export function showPlacements() {
        document.getElementById("placementsContainer_id").classList.add("placementsShown");
        document.getElementById("placementsContainer_id").classList.remove("placementsHidden");
        document.getElementById("placementsBackground_id").classList.add("emptyBackground");
        document.getElementById("placementsBackground_id").style.zIndex = "10";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible") });
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
}