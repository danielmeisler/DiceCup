namespace DiceCup{
    export class SubMenu {

        private menu: MenuPages;
        private id: string;
        private title: string;
    
        constructor(_menu: MenuPages, _id: string, _title: string) {
          this.menu = _menu;
          this.id = _id;
          this.title = _title;
          this.createSubMenu();
        }

        public createSubMenu(): void {
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
    
            let buttonArea: HTMLDivElement = document.createElement("div");
            buttonArea.id = this.id + "MenuButtons_id";
            buttonArea.classList.add("gameMenuButtonArea");
            background.appendChild(buttonArea);

            let leftButtonArea: HTMLDivElement = document.createElement("div");
            leftButtonArea.id = this.id + "MenuLeftButtonArea_id";
            leftButtonArea.classList.add("gameMenuLeftButtonArea");
            buttonArea.appendChild(leftButtonArea);

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
            returnIcon.classList.add("gameMenuButtonsIcons");
            returnIcon.src = "Game/Assets/images/menuButtons/return.svg";
            returnButton.appendChild(returnIcon);
            returnButton.addEventListener("click", () => {
                switchMenu(MenuPages.main);
            });
        }
    }

}