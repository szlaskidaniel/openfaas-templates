"use strict";
const utils = require("./libs/utils.js");
const responseLib = require("./libs/response-lib");
const pkg = require("./package.json");

module.exports = async (event, context) => {
  console.log(`> ${pkg.name}@${pkg.version}`);
  // Token Verification
  // const verified = await utils.verifyToken(event);
  // if (!verified) {
  //   return responseLib.unauthorized(context);
  // }
  // console.log(verified);

  return responseLib.success(context, JSON.stringify(event.body));
};
