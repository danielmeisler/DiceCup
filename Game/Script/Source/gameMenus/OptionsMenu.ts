namespace DiceCup {

    // -- Variable declaration --

    // Variables for music and sound effect volumes
    export let sfxVolume: number = localStorage.getItem("volume") ? parseInt(localStorage.getItem("volume")) : 50;
    export let musicVolume: number = localStorage.getItem("musicVolume") ? parseInt(localStorage.getItem("musicVolume")) : 50;

    // Creates a submenu for the options screen where the player can change settings related to the whole application like volume, language or game settings
    export function optionsMenu(): void {
        new SubMenu(MenuPage.options, "options", language.menu.settings.title);

        let contentContainer: HTMLDivElement = document.createElement("div");
        contentContainer.id = "optionsContentContainer_id";
        contentContainer.classList.add("lobbyContainer");
        document.getElementById("optionsMenuContent_id").appendChild(contentContainer);

        // Creates a reset button to return to default factory settings
        let resetButton: HTMLButtonElement = document.createElement("button");
        resetButton.id = "optionsStartButton_id";
        resetButton.classList.add("gameMenuStartButtons");
        resetButton.classList.add("gameMenuButtons");
        resetButton.classList.add("diceCupButtons");
        resetButton.innerHTML = language.menu.settings.reset_button;
        document.getElementById("optionsMenuRightButtonArea_id").appendChild(resetButton);

        resetButton.addEventListener("click", () => {
            playSFX(buttonClick);
            localStorage.clear();
            localStorage.setItem("optionsMenu", "true");
            location.reload();
        });

        // Creates the gridlayout for the content
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 2; col++) {
                let gridContainer: HTMLDivElement = document.createElement("div");
                gridContainer.id = "optionsGrid_id_" + row + "_" + col;
                gridContainer.classList.add("optionsRow_" + row);
                gridContainer.classList.add("optionsColumn_" + col);
                contentContainer.appendChild(gridContainer);
            }
        }
    
        // Creates the music volume controls
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
            playSFX(buttonClick);
            if (musicVolume < 100) {
                musicVolume += 10;
                musicControl.innerHTML = musicVolume + "%";
                musicSwitchButtonLeft.disabled = false;
                musicSwitchButtonLeftIcon.style.opacity = "100%";
                changeVolume(0);
            }
            if (musicVolume == 100) {
                musicSwitchButtonRight.disabled = false;
                musicSwitchButtonRightIcon.style.opacity = "0";
            }
            localStorage.setItem("musicVolume", musicVolume.toString());
        });
        musicSwitchButtonLeft.addEventListener("click", () => {
            playSFX(buttonClick);
            if (musicVolume > 0) {
                musicVolume -= 10;
                musicControl.innerHTML = musicVolume + "%";
                musicSwitchButtonRight.disabled = false;
                musicSwitchButtonRightIcon.style.opacity = "100%";
                changeVolume(0);
            }
            if (musicVolume == 0) {
                musicSwitchButtonLeft.disabled = false;
                musicSwitchButtonLeftIcon.style.opacity = "0";
            }
            localStorage.setItem("musicVolume", musicVolume.toString());
        });

        if (musicVolume == 100) {
            musicSwitchButtonRight.disabled = false;
            musicSwitchButtonRightIcon.style.opacity = "0";
        } else if (musicVolume == 0) {
            musicSwitchButtonLeft.disabled = false;
            musicSwitchButtonLeftIcon.style.opacity = "0";
        }

        // Creates the sfx volume controls
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
            playSFX(buttonClick);
            if (sfxVolume < 100) {
                sfxVolume += 10;
                soundControl.innerHTML = sfxVolume + "%";
                switchButtonLeft.disabled = false;
                switchButtonLeftIcon.style.opacity = "100%";
                changeVolume(1);
            }
            if (sfxVolume == 100) {
                switchButtonRight.disabled = true;
                switchButtonRightIcon.style.opacity = "0";
            }
            localStorage.setItem("volume", sfxVolume.toString());
        });
        switchButtonLeft.addEventListener("click", () => {
            playSFX(buttonClick);
            if (sfxVolume > 0) {
                sfxVolume -= 10;
                soundControl.innerHTML = sfxVolume + "%";
                switchButtonRight.disabled = false;
                switchButtonRightIcon.style.opacity = "100%";
                changeVolume(1);
            }
            if (sfxVolume == 0) {
                switchButtonLeft.disabled = true;
                switchButtonLeftIcon.style.opacity = "0";
            }
            localStorage.setItem("volume", sfxVolume.toString());
        });

        if (sfxVolume == 100) {
            switchButtonRight.disabled = true;
            switchButtonRightIcon.style.opacity = "0";
        } else if (sfxVolume == 0) {
            switchButtonLeft.disabled = true;
            switchButtonLeftIcon.style.opacity = "0";
        }

        // Creates the language switch controls
        let languageTag: HTMLSpanElement = document.createElement("span");
        languageTag.id = "optionsLanguageTag_id";
        languageTag.innerHTML = language.menu.settings.language.title;
        document.getElementById("optionsGrid_id_2_0").appendChild(languageTag);

        let languageControlContainer: HTMLDivElement = document.createElement("div");
        languageControlContainer.id = "optionsLanguageContainer_id";
        document.getElementById("optionsGrid_id_2_1").appendChild(languageControlContainer);

        let languageControlButton: HTMLButtonElement = document.createElement("button");
        languageControlButton.id = "optionsLanguageButton_id";
        languageControlButton.innerHTML = languageTranslation(currentLanguage) + " ▾";
        languageControlContainer.appendChild(languageControlButton);

        let languageControlMenu: HTMLDivElement = document.createElement("div");
        languageControlMenu.classList.add("optionsLanguageMenu");
        languageControlButton.appendChild(languageControlMenu);

        for (let i = 0; i < Object.values(Languages).length; i++) {
            let languageControlButton: HTMLButtonElement = document.createElement("button");
            languageControlButton.classList.add("optionsLanguageMenuContent");
            languageControlButton.innerHTML = languageTranslation(Object.values(Languages)[i]);
            languageControlMenu.appendChild(languageControlButton);
            languageControlButton.addEventListener("click", () => {                 
                playSFX(buttonClick);
                localStorage.setItem("language", Object.values(Languages)[i]);
                localStorage.setItem("optionsMenu", "true");
                location.reload()
            });
        }

        languageControlButton.addEventListener("click", () => {                 
            playSFX(buttonClick);
            languageControlMenu.classList.contains("optionsShowLanguages") ? languageControlMenu.classList.remove("optionsShowLanguages") : languageControlMenu.classList.add("optionsShowLanguages") 
        } );

        // Creates the controls for the hud visibility
        let helpCategory: HTMLSpanElement = document.createElement("span");
        helpCategory.id = "optionsHelpCategory_id";
        helpCategory.innerHTML = language.menu.settings.help_category_hud.title;
        document.getElementById("optionsGrid_id_3_0").appendChild(helpCategory);

        let helpCategoryContainer: HTMLDivElement = document.createElement("div");
        helpCategoryContainer.id = "optionsHelpCategoryContainer_id";
        document.getElementById("optionsGrid_id_3_1").appendChild(helpCategoryContainer);

        let helpCategoryCheckbox: HTMLInputElement = document.createElement("input");
        helpCategoryCheckbox.type = "checkbox";
        if (localStorage.getItem("helpCategoryHud")) {
            if (localStorage.getItem("helpCategoryHud") === "true") {
                helpCategoryCheckbox.checked = true;
                helpCategoryHud = true;
            } else if (localStorage.getItem("helpCategoryHud") === "false") {
                helpCategoryCheckbox.checked = false;
                helpCategoryHud = false;
            }
        } else {
            helpCategoryCheckbox.checked = true;
        }
        helpCategoryContainer.appendChild(helpCategoryCheckbox);

        helpCategoryCheckbox.addEventListener("change", function() {
            if (this.checked) {
                helpCategoryHud = true;
                localStorage.setItem("helpCategoryHud", "true");
            } else {
                helpCategoryHud = false;
                localStorage.setItem("helpCategoryHud", "false");
            }
        });

    }

}