namespace DiceCup {
    import ƒ = FudgeCore;

    // Changes the viewport state for the different camera angles and perspectives
    export async function changeViewportState(_viewportState: ViewportState): Promise<void> {
        switch (_viewportState) {
            case ViewportState.menu: 
                await menuViewport();
            break;
            case ViewportState.transition: 
                await transitionViewport();
            break;
            case ViewportState.game: 
                await gameViewport();
            break;
        }
        viewportState = _viewportState;
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }

    // Changes the camera and arena for the main menu background
    // Rotates the camera in the update function
    async function menuViewport(): Promise<void> {   
        let diceColors: RgbaDao[] = await loadDiceColors();
        changeFloor(false);
        activateCover(false);
        
        viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 0.4, -3);

        for (let i = 0, color = 0; i < dicesLength; i++, color+=0.5) {
            new Dice(diceColors[Math.floor(color)], Math.floor(color), 2);
        }
    }

    // For possible transition animations with tracking shots
    async function transitionViewport(): Promise<void> {
        // let response: Response = await fetch("Game/Script/Data/diceColors.json");
        // let diceColors: RgbaDao[] = await response.json();
        // changeFloor(false);
        // activateCover(false);
        
        // viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 0.8, -5);

        // for (let i = 0, color = 0; i < dicesLength; i++, color+=0.5) {
        //     dices.push(new Dice(diceColors[Math.floor(color)], Math.floor(color), 2));
        // }

    }
    
    // Changes the arena and camera perspective for ingame situations
    async function gameViewport(): Promise<void> {  
        viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 4, -2.5);
        viewport.camera.mtxPivot.rotation = new ƒ.Vector3(60, 0, 0);

        changeFloor(true);
        activateCover(true);
    }
}