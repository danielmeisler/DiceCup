namespace DiceCup {
    
    import ƒ = FudgeCore;

    // The Update function draws the viewport and simulates the physics every frame
    export function update(_event: Event): void {
        // FUDGE Physics
        ƒ.Physics.simulate();

        // Mutes all sounds if browser tab is switched or app is in the background on the phone
        if(document.hidden){
            muteAll();
        } else {
            changeVolume(0);
            changeVolume(1);
        }

        // Changes the camera position and behaviour depending in which viewport state the game is in
        switch (viewportState) {
            case ViewportState.menu:
                viewport.camera.mtxPivot.lookAt(new ƒ.Vector3(0, 0.4, 0));
                viewport.camera.mtxPivot.translateX(0.02);
                break;
        
            default:
                break;
        }

        // Draws the viewport and updates the AudioManager
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
}