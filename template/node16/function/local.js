"use strict";
const handler = require("./handler");

handler({
  method: "GET",
  body: {},
  headers: {
    Authorization: "Token",
  },
});
