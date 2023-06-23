namespace DiceCup {
    
    import ƒ = FudgeCore;

    export function update(_event: Event): void {
        ƒ.Physics.simulate();  // if physics is included and used

        if(document.hidden){
            muteAll();
        } else {
            changeVolume(0);
            changeVolume(1);
        }

        switch (viewportState) {
            case ViewportState.menu:
                viewport.camera.mtxPivot.lookAt(new ƒ.Vector3(0, 0.75, 0))
                viewport.camera.mtxPivot.translateX(0.02);
                break;
        
            default:
                break;
        }

        viewport.draw();
        ƒ.AudioManager.default.update();
    }
}