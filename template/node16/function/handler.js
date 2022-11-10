"use strict";

const lib = require("openfaas-custom-libs");
const pkg = require("./package.json");

//const pkg = require("./package.json");

module.exports = async (event, context) => {
  console.log(`> ${pkg.name}@${pkg.version}`);

  // Token Verification
  const verified = await lib.utils.callFunction(event, "validate-token", "GET");
  if (!verified) {
    return lib.responseLib.unauthorized(context);
  }
  //console.log(verified);

  let resp = null;
  const { method } = event;
  try {
    switch (method) {
      case "GET":
        resp = await handleGet(event, context);
        break;
      case "POST":
        resp = await handlePost(event, context);
        break;
      case "PUT":
        resp = await handlePut(event, context);
        break;
      case "DELETE":
        resp = await handleDelete(event, context);
        break;
      case "PATCH":
        resp = await handlePatch(event, context);
        break;
      default:
        resp = lib.responseLib.generic(context, 405, "Method Not Allowed");
    }
  } catch (error) {
    resp = lib.responseLib.generic(context, 500, error.toString());
  }
  if (process.env.IS_LOCALHOST) console.log({ method, resp });
  return resp;
};

const handleGet = async (event, context) => {
  return lib.responseLib.generic(context, 405, "Method Not Allowed");
};

const handlePost = async (event, context) => {
  return lib.responseLib.generic(context, 405, "Method Not Allowed");
};

const handlePut = async (event, context) => {
  return lib.responseLib.generic(context, 405, "Method Not Allowed");
};

const handleDelete = async (event, context) => {
  return lib.responseLib.generic(context, 405, "Method Not Allowed");
};

const handlePatch = async (event, context) => {
  return lib.responseLib.generic(context, 405, "Method Not Allowed");
};
