namespace DiceCup {

    let volume: number = localStorage.getItem("volume") ? parseInt(localStorage.getItem("volume")) : 50;

    export function optionsMenu(): void {
        new SubMenu(MenuPage.options, "options", language.menu.settings.title);

        let contentContainer: HTMLDivElement = document.createElement("div");
        contentContainer.id = "optionsContentContainer_id";
        contentContainer.classList.add("lobbyContainer");
        document.getElementById("optionsMenuContent_id").appendChild(contentContainer);

        let resetButton: HTMLButtonElement = document.createElement("button");
        resetButton.id = "optionsStartButton_id";
        resetButton.classList.add("gameMenuStartButtons");
        resetButton.classList.add("gameMenuButtons");
        resetButton.classList.add("diceCupButtons");
        resetButton.innerHTML = "Reset";
        document.getElementById("optionsMenuRightButtonArea_id").appendChild(resetButton);

        resetButton.addEventListener("click", () => {
            localStorage.clear();
            localStorage.setItem("optionsMenu", "true");
            location.reload();
        });

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                let gridContainer: HTMLDivElement = document.createElement("div");
                gridContainer.id = "optionsGrid_id_" + row + "_" + col;
                gridContainer.classList.add("optionsRow_" + row);
                gridContainer.classList.add("optionsColumn_" + col);
                contentContainer.appendChild(gridContainer);
            }
        }

        let soundControlTag: HTMLSpanElement = document.createElement("span");
        soundControlTag.id = "optionsSoundControlTag_id";
        soundControlTag.innerHTML = "VOLUME";
        document.getElementById("optionsGrid_id_0_0").appendChild(soundControlTag);
    
        let soundControlContainer: HTMLDivElement = document.createElement("div");
        soundControlContainer.id = "optionsSoundControlContainer_id";
        document.getElementById("optionsGrid_id_0_1").appendChild(soundControlContainer);

        let switchButtonLeft: HTMLButtonElement = document.createElement("button");
        switchButtonLeft.classList.add("optionsSwitchVolume");
        soundControlContainer.appendChild(switchButtonLeft);

        let switchButtonLeftIcon: HTMLImageElement = document.createElement("img");
        switchButtonLeftIcon.classList.add("optionsSwitchVolumeIcons");
        switchButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        switchButtonLeft.appendChild(switchButtonLeftIcon);

        let soundControl: HTMLSpanElement = document.createElement("span");
        soundControl.id = "optionsSoundControl_id";
        soundControl.innerHTML = volume + "%";
        soundControlContainer.appendChild(soundControl);

        let switchButtonRight: HTMLButtonElement = document.createElement("button");
        switchButtonRight.classList.add("optionsSwitchVolume");
        soundControlContainer.appendChild(switchButtonRight);

        let switchButtonRightIcon: HTMLImageElement = document.createElement("img");
        switchButtonRightIcon.classList.add("optionsSwitchVolumeIcons");
        switchButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        switchButtonRight.appendChild(switchButtonRightIcon);

        switchButtonRight.addEventListener("click", () => {
            if (volume < 100) {
                volume += 10;
                soundControl.innerHTML = volume + "%";
                switchButtonLeft.style.visibility = "visible";
            }
            if (volume == 100) {
                switchButtonRight.style.visibility = "hidden";
            }
            localStorage.setItem("volume", volume.toString());
        });
        switchButtonLeft.addEventListener("click", () => {
            if (volume > 0) {
                volume -= 10;
                soundControl.innerHTML = volume + "%";
                switchButtonRight.style.visibility = "visible";
            }
            if (volume == 0) {
                switchButtonLeft.style.visibility = "hidden";
            }
            localStorage.setItem("volume", volume.toString());
        });

        if (volume == 100) {
            switchButtonRight.style.visibility = "hidden";
        } else if (volume == 0) {
            switchButtonLeft.style.visibility = "hidden";
        }

        let languageTag: HTMLSpanElement = document.createElement("span");
        languageTag.id = "optionsLanguageTag_id";
        languageTag.innerHTML = "LANGUAGE";
        document.getElementById("optionsGrid_id_1_0").appendChild(languageTag);

        let languageControlContainer: HTMLDivElement = document.createElement("div");
        languageControlContainer.id = "optionsLanguageContainer_id";
        document.getElementById("optionsGrid_id_1_1").appendChild(languageControlContainer);

        let languageControlButton: HTMLButtonElement = document.createElement("button");
        languageControlButton.id = "optionsLanguageButton_id";
        languageControlButton.innerHTML = currentLanguage + "▾";
        languageControlContainer.appendChild(languageControlButton);

        let languageControlMenu: HTMLDivElement = document.createElement("div");
        languageControlMenu.classList.add("optionsLanguageMenu");
        languageControlButton.appendChild(languageControlMenu);

        for (let i = 0; i < Object.values(Languages).length; i++) {
            let languageControlButton: HTMLButtonElement = document.createElement("button");
            languageControlButton.classList.add("optionsLanguageMenuContent");
            languageControlButton.innerHTML = Object.values(Languages)[i];
            languageControlMenu.appendChild(languageControlButton);

            languageControlButton.addEventListener("click", () => { localStorage.setItem("language", Object.values(Languages)[i]), localStorage.setItem("optionsMenu", "true") , location.reload()});
        }

        languageControlButton.addEventListener("click", () => { languageControlMenu.classList.contains("optionsShowLanguages") ? languageControlMenu.classList.remove("optionsShowLanguages") : languageControlMenu.classList.add("optionsShowLanguages") } );
    }
}