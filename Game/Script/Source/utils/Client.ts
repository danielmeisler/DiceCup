///<reference path="../../../../Library/Net/Build/Client/FudgeClient.d.ts"/>
namespace DiceCup {
    import ƒ = FudgeCore;
    import ƒClient = FudgeNet.FudgeClient;
    ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);
  
    // Create a FudgeClient for this browser tab
    export let client: ƒClient = new ƒClient();
    export let host: boolean = false;
    export let clientPlayerNumber: number;
    export let numberOfPlayers: number;
    export let currentRoom: string = "Lobby";

    // keep a list of known clients, updated with information from the server
    let clientsKnown: { [id: string]: { name?: string; isHost?: boolean; } } = {};

    window.addEventListener("load", connectToServer);
  
    export async function startClient(): Promise<void> {
      console.log(client);
      console.log("Client started...")
      document.getElementById("multiplayer_id").addEventListener("click", hndEvent);
      document.getElementById("multiplayerRenewButton_id").addEventListener("click", hndEvent);
      document.getElementById("multiplayerJoinButton_id").addEventListener("click", hndEvent);
      document.getElementById("multiplayerCreateButton_id").addEventListener("click", hndEvent);
      document.getElementById("multiplayerLobbyMenuReturnButton_id").addEventListener("click", hndEvent);
      document.getElementById("multiplayerLobbyStartButton_id").addEventListener("click", hndEvent);

      if (playerMode == PlayerMode.multiplayer) {
        document.getElementById("replayButton_id").addEventListener("click", hndEvent);
      }
      
      // document.querySelector("button#rename").addEventListener("click", rename);
      // document.querySelector("button#mesh").addEventListener("click", structurePeers);
      // document.querySelector("button#host").addEventListener("click", structurePeers);
      // document.querySelector("button#disconnect").addEventListener("click", structurePeers);
      // document.querySelector("button#reset").addEventListener("click", structurePeers);
      // document.querySelector("fieldset").addEventListener("click", sendMessage);
      // createTable();
    }
  
    export async function hndEvent (_event: Event): Promise<void> {
      if (!(_event.target instanceof HTMLButtonElement))
        return;
  
      let command: string = _event.target.id;
      switch (command) {
        case "multiplayerRenewButton_id":
        case "passwordReturnButton_id":
        case "multiplayer_id":
          client.dispatch({ command: FudgeNet.COMMAND.ROOM_LIST, route: FudgeNet.ROUTE.SERVER});
          break;
        case "multiplayerCreateButton_id":
          client.dispatch({ command: FudgeNet.COMMAND.ROOM_CREATE, route: FudgeNet.ROUTE.SERVER });
          break;
        case "multiplayerJoinButton_id":
          currentRoom = focusedIdRoom;
          console.log("Enter", focusedIdRoom );
          client.dispatch({ command: FudgeNet.COMMAND.ROOM_ENTER, route: FudgeNet.ROUTE.SERVER, content: { room: currentRoom, host: false } });
          break;
        case "multiplayerLobbyMenuReturnButton_id":
          currentRoom = "Lobby";
          client.dispatch({ command: FudgeNet.COMMAND.ROOM_LEAVE, route: FudgeNet.ROUTE.SERVER, content: { leaver_id: client.id, host: host } });
        break;
        case "nameInputButton_id":
          client.dispatch({ command: FudgeNet.COMMAND.ASSIGN_USERNAME, route: FudgeNet.ROUTE.SERVER, content: { username: username } });
        break;
        case "passwordJoinButton_id":
          currentRoom = focusedIdRoom;
          console.log("Enter", focusedIdRoom );
          let password: string = (<HTMLInputElement>document.getElementById("passwordInput_id")).value;
          client.dispatch({ command: FudgeNet.COMMAND.ROOM_ENTER, route: FudgeNet.ROUTE.SERVER, content: { room: currentRoom, host: false, password: password} });
        break;


        case "multiplayerLobbyStartButton_id": 
          client.dispatch({ command: FudgeNet.COMMAND.START_GAME, route: FudgeNet.ROUTE.SERVER });
        break;
      }
    }
  
    async function connectToServer(_event: Event): Promise<void> {
      let domServer: string = "ws://localhost:9001";
      try {
        // connect to a server with the given url
        client.connectToServer(domServer);
        await delay(1000);
        // document.forms[0].querySelector("button#login").removeAttribute("disabled");
        // document.forms[0].querySelector("button#mesh").removeAttribute("disabled");
        // document.forms[0].querySelector("button#host").removeAttribute("disabled");
        // (<HTMLInputElement>document.forms[0].querySelector("input#id")).value = client.id;
        // install an event listener to be called when a message comes in
        client.addEventListener(FudgeNet.EVENT.MESSAGE_RECEIVED, receiveMessage as unknown as EventListener);
      } catch (_error) {
        console.log(_error);
        console.log("Make sure, FudgeServer is running and accessable");
      }
    }
  
    // async function rename(_event: Event): Promise<void> {
    //   let domProposeName: HTMLInputElement = document.forms[0].querySelector("input[name=proposal]");
    //   let domName: HTMLInputElement = document.forms[0].querySelector("input[name=name]");
    //   domName.value = domProposeName.value;
    //   // associate a readable name with this client id
    //   client.loginToServer(domName.value);
    // }
  
    async function receiveMessage(_event: CustomEvent | MessageEvent): Promise<void> {
      let alertMessageList: HTMLDivElement = <HTMLDivElement>document.getElementById("multiplayerAlert_id");
      let alertPassword: HTMLDivElement = <HTMLDivElement>document.getElementById("passwordAlert_id");
      if (_event instanceof MessageEvent) {
        let message: FudgeNet.Message = JSON.parse(_event.data);
        if (message.command != FudgeNet.COMMAND.SERVER_HEARTBEAT && message.command != FudgeNet.COMMAND.CLIENT_HEARTBEAT)
          showMessage(message);
        switch (message.command) {

          case FudgeNet.COMMAND.SERVER_HEARTBEAT:
            // if (client.name == undefined)
              // proposeName();
            // updateTable();
            // on each server heartbeat, dispatch this clients heartbeat
            client.dispatch({ idRoom: currentRoom, command: FudgeNet.COMMAND.CLIENT_HEARTBEAT });
            // client.dispatch({ command: FudgeNet.COMMAND.ROOM_GET_IDS, route: FudgeNet.ROUTE.SERVER });
            break;

          case FudgeNet.COMMAND.CLIENT_HEARTBEAT:
            let span: HTMLSpanElement = document.querySelector(`#${message.idSource} span`);

            blink(span);
            break;

          case FudgeNet.COMMAND.DISCONNECT_PEERS:
            client.disconnectPeers();
            break;

          case FudgeNet.COMMAND.ROOM_LIST:
            getRooms(message);
            break;

          case FudgeNet.COMMAND.ROOM_CREATE:
            console.log("Created room", message.content.room);
            host = message.content.host;
            client.dispatch({ command: FudgeNet.COMMAND.ROOM_ENTER, route: FudgeNet.ROUTE.SERVER, content: { room: message.content.room, host: host } });
            break;

          case FudgeNet.COMMAND.ROOM_RENAME:
            client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: message.content.room } });
            break;

          case FudgeNet.COMMAND.ROOM_ENTER:
            if (message.content.expired != true) {

              if (message.content.private == true) {
                passwordInput();
              } else {
                client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: message.content.room } });
              }

              if (message.content.correctPassword == false) {
                if (alertPassword) {
                  alertPassword.innerHTML = language.menu.alerts.wrong_password;
                  ƒ.Time.game.setTimer(1000, 1, () => {alertPassword.innerHTML = ""});
                }
              } else if (message.content.correctPassword == true) {
                document.getElementById("passwordInputContainer_id").remove();
              }

            } else {
              alertMessageList.innerHTML = language.menu.alerts.room_unavailable;
              ƒ.Time.game.setTimer(1000, 1, () => {alertMessageList.innerHTML = ""});
              alertPassword.innerHTML = language.menu.alerts.room_unavailable;
              ƒ.Time.game.setTimer(1000, 1, () => {alertPassword.innerHTML = ""});
            }
            break;

          case FudgeNet.COMMAND.ROOM_LEAVE:
            if (message.content.leaver == true) {
              switchMenu(MenuPage.multiplayer);
              client.dispatch({ command: FudgeNet.COMMAND.ROOM_LIST, route: FudgeNet.ROUTE.SERVER});
            } else {
              if (!inGame) {
                client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: message.content.room } });
              } else {
                changeGameSettings();
              }
            }
            message.content.newHost == client.id ? host = true : host = false;
            break;

          case FudgeNet.COMMAND.ROOM_INFO:
            if (message.content.room != "Lobby") {
              joinRoom(message);
            }
            break;

          case FudgeNet.COMMAND.ASSIGN_USERNAME:
            checkUsername(message);
            break;

          case FudgeNet.COMMAND.START_GAME:
            playerMode = PlayerMode.multiplayer;
            inGame = true;
            await setGameSettings(message);
            hideMenu();
            changeGameState(GameState.init);
            break;

          case FudgeNet.COMMAND.SEND_DICE:
            console.log(message);
            // dices = message.content.dice;
            if (!host) {
              getRolledDices(message);
            }
            break;

          case FudgeNet.COMMAND.SEND_SCORE:
            console.log(message);
            console.log(message.content.value[0]);
            console.log(message.content.index[0]);
            console.log(message.content.name[0]);

              for (let index = 0; index < message.content.value.length; index++) {
                updateSummary(message.content.value[index], message.content.index[index], message.content.name[index]);
              }
            break;
          default:
            break;
        }
        return;
      } else
        console.table(_event);
    }

    export function clientLeavesRoom(): void {
      client.dispatch({ command: FudgeNet.COMMAND.ROOM_LEAVE, route: FudgeNet.ROUTE.SERVER, content: { leaver_id: client.id, host: host } });
    }

    async function setGameSettings(message: FudgeNet.Message): Promise<void> {
      gameSettings_mp = {playerNames: ["", "", "", "", "", ""]};
      let playerNumber: number = (<any>Object.keys(message.content.clients)).length;

      for (let index = 0; index < playerNumber; index++) {
        (<any>Object.values(message.content.clients)[index]).name ? gameSettings_mp.playerNames[index] = (<any>Object.values(message.content.clients)[index]).name : gameSettings_mp.playerNames[index] = (<any>Object.values(message.content.clients)[index]).id;
        if (client.id == (<any>Object.values(message.content.clients)[index]).id) {
          clientPlayerNumber = index;
        }
      }
      numberOfPlayers = gameSettings_mp.playerNames.filter(name => name != "").length;
    }

    function changeGameSettings(): void {
      numberOfPlayers--;
    }

    function checkUsername(message: FudgeNet.Message): void {
      let alertMessageLobby: HTMLDivElement = <HTMLDivElement>document.getElementById("multiplayerLobbyAlert_id");

      if (message.content.message == "valid") {
        client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: message.content.room } });
        if (message.idSource == client.id) {
          host && client.dispatch({ command: FudgeNet.COMMAND.ROOM_RENAME, route: FudgeNet.ROUTE.SERVER });
        }
        
      } else if (message.content.message == "alreadyTaken") {
        alertMessageLobby.innerHTML = language.menu.alerts.identical_names;
        ƒ.Time.game.setTimer(1000, 1, () => {alertMessageLobby.innerHTML = ""});
        client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: message.content.room } });
        
      } else if (message.content.message == "invalidTokens") {
        alertMessageLobby.innerHTML = language.menu.alerts.invalid_tokes;
        ƒ.Time.game.setTimer(1000, 1, () => {alertMessageLobby.innerHTML = ""});
        client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: message.content.room } });
      }
    }
  
    function delay(_milisec: number): Promise<void> {
      return new Promise(resolve => {
        setTimeout(() => { resolve(); }, _milisec);
      });
    }
  
    function blink(_span: HTMLSpanElement): void {
      let newSpan: HTMLSpanElement = document.createElement("span");
      newSpan.textContent = (parseInt(_span.textContent) + 1).toString().padStart(3, "0");
      _span.parentElement.replaceChild(newSpan, _span);
    }
  
    function showMessage(_message: FudgeNet.Message): void {
      console.table(_message);
      if (_message.command)
        return;
      let received: HTMLTextAreaElement = document.forms[1].querySelector("textarea#received");
      let line: string = (_message.route || "toPeer") + " > " + _message.idSource + "(" + clientsKnown[_message.idSource].name + "):" + JSON.stringify(_message.content);
      received.value = line + "\n" + received.value;
    }

}