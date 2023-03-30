namespace DiceCup {
    export class Categories {

        public async initCategories() {
            let response: Response = await fetch("Game/Script/Data/scoringCategories.json");
            let categories: ScoringCategoryDao[] = await response.json();

            let background: HTMLDivElement = document.createElement("div");
            background.id = "categoryBackground_id";
            document.querySelector("body").appendChild(background);

            let container: HTMLDivElement = document.createElement("div");
            container.id = "categoryContainer_id";
            background.appendChild(container);

            let header: HTMLDivElement = document.createElement("div");
            header.id = "categoryHeader_id";
            container.appendChild(header);

            let title: HTMLSpanElement = document.createElement("span");
            title.id = "categoryTitle_id";
            title.innerHTML = "Choose a category"
            header.appendChild(title);

            let timer: HTMLDivElement = document.createElement("div");
            timer.id = "categoryTimer_id";
            header.appendChild(timer);

            let content: HTMLDivElement = document.createElement("div");
            content.id = "categoryContent_id";
            container.appendChild(content);

            for (let i = 0; i < 12; i++) {
                let button: HTMLButtonElement = document.createElement("button");
                button.classList.add("categoryButtons");
                button.classList.add("diceCupButtons");
                button.id = "categoryButtons_id_" + i;
                content.appendChild(button);

                let img: HTMLImageElement = document.createElement("img");
                img.src = categories[i].image;
                img.classList.add("categoryImages");
                img.id = "categoryImage_i_" + i;
                button.appendChild(img);
                
                let points: HTMLSpanElement = document.createElement("span");
                points.classList.add("categoryPoints");
                button.appendChild(points);
            }
        }
    }
}