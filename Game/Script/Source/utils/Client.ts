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

    // Keep a list of known clients, updated with information from the server
    let clientsKnown: { [id: string]: { name?: string; isHost?: boolean; } } = {};

    // Tries to connect to the server when the application is loaded
    window.addEventListener("load", connectToServer);
  
    // Starts the client and all the connected event listeners
    export async function startClient(): Promise<void> {
      console.log(client);
      console.log("Client started...")
      document.getElementById("multiplayer_id").addEventListener("click", hndEvent);
      document.getElementById("multiplayerRenewButton_id").addEventListener("click", hndEvent);
      document.getElementById("multiplayerJoinButton_id").addEventListener("click", hndEvent);
      document.getElementById("multiplayerCreateButton_id").addEventListener("click", hndEvent);
      document.getElementById("multiplayerLobbyMenuReturnButton_id").addEventListener("click", hndEvent);

      if (playerMode == PlayerMode.multiplayer) {
        document.getElementById("replayButton_id").addEventListener("click", hndEvent);
      }
    }
  
    // Handles all messages depending on which button has been pressed
    export async function hndEvent(_event: Event): Promise<void> {
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
          if (privateRoom) {
            client.dispatch({ command: FudgeNet.COMMAND.ROOM_CREATE, route: FudgeNet.ROUTE.SERVER, content: { gamemode: gameMode, privateRoom: privateRoom, roomPassword: roomPassword} });
          } else {
            client.dispatch({ command: FudgeNet.COMMAND.ROOM_CREATE, route: FudgeNet.ROUTE.SERVER, content: { gamemode: gameMode, privateRoom: privateRoom} });
          }
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
          client.dispatch({ command: FudgeNet.COMMAND.START_GAME, route: FudgeNet.ROUTE.SERVER, content: {roundTimer: roundTimer} });
        break;
      }
    }
  
    // Connects to the server with the given url (local: localhost; online: render)
    async function connectToServer(_event: Event): Promise<void> {
      let domServer: string[] = ["ws://localhost:9001", "wss://dice-cup.onrender.com"];      
      try {
        // connect to a server with the given url
        client.connectToServer(domServer[1]);
        await delay(1000);

        client.addEventListener(FudgeNet.EVENT.MESSAGE_RECEIVED, receiveMessage as unknown as EventListener);
      } catch (_error) {
        console.log(_error);
        console.log("Make sure, FudgeServer is running and accessable");
      }
    }
  
    // Distinguishes between the different cases when receiving a message from the server
    async function receiveMessage(_event: CustomEvent | MessageEvent): Promise<void> {
      if (_event instanceof MessageEvent) {
        let message: FudgeNet.Message = JSON.parse(_event.data);
        if (message.command != FudgeNet.COMMAND.SERVER_HEARTBEAT && message.command != FudgeNet.COMMAND.CLIENT_HEARTBEAT)
          showMessage(message);
        switch (message.command) {

          case FudgeNet.COMMAND.SERVER_HEARTBEAT:
            await command_serverHeartbeat();
            break;

          case FudgeNet.COMMAND.CLIENT_HEARTBEAT:
            await command_clientHeartbeat(message);
            break;

          case FudgeNet.COMMAND.DISCONNECT_PEERS:
            await command_disconnectPeers();
            break;

          case FudgeNet.COMMAND.ROOM_LIST:
            await command_roomList(message);
            break;

          case FudgeNet.COMMAND.ROOM_CREATE:
            await command_roomCreate(message);
            break;

          case FudgeNet.COMMAND.ROOM_RENAME:
            await command_roomRename(message);
            break;

          case FudgeNet.COMMAND.ROOM_ENTER:
            await command_roomEnter(message);
            break;

          case FudgeNet.COMMAND.ROOM_LEAVE:
            await command_roomLeave(message);
            break;

          case FudgeNet.COMMAND.ROOM_INFO:
            await command_roomInfo(message);
            break;

          case FudgeNet.COMMAND.CLIENT_READY:
            await command_clientReady();
            break;

          case FudgeNet.COMMAND.ASSIGN_USERNAME:
            await command_assignUsername(message);
            break;

          case FudgeNet.COMMAND.START_GAME:
            await command_startGame(message);
            break;

          case FudgeNet.COMMAND.SEND_DICE:
            await command_sendDice(message);
            break;

          case FudgeNet.COMMAND.SEND_SCORE:
            await command_sendScore(message);
            break;

          case FudgeNet.COMMAND.SKIP_SUMMARY:
            await command_skipSummary();
            break;

          default:
            break;
        }
        return;
      } else
        console.table(_event);
    }

    // Creates the server heartbeat when the server is succesfully working
    async function command_serverHeartbeat(): Promise<void> {
      client.dispatch({ idRoom: currentRoom, command: FudgeNet.COMMAND.CLIENT_HEARTBEAT });
    }

    // Creates the client heartbeat when the client is succesfully connected to the server
    async function command_clientHeartbeat(_message: FudgeNet.Message): Promise<void> {
      let span: HTMLSpanElement = document.querySelector(`#${_message.idSource} span`);

      blink(span);
    }

    // Disconnects the peers
    async function command_disconnectPeers(): Promise<void> {
      client.disconnectPeers();
    }

    // If the server returns the room list the client creates the server list with all available rooms
    async function command_roomList(_message: FudgeNet.Message): Promise<void> {
      getRooms(_message);
    }

    // If the client wants to create a room he is entering the room right after the server creates the new room
    async function command_roomCreate(_message: FudgeNet.Message): Promise<void> {
      console.log("Created room", _message.content.room);
      host = _message.content.host;
      client.dispatch({ command: FudgeNet.COMMAND.ROOM_ENTER, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room, host: host } });
    }

    // If the client renamed the room the server sends the new room information so the name updates for everybody
    async function command_roomRename(_message: FudgeNet.Message): Promise<void> {
      client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
    }

    // If the client tries to enter a room the server returns the room privacy, if an password is needed and if its still available
    // If the room has a password the user need to fill the right password into the password input field
    async function command_roomEnter(_message: FudgeNet.Message): Promise<void> {
      let alertPassword: HTMLDivElement = <HTMLDivElement>document.getElementById("passwordAlert_id");
      let alertMessageList: HTMLDivElement = <HTMLDivElement>document.getElementById("multiplayerAlert_id");

      // If room is still available and not expired due to server list only updates on actions
      if (_message.content.expired != true) {

        // If the room has a password the client must input a password
        // If the room has no password the client enters the room and updates the room info for everyone
        if (_message.content.private == true) {
            passwordInput();
        } else {
          client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
        }

        // If the entered password is incorrect the client gets an alert
        // If the entered password is correct the password input field gets removed
        if (_message.content.correctPassword == false) {
          if (alertPassword) {
            alertPassword.innerHTML = language.menu.alerts.wrong_password;
            ƒ.Time.game.setTimer(1000, 1, () => {alertPassword.innerHTML = ""});
          }
        } else if (_message.content.correctPassword == true) {
          if (document.getElementById("passwordInputContainer_id")) {
            document.getElementById("passwordInputContainer_id").remove();
          }
        }

        // If the room has already started the game no client can join this room while ingame and gets an alert
        if (_message.content.ingame == true) {
          alertMessageList.innerHTML = language.menu.alerts.ingame;
          ƒ.Time.game.setTimer(1000, 1, () => {alertMessageList.innerHTML = ""});
        }

      } else {
        alertMessageList.innerHTML = language.menu.alerts.room_unavailable;
        ƒ.Time.game.setTimer(1000, 1, () => {alertMessageList.innerHTML = ""});
        alertPassword.innerHTML = language.menu.alerts.room_unavailable;
        ƒ.Time.game.setTimer(1000, 1, () => {alertPassword.innerHTML = ""});
      }
    }

    // If the client leaves the room on purpose or gets kicked it updates the room info for everybody and updates the server list for the client
    async function command_roomLeave(_message: FudgeNet.Message): Promise<void> {
      // If somebody in the clients room leaves and its not the client himself it updates the room info if they are still in the lobby
      // If the game already starts the gamesettings get adjusted and if the leaver was the host a new host is chosen, so the game can continue without problems
      if (_message.content.leaver == false) {
        if (!inGame) {
          client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
        } else {
          changeGameSettings();
        }
      } else {
        // If the client is the leaver he updates his server list
        client.dispatch({ command: FudgeNet.COMMAND.ROOM_LIST, route: FudgeNet.ROUTE.SERVER});
      }
      // If the client is the leaver because he got kicked he switches to the server list and updates it
      if (_message.content.kicked == true) {
        switchMenu(MenuPage.multiplayer);
        client.dispatch({ command: FudgeNet.COMMAND.ROOM_LIST, route: FudgeNet.ROUTE.SERVER});
      }
      // If the client was the host he is not anymore
      _message.content.newHost == client.id ? host = true : host = false;
    }

    // Returns all needed information about a specific room to create the multiplayer lobby
    async function command_roomInfo(_message: FudgeNet.Message): Promise<void> {
      if (_message.content.room != "Lobby") {
        joinRoom(_message);
      }
    }

    // Returns and updates the clients ready state so everybody sees who is ready and who not
    async function command_clientReady(): Promise<void> {
      client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: currentRoom } });
    }

    // Returns the new username and checks whether it meets all requirements or not
    async function command_assignUsername(_message: FudgeNet.Message): Promise<void> {
      checkUsername(_message);
    }

    // Only the host can start the game and changes some variables for ingame purposes
    async function command_startGame(_message: FudgeNet.Message): Promise<void> {
      playerMode = PlayerMode.multiplayer;
      inGame = true;
      await setGameSettings(_message);
      hideMenu();
      changeGameState(GameState.init);
    }

    // Only the host sends the dice to everyone else. The guests get the rolled dice
    async function command_sendDice(_message: FudgeNet.Message): Promise<void> {
      console.log(_message);
      if (!host) {
        getRolledDices(_message);
      }
    }

    // Everyone in the room sends the score to the server so everybody has a full table to visualize on the client.
    // In the meantime the alert "waiting for other players" is shown until everybody got all scores consisting of name, category and points
    async function command_sendScore(_message: FudgeNet.Message): Promise<void> {
      console.log(_message);
      for (let index = 0; index < _message.content.value.length; index++) {
        updateSummary(_message.content.value[index], _message.content.index[index], _message.content.name[index]);
      }
      if (document.getElementById("waitAlert_id")) {
        document.getElementById("waitAlert_id").remove();
      }
      changeGameState(GameState.summary);
    }

    // Updates the skip counter if someone wants to skip the summary phase
    async function command_skipSummary(): Promise<void> {
      updateSummarySkipCounter();
    }

    // If the client leaves the room he is doing it by himself with another attribute
    export function clientLeavesRoom(): void {
      client.dispatch({ command: FudgeNet.COMMAND.ROOM_LEAVE, route: FudgeNet.ROUTE.SERVER, content: { leaver_id: client.id, host: host } });
    }

    // Sets the gamesettings from lobby content and lobby settings to create the current game
    async function setGameSettings(_message: FudgeNet.Message): Promise<void> {
      roundTimer = parseInt(_message.content.roundTimer);
      gameSettings_mp = {playerNames: ["", "", "", "", "", ""]};
      let playerNumber: number = (<any>Object.keys(_message.content.clients)).length;

      for (let index = 0; index < playerNumber; index++) {
        (<any>Object.values(_message.content.clients)[index]).name ? gameSettings_mp.playerNames[index] = (<any>Object.values(_message.content.clients)[index]).name : gameSettings_mp.playerNames[index] = (<any>Object.values(_message.content.clients)[index]).id;
        if (client.id == (<any>Object.values(_message.content.clients)[index]).id) {
          clientPlayerNumber = index;
        }
      }
      numberOfPlayers = gameSettings_mp.playerNames.filter(name => name != "").length;
    }

    // Adjusts the gamesettings while ingame and someone leaves
    function changeGameSettings(): void {
      numberOfPlayers--;
    }

    // Checks the username for length, already in use and invalid tokens
    function checkUsername(_message: FudgeNet.Message): void {
      let alertMessageLobby: HTMLDivElement = <HTMLDivElement>document.getElementById("multiplayerLobbyAlert_id");

      if (_message.content.message == "valid") {
        client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
        if (_message.idSource == client.id) {
          host && client.dispatch({ command: FudgeNet.COMMAND.ROOM_RENAME, route: FudgeNet.ROUTE.SERVER });
        }
        
      } else if (_message.content.message == "alreadyTaken") {
        alertMessageLobby.innerHTML = language.menu.alerts.identical_names;
        ƒ.Time.game.setTimer(1000, 1, () => {alertMessageLobby.innerHTML = ""});
        client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
        
      } else if (_message.content.message == "invalidTokens") {
        alertMessageLobby.innerHTML = language.menu.alerts.invalid_tokes;
        ƒ.Time.game.setTimer(1000, 1, () => {alertMessageLobby.innerHTML = ""});
        client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
      } else if (_message.content.message == "invalidLength") {
        alertMessageLobby.innerHTML = language.menu.alerts.invalid_length;
        ƒ.Time.game.setTimer(1000, 1, () => {alertMessageLobby.innerHTML = ""});
        client.dispatch({ command: FudgeNet.COMMAND.ROOM_INFO, route: FudgeNet.ROUTE.SERVER, content: { room: _message.content.room } });
    }
    }
  
    // Creates a delay
    function delay(_milisec: number): Promise<void> {
      return new Promise(resolve => {
        setTimeout(() => { resolve(); }, _milisec);
      });
    }
  
    // Creates a blink
    function blink(_span: HTMLSpanElement): void {
      let newSpan: HTMLSpanElement = document.createElement("span");
      newSpan.textContent = (parseInt(_span.textContent) + 1).toString().padStart(3, "0");
      _span.parentElement.replaceChild(newSpan, _span);
    }
  
    // Shows the messages in the console 
    function showMessage(_message: FudgeNet.Message): void {
      console.table(_message);
      if (_message.command)
        return;
      let received: HTMLTextAreaElement = document.forms[1].querySelector("textarea#received");
      let line: string = (_message.route || "toPeer") + " > " + _message.idSource + "(" + clientsKnown[_message.idSource].name + "):" + JSON.stringify(_message.content);
      received.value = line + "\n" + received.value;
    }

}