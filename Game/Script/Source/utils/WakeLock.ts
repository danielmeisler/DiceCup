namespace DiceCup {
    import ƒ = FudgeCore;

    // -- Variable declaration --

    // Stores the wakelock object
    let wakeLock: any = null;
    // The timer id to reset and delete the timer
    let timerID: number;

    // Enables the wakelock so the screen doesn't go in standby
    export async function enableWakeLock(): Promise<boolean> {
        if ("wakeLock" in navigator) {
            // @ts-ignore
            wakeLock = await navigator.wakeLock.request("screen");
            resetWakeLock();
        }
        return (wakeLock != null);
    }

    // Disables the wakelock if the phone wasn't touched in a while so the phone can go in standby
    export function disableWakeLock(): void {
        wakeLock && wakeLock.release().then(() => {wakeLock = null});
    }

    // Resets the wakelock everytime an action is performed so the screen doesn#t go in standby while playing
    export function resetWakeLock(): void {
        timerID && ƒ.Time.game.deleteTimer(timerID);
        timerID = ƒ.Time.game.setTimer(30000, 1, disableWakeLock);
    }
}