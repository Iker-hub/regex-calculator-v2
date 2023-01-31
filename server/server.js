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
    .createServer({
      requestCert: true,
      rejectUnauthorized: false,
      ca: fs.readFileSync("ca.crt"),
    })
    .listen(3000);
}

exports.init = init;
