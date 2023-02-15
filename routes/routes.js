const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("We are on home");
});

router.get("/login", async (req, res) => {
  if (req.client.authorized) {
    res.status(200).json(`Bienvenido!`);
  } else {
    res.status(401).json({
      data: `Lo sentimos, pero necesitas un certificado válido para iniciar sesión`,
    });
  }
});

module.exports = router;
