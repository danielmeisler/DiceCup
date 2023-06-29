

namespace DiceCup {

    export async function resizeScreenresolution(): Promise<void> {
        let width = document.documentElement.clientWidth * window.devicePixelRatio;
        let testviewport = document.querySelector("meta[name=viewport]");
        testviewport.setAttribute('content', 'width=' + width + ', minimum-scale: 1');
        document.documentElement.style.transform = 'scale( 1 / window.devicePixelRatio )';
        document.documentElement.style.transformOrigin = 'top left';
    }

}