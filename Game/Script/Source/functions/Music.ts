namespace DiceCup{
    import ƒ = FudgeCore;

    export let buttonClick: string = "Audio|2023-05-17T14:09:29.972Z|51408";
    let themes: string[] = ["Audio|2023-05-15T19:01:45.890Z|78438", "Audio|2023-05-18T18:10:25.157Z|72912", "Audio|2023-05-18T18:10:38.906Z|20682"];

    let backgroundAudio: ƒ.ComponentAudio;
    let sfxAudio: ƒ.ComponentAudio;

    export function initBackgroundMusic(_track: number): void {
        let track: ƒ.Audio = <ƒ.Audio>ƒ.Project.resources[themes[_track]];
        backgroundAudio = new ƒ.ComponentAudio(track, true, false);
        backgroundAudio.connect(true);
        backgroundAudio.volume = setMusicVolume(musicVolume);
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

    export function changeVolume(_mode: number): void {
        switch (_mode) {
            case 0:
                backgroundAudio.volume = setMusicVolume(musicVolume);
                break;
            case 1:
                sfxAudio.volume = setSFXVolume(sfxVolume);
                break;
            default:
                break;
        }
    }

    export function playSFX(_sfx: string): void{
        let audio: ƒ.Audio = <ƒ.Audio>ƒ.Project.resources[_sfx];
        sfxAudio = new ƒ.ComponentAudio(audio, false, false);
        sfxAudio.connect(true);
        sfxAudio.volume = setSFXVolume(sfxVolume);
        sfxAudio.setAudio(audio);

        sfxAudio.play(true); 
    }

    export function muteAll(): void {
        backgroundAudio.volume = 0;
        sfxAudio.volume = 0;
    }

    function setMusicVolume(_volume: number): number {
        return _volume /= 1000;
    }

    function setSFXVolume(_volume: number): number {
        return _volume /= 100;
    }
}