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
        key: fs.readFileSync("./keys/server_key.pem"),
        cert: fs.readFileSync("./keys/server_cert.pem"),
        ca: [fs.readFileSync("./keys/server_cert.pem")],
        requestCert: true,
        rejectUnauthorized: false,
      },
      app
    )
    .listen(3000);
}

exports.init = init;
