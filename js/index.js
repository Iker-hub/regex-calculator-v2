let loginContainer = document.getElementById("loginContainer");
let btLogin = document.getElementById("btLogin");

let regexContainer = document.getElementById("regexContainer");
let inRegex = document.getElementById("inRegex");
let btRegex = document.getElementById("btRegex");
let taRegex = document.getElementById("taRegex");

let alertContainerLogin = document.getElementById("alertContainerLogin");
let alertContainerRegex = document.getElementById("alertContainerRegex");

let loaderLogin = document.getElementById("spLoaderLogin");
let loaderRegex = document.getElementById("spLoaderRegex");

const MAX_LONG = -3.590768;
const MIN_LONG = -3.592621;
const MIN_LATI = 37.160317;
const MAX_LATI = 37.161525;

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
  checkPosition();
});

function checkPosition() {
  loaderLogin.toggleAttribute("hidden");
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      loaderLogin.toggleAttribute("hidden");
      if (
        MIN_LATI < pos.coords.latitude < MAX_LATI &&
        MIN_LONG > pos.coords.longitude > MAX_LONG
      ) {
        proxy.login;
      } else {
        alertContainerLogin.innerHTML = "Tu ubicación no está permitida";
      }
    },
    function (err) {
      loaderLogin.toggleAttribute("hidden");
      console.log(`Error ${err.code} : ${err.message}`);
      if (err.code == 1) {
        alertContainerLogin.innerHTML = "Acceso a ubicación denegado";
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    }
  );
}

function login() {
  const url = "https://localhost:3000/login";
  const options = {
    method: "GET",
  };
  fetch(url, options)
    .then((data) => {
      switch (data.status) {
        case 200:
          loginContainer.classList.toggle("display-none");
          regexContainer.classList.toggle("display-none");
          taRegex.value = "";
          connectToWebSocket({
            ip: "localhost",
            port: "3030",
          });
          break;
        case 401:
          alertContainerLogin.innerHTML =
            "Lo sentimos, pero necesitas un certificado válido para iniciar sesión";
          break;
      }
    })
    .catch((err) => console.error("error:" + err));
}

function connectToWebSocket(config) {
  socket = new WebSocket("ws://" + config.ip + ":" + config.port);

  socket.onmessage = (event) => {
    loaderRegex.toggleAttribute("hidden");
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
    if (loaderRegex.hasAttribute("hidden")) {
      loaderRegex.toggleAttribute("hidden");
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
