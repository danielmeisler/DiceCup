namespace DiceCup {
    import ƒ = FudgeCore;

    export function changeViewportState(_viewportState: ViewportState) {
        switch (_viewportState) {
            case ViewportState.menu: 
                menuViewport();
            break;
            case ViewportState.transition: 
                transitionViewport();
            break;
            case ViewportState.game: 
                gameViewport();
            break;
        }
        viewportState = _viewportState;
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }

    async function menuViewport() {   
        let response: Response = await fetch("Game/Script/Data/diceColors.json");
        let diceColors: RgbaDao[] = await response.json();
        
        viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 1, -5);

        for (let i = 0, color = 0; i < 12; i++, color+=0.5) {
            new Dice("Dice_" + i, diceColors[Math.floor(color)], Math.floor(color), 2);
        }

        changeFloor(false);

    }

    async function transitionViewport() {
        let response: Response = await fetch("Game/Script/Data/diceColors.json");
        let diceColors: RgbaDao[] = await response.json();
        
        viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 0.8, -5);

        for (let i = 0, color = 0; i < 12; i++, color+=0.5) {
            dices.push(new Dice("Dice_" + i, diceColors[Math.floor(color)], Math.floor(color), 2));
        }

        changeFloor(false);

    }
    
    async function gameViewport() {  
        viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 8, -4);
        viewport.camera.mtxPivot.rotation = new ƒ.Vector3(60, 0, 0);

        changeFloor(true);
    }
}