"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FudgeNet = void 0;
(function (FudgeNet) {
    let COMMAND;
    (function (COMMAND) {
        COMMAND["UNDEFINED"] = "undefined";
        COMMAND["ERROR"] = "error";
        /** sent from server to assign an id for the connection and reconfirmed by the client. `idTarget` is used to carry the id  */
        COMMAND["ASSIGN_ID"] = "assignId";
        /** sent from a client to the server to suggest a login name. `name` used for the suggested name  */
        COMMAND["LOGIN_REQUEST"] = "loginRequest";
        /** sent from the server to the client requesting a login name. `content.success` is true or false for feedback */
        COMMAND["LOGIN_RESPONSE"] = "loginResponse";
        /** sent from the server every second to check if the connection is still up.
         * `content` is an array of objects with the ids of the clients and their connected peers as known to the server */
        COMMAND["SERVER_HEARTBEAT"] = "serverHeartbeat";
        /** not used yet */
        COMMAND["CLIENT_HEARTBEAT"] = "clientHeartbeat";
        /** command used internally when a client tries to connect to another via rtc to create a peer-to-peer-connection */
        COMMAND["RTC_OFFER"] = "rtcOffer";
        /** command used internally when a client answers a conection request from another client */
        COMMAND["RTC_ANSWER"] = "rtcAnswer";
        /** command used internally when a client send its connection candidates for peer-to-peer connetion */
        COMMAND["ICE_CANDIDATE"] = "rtcCandidate";
        /** command sent by a client to the server and from the server to all clients to initiate a mesh structure between the clients
         * creating peer-to-peer-connections between all clients known to the server */
        COMMAND["CREATE_MESH"] = "createMesh";
        /** command sent by a client, which is supposed to become the host, to the server and from the server to all clients
         * to create peer-to-peer-connections between this host and all other clients known to the server */
        COMMAND["CONNECT_HOST"] = "connectHost";
        /** command initializing peer-to-peer-connections between the client identified with `idTarget` and all the peers
         * identified by the array giwen with `content.peers` */
        COMMAND["CONNECT_PEERS"] = "connectPeers";
        /** dissolve peer-to-peer-connection between the client identified with `idTarget` and all the peers
         * identified by the array giwen with `content.peers` or to all peers the client is connected to, if content.peers is undefined */
        COMMAND["DISCONNECT_PEERS"] = "disconnectPeers";
        /** sent to the server to create a new room and return its id */
        COMMAND["ROOM_CREATE"] = "roomCreate";
        /** sent to the server to rename the given room, not its id */
        COMMAND["ROOM_RENAME"] = "roomRename";
        /** sent to the server and back to the calling client to retrieve an array of available room names */
        COMMAND["ROOM_LIST"] = "roomList";
        /** sent to the server to join the calling client to the room given with the id, sent back to all clients in the room after */
        COMMAND["ROOM_ENTER"] = "roomEnter";
        /** sent to the server to leave the calling client to the room given with the id, sent back to all clients in the leaved room */
        COMMAND["ROOM_LEAVE"] = "roomLeave";
        /** sent to the server to get information like id, roomname and clients about the room given with the id */
        COMMAND["ROOM_INFO"] = "roomInfo";
        /** sent to the server to set or remove a room password */
        COMMAND["ROOM_PASSWORD"] = "roomPassword";
        /** sent to the server to change the gamemode of the current game */
        COMMAND["CHANGE_GAMEMODE"] = "changeGamemode";
        /** sent to the server to set the client on ready so the host can start the game if all clients are ready*/
        COMMAND["CLIENT_READY"] = "clientReady";
        /** sent to the server to set a temporary username besides the client id and check if its available */
        COMMAND["ASSIGN_USERNAME"] = "assignUsername";
        /** sent to the server to start the game with the connected clients */
        COMMAND["START_GAME"] = "startGame";
        /** sent to the server to end the game with the connected clients and reset states and variables*/
        COMMAND["END_GAME"] = "endGame";
        /** sent to the server as host to share the dice with the other clients */
        COMMAND["SEND_DICE"] = "sendDice";
        /** sent to the server to share the score so everyone has a full summary table */
        COMMAND["SEND_SCORE"] = "sendScore";
        /** sent to the server to determine how many clients want to skip the summary phase */
        COMMAND["SKIP_SUMMARY"] = "skipSummary";
    })(COMMAND = FudgeNet.COMMAND || (FudgeNet.COMMAND = {}));
    /**
     * Defines the route the message should take.
     * - route undefined -> send message to peer idTarget using RTC
     * - route undefined & idTarget undefined -> send message to all peers using RTC
     * - route HOST -> send message to peer acting as host using RTC, ignoring idTarget
     * - route SERVER -> send message to server using websocket
     * - route VIA_SERVER -> send message to client idTarget via server using websocket
     * - route VIA_SERVER_HOST -> send message to client acting as host via server using websocket, ignoring idTarget
     */
    let ROUTE;
    (function (ROUTE) {
        ROUTE["HOST"] = "toHost";
        ROUTE["SERVER"] = "toServer";
        ROUTE["VIA_SERVER"] = "viaServer";
        ROUTE["VIA_SERVER_HOST"] = "viaServerToHost";
    })(ROUTE = FudgeNet.ROUTE || (FudgeNet.ROUTE = {}));
})(exports.FudgeNet || (exports.FudgeNet = {}));
