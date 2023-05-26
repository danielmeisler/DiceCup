namespace DiceCup {

    let helpPages: number = 1;
    let helpPagesTitle: string[] = [];
    let helpPagesContent: string[] = [];
    let splitContent: string[]

    export function helpMenu(): void {
        new SubMenu(MenuPage.help, "help", language.menu.help.title);

        helpPagesTitle = [language.menu.help.page_1.title, language.menu.help.page_2.title, language.menu.help.page_3.title, language.menu.help.page_4.title];
        helpPagesContent = [language.menu.help.page_1.content, language.menu.help.page_2.content, language.menu.help.page_3.content, language.menu.help.page_4.content];

        let title: HTMLSpanElement = document.createElement("span");
        title.id = "helpSubtitle_id";
        document.getElementById("helpMenuContent_id").appendChild(title);

        let content: HTMLSpanElement = document.createElement("span");
        content.id = "helpContent_id";
        document.getElementById("helpMenuContent_id").appendChild(content);

        let backButton: HTMLButtonElement = document.createElement("button");
        backButton.id = "helpNextButton_id";
        backButton.classList.add("gameMenuButtons");
        backButton.classList.add("diceCupButtons");
        document.getElementById("helpMenuRightButtonArea_id").appendChild(backButton);

        let backIcon: HTMLImageElement = document.createElement("img");
        backIcon.classList.add("diceCupButtonsIcons");
        backIcon.src = "Game/Assets/images/menuButtons/left.svg";
        backButton.appendChild(backIcon);

        backButton.addEventListener("click", () => {
            playSFX(buttonClick);
            helpPages > 1 && changePage(helpPages-=1);
        });

        let nextButton: HTMLButtonElement = document.createElement("button");
        nextButton.id = "helpNextButton_id";
        nextButton.classList.add("gameMenuButtons");
        nextButton.classList.add("diceCupButtons");
        document.getElementById("helpMenuRightButtonArea_id").appendChild(nextButton);

        let nextIcon: HTMLImageElement = document.createElement("img");
        nextIcon.classList.add("diceCupButtonsIcons");
        nextIcon.src = "Game/Assets/images/menuButtons/right.svg";
        nextButton.appendChild(nextIcon);

        nextButton.addEventListener("click", () => {
            playSFX(buttonClick);
            helpPages < helpPagesContent.length && changePage(helpPages+=1);
        });

        changePage(helpPages);
    }

    async function changePage(_page: number): Promise<void> {
        document.getElementById("helpAlert_id").innerHTML = language.menu.help.page + " " + _page + "/" + helpPagesContent.length;
        document.getElementById("helpSubtitle_id").innerHTML = "";
        document.getElementById("helpContent_id").innerHTML = "";
        switch (_page) {
            case 1:
                document.getElementById("helpSubtitle_id").innerHTML = language.menu.help.page_1.title;
                document.getElementById("helpContent_id").innerHTML = language.menu.help.page_1.content;
                break;
            case 2:
                document.getElementById("helpSubtitle_id").innerHTML = language.menu.help.page_2.title;
                document.getElementById("helpContent_id").innerHTML = language.menu.help.page_2.content;
                break;
            case 3:
                document.getElementById("helpSubtitle_id").innerHTML = language.menu.help.page_3.title;

                splitContent = language.menu.help.page_3.content.split("<br>");
                let iconLengths: number[] = [3, 6, 1, 1, 1];
                let counter: number = 0;

                for (let i = 0; i < 5; i++) {
                    let row: HTMLDivElement = document.createElement("div");
                    row.id = "helpRow3";
                    document.getElementById("helpContent_id").appendChild(row);

                    let subContent: HTMLSpanElement = document.createElement("span");
                    subContent.innerHTML = "· " + splitContent[i];
                    row.appendChild(subContent);

                    let iconContainer: HTMLDivElement = document.createElement("div");
                    iconContainer.id = "helpIconContainer";
                    row.appendChild(iconContainer);

                    for (let j = 0; j < iconLengths[i]; j++) {
                        let icon: HTMLImageElement = document.createElement("img");
                        icon.classList.add("helpIcons");
                        icon.src = await loadIcon(counter + j);
                        iconContainer.appendChild(icon);
                    }

                    counter += iconLengths[i];
                }
                break;
            case 4:
                document.getElementById("helpSubtitle_id").innerHTML = language.menu.help.page_4.title;

                splitContent = language.menu.help.page_4.content.split("<br>");
                let iconArray: number[] = [0, 4, 9, 10, 11];

                for (let i = 0; i < 5; i++) {
                    let row: HTMLDivElement = document.createElement("div");
                    row.id = "helpRow4";
                    document.getElementById("helpContent_id").appendChild(row);

                    let icon: HTMLImageElement = document.createElement("img");
                    icon.classList.add("helpIcons");
                    icon.src = await loadIcon(iconArray[i]);
                    row.appendChild(icon);
    
                    let subContent: HTMLSpanElement = document.createElement("span");
                    subContent.innerHTML = splitContent[i];
                    row.appendChild(subContent);
                }

                let example: HTMLImageElement = document.createElement("img");
                example.id = "helpExample_id";
                example.classList.add("exampleIcons");
                example.src = "Game/Assets/images/example.svg";
                document.getElementById("helpContent_id").appendChild(example);

                break;
            default:
                break;
        }
    }

    async function loadIcon(_icon: number): Promise<string> {
        let response: Response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories: ScoringCategoryDao[] = await response.json();

        return categories[_icon].image;
    }
}