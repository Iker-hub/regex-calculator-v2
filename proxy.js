const proxy = new Proxy(
  {
    login: "",
    regex: "",
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
