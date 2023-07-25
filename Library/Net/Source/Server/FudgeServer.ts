import { getuid } from "process";
import WebSocket from "ws";
import { FudgeNet } from "./Message.js";

/**
 * Keeps information about the connected clients
 */
export interface Client {
  id: string;
  name?: string;
  socket?: WebSocket;
  ready: boolean;
  peers: string[];
  summary: {
    name?: string;
    index?: number;
    value?: number;
  }
}

interface Room {
  id: string; // needed?
  name?: string;
  clients: { [id: string]: Client };
  idHost: string | undefined;
  ingame: boolean;
  private: boolean;
  password?: string;
  gamemode: number;
}

type Clients = { [id: string]: Client; };
type Rooms = { [id: string]: Room; };

/**
 * Manages the websocket connections to FudgeClients, their ids and login names
 * and keeps track of the peer to peer connections between them. Processes messages 
 * from the clients in the format {@link FudgeNet.Message} according to the controlling
 * fields {@link FudgeNet.ROUTE} and {@link FudgeNet.COMMAND}.  
 * @author Falco Böhnke, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2021
 * TODOs: 
 * - finalize the tracking of peers, deleted clients may not be removed from peers-array
 * - pass messages through the server to other clients to have them use the safe websocket connection
 */
export class FudgeServer {
  public socket!: WebSocket.Server;
  public rooms: Rooms = {};
  private idLobby: string = "Lobby";

  /**
   * Starts the server on the given port, installs the appropriate event-listeners and starts the heartbeat
   */
  public startUp = (_port: number = 8080) => {
    this.rooms[this.idLobby] = { id: this.idLobby, clients: {}, gamemode: 0, idHost: undefined, private: false, ingame: false }; // create lobby to collect newly connected clients
    console.log(_port);
    this.socket = new WebSocket.Server({ port: _port });
    this.addEventListeners();
    setInterval(this.heartbeat, 1000);
  }

  /**
   * Close the websocket of this server
   */
  public closeDown = () => {
    this.socket.close();
  }

  /**
   * Dispatch a FudgeNet.Message to the client with the id given as `idTarget`
   */
  public dispatch(_message: FudgeNet.Message): void {
    _message.timeServer = Date.now();
    let message: string = JSON.stringify(_message);
    let clients: Clients = this.rooms[_message.idRoom!].clients;
    if (_message.idTarget)
      clients[_message.idTarget].socket?.send(message);
  }

  /**
   * Broadcast a FudgeMet.Message to all clients known to the server.
   */
  public broadcast(_message: FudgeNet.Message): void {
    _message.timeServer = Date.now();
    let message: string = JSON.stringify(_message);
    let clients: Clients = this.rooms[_message.idRoom!].clients;
    for (let id in clients)
      // TODO: examine, if idTarget should be tweaked...
      clients[id].socket?.send(message);
  }

  /**
   * Logs the net-message with some additional text as prefix
   */
  public logMessage(_text: string, _message: FudgeNet.Message): void {
    console.log(_text, `room: ${_message.idRoom}, command: ${_message.command}, route: ${_message.route}, idTarget: ${_message.idTarget}, idSource: ${_message.idSource}`);
  }

  /**
   * Log the list of known clients
   */
  public logClients(_room: Room): void {
    let ids: string[] = <string[]>Reflect.ownKeys(_room.clients);
    // TODO: also display known peer-connections?

    console.log("Connected clients", ids);
  }

