namespace DiceCup {
    import ƒ = FudgeCore;
    let wakeLock: any = null;
    let timer: number;

    export async function enableWakeLock(): Promise<boolean> {
        if ("wakeLock" in navigator) {
            // @ts-ignore
            wakeLock = await navigator.wakeLock.request("screen");
            resetTimer();
        }
        return (wakeLock != null);
    }

    export function disableWakeLock(): void {
        wakeLock && wakeLock.release().then(() => {wakeLock = null});
    }

    export function resetTimer(): void {
        timer && ƒ.Time.game.deleteTimer(timer);
        timer = ƒ.Time.game.setTimer(30000, 1, disableWakeLock);
    }
}