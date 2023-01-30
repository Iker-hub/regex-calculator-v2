const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://admin:admin@localhost:1888/admin?authMechanism=DEFAULT",
  () => {
    console.log("Connect to DB!");
  }
);
