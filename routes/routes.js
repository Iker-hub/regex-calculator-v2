const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

router.post("/login", async (req, res) => {
  const cert = req.socket.getPeerCertificate();
  if (req.client.authorized) {
    res.send(`Hola ${cert.subject.CN}!`);
  } else if (cert.subject) {
    res
      .status(403)
      .send(`Lo sentimos ${cert.subject.CN}, tu certificado no es válido`);
  } else {
    res
      .status(401)
      .send(`Lo sentimos, pero necesitas un certificado para iniciar sesión`);
  }
  return next();
});

module.exports = router;
