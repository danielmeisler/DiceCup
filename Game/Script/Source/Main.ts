namespace DiceCup {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Dice Cup is running!");

  // -- Variable declaration --
  
  // Creates all needed variables for the whole application
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

  // Start function when the application is loaded
  // Enables wakelock and starts the load process while showing the loading screen with fudge logo
  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    enableWakeLock();
    playSFX(buttonClick);
    ƒ.Time.game.setTimer(2000, 1, load);
  } 

  // Loads all required resources for the game while showing the loading screen
  async function load(): Promise<void> {
    // Resizes the resolution
    await resizeScreenresolution();
    
    // Creates a DiceCup div so all divs are hidden and well-ordered
    let diceCup: HTMLDivElement = document.createElement("div");
    diceCup.id = "DiceCup";
    document.querySelector("body").appendChild(diceCup);

    // Gets the main graph and sets up the audio manager
    let graph: ƒ.Node = viewport.getBranch();
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
    ƒ.AudioManager.default.listenTo(graph);

    // Declares needed variables for the game like language etc.
    categoriesLength = Object.keys(ScoringCategory).length / 2;
    dicesLength = Object.keys(DiceColor).length;
    gameMode = parseInt(localStorage.getItem("gamemode")) || GameMode.normal;
    currentLanguage = <Languages>localStorage.getItem("language") || Languages.english;

    // Starts the client, the menus and loads the chosen language and viewport state
    await initBackgroundMusic(0);
    await chooseLanguage(currentLanguage);
    await changeViewportState(ViewportState.menu);
    await initMenu();
    startClient();

    // Removes the loading screen when finished with loading
    document.getElementById("loadingScreen").remove(); 
  }
}