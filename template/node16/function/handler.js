"use strict";

module.exports = async (event, context) => {
  "use strict";
  const responseLib = require("./libs/response-lib");
  const utils = require("./libs/utils.js");

  return responseLib.success(context, JSON.stringify(event.body));
};
