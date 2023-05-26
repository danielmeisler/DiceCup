namespace DiceCup {

    let helpPages: number = 1;
    let helpPagesTitle: string[] = [];
    let helpPagesContent: string[] = [];
    let content: HTMLSpanElement[] = [];

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
        loadPages();
    }

    async function loadPages(): Promise<void> {
        for (let i = 0; i < helpPagesContent.length; i++) {
            content[i] = document.createElement("span");
            content[i].innerHTML = helpPagesContent[i];
        }
        changePage(helpPages);
    }

    async function changePage(_page: number): Promise<void> {
        document.getElementById("helpAlert_id").innerHTML = language.menu.help.page + " " + _page + "/" + helpPagesContent.length;
        document.getElementById("helpSubtitle_id").innerHTML = helpPagesTitle[_page - 1]
        document.getElementById("helpContent_id").innerHTML = content[_page - 1].innerHTML;
    }

    async function loadIcon(_icon: number): Promise<string> {
        let response: Response = await fetch("Game/Script/Data/scoringCategories.json");
        let categories: ScoringCategoryDao[] = await response.json();

        return "<img src=\"" + categories[_icon].image + "\" class=\" helpIcons \">";
    }

    function loadExample(): string {
        return "<img src=\"" + "Game/Assets/images/example.svg" + "\" class=\" exampleIcons \">";
    }
}