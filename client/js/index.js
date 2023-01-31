import { readFileSync } from "fs";
import { request } from "https";

let loginContainer = document.getElementById("loginContainer");
let inUser = document.getElementById("inUser");
let inPass = document.getElementById("inPass");
let btLogin = document.getElementById("btLogin");

let regexContainer = document.getElementById("regexContainer");
let inRegex = document.getElementById("inRegex");
let btRegex = document.getElementById("btRegex");
let taRegex = document.getElementById("taRegex");

let alertContainerLogin = document.getElementById("alertContainerLogin");
let alertContainerRegex = document.getElementById("alertContainerRegex");

let loaderLogin = document.getElementById("spLoaderLogin");
let loaderRegex = document.getElementById("spLoaderRegex");

const proxy = new Proxy(
  {
    login: login,
    regex: sendMsgThroughWebSocket,
  },
  {
    get: function (target, prop) {
      if (prop === "login") {
        target.login();
      }
    },
    set: function (target, prop, value) {
      if (prop === "regex") {
        target.regex(value);
        return true;
      }
    },
  }
);

btLogin.addEventListener("click", () => {
  let user = inUser.value;
  let pass = inPass.value;
  alertContainerLogin.innerHTML = "";
  if (user.value == "" || pass.value == "") {
    alertContainerLogin.innerHTML = "Introduce tu usuario y contraseña";
  } else {
    proxy.login;
  }
});

function login() {
  const req = request(
    {
      hostname: "", // TODO server name
      port: 3000,
      path: "http://localhost:3000/login",
      method: "POST",
      cert: readFileSync("client.crt"),
      key: readFileSync("client.key"),
      ca: readFileSync("ca.crt"),
    },
    (res) => {
      res.on("data", function (data) {
        if (data.data != null) {
          // TODO catch
          token = data.data;
          loginContainer.classList.toggle("display-none");
          regexContainer.classList.toggle("display-none");
          taRegex.value = "";
          connectToWebSocket({
            ip: "localhost",
            port: "3030",
          });
        } else {
          alertContainerLogin.innerHTML = "Usuario o contraseña no válidos";
        }
      });
    }
  );

  req.end();
}

function connectToWebSocket(config) {
  socket = new WebSocket("ws://" + config.ip + ":" + config.port);

  socket.onmessage = (event) => {
    loader.toggleAttribute("hidden");
    taRegex.value += `${JSON.parse(event.data).result}\n\n`;
    if (cont == 5) {
      btRegex.classList.toggle("display-none");
      alertContainerRegex.innerHTML =
        'Gastaste tus consultas, vuelve a <u id="linkLogin">loguearte</u>';
      inRegex.value = "";
      cont = 0;
      document.getElementById("linkLogin").addEventListener("click", () => {
        loginContainer.classList.toggle("display-none");
        regexContainer.classList.toggle("display-none");
        alertContainerRegex.innerHTML = "";
        taRegex.value = "";
        btRegex.classList.toggle("display-none");
      });
    }
  };

  socket.onclose = () => {
    state = false;
  };

  socket.onerror = () => {
    state = false;
  };
}

btRegex.addEventListener("click", () => {
  let regex = inRegex.value;
  alertContainerRegex.innerHTML = "";
  inRegex.value = "";
  if (regex == "") {
    alertContainerRegex.innerHTML = "Introduce una regex";
  } else {
    if (loader.hasAttribute("hidden")) {
      loader.toggleAttribute("hidden");
    }
    proxy.regex = regex;
    cont++;
  }
});

function sendMsgThroughWebSocket(content) {
  socket.send(
    JSON.stringify({
      token: token,
      content: content,
    })
  );
}
