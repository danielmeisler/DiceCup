namespace DiceCup {
    import ƒ = FudgeCore;

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
        title.innerHTML = "Choose a category"
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
            button.addEventListener("click", handleCategory);
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

    export function showCategories() {
        document.getElementById("categoryContainer_id").classList.add("categoriesShown");
        document.getElementById("categoryContainer_id").classList.remove("categoriesHidden");
        document.getElementById("categoryBackground_id").classList.add("emptyBackground");
        document.getElementById("categoryBackground_id").style.zIndex = "10";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("visible"), new TimerBar("categoryTimer_id", 5)});
    }

    export function hideCategories() {
        document.getElementById("categoryContainer_id").classList.remove("categoriesShown");
        document.getElementById("categoryContainer_id").classList.add("categoriesHidden");
        document.getElementById("categoryBackground_id").classList.remove("emptyBackground");
        document.getElementById("categoryBackground_id").style.zIndex = "0";
        ƒ.Time.game.setTimer(1000, 1, () => { visibility("hidden") });
    }

    function handleCategory(_event: Event): void {
        let index: number = parseInt((<HTMLDivElement>_event.currentTarget).getAttribute("index"));
        document.getElementById("categoryImage_i_" + (<HTMLDivElement>_event.currentTarget).getAttribute("index")).classList.add("categoryImagesTransparent");
        this.disabled = true;
        hideCategories();
        ƒ.Time.game.setTimer(2000, 1, () => { addPointsToButton(index) });
    }

    function addPointsToButton(_index: number): void {
        let valuation: Valuation = new Valuation(_index, dices);
        let value: number = valuation.chooseScoringCategory();
        document.getElementById("categoryPoints_id_" + _index).innerHTML = value.toString();
        document.getElementById("categoryImage_i_" + _index).classList.add("categoryImagesTransparent");
        hideHudCategory(_index);
        updateSummary(value, _index, gameSettings.playerName);
        ƒ.Time.game.setTimer(2000, 1, () => { changeGameState(GameState.summary) });
    }

    function visibility(_visibility: string) {
        document.getElementById("categoryBackground_id").style.visibility = _visibility;
    }
}