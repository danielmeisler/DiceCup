namespace DiceCup {
    import ƒ = FudgeCore;

    export let freePlayerCategories: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    let categoryTime: number = 10;
    let timerOver: boolean = false;
    let timerID: number;

    export async function initCategories() {
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

        for (let i = 0; i < 12; i++) {
            let button: HTMLButtonElement = document.createElement("button");
            button.classList.add("categoryButtons");
            button.classList.add("diceCupButtons");
            button.id = "categoryButtons_id_" + i;
            button.setAttribute("index", i.toString());
            // button.addEventListener("click", () => {ƒ.Time.game.deleteTimer(timerID)});
            button.addEventListener("click", handleCategory );
            button.addEventListener("click", () => {playSFX(buttonClick)});
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

    export async function showCategories() {
        if (freePlayerCategories.length == 1) {
            addPointsToButton(freePlayerCategories[0]);
            if (playerMode == PlayerMode.multiplayer) {
                changeGameState(GameState.validating);
            }
        } else {
            document.getElementById("categoryContainer_id").classList.add("categoriesShown");
            document.getElementById("categoryContainer_id").classList.remove("categoriesHidden");
            document.getElementById("categoryBackground_id").classList.add("emptyBackground");
            document.getElementById("categoryBackground_id").style.zIndex = "10";
            ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible") });
            new TimerBar("categoryTimer_id", categoryTime);
            timerOver = false;
            timerID = ƒ.Time.game.setTimer(categoryTime * 1000, 1, () => { 
                document.getElementById("categoryButtons_id_" + freePlayerCategories[Math.floor(Math.random() * freePlayerCategories.length)]).click();
                timerOver = true;
                changeGameState(GameState.validating);
            });
        }
    }

    export function hideCategories() {
        document.getElementById("categoryContainer_id").classList.remove("categoriesShown");
        document.getElementById("categoryContainer_id").classList.add("categoriesHidden");
        document.getElementById("categoryBackground_id").classList.remove("emptyBackground");
        document.getElementById("categoryBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden") });
    }

    function visibility(_visibility: string) {
        document.getElementById("categoryBackground_id").style.visibility = _visibility;
    }

    async function handleCategory(_event: Event): Promise<void> {
        let index: number = parseInt((<HTMLDivElement>_event.currentTarget).getAttribute("index"));
        document.getElementById("categoryImage_i_" + (<HTMLDivElement>_event.currentTarget).getAttribute("index")).classList.add("categoryImagesTransparent");
        this.disabled = true;
        let tempArray: number[] = freePlayerCategories.filter((element) => element !== index);
        freePlayerCategories = tempArray;
        hideCategories();
        waitForPlayerValidation();
        ƒ.Time.game.setTimer(2000, 1, () => { addPointsToButton(index) });
    }

    function addPointsToButton(_index: number): void {
        let valuation: Valuation = new Valuation(_index, dices, true);
        let value: number = valuation.chooseScoringCategory();
        value = timerOver ? 0 : value;
        timerOver = false;
        ƒ.Time.game.deleteTimer(timerID);
        document.getElementById("categoryPoints_id_" + _index).innerHTML = value.toString();
        document.getElementById("categoryImage_i_" + _index).classList.add("categoryImagesTransparent");
        hideHudCategory(_index);

        handleSummary(value, _index);

        if (playerMode == PlayerMode.singlelpayer) {
            changeGameState(GameState.validating);
        }

    }
    
}