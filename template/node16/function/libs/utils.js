const fs = require("fs").promises;
const axios = require("axios");

const passwordPath = process.env.IS_LOCALHOST ? "../secrets/" : "/var/openfaas/secrets/";

module.exports.readSecret = async (file) => {
  console.log("try to read secret", file);
  try {
    let data = await fs.readFile(passwordPath + file, "utf-8");
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// Call OpenFaaS Function Internally
module.exports.callFunction = async (event, functionName, method, body, headers) => {
  console.log("callFunction");
  const protocol = getProtocolFromOrigin(event?.headers?.origin);

  try {
    const resp = await axios({
      url: `${protocol}://${functionName}.openfaas-fn.svc.cluster.local:8080/function/${functionName}`,
      method: method,
      headers: headers,
      data: body,
    });
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// Validate Token Wrapper
module.exports.verifyToken = async (event) => {
  console.log("verifyToken");

  try {
    const resp = await exports.callFunction(event, "validate-token", "GET", undefined, event.headers);
    if (resp.status !== 403) return resp.data;
    return false;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// Depends on a situation, protocol for requests can be HTTP or HTTPS, get it's value from a Hosted Func/WebPage
function getProtocolFromOrigin(origin) {
  console.log("getProtocolFromOrigin", origin);
  if (!origin) return "http";
  let tmp = origin.split("//")[0];
  return tmp.slice(0, -1);
}
