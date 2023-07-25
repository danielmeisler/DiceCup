namespace DiceCup{
    export class SubMenu {

        // -- Variable declaration --

        // Stores the menu page
        private menu: MenuPage;
        // Stores the menu page id
        private id: string;
        // Stores the wanted title for this submenu
        private title: string;
    
        // Constructor for creating an empty submenu template
        constructor(_menu: MenuPage, _id: string, _title: string) {
          this.menu = _menu;
          this.id = _id;
          this.title = _title;
          this.createSubMenu();
        }

        // Creates an empty submenu with given attributes to fill in its own function (gameMenus folder)
        public createSubMenu(): void {
            // Creates simple construct with background and title, content and button area (top to bottom)
            let background: HTMLDivElement = document.createElement("div");
            background.id = this.menu;
            background.classList.add("gameMenus");
            background.classList.add("subGameMenus");
            background.style.visibility = "hidden";
            document.getElementById("gameMenu_id").appendChild(background);
    
            let title: HTMLSpanElement = document.createElement("span");
            title.id = this.id + "MenuTitle_id";
            title.classList.add("gameMenuTitles");
            title.innerHTML = this.title;
            background.appendChild(title);
    
            let content: HTMLDivElement = document.createElement("div");
            content.id = this.id + "MenuContent_id";
            content.classList.add("gameMenuContent");
            background.appendChild(content);
    
            // Creates simple button area with important standard buttons like a back button to get to the main menu
            let buttonArea: HTMLDivElement = document.createElement("div");
            buttonArea.id = this.id + "MenuButtons_id";
            buttonArea.classList.add("gameMenuButtonArea");
            background.appendChild(buttonArea);

            let leftButtonArea: HTMLDivElement = document.createElement("div");
            leftButtonArea.id = this.id + "MenuLeftButtonArea_id";
            leftButtonArea.classList.add("gameMenuLeftButtonArea");
            buttonArea.appendChild(leftButtonArea);

            let midButtonArea: HTMLDivElement = document.createElement("div");
            midButtonArea.id = this.id + "MenuMidButtonArea_id";
            midButtonArea.classList.add("gameMenuMidButtonArea");
            buttonArea.appendChild(midButtonArea);

            let alert: HTMLSpanElement = document.createElement("span");
            alert.id = this.id + "Alert_id";
            alert.classList.add("gameMenuAlert");
            midButtonArea.appendChild(alert);

            let rightButtonArea: HTMLDivElement = document.createElement("div");
            rightButtonArea.id = this.id + "MenuRightButtonArea_id";
            rightButtonArea.classList.add("gameMenuRightButtonArea");
            buttonArea.appendChild(rightButtonArea);
    
            let returnButton: HTMLButtonElement = document.createElement("button");
            returnButton.id = this.id + "MenuReturnButton_id";
            returnButton.classList.add("gameMenuButtons");
            returnButton.classList.add("diceCupButtons");
            leftButtonArea.appendChild(returnButton);
    
            let returnIcon: HTMLImageElement = document.createElement("img");
            returnIcon.classList.add("diceCupButtonsIcons");
            returnIcon.src = "Game/Assets/images/menuButtons/return.svg";
            returnButton.appendChild(returnIcon);
            returnButton.addEventListener("click", () => {
                playSFX(buttonClick);
                switchMenu(MenuPage.main);
            });
        }
    }

}