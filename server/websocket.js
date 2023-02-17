class Queue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  peek() {
    return this.items[this.frontIndex];
  }
  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
  }
  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
  }
}

function init() {
  var WebSocketServer = require("ws").Server;

  var parser = require("../rules/rules");

  const queue = new Queue();

  var wss = new WebSocketServer({ port: 3030 });
  wss.on("connection", function connection(ws) {
    ws.on("message", function broadcastMsg(msg) {
      queue.enqueue(JSON.parse(msg).content);
      setTimeout(() => {
        let regex = queue.peek();
        ws.send(
          JSON.stringify({
            result: regex + " : " + parser.parse(`Evaluar[${regex}];`),
          })
        );
        queue.dequeue();
      }, Math.floor(Math.random() * 10000) + 1);
    });
  });
}

exports.init = init;
