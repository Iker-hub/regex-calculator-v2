const database = require("./server/database.js");
const server = require("./server/server");
//const websocket = require("./server/websocket");

database.init();
server.init();
//websocket.init();
