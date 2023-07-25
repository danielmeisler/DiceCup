/**
 * Minimal implementation showing the use of the FudgeServer.
 * Start with `node Server.js <port>`, Heroku uses the start-script in package.json
 * @author Jirka Dell'Oro-Friedl, HFU, 2021
 */
// Imports the FudgeServer
import { FudgeServer } from "../Library/Net/Build/Server/FudgeServer.js";
// Defines the port
let port = process.env.PORT;
if (port == undefined)
    port = parseInt(process.argv[2]);
if (!port) {
    console.log("Syntax: 'node Server.js <port>' or use start script in Heroku");
    process.exit();
}
// Starts the Fudge Server with given port
let server = new FudgeServer();
server.startUp(port);
console.log(server);
