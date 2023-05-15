namespace DiceCup{
    import ƒ = FudgeCore;

    let backgroundAudio: ƒ.ComponentAudio;

    export function initBackgroundMusic(_track: number): void {
        let soundArray: string[] = ["Audio|2023-05-15T19:01:45.890Z|78438"];
        let track: ƒ.Audio = <ƒ.Audio>ƒ.Project.resources[soundArray[_track]];
        backgroundAudio = new ƒ.ComponentAudio(track, true, false);
        backgroundAudio.connect(true);
        backgroundAudio.volume = setVolume(musicVolume);
        backgroundAudio.setAudio(track);

        backgroundMusic(true);
    }

    export function backgroundMusic(_on: boolean): void {
        backgroundAudio.play(_on); 
    }

    export function nextTrack(_track: number): void {
        backgroundMusic(false);
        initBackgroundMusic(_track);
    }

    export function changeVolume(): void {
        backgroundAudio.volume = setVolume(musicVolume);
    }

    export function playSFX(_sfx: string): void{
        let cmpAudio: ƒ.ComponentAudio;
        let audio: ƒ.Audio = <ƒ.Audio>ƒ.Project.resources[_sfx];
        cmpAudio = new ƒ.ComponentAudio(audio, false, false);
        cmpAudio.connect(true);
        cmpAudio.volume = setVolume(sfxVolume);
        cmpAudio.setAudio(audio);

        cmpAudio.play(true); 
    }

    function setVolume(_volume: number): number {
        return _volume /= 1000;
    }
}