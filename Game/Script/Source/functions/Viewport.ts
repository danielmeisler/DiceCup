namespace DiceCup {
    import ƒ = FudgeCore;
    
    export async function initViewport() {
        // let response: Response = await fetch("Game/Script/Data/diceColors.json");
        // let diceColors: RgbaDao[] = await response.json();
        
        viewport.camera.mtxPivot.translation = new ƒ.Vector3(0, 8, -4);
        viewport.camera.mtxPivot.rotation = new ƒ.Vector3(60, 0, 0);

        // for (let i = 0, color = 0; i < 12; i++, color+=0.5) {
        //     dices.push(new Dice("Dice_" + i, diceColors[Math.floor(color)], Math.floor(color)));
        // }

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }
}