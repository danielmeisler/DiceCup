namespace DiceCup {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Dice Cup is running!");
  
  export let viewport: ƒ.Viewport;
  export let viewportState: ViewportState;
  export let currentLanguage: Languages;
  export let playerMode: PlayerMode;
  export let gameMode: GameMode;
  export let inGame: boolean = false;
  export let helpCategoryHud: boolean = true;
  export let categoriesLength: number;
  export let dicesLength: number;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    enableWakeLock();
    playSFX(buttonClick);
    ƒ.Time.game.setTimer(2000, 1, load);
  }

  async function load(): Promise<void> {
    let diceCup: HTMLDivElement = document.createElement("div");
    diceCup.id = "DiceCup";
    document.querySelector("body").appendChild(diceCup);

    let graph: ƒ.Node = viewport.getBranch();
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.AudioManager.default.listenTo(graph);

    categoriesLength = Object.keys(ScoringCategory).length / 2;
    dicesLength = Object.keys(DiceColor).length;
    gameMode = parseInt(localStorage.getItem("gamemode")) || GameMode.normal;
    currentLanguage = <Languages>localStorage.getItem("language") || Languages.english;
    await initBackgroundMusic(0);
    await chooseLanguage(currentLanguage);
    await changeViewportState(ViewportState.menu);
    await initMenu();
    startClient();
    document.getElementById("loadingScreen").remove();
  }

}