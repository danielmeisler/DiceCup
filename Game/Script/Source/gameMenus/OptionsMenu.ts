namespace DiceCup {

    export function optionsMenu(): void {
        new SubMenu(MenuPage.options, "options", language.menu.settings.title);
    }
}