  protected async handleMessage(_message: string, _wsConnection: WebSocket): Promise<void> {
    let message: FudgeNet.Message = JSON.parse(_message);
    this.logMessage("Received", message);
    // this.dispatchEvent(new MessageEvent( EVENT.MESSAGE_RECEIVED message); TODO: send event to whoever listens

    switch (message.command) {
      case FudgeNet.COMMAND.LOGIN_REQUEST:
        this.addUserOnValidLoginRequest(_wsConnection, message);
        break;
      case FudgeNet.COMMAND.RTC_OFFER:
        this.sendRtcOfferToRequestedClient(_wsConnection, message);
        break;

      case FudgeNet.COMMAND.RTC_ANSWER:
        this.answerRtcOfferOfClient(_wsConnection, message);
        break;

      case FudgeNet.COMMAND.ICE_CANDIDATE:
        this.sendIceCandidatesToRelevantPeer(_wsConnection, message);
        break;

      case FudgeNet.COMMAND.ROOM_LIST:
        this.getRoomList(message);
        break;

      case FudgeNet.COMMAND.ROOM_CREATE:
        this.createRoom(message);
        break;

      case FudgeNet.COMMAND.ROOM_RENAME:
        this.renameRoom(message);
        break;

      case FudgeNet.COMMAND.ROOM_PASSWORD:
        this.setRoomPassword(message);
        break;

      case FudgeNet.COMMAND.ROOM_ENTER:
        this.enterRoom(message);
        break;

      case FudgeNet.COMMAND.ROOM_LEAVE:
        this.leaveRoom(message);
        break;

      case FudgeNet.COMMAND.ROOM_INFO:
        this.getRoomInfo(message);
        break;

      case FudgeNet.COMMAND.CHANGE_GAMEMODE:
        this.changeGamemode(message);
        break;

      case FudgeNet.COMMAND.CLIENT_READY:
        this.clientReady(message);
        break;

      case FudgeNet.COMMAND.ASSIGN_USERNAME:
        this.assignUsername(message);
        break;

      case FudgeNet.COMMAND.START_GAME:
        this.startGame(message);
        break;

      case FudgeNet.COMMAND.END_GAME:
        this.endGame(message);
        break;

      case FudgeNet.COMMAND.SEND_DICE:
        this.sendDice(message);
        break;

      case FudgeNet.COMMAND.SEND_SCORE:
        this.sendScore(message);
        break;

      case FudgeNet.COMMAND.SKIP_SUMMARY:
        this.skipSummary(message);
        break;
      

      case FudgeNet.COMMAND.CREATE_MESH:
        this.createMesh(message);
        break;

      case FudgeNet.COMMAND.CONNECT_HOST:
        this.connectHost(message);
        break;
      default:
        switch (message.route) {
          case FudgeNet.ROUTE.VIA_SERVER_HOST:
            let room: Room = this.rooms[message.idRoom!];
            message.idTarget = room.idHost;
            this.logMessage("Forward to host", message);
            this.dispatch(message);
            break;
          case FudgeNet.ROUTE.VIA_SERVER:
            if (message.idTarget) {
              this.logMessage("Pass to target", message);
              this.dispatch(message);
            } else {
              this.logMessage("Broadcast to all", message);
              this.broadcast(message);
            }
            break;
        }
        break;
    }
  }

  private addEventListeners = (): void => {
    this.socket.on("connection", (_socket: WebSocket) => {
      console.log("Connection attempt");

      try {
        const id: string = this.createID();
        const client: Client = { socket: _socket, id: id, peers: [], ready: false, summary: {} };
        // TODO: client connects -> send a list of available roomss
        console.log(this.rooms[this.idLobby]);
        this.rooms[this.idLobby].clients[id] = client;
        this.logClients(this.rooms[this.idLobby]);
        let netMessage: FudgeNet.Message = { idRoom: this.idLobby, idTarget: id, command: FudgeNet.COMMAND.ASSIGN_ID };
        this.dispatch(netMessage);
      } catch (error) {
        console.error("Unhandled Exception", error);
      }

      _socket.on("message", (_message: string) => {
        this.handleMessage(_message, _socket);
      });

      _socket.addEventListener("close", () => {
        console.log("Connection closed");
        for (let idRoom in this.rooms) {
          let clients: Clients = this.rooms[idRoom].clients;
          for (let id in clients) {
            if (clients[id].socket == _socket) {
              console.log("Deleting from known clients: ", id);
              delete clients[id];
              this.logClients(this.rooms[idRoom]);
              this.checkLeavedRoom(idRoom);
            }
          }
        }
      });
    });
  }

