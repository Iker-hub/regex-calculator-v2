//import Queue from "bull";

function init() {
  var WebSocketServer = require("ws").Server;

  const jwt = require("jsonwebtoken");
  var parser = require("../rules/rules");

  /*interface IRegex {
    regex: string;
  }

  const regexs = [{ regex: "1+2" }];

  const regex = new Queue() < IRegex > "myQueue";

  const controller = async () => {
    const promises = regexs.map((regex) => queue.add(regex));

    await Promise.all(promises);
  };

  void controller();*/

  var wss = new WebSocketServer({ port: 3030 });
  wss.on("connection", function connection(ws) {
    ws.on("message", function broadcastMsg(msg) {});
  });
}

exports.init = init;
