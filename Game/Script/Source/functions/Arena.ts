namespace DiceCup{
    import ƒ = FudgeCore;

    export function changeFloor(_change: boolean) {
        let graph: ƒ.Node = viewport.getBranch();
        let arena: ƒ.Node = graph.getChildrenByName("Arena")[0];
        let game_floor: ƒ.Node = arena.getChildrenByName("Floor_game")[0];
        let menu_floor: ƒ.Node = arena.getChildrenByName("Floor_menu")[0];
        game_floor.activate(_change);
        menu_floor.activate(!_change);
    }

    export function activateCover(_change: boolean) {
        let graph: ƒ.Node = viewport.getBranch();
        let arena: ƒ.Node = graph.getChildrenByName("Arena")[0];
        let cover: ƒ.Node = arena.getChildrenByName("Game_cover")[0];
        cover.activate(_change);
    }

}