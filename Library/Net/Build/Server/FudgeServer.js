"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FudgeServer = void 0;
const ws_1 = __importDefault(require("ws"));
const Message_js_1 = require("./Message.js");
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
class FudgeServer {
    socket;
    rooms = {};
    idLobby = "Lobby";
    /**
     * Starts the server on the given port, installs the appropriate event-listeners and starts the heartbeat
     */
    startUp = (_port = 8080) => {
        this.rooms[this.idLobby] = { id: this.idLobby, clients: {}, idHost: undefined, private: false }; // create lobby to collect newly connected clients
        console.log(_port);
        this.socket = new ws_1.default.Server({ port: _port });
        this.addEventListeners();
        setInterval(this.heartbeat, 1000);
    };
    /**
     * Close the websocket of this server
     */
    closeDown = () => {
        this.socket.close();
    };
    /**
     * Dispatch a FudgeNet.Message to the client with the id given as `idTarget`
     */
    dispatch(_message) {
        _message.timeServer = Date.now();
        let message = JSON.stringify(_message);
        let clients = this.rooms[_message.idRoom].clients;
        if (_message.idTarget)
            clients[_message.idTarget].socket?.send(message);
    }
    /**
     * Broadcast a FudgeMet.Message to all clients known to the server.
     */
    broadcast(_message) {
        _message.timeServer = Date.now();
        let message = JSON.stringify(_message);
        let clients = this.rooms[_message.idRoom].clients;
        for (let id in clients)
            // TODO: examine, if idTarget should be tweaked...
            clients[id].socket?.send(message);
    }
    /**
     * Logs the net-message with some additional text as prefix
     */
    logMessage(_text, _message) {
        console.log(_text, `room: ${_message.idRoom}, command: ${_message.command}, route: ${_message.route}, idTarget: ${_message.idTarget}, idSource: ${_message.idSource}`);
    }
    /**
     * Log the list of known clients
     */
    logClients(_room) {
        let ids = Reflect.ownKeys(_room.clients);
        // TODO: also display known peer-connections?
        console.log("Connected clients", ids);
    }
    async handleMessage(_message, _wsConnection) {
        let message = JSON.parse(_message);
        this.logMessage("Received", message);
        // this.dispatchEvent(new MessageEvent( EVENT.MESSAGE_RECEIVED message); TODO: send event to whoever listens
        switch (message.command) {
            case Message_js_1.FudgeNet.COMMAND.LOGIN_REQUEST:
                this.addUserOnValidLoginRequest(_wsConnection, message);
                break;
            case Message_js_1.FudgeNet.COMMAND.RTC_OFFER:
                this.sendRtcOfferToRequestedClient(_wsConnection, message);
                break;
            case Message_js_1.FudgeNet.COMMAND.RTC_ANSWER:
                this.answerRtcOfferOfClient(_wsConnection, message);
                break;
            case Message_js_1.FudgeNet.COMMAND.ICE_CANDIDATE:
                this.sendIceCandidatesToRelevantPeer(_wsConnection, message);
                break;
            case Message_js_1.FudgeNet.COMMAND.ROOM_LIST:
                this.getRoomList(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.ROOM_CREATE:
                this.createRoom(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.ROOM_RENAME:
                this.renameRoom(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.ROOM_PASSWORD:
                this.setRoomPassword(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.ROOM_ENTER:
                this.enterRoom(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.ROOM_LEAVE:
                this.leaveRoom(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.ROOM_INFO:
                this.getRoomInfo(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.ASSIGN_USERNAME:
                this.assignUsername(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.START_GAME:
                this.startGame(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.SEND_DICE:
                this.sendDice(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.SEND_SCORE:
                this.sendScore(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.CREATE_MESH:
                this.createMesh(message);
                break;
            case Message_js_1.FudgeNet.COMMAND.CONNECT_HOST:
                this.connectHost(message);
                break;
            default:
                switch (message.route) {
                    case Message_js_1.FudgeNet.ROUTE.VIA_SERVER_HOST:
                        let room = this.rooms[message.idRoom];
                        message.idTarget = room.idHost;
                        this.logMessage("Forward to host", message);
                        this.dispatch(message);
                        break;
                    case Message_js_1.FudgeNet.ROUTE.VIA_SERVER:
                        if (message.idTarget) {
                            this.logMessage("Pass to target", message);
                            this.dispatch(message);
                        }
                        else {
                            this.logMessage("Broadcast to all", message);
                            this.broadcast(message);
                        }
                        break;
                }
                break;
        }
    }
    addEventListeners = () => {
        this.socket.on("connection", (_socket) => {
            console.log("Connection attempt");
            try {
                const id = this.createID();
                const client = { socket: _socket, id: id, peers: [] };
                // TODO: client connects -> send a list of available roomss
                console.log(this.rooms[this.idLobby]);
                this.rooms[this.idLobby].clients[id] = client;
                this.logClients(this.rooms[this.idLobby]);
                let netMessage = { idRoom: this.idLobby, idTarget: id, command: Message_js_1.FudgeNet.COMMAND.ASSIGN_ID };
                this.dispatch(netMessage);
            }
            catch (error) {
                console.error("Unhandled Exception", error);
            }
            _socket.on("message", (_message) => {
                this.handleMessage(_message, _socket);
            });
            _socket.addEventListener("close", () => {
                console.log("Connection closed");
                for (let idRoom in this.rooms) {
                    let clients = this.rooms[idRoom].clients;
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
    };
    assignUsername(_message) {
        switch (this.checkUsername(_message.content.username)) {
            case "alreadyTaken":
                let messageAlreadyTaken = {
                    idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.ASSIGN_USERNAME, idTarget: _message.idSource, content: { message: "alreadyTaken" }
                };
                this.dispatch(messageAlreadyTaken);
                break;
            case "invalidTokens":
                let messageInvalidTokens = {
                    idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.ASSIGN_USERNAME, idTarget: _message.idSource, content: { message: "invalidTokens" }
                };
                this.dispatch(messageInvalidTokens);
                break;
            case "valid":
                let client = this.rooms[_message.idRoom].clients[_message.idSource];
                client.name = _message.content.username;
                let message = {
                    idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.ASSIGN_USERNAME, idSource: _message.idSource, content: { message: "valid" }
                };
                this.broadcast(message);
                break;
            default:
                break;
        }
    }
    checkUsername(_username) {
        let existingUsername = false;
        Object.values(this.rooms).map(room => { Object.values(room.clients).map(client => { if (client.id == _username || client.name == _username) {
            existingUsername = true;
        } }); });
        if (existingUsername) {
            return "alreadyTaken";
        }
        if (!/^[A-Za-z0-9_]*$/.test(_username)) {
            return "invalidTokens";
        }
        return "valid";
    }
    checkLeavedRoom(_room) {
        if (_room != this.idLobby) {
            if (Object.keys(this.rooms[_room].clients).length == 0) {
                delete this.rooms[_room];
            }
            else {
                let messageRoom = {
                    idRoom: _room, command: Message_js_1.FudgeNet.COMMAND.ROOM_LEAVE, content: { leaver: false, newHost: Object.keys(this.rooms[_room].clients)[0] }
                };
                this.broadcast(messageRoom);
            }
        }
    }
    setRoomPassword(_message) {
        if (_message.content.private) {
            this.rooms[_message.idRoom].private = true;
            this.rooms[_message.idRoom].password = _message.content.password;
        }
        else {
            this.rooms[_message.idRoom].private = false;
            this.rooms[_message.idRoom].password ?? delete this.rooms[_message.idRoom].password;
        }
    }
    enterRoom(_message) {
        if (!_message.idRoom || !_message.idSource || !_message.content)
            throw (new Error("Message lacks idSource, idRoom or content."));
        if (!this.rooms[_message.idRoom])
            throw (new Error(`Room unavailable ${_message.idRoom}`));
        if (this.rooms[_message.content.room]) {
            if (this.rooms[_message.content.room].private) {
                if (_message.content.password) {
                    if (_message.content.password == this.rooms[_message.content.room].password) {
                        let client = this.rooms[_message.idRoom].clients[_message.idSource];
                        let room = this.rooms[_message.content.room];
                        delete this.rooms[_message.idRoom].clients[_message.idSource];
                        room.clients[_message.idSource] = client;
                        let message = {
                            idRoom: _message.content.room, command: Message_js_1.FudgeNet.COMMAND.ROOM_ENTER, content: { client: _message.idSource, host: _message.content?.host, correctPassword: true }
                        };
                        this.broadcast(message);
                    }
                    else {
                        let messageClient = {
                            idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.ROOM_ENTER, idTarget: _message.idSource, content: { correctPassword: false }
                        };
                        this.dispatch(messageClient);
                    }
                }
                else {
                    let messageClient = {
                        idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.ROOM_ENTER, idTarget: _message.idSource, content: { private: true }
                    };
                    this.dispatch(messageClient);
                }
            }
            else {
                let client = this.rooms[_message.idRoom].clients[_message.idSource];
                let room = this.rooms[_message.content.room];
                delete this.rooms[_message.idRoom].clients[_message.idSource];
                room.clients[_message.idSource] = client;
                let message = {
                    idRoom: _message.content.room, command: Message_js_1.FudgeNet.COMMAND.ROOM_ENTER, content: { client: _message.idSource, host: _message.content?.host, correctPassword: false }
                };
                this.broadcast(message);
            }
        }
        else {
            let messageClient = {
                idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.ROOM_ENTER, idTarget: _message.idSource, content: { expired: true }
            };
            this.dispatch(messageClient);
        }
    }
    leaveRoom(_message) {
        if (!_message.idRoom || !_message.content.leaver_id)
            throw (new Error("Message lacks idSource, idRoom or content"));
        if (!this.rooms[_message.idRoom])
            throw (new Error(`Room unavailable ${_message.idRoom}`));
        let client = this.rooms[_message.idRoom].clients[_message.content.leaver_id];
        let room = this.rooms[this.idLobby];
        delete this.rooms[_message.idRoom].clients[_message.content.leaver_id];
        room.clients[_message.content.leaver_id] = client;
        let messageRoom = {
            idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.ROOM_LEAVE, content: { leaver: false, newHost: Object.keys(this.rooms[_message.idRoom].clients)[0] }
        };
        this.broadcast(messageRoom);
        let messageClient = {
            idRoom: this.idLobby, command: Message_js_1.FudgeNet.COMMAND.ROOM_LEAVE, idTarget: _message.content.leaver_id, content: { leaver: true, newHost: Object.keys(this.rooms[_message.idRoom].clients)[0] }
        };
        this.dispatch(messageClient);
        (Object.keys(this.rooms[_message.idRoom].clients).length == 0) && delete this.rooms[_message.idRoom];
    }
    createRoom(_message) {
        let client = this.rooms[_message.idRoom].clients[_message.idSource];
        let idRoom = this.createID();
        this.rooms[idRoom] = { id: idRoom, clients: {}, idHost: undefined, name: client.name ? client.name + "'s Lobby" : client.id + "'s Lobby", private: false };
        let message = {
            idRoom: this.idLobby, command: Message_js_1.FudgeNet.COMMAND.ROOM_CREATE, idTarget: _message.idSource, content: { room: idRoom, host: true }
        };
        this.dispatch(message);
    }
    renameRoom(_message) {
        let client = this.rooms[_message.idRoom].clients[_message.idSource];
        this.rooms[_message.idRoom].name = client.name + "'s Lobby";
        let message = {
            idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.ROOM_RENAME, idTarget: _message.idSource, content: { room: _message.idRoom }
        };
        this.dispatch(message);
    }
    getRoomList(_message) {
        let message = {
            idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.ROOM_LIST, idTarget: _message.idSource, content: { rooms: Object.keys(this.rooms), roomNames: Object.values(this.rooms).map(room => room.name), clients: Object.values(this.rooms).map(room => Object.keys(room.clients).toString()), private: Object.values(this.rooms).map(room => room.private) }
        };
        this.dispatch(message);
    }
    getRoomInfo(_message) {
        let clients = this.rooms[_message.idRoom].clients;
        let message = {
            idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.ROOM_INFO, idTarget: _message.idSource, content: { room: _message.idRoom, name: this.rooms[_message.idRoom].name, clients: clients }
        };
        this.dispatch(message);
    }
    startGame(_message) {
        let clients = this.rooms[_message.idRoom].clients;
        let message = {
            idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.START_GAME, content: { clients: clients }
        };
        this.broadcast(message);
    }
    sendDice(_message) {
        let message = {
            idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.SEND_DICE, content: { dice: _message.content.dice }
        };
        this.broadcast(message);
    }
    values = [];
    indices = [];
    names = [];
    sendScore(_message) {
        console.log(_message);
        let clients = this.rooms[_message.idRoom].clients;
        this.values.push(_message.content.value);
        this.indices.push(_message.content.index);
        this.names.push(_message.content.name);
        if (this.values.length == Object.keys(clients).length) {
            let message = {
                idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.SEND_SCORE, content: { value: this.values, index: this.indices, name: this.names }
            };
            this.broadcast(message);
            this.values = [];
            this.indices = [];
            this.names = [];
        }
    }
    async createMesh(_message) {
        let room = this.rooms[_message.idRoom];
        let ids = Reflect.ownKeys(room.clients);
        while (ids.length > 1) {
            let id = ids.pop();
            let message = {
                idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.CONNECT_PEERS, idTarget: id, content: { peers: ids }
            };
            await new Promise((resolve) => { setTimeout(resolve, 500); });
            this.dispatch(message);
        }
        room.idHost = undefined;
    }
    async connectHost(_message) {
        if (!_message.idSource || !_message.idRoom)
            return;
        let room = this.rooms[_message.idRoom];
        let ids = Reflect.ownKeys(room.clients);
        let message = {
            idRoom: _message.idRoom, command: Message_js_1.FudgeNet.COMMAND.CONNECT_PEERS, idTarget: _message.idSource, content: { peers: ids }
        };
        console.log("Connect Host", _message.idSource, ids);
        room.idHost = _message.idSource;
        this.dispatch(message);
    }
    addUserOnValidLoginRequest(_wsConnection, _message) {
        let rooms = this.rooms[this.idLobby];
        let name = _message.content?.name;
        for (let id in rooms.clients) {
            if (rooms.clients[id].name == name) {
                console.log("UsernameTaken", name);
                let netMessage = { idRoom: this.idLobby, idTarget: id, command: Message_js_1.FudgeNet.COMMAND.LOGIN_RESPONSE, content: { success: false } };
                this.dispatch(netMessage);
                return;
            }
        }
        try {
            for (let id in rooms.clients) {
                let client = rooms.clients[id];
                if (client.socket == _wsConnection) {
                    client.name = name;
                    let netMessage = { idRoom: this.idLobby, idTarget: id, command: Message_js_1.FudgeNet.COMMAND.ASSIGN_ID, content: { success: true } };
                    this.dispatch(netMessage);
                    return;
                }
            }
        }
        catch (error) {
            console.error("Unhandled Exception: Unable to create or send LoginResponse", error);
        }
    }
    sendRtcOfferToRequestedClient(_wsConnection, _message) {
        try {
            if (!_message.idTarget || !_message.content || !_message.idRoom)
                throw (new Error("Message lacks idTarget, idRoom or content."));
            let room = this.rooms[_message.idRoom];
            // console.log("Sending offer to: ", _message.idTarget);
            const client = room.clients[_message.idTarget];
            if (!client)
                throw (new Error(`No client found with id ${_message.idTarget}`));
            let netMessage = {
                idRoom: _message.idRoom, idSource: _message.idSource, idTarget: _message.idTarget, command: Message_js_1.FudgeNet.COMMAND.RTC_OFFER, content: { offer: _message.content.offer }
            };
            this.dispatch(netMessage);
        }
        catch (error) {
            console.error("Unhandled Exception: Unable to relay Offer to Client", error);
        }
    }
    answerRtcOfferOfClient(_wsConnection, _message) {
        if (!_message.idTarget || !_message.idRoom)
            throw (new Error("Message lacks target"));
        let room = this.rooms[_message.idRoom];
        // console.log("Sending answer to: ", _message.idTarget);
        const client = room.clients[_message.idTarget];
        if (client && client.socket && _message.content) {
            this.dispatch(_message);
        }
        else
            throw (new Error("Client or its socket not found or message lacks content."));
    }
    sendIceCandidatesToRelevantPeer(_wsConnection, _message) {
        if (!_message.idTarget || !_message.idSource || !_message.idRoom)
            throw (new Error("Message lacks target-, source- or room-id."));
        let room = this.rooms[_message.idRoom];
        const client = room.clients[_message.idTarget];
        if (client && _message.content) {
            // console.warn("Send Candidate", client, _message.content.candidate);
            this.dispatch(_message);
        }
        else
            throw (new Error("Client not found or message lacks content."));
    }
    createID = () => {
        // Math.random should be random enough because of its seed
        // convert to base 36 and pick the first few digits after comma
        // return "_" + process.getuid().toString(36);
        return "_" + Math.random().toString(36).slice(2, 7);
    };
    heartbeat = () => {
        process.stdout.write("♥");
        for (let idRoom in this.rooms) {
            let room = this.rooms[idRoom];
            let clients = {};
            for (let id in room.clients)
                //@ts-ignore
                clients[id] = { name: room.clients[id].name, peers: room.clients[id].peers, isHost: room.idHost == id };
            let message = { idRoom: idRoom, command: Message_js_1.FudgeNet.COMMAND.SERVER_HEARTBEAT, content: clients };
            this.broadcast(message);
        }
    };
}
exports.FudgeServer = FudgeServer;
