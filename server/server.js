function init() {
  const express = require("express");
  const app = express();

  const bodyParser = require("body-parser");
  const cors = require("cors");

  app.use(cors());
  app.use(bodyParser.json());

  const routes = require("../routes/routes");
  app.use("/", routes);

  const https = require("https");
  const fs = require("fs");
  https
    .createServer(
      {
        key: fs.readFileSync("./keys/client-1.local.key"),
        cert: fs.readFileSync("./keys/localhost.crt"),
        requestCert: true,
        rejectUnauthorized: false,
        ca: [fs.readFileSync("./keys/rootSSL.pem")],
      },
      app
    )
    .listen(3000);

  console.log("Server running...");
}

exports.init = init;
