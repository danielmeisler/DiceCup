namespace DiceCup {

    export let sfxVolume: number = localStorage.getItem("volume") ? parseInt(localStorage.getItem("volume")) : 50;
    export let musicVolume: number = localStorage.getItem("musicVolume") ? parseInt(localStorage.getItem("musicVolume")) : 50;

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
        resetButton.innerHTML = language.menu.settings.reset_button;
        document.getElementById("optionsMenuRightButtonArea_id").appendChild(resetButton);

        resetButton.addEventListener("click", () => {
            localStorage.clear();
            localStorage.setItem("optionsMenu", "true");
            location.reload();
        });

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                let gridContainer: HTMLDivElement = document.createElement("div");
                gridContainer.id = "optionsGrid_id_" + row + "_" + col;
                gridContainer.classList.add("optionsRow_" + row);
                gridContainer.classList.add("optionsColumn_" + col);
                contentContainer.appendChild(gridContainer);
            }
        }
    
        let musicControlTag: HTMLSpanElement = document.createElement("span");
        musicControlTag.id = "optionsSoundControlTag_id";
        musicControlTag.innerHTML = language.menu.settings.volume.music;
        document.getElementById("optionsGrid_id_0_0").appendChild(musicControlTag);
    
        let musicControlContainer: HTMLDivElement = document.createElement("div");
        musicControlContainer.id = "optionsSoundControlContainer_id";
        document.getElementById("optionsGrid_id_0_1").appendChild(musicControlContainer);

        let musicSwitchButtonLeft: HTMLButtonElement = document.createElement("button");
        musicSwitchButtonLeft.classList.add("optionsSwitchVolume");
        musicControlContainer.appendChild(musicSwitchButtonLeft);

        let musicSwitchButtonLeftIcon: HTMLImageElement = document.createElement("img");
        musicSwitchButtonLeftIcon.classList.add("optionsSwitchVolumeIcons");
        musicSwitchButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        musicSwitchButtonLeft.appendChild(musicSwitchButtonLeftIcon);

        let musicControl: HTMLSpanElement = document.createElement("span");
        musicControl.id = "optionsSoundControl_id";
        musicControl.innerHTML = musicVolume + "%";
        musicControlContainer.appendChild(musicControl);

        let musicSwitchButtonRight: HTMLButtonElement = document.createElement("button");
        musicSwitchButtonRight.classList.add("optionsSwitchVolume");
        musicControlContainer.appendChild(musicSwitchButtonRight);

        let musicSwitchButtonRightIcon: HTMLImageElement = document.createElement("img");
        musicSwitchButtonRightIcon.classList.add("optionsSwitchVolumeIcons");
        musicSwitchButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        musicSwitchButtonRight.appendChild(musicSwitchButtonRightIcon);

        musicSwitchButtonRight.addEventListener("click", () => {
            if (musicVolume < 100) {
                musicVolume += 10;
                musicControl.innerHTML = musicVolume + "%";
                musicSwitchButtonLeft.style.visibility = "visible";
                changeVolume();
            }
            if (musicVolume == 100) {
                musicSwitchButtonRight.style.visibility = "hidden";
            }
            localStorage.setItem("musicVolume", musicVolume.toString());
        });
        musicSwitchButtonLeft.addEventListener("click", () => {
            if (musicVolume > 0) {
                musicVolume -= 10;
                musicControl.innerHTML = musicVolume + "%";
                musicSwitchButtonRight.style.visibility = "visible";
                changeVolume();
            }
            if (musicVolume == 0) {
                musicSwitchButtonLeft.style.visibility = "hidden";
            }
            localStorage.setItem("musicVolume", musicVolume.toString());
        });

        if (musicVolume == 100) {
            musicSwitchButtonRight.style.visibility = "hidden";
        } else if (musicVolume == 0) {
            musicSwitchButtonLeft.style.visibility = "hidden";
        }

        let soundControlTag: HTMLSpanElement = document.createElement("span");
        soundControlTag.id = "optionsSoundControlTag_id";
        soundControlTag.innerHTML = language.menu.settings.volume.sfx;
        document.getElementById("optionsGrid_id_1_0").appendChild(soundControlTag);
    
        let soundControlContainer: HTMLDivElement = document.createElement("div");
        soundControlContainer.id = "optionsSoundControlContainer_id";
        document.getElementById("optionsGrid_id_1_1").appendChild(soundControlContainer);

        let switchButtonLeft: HTMLButtonElement = document.createElement("button");
        switchButtonLeft.classList.add("optionsSwitchVolume");
        soundControlContainer.appendChild(switchButtonLeft);

        let switchButtonLeftIcon: HTMLImageElement = document.createElement("img");
        switchButtonLeftIcon.classList.add("optionsSwitchVolumeIcons");
        switchButtonLeftIcon.src = "Game/Assets/images/menuButtons/left.svg";
        switchButtonLeft.appendChild(switchButtonLeftIcon);

        let soundControl: HTMLSpanElement = document.createElement("span");
        soundControl.id = "optionsSoundControl_id";
        soundControl.innerHTML = sfxVolume + "%";
        soundControlContainer.appendChild(soundControl);

        let switchButtonRight: HTMLButtonElement = document.createElement("button");
        switchButtonRight.classList.add("optionsSwitchVolume");
        soundControlContainer.appendChild(switchButtonRight);

        let switchButtonRightIcon: HTMLImageElement = document.createElement("img");
        switchButtonRightIcon.classList.add("optionsSwitchVolumeIcons");
        switchButtonRightIcon.src = "Game/Assets/images/menuButtons/right.svg";
        switchButtonRight.appendChild(switchButtonRightIcon);

        switchButtonRight.addEventListener("click", () => {
            if (sfxVolume < 100) {
                sfxVolume += 10;
                soundControl.innerHTML = sfxVolume + "%";
                switchButtonLeft.style.visibility = "visible";
                changeVolume();
            }
            if (sfxVolume == 100) {
                switchButtonRight.style.visibility = "hidden";
            }
            localStorage.setItem("volume", sfxVolume.toString());
        });
        switchButtonLeft.addEventListener("click", () => {
            if (sfxVolume > 0) {
                sfxVolume -= 10;
                soundControl.innerHTML = sfxVolume + "%";
                switchButtonRight.style.visibility = "visible";
                changeVolume();
            }
            if (sfxVolume == 0) {
                switchButtonLeft.style.visibility = "hidden";
            }
            localStorage.setItem("volume", sfxVolume.toString());
        });

        if (sfxVolume == 100) {
            switchButtonRight.style.visibility = "hidden";
        } else if (sfxVolume == 0) {
            switchButtonLeft.style.visibility = "hidden";
        }

        let languageTag: HTMLSpanElement = document.createElement("span");
        languageTag.id = "optionsLanguageTag_id";
        languageTag.innerHTML = language.menu.settings.language.title;
        document.getElementById("optionsGrid_id_2_0").appendChild(languageTag);

        let languageControlContainer: HTMLDivElement = document.createElement("div");
        languageControlContainer.id = "optionsLanguageContainer_id";
        document.getElementById("optionsGrid_id_2_1").appendChild(languageControlContainer);

        let languageControlButton: HTMLButtonElement = document.createElement("button");
        languageControlButton.id = "optionsLanguageButton_id";
        languageControlButton.innerHTML = translateLanguages(currentLanguage) + " ▾";
        languageControlContainer.appendChild(languageControlButton);

        let languageControlMenu: HTMLDivElement = document.createElement("div");
        languageControlMenu.classList.add("optionsLanguageMenu");
        languageControlButton.appendChild(languageControlMenu);

        for (let i = 0; i < Object.values(Languages).length; i++) {
            let languageControlButton: HTMLButtonElement = document.createElement("button");
            languageControlButton.classList.add("optionsLanguageMenuContent");
            languageControlButton.innerHTML = translateLanguages(Object.values(Languages)[i]);
            languageControlMenu.appendChild(languageControlButton);
            languageControlButton.addEventListener("click", () => { localStorage.setItem("language", Object.values(Languages)[i]), localStorage.setItem("optionsMenu", "true") , location.reload()});
        }

        languageControlButton.addEventListener("click", () => { languageControlMenu.classList.contains("optionsShowLanguages") ? languageControlMenu.classList.remove("optionsShowLanguages") : languageControlMenu.classList.add("optionsShowLanguages") } );
    }
}