  // Checks the new username if its already taken, has invalid tokens or is too long or too short
  // If all requirements are valid the new username gets accepted
  private assignUsername(_message: FudgeNet.Message): void {

    switch (this.checkUsername(_message.content!.username)) {
      case "alreadyTaken":
        let messageAlreadyTaken: FudgeNet.Message = {
          idRoom: _message.idRoom, command: FudgeNet.COMMAND.ASSIGN_USERNAME, idTarget: _message.idSource, content: { message: "alreadyTaken" }
        };
        this.dispatch(messageAlreadyTaken);
        break;
      case "invalidTokens":
        let messageInvalidTokens: FudgeNet.Message = {
          idRoom: _message.idRoom, command: FudgeNet.COMMAND.ASSIGN_USERNAME, idTarget: _message.idSource, content: { message: "invalidTokens"}
        };
        this.dispatch(messageInvalidTokens);
      break;
      case "invalidLength":
        let messageInvalidLength: FudgeNet.Message = {
          idRoom: _message.idRoom, command: FudgeNet.COMMAND.ASSIGN_USERNAME, idTarget: _message.idSource, content: { message: "invalidLength"}
        };
        this.dispatch(messageInvalidLength);
      break;
      case "valid":
        let client: Client = this.rooms[_message.idRoom!].clients[_message.idSource!];
        client.name = _message.content!.username;   
  
        let message: FudgeNet.Message = {
          idRoom: _message.idRoom, command: FudgeNet.COMMAND.ASSIGN_USERNAME, idSource: _message.idSource, content: { message: "valid" }
        };
        this.broadcast(message);
      break;
      default:
        break;
    }
  }

  // Checks the username by length, invalid tokens and if its already taken
  private checkUsername(_username: string): string {
    let existingUsername: boolean = false;
    Object.values(this.rooms).map(room => {Object.values(room.clients).map(client => {if (client.id == _username || client.name == _username) {existingUsername = true;}})});
    if (existingUsername) {
      return "alreadyTaken";
    }

    if (!/^[A-Za-z0-9_]*$/.test(_username)) {
      return "invalidTokens";
    }

    if (_username.length < 3 || _username.length > 8) {
      return "invalidLength"
    }

    return "valid";
  }

  // Checks the room the client just left to see if its empty now to delete it from the list
  private checkLeavedRoom(_room: string): void {
    if (_room != this.idLobby) {
      if (Object.keys(this.rooms[_room].clients).length == 0) {
        delete this.rooms[_room];
      } else {
        Object.values(this.rooms[_room].clients)[0].ready = true;
        let messageRoom: FudgeNet.Message = {
          idRoom: _room, command: FudgeNet.COMMAND.ROOM_LEAVE, content: { leaver: false, newHost: Object.keys(this.rooms[_room].clients)[0]}
        };
        this.broadcast(messageRoom);
      }
    }
  }

  // Sets the privacy of a room and the associated password
  private setRoomPassword(_message: FudgeNet.Message): void {
    if (_message.content!.private) {
      this.rooms[_message.idRoom!].private = true;
      this.rooms[_message.idRoom!].password = _message.content!.password;
    } else {
      this.rooms[_message.idRoom!].private = false;
      this.rooms[_message.idRoom!].password ?? delete this.rooms[_message.idRoom!].password;
    }
  }

  // If a client enters a room it checks if the room is existing, ingame, secured with a password and who the host is
  private enterRoom(_message: FudgeNet.Message): void {
    if (!_message.idRoom || !_message.idSource || !_message.content)
      throw (new Error("Message lacks idSource, idRoom or content."));
    if (!this.rooms[_message.idRoom])
      throw (new Error(`Room unavailable ${_message.idRoom}`));

    if (this.rooms[_message.content.room]) {  
      if (this.rooms[_message.content.room].private) {
        if (_message.content.password) {
          if (_message.content.password == this.rooms[_message.content.room].password) {
            let client: Client = this.rooms[_message.idRoom].clients[_message.idSource];
            let room: Room = this.rooms[_message.content.room];
            delete this.rooms[_message.idRoom].clients[_message.idSource];
            room.clients[_message.idSource] = client;
      
            let message: FudgeNet.Message = {
              idRoom: _message.content.room, command: FudgeNet.COMMAND.ROOM_ENTER, content: { client: _message.idSource, host: _message.content?.host, correctPassword: true }
            };
            this.broadcast(message);
          } else {
            let messageClient: FudgeNet.Message = {
              idRoom: _message.idRoom, command: FudgeNet.COMMAND.ROOM_ENTER, idTarget: _message.idSource, content: { correctPassword: false }
            };
            this.dispatch(messageClient);
          }
          
        } else if (_message.content.host == true) {
          let client: Client = this.rooms[_message.idRoom].clients[_message.idSource];
          let room: Room = this.rooms[_message.content.room];
          delete this.rooms[_message.idRoom].clients[_message.idSource];
          room.clients[_message.idSource] = client;
    
          let message: FudgeNet.Message = {
            idRoom: _message.content.room, command: FudgeNet.COMMAND.ROOM_ENTER, content: { client: _message.idSource, host: _message.content?.host, correctPassword: true }
          };

          this.broadcast(message);
        } else {
          let messageClient: FudgeNet.Message = {
            idRoom: _message.idRoom, command: FudgeNet.COMMAND.ROOM_ENTER, idTarget: _message.idSource, content: { private: true }
          };
          this.dispatch(messageClient);
        }

      } else if (this.rooms[_message.content.room].ingame) {
        let messageClient: FudgeNet.Message = {
          idRoom: _message.idRoom, command: FudgeNet.COMMAND.ROOM_ENTER, idTarget: _message.idSource, content: { ingame: true }
        };
        this.dispatch(messageClient);
      } else {
        let client: Client = this.rooms[_message.idRoom].clients[_message.idSource];
        let room: Room = this.rooms[_message.content.room];
        delete this.rooms[_message.idRoom].clients[_message.idSource];
        room.clients[_message.idSource] = client;
  
        let message: FudgeNet.Message = {
          idRoom: _message.content.room, command: FudgeNet.COMMAND.ROOM_ENTER, content: { client: _message.idSource, host: _message.content?.host, correctPassword: false }
        };
        this.broadcast(message);
      }
    } else {
      let messageClient: FudgeNet.Message = {
        idRoom: _message.idRoom, command: FudgeNet.COMMAND.ROOM_ENTER, idTarget: _message.idSource, content: { expired: true }
      };
      this.dispatch(messageClient);
    }
  }

  // When the client leaves a room on purpose or gets kicked update the list and broadcast it to everyone in the left room and the left client
  // If a client disconnects not on purpose because of internet connection or closed the application midgame the server responses as he left the room on purpose
  private leaveRoom(_message: FudgeNet.Message): void {
    if (!_message.idRoom || !_message.content!.leaver_id)
      throw (new Error("Message lacks idSource, idRoom or content"));
    if (!this.rooms[_message.idRoom])
      throw (new Error(`Room unavailable ${_message.idRoom}`));

    let client: Client = this.rooms[_message.idRoom].clients[_message.content!.leaver_id];
    let room: Room = this.rooms[this.idLobby];
    delete this.rooms[_message.idRoom].clients[_message.content!.leaver_id];
    room.clients[_message.content!.leaver_id] = client;
    client.ready = false;

    let messageRoom: FudgeNet.Message = {
      idRoom: _message.idRoom, command: FudgeNet.COMMAND.ROOM_LEAVE, content: { leaver: false, newHost: Object.keys(this.rooms[_message.idRoom].clients)[0]}
    };
    this.broadcast(messageRoom);
    if (_message.content!.kicked == true) {
      let messageClient: FudgeNet.Message = {
        idRoom: this.idLobby, command: FudgeNet.COMMAND.ROOM_LEAVE, idTarget: _message.content!.leaver_id, content: { leaver: true, newHost: Object.keys(this.rooms[_message.idRoom].clients)[0], kicked: _message.content!.kicked}
      };
      this.dispatch(messageClient);
    } else {
      let messageClient: FudgeNet.Message = {
        idRoom: this.idLobby, command: FudgeNet.COMMAND.ROOM_LEAVE, idTarget: _message.content!.leaver_id, content: { leaver: true, newHost: Object.keys(this.rooms[_message.idRoom].clients)[0]}
      };
      this.dispatch(messageClient);
    }

    (Object.keys(this.rooms[_message.idRoom].clients).length == 0) && delete this.rooms[_message.idRoom];
  }

  // Creates a room with given attributes like name, privacy and password and gamemode
  private createRoom(_message: FudgeNet.Message): void {
    let client: Client = this.rooms[_message.idRoom!].clients[_message.idSource!];
    let idRoom: string = this.createID();
    this.rooms[idRoom] = { id: idRoom, clients: {}, idHost: undefined, name: client.name ? client.name + "'s Lobby" : client.id + "'s Lobby", gamemode: _message.content!.gamemode, private: _message.content!.privateRoom, ingame: false};
    client.ready = true;
    if (_message.content!.roomPassword) {
      this.rooms[idRoom].password = _message.content!.roomPassword;
    }
    let message: FudgeNet.Message = {
      idRoom: this.idLobby, command: FudgeNet.COMMAND.ROOM_CREATE, idTarget: _message.idSource, content: { room: idRoom, host: true }
    };
    this.dispatch(message);

  }

  // Renames an existing room when the client changes his name as example
  private renameRoom(_message: FudgeNet.Message): void {
    let client: Client = this.rooms[_message.idRoom!].clients[_message.idSource!];
    this.rooms[_message.idRoom!].name = client.name + "'s Lobby";
    let message: FudgeNet.Message = {
      idRoom: _message.idRoom, command: FudgeNet.COMMAND.ROOM_RENAME, idTarget: _message.idSource, content: { room: _message.idRoom }
    };
    this.dispatch(message);
  }

  // Changes the gamemode of the room when the lobby settings get changed
  private changeGamemode(_message: FudgeNet.Message): void {
    this.rooms[_message.idRoom!].gamemode = _message.content!.gamemode;
  }

  // Returns a list with all available rooms to create the serverlist on the client
  private getRoomList(_message: FudgeNet.Message): void {
    let message: FudgeNet.Message = {
      idRoom: _message.idRoom, command: FudgeNet.COMMAND.ROOM_LIST, idTarget: _message.idSource, content: { rooms: Object.keys(this.rooms), roomNames: Object.values(this.rooms).map(room => room.name), clients: Object.values(this.rooms).map(room => Object.keys(room.clients).toString()), private: Object.values(this.rooms).map(room => room.private), gamemode: Object.values(this.rooms).map(room => room.gamemode), ingame: Object.values(this.rooms).map(room => room.ingame)}
    };
    this.dispatch(message);
  }

  // Returns all needed informations of a specific room to create the multiplayer lobby
  private getRoomInfo(_message: FudgeNet.Message): void {
    let clients: Clients = this.rooms[_message.idRoom!].clients;
    let message: FudgeNet.Message = {
      idRoom: _message.idRoom, command: FudgeNet.COMMAND.ROOM_INFO, idTarget: _message.idSource, content: { room: _message.idRoom, name: this.rooms[_message.idRoom!].name, clients: clients }
    };
    this.dispatch(message);
  }

  // Sets the client on ready so it updates for everybody and the host knows when he can start the game
  private clientReady(_message: FudgeNet.Message): void {
    let client: Client = this.rooms[_message.idRoom!].clients[_message.idSource!];
    client.ready = client.ready ? client.ready = false : client.ready = true;

    let message: FudgeNet.Message = {
      idRoom: _message.idRoom, command: FudgeNet.COMMAND.CLIENT_READY
    };
    this.broadcast(message);
  }

  // Starts the game and sets the ready state for every guest on unready again so the host can't force a new round after the game is completed
  // Sets the lobby state on ingame so no new client can join while ingame
  // Clears all ingame summary content
  private startGame(_message: FudgeNet.Message): void {
    let clients: Clients = this.rooms[_message.idRoom!].clients;
    Object.values(clients).map((client, index) => {
      if (index > 0) {
        client.ready = false;
      }
    });
    Object.values(clients).map(client => {
      delete client.summary.name;
      delete client.summary.index;
      delete client.summary.value;
    });
    this.rooms[_message.idRoom!].ingame = true;
    let message: FudgeNet.Message = {
      idRoom: _message.idRoom, command: FudgeNet.COMMAND.START_GAME, content: {clients: clients, roundTimer: _message.content!.roundTimer}
    };
    this.broadcast(message);
  }

  // Resets the room state to not ingame so new clients can join again
  private endGame(_message: FudgeNet.Message): void {
    this.rooms[_message.idRoom!].ingame = false;
  }

  // Sends the current dice to everyone in the room
  private sendDice(_message: FudgeNet.Message): void {
    let message: FudgeNet.Message = {
      idRoom: _message.idRoom, command: FudgeNet.COMMAND.SEND_DICE, content: {dice: _message.content!.dice }
    };
    this.broadcast(message);
  }

  // Sends the current score to everyone in the room as soon as everyone sent an score so everybody gets the score simultaneously
  private sendScore(_message: FudgeNet.Message): void {
    let clients: Clients = this.rooms[_message.idRoom!].clients;

    // Stores the current message content into the right client attributes
    Object.values(clients).map(client => {
      if (client.name == _message.content!.name || client.id == _message.content!.name) {
          client.summary.name! = _message.content!.name;
          client.summary.index! = _message.content!.index;
          client.summary.value! = _message.content!.value;
      }
    });

    // Checks if the clients values are all right and if all values are true and every client got its values the message gets broadcasted and the attributes resetted
    if (Object.values(clients).map(client => { 
      if (!client.summary.name) {
        return false;
      } else if (isNaN(client.summary.index!)) {
        return false;
      } else if (isNaN(client.summary.value!)) {
        return false;
      } else {
        return true;
      }
    }).every(x => x)) {
      // Broadcasts current scores for every client
      let message: FudgeNet.Message = {
        idRoom: _message.idRoom, command: FudgeNet.COMMAND.SEND_SCORE, content: { value: Object.values(clients).map(client => client.summary.value), index: Object.values(clients).map(client => client.summary.index), name: Object.values(clients).map(client => client.summary.name)}
      };
      this.broadcast(message);

      // Reset client attributes
      Object.values(clients).map(client => {
        delete client.summary.name;
        delete client.summary.index;
        delete client.summary.value;
      });
    }
  }

  // Skips the summary if all clients voted for it
  private skipSummary(_message: FudgeNet.Message): void {
    let message: FudgeNet.Message = {
      idRoom: _message.idRoom, command: FudgeNet.COMMAND.SKIP_SUMMARY, content: { name: _message.idSource, ready: true }
    };
    this.broadcast(message);
  }



  // Pre functions: not created for the game 

  private async createMesh(_message: FudgeNet.Message): Promise<void> {
    let room: Room = this.rooms[_message.idRoom!];
    let ids: string[] = <string[]>Reflect.ownKeys(room.clients);
    while (ids.length > 1) {
      let id: string = <string>ids.pop();
      let message: FudgeNet.Message = {
        idRoom: _message.idRoom, command: FudgeNet.COMMAND.CONNECT_PEERS, idTarget: id, content: { peers: ids }
      };
      await new Promise((resolve) => { setTimeout(resolve, 500); });
      this.dispatch(message);
    }
    room.idHost = undefined;
  }

  private async connectHost(_message: FudgeNet.Message): Promise<void> {
    if (!_message.idSource || !_message.idRoom)
      return;
    let room: Room = this.rooms[_message.idRoom];
    let ids: string[] = <string[]>Reflect.ownKeys(room.clients);
    let message: FudgeNet.Message = {
      idRoom: _message.idRoom, command: FudgeNet.COMMAND.CONNECT_PEERS, idTarget: _message.idSource, content: { peers: ids }
    };
    console.log("Connect Host", _message.idSource, ids);
    room.idHost = _message.idSource;
    this.dispatch(message);
  }

