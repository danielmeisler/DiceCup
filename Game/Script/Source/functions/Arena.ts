namespace DiceCup{
    import ƒ = FudgeCore;

    // Changes the floor depending on the gamestate. In the menu the floor is clean so it gets blurred with the walls
    // Ingame the floor gets the fade effect like in the main menu
    export function changeFloor(_change: boolean): void {
        let graph: ƒ.Node = viewport.getBranch();
        let arena: ƒ.Node = graph.getChildrenByName("Arena")[0];
        let game_floor: ƒ.Node = arena.getChildrenByName("Floor_game")[0];
        let menu_floor: ƒ.Node = arena.getChildrenByName("Floor_menu")[0];
        game_floor.activate(_change);
        menu_floor.activate(!_change);
    }

    // Activates/Deactivates the cover so the dice can't stack on each other and cover up important dice values
    export function activateCover(_change: boolean): void {
        let graph: ƒ.Node = viewport.getBranch();
        let arena: ƒ.Node = graph.getChildrenByName("Arena")[0];
        let cover: ƒ.Node = arena.getChildrenByName("Game_cover")[0];
        cover.activate(_change);
    }

}