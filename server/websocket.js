function init() {
  var WebSocketServer = require("ws").Server;

  var parser = require("../rules/rules");

  // TODO Redis

  var wss = new WebSocketServer({ port: 3030 });
  wss.on("connection", function connection(ws) {
    ws.on("message", function broadcastMsg(msg) {
      ws.send(
        JSON.stringify({
          result: regex + " : " + parser.parse(`Evaluar[${regex}];`),
        })
      );
    });
  });
}

exports.init = init;