  private addUserOnValidLoginRequest(_wsConnection: WebSocket, _message: FudgeNet.Message): void {
    let rooms: Room = this.rooms[this.idLobby];
    let name: string = _message.content?.name;
    for (let id in rooms.clients) {
      if (rooms.clients[id].name == name) {
        console.log("UsernameTaken", name);
        let netMessage: FudgeNet.Message = { idRoom: this.idLobby, idTarget: id, command: FudgeNet.COMMAND.LOGIN_RESPONSE, content: { success: false } };
        this.dispatch(netMessage);
        return;
      }
    }
    try {
      for (let id in rooms.clients) {
        let client: Client = rooms.clients[id];
        if (client.socket == _wsConnection) {
          client.name = name;
          let netMessage: FudgeNet.Message = { idRoom: this.idLobby, idTarget: id, command: FudgeNet.COMMAND.ASSIGN_ID, content: { success: true } };
          this.dispatch(netMessage);
          return;
        }
      }
    } catch (error) {
      console.error("Unhandled Exception: Unable to create or send LoginResponse", error);
    }
  }

  private sendRtcOfferToRequestedClient(_wsConnection: WebSocket, _message: FudgeNet.Message): void {
    try {
      if (!_message.idTarget || !_message.content || !_message.idRoom)
        throw (new Error("Message lacks idTarget, idRoom or content."));
      let room: Room = this.rooms[_message.idRoom];

      // console.log("Sending offer to: ", _message.idTarget);
      const client: Client | undefined = room.clients[_message.idTarget];
      if (!client)
        throw (new Error(`No client found with id ${_message.idTarget}`));

      let netMessage: FudgeNet.Message = {
        idRoom: _message.idRoom, idSource: _message.idSource, idTarget: _message.idTarget, command: FudgeNet.COMMAND.RTC_OFFER, content: { offer: _message.content.offer }
      };

      this.dispatch(netMessage);
    } catch (error) {
      console.error("Unhandled Exception: Unable to relay Offer to Client", error);
    }
  }

  private answerRtcOfferOfClient(_wsConnection: WebSocket, _message: FudgeNet.Message): void {
    if (!_message.idTarget || !_message.idRoom)
      throw (new Error("Message lacks target"));
    let room: Room = this.rooms[_message.idRoom];

    // console.log("Sending answer to: ", _message.idTarget);
    const client: Client | undefined = room.clients[_message.idTarget];

    if (client && client.socket && _message.content) {
      this.dispatch(_message);
    } else
      throw (new Error("Client or its socket not found or message lacks content."));
  }

  private sendIceCandidatesToRelevantPeer(_wsConnection: WebSocket, _message: FudgeNet.Message): void {
    if (!_message.idTarget || !_message.idSource || !_message.idRoom)
      throw (new Error("Message lacks target-, source- or room-id."));
    let room: Room = this.rooms[_message.idRoom];
    const client: Client | undefined = room.clients[_message.idTarget];

    if (client && _message.content) {
      // console.warn("Send Candidate", client, _message.content.candidate);
      this.dispatch(_message);
    } else
      throw (new Error("Client not found or message lacks content."));
  }

  private createID = (): string => {
    // Math.random should be random enough because of its seed
    // convert to base 36 and pick the first few digits after comma
    // return "_" + process.getuid().toString(36);
    return "_" + Math.random().toString(36).slice(2, 7);
  }

  private heartbeat = (): void => {
    process.stdout.write("♥");
    for (let idRoom in this.rooms) {
      let room: Room = this.rooms[idRoom];
      let clients: Clients = {};
      for (let id in room.clients)
        //@ts-ignore
        clients[id] = { name: room.clients[id].name, peers: room.clients[id].peers, isHost: room.idHost == id };
      let message: FudgeNet.Message = { idRoom: idRoom, command: FudgeNet.COMMAND.SERVER_HEARTBEAT, content: clients };
      this.broadcast(message);
    }
  }
}