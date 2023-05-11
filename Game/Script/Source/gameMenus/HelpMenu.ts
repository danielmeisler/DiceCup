namespace DiceCup {

    export function helpMenu(): void {
        new SubMenu(MenuPage.help, "help", language.menu.help.title);
    }
}