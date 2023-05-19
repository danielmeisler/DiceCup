namespace DiceCup {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Dice Cup is running!");
  
  export let viewport: ƒ.Viewport;
  export let viewportState: ViewportState;
  export let currentLanguage: Languages;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    enableWakeLock();
    load();
  }

  async function load(): Promise<void> {
    let diceCup: HTMLDivElement = document.createElement("div");
    diceCup.id = "DiceCup";
    document.querySelector("body").appendChild(diceCup);
    
    let graph: ƒ.Node = viewport.getBranch();
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.AudioManager.default.listenTo(graph);

    diceCup.style.background = "black";
    currentLanguage = await <Languages>localStorage.getItem("language") || Languages.english;
    await initBackgroundMusic(0);
    await chooseLanguage(currentLanguage);
    await changeViewportState(ViewportState.menu);
    await initMenu();
    diceCup.style.background = "transparent";

  }

}