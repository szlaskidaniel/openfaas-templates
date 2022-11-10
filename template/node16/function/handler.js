"use strict";

import lib from "openfaas-custom-libs";
import pkg from "./package.json";

//const pkg = require("./package.json");

module.exports = async (event, context) => {
  console.log(`> ${pkg.name}@${pkg.version}`);

  // Token Verification
  const verified = await lib.utils.callFunction(event, "validate-token", "GET");
  if (!verified) {
    return lib.responseLib.unauthorized(context);
  }
  //console.log(verified);

  const { method } = event;

  let resp = null;
  switch (method) {
    case "GET":
      resp = await handleGet(event, context);
    case "POST":
      resp = await handlePost(event, context);
    case "PUT":
      resp = await handlePut(event, context);
    case "DELETE":
      resp = await handleDelete(event, context);
    case "PATCH":
      resp = await handlePatch(event, context);
    default:
      resp = lib.responseLib.generic(context, 405, "Method Not Allowed");
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
