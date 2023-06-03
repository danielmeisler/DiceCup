///<reference path="../../../../Library/Net/Client/FudgeClient.d.ts"/>
namespace DiceCup {
    import ƒ = FudgeCore;
    import ƒClient = FudgeNet.FudgeClient;
    ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);
    let idRoom: string;
  
    // Create a FudgeClient for this browser tab
    export let client: ƒClient = new ƒClient();
    // keep a list of known clients, updated with information from the server
    let clientsKnown: { [id: string]: { name?: string; isHost?: boolean; } } = {};

    window.addEventListener("load", connectToServer);
  
    export async function startClient(): Promise<void> {
      console.log(client);
      console.log("Client started...")
      document.getElementById("multiplayer_id").addEventListener("click", hndRoom);
      document.getElementById("multiplayerRenewButton_id").addEventListener("click", hndRoom);
      document.getElementById("multiplayerJoinButton_id").addEventListener("click", hndRoom);
      document.getElementById("multiplayerCreateButton_id").addEventListener("click", hndRoom);
      // document.querySelector("button#rename").addEventListener("click", rename);
      // document.querySelector("button#mesh").addEventListener("click", structurePeers);
      // document.querySelector("button#host").addEventListener("click", structurePeers);
      // document.querySelector("button#disconnect").addEventListener("click", structurePeers);
      // document.querySelector("button#reset").addEventListener("click", structurePeers);
      // document.querySelector("fieldset").addEventListener("click", sendMessage);      
      // createTable();
    }
  
    async function hndRoom (_event: Event): Promise<void> {
      if (!(_event.target instanceof HTMLButtonElement))
        return;
      let command: string = _event.target.id;
      switch (command) {
        case "multiplayerRenewButton_id":
        case "multiplayer_id":
          client.dispatch({ command: FudgeNet.COMMAND.ROOM_GET_IDS, route: FudgeNet.ROUTE.SERVER });
          break;
        case "multiplayerCreateButton_id":
          client.dispatch({ command: FudgeNet.COMMAND.ROOM_CREATE, route: FudgeNet.ROUTE.SERVER });
          break;
        case "multiplayerJoinButton_id":
          let idRoom: string = focusedIdRoom;
          console.log("Enter", focusedIdRoom );

          client.dispatch({ command: FudgeNet.COMMAND.ROOM_ENTER, route: FudgeNet.ROUTE.SERVER, content: { room: idRoom } });
          console.log(client.idRoom);
          document.getElementById("multiplayerLobbyMenuTitle_id").innerHTML = idRoom;
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
            client.dispatch({ idRoom: idRoom, command: FudgeNet.COMMAND.CLIENT_HEARTBEAT });
            break;
          case FudgeNet.COMMAND.CLIENT_HEARTBEAT:
            let span: HTMLSpanElement = document.querySelector(`#${message.idSource} span`);
            blink(span);
            break;
          case FudgeNet.COMMAND.DISCONNECT_PEERS:
            client.disconnectPeers();
            break;
          case FudgeNet.COMMAND.ROOM_GET_IDS:
            getRooms(message.content.rooms);
            break;
          case FudgeNet.COMMAND.ROOM_CREATE:
            document.getElementById("multiplayerLobbyMenuTitle_id").innerHTML = message.content.room;
            console.log("Created room", message.content.room);
          case FudgeNet.COMMAND.ROOM_ENTER:
            client.dispatch({ command: FudgeNet.COMMAND.ROOM_GET_IDS, route: FudgeNet.ROUTE.SERVER });
            break;
          default:
            break;
        }
        return;
      } else
        console.table(_event);
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