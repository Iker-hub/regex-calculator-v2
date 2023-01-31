const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  if (!req.client.authorized) {
    return res
      .status(401)
      .send("Autenticación de certificado de cliente no válida");
  }
  return next();
});

module.exports = router;
