namespace DiceCup {
    import ƒ = FudgeCore;

    // -- Variable declaration --

    // Categories the player picks will be removed from this array
    export let freePlayerCategories: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    // The time for picking a category
    let categoryTime: number = 10;
    // Boolean to check if the timer is over
    let timerOver: boolean = false;
    // Timer ID of the category timer so we can delete it etc.
    let timerID: number;
    // TimerBar object to visualize the time and reset it
    let timerBar: TimerBar;

    //  Initialize the category panel with the buttons etc. at the beginning
    export async function initCategories(): Promise<void> {
        let response: Response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories: ScoringCategoryDao[] = await response.json();

        let background: HTMLDivElement = document.createElement("div");
        background.id = "categoryBackground_id";
        document.getElementById("DiceCup").appendChild(background);

        let container: HTMLDivElement = document.createElement("div");
        container.classList.add("categoriesHidden");
        container.id = "categoryContainer_id";
        background.appendChild(container);

        let header: HTMLDivElement = document.createElement("div");
        header.id = "categoryHeader_id";
        container.appendChild(header);

        let timer: HTMLDivElement = document.createElement("div");
        timer.id = "categoryTimer_id";
        header.appendChild(timer);

        let title: HTMLSpanElement = document.createElement("span");
        title.id = "categoryTitle_id";
        title.innerHTML = language.game.categories.title;
        header.appendChild(title);

        let content: HTMLDivElement = document.createElement("div");
        content.id = "categoryContent_id";
        container.appendChild(content);

        // Creates every category button with adds event listener
        // Deletes timer if player picked a category right in time
        for (let i = 0; i < categoriesLength; i++) {
            let button: HTMLButtonElement = document.createElement("button");
            button.classList.add("categoryButtons");
            button.classList.add("diceCupButtons");
            button.id = "categoryButtons_id_" + i;
            button.setAttribute("index", i.toString());
            if (playerMode == PlayerMode.multiplayer) {
                timerID ?? button.addEventListener("click", () => {ƒ.Time.game.deleteTimer(timerID), timerBar.resetTimer();});
            }
            button.addEventListener("click", handleCategory );
            button.addEventListener("click", () => {playSFX(buttonClick), blockClicks()});
            content.appendChild(button);

            let img: HTMLImageElement = document.createElement("img");
            img.src = categories[i].image;
            img.classList.add("categoryImages");
            img.id = "categoryImage_i_" + i;
            button.appendChild(img);
            
            let points: HTMLSpanElement = document.createElement("span");
            points.id = "categoryPoints_id_" + i;
            points.classList.add("categoryPoints");
            button.appendChild(points);
        }

        visibility("hidden");
    }

    // Shows the category panel every round in the category phase
    export async function showCategories(): Promise<void> {
        // If the player has only one category left it means it's the last round and it can be picked automatically without player input.
        if (freePlayerCategories.length == 1) {
            addPointsToButton(freePlayerCategories[0]);
            // Singleplayer: Bots play their final round
            // Multiplayer: Switching to th last validating state 
            if (playerMode == PlayerMode.multiplayer) {
                changeGameState(GameState.validating);
            } else {
                botTurn();
            }
        } else {
            document.getElementById("categoryContainer_id").classList.add("categoriesShown");
            document.getElementById("categoryContainer_id").classList.remove("categoriesHidden");
            document.getElementById("categoryBackground_id").classList.add("emptyBackground");
            document.getElementById("categoryBackground_id").style.zIndex = "10";
            ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible") });

            // The timer is only available in the multiplayer
            if (playerMode == PlayerMode.multiplayer) {
                timerBar = new TimerBar("categoryTimer_id", categoryTime);
                timerOver = false;
                timerID = ƒ.Time.game.setTimer(categoryTime * 1000, 1, () => { 
                    document.getElementById("categoryButtons_id_" + freePlayerCategories[Math.floor(Math.random() * freePlayerCategories.length)]).click();
                    timerOver = true;
                });
            }

        }
    }

    // Hides the panel once timer expires or category has been picked
    export function hideCategories(): void {
        document.getElementById("categoryContainer_id").classList.remove("categoriesShown");
        document.getElementById("categoryContainer_id").classList.add("categoriesHidden");
        document.getElementById("categoryBackground_id").classList.remove("emptyBackground");
        document.getElementById("categoryBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden") });
    }

    // Toggles the visibility of the panel
    function visibility(_visibility: string): void {
        document.getElementById("categoryBackground_id").style.visibility = _visibility;
    }

    // Handles the picked category and changes the panel every round
    async function handleCategory(_event: Event): Promise<void> {
        let index: number = parseInt((<HTMLDivElement>_event.currentTarget).getAttribute("index"));
        document.getElementById("categoryImage_i_" + (<HTMLDivElement>_event.currentTarget).getAttribute("index")).classList.add("categoryImagesTransparent");
        this.disabled = true;
        let tempArray: number[] = freePlayerCategories.filter((element) => element !== index);
        freePlayerCategories = tempArray;
        hideCategories();
        // Singleplayer: The bots pick their categories now
        // Multiplayer: Everyone waits until everyone has chosen a category 
        if (playerMode == PlayerMode.multiplayer) {
            waitForPlayerValidation();
        } else if (playerMode == PlayerMode.singlelpayer) {
            lastPickedCategory = index;
            botTurn();
        }
        ƒ.Time.game.setTimer(2000, 1, () => { addPointsToButton(index) });
    }

    // Adds the gotten points for the picked category on the buttons after a little delay so it's only visible next round
    function addPointsToButton(_index: number): void {
        let valuation: Valuation = new Valuation(_index, dices, true);
        let value: number = valuation.chooseScoringCategory();
        value = timerOver ? 0 : value;
        timerOver = false;
        timerID ?? ƒ.Time.game.deleteTimer(timerID);
        if (playerMode ?? PlayerMode.multiplayer) {
            timerBar.resetTimer();
        }
        document.getElementById("categoryPoints_id_" + _index).innerHTML = value.toString();
        document.getElementById("categoryImage_i_" + _index).classList.add("categoryImagesTransparent");
        hideHudCategory(_index);
        handleSummary(value, _index);
        unblockClicks();
        changeGameState(GameState.validating);
    }

    // Blocks clicks/taps of all buttons so the player can't pick more than one category
    function blockClicks(): void {
        for (let i = 0; i < categoriesLength; i++) {
            (<HTMLButtonElement>document.getElementById("categoryButtons_id_" + i)).disabled = true;
        }
    }

    // Unblocks the clicks/taps so the player can pick a category again in the next round
    function unblockClicks(): void {
        for (let i = 0; i < freePlayerCategories.length; i++) {
            (<HTMLButtonElement>document.getElementById("categoryButtons_id_" + freePlayerCategories[i])).disabled = false;
        }
    }
}