const fs = require("fs").promises;
const axios = require("axios");

const passwordPath = process.env.IS_LOCALHOST ? "../../secrets/" : "/var/openfaas/secrets/";

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
module.exports.callFunction = async (event, functionName, method, body) => {
  console.log("callFunction()", functionName);
  const protocol = getProtocolFromOrigin(event?.headers?.origin);

  const path = process.env.IS_LOCALHOST ? "localhost:8080" : `${functionName}.openfaas-fn.svc.cluster.local:8080`;
  console.log("url:", `${protocol}://${path}/function/${functionName}`);
  try {
    const resp = await axios({
      url: `${protocol}://${path}/function/${functionName}`,
      method: method,
      headers: event.headers,
      data: body,
    });
    console.log("Got Response !");
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// Validate Token Wrapper
module.exports.verifyToken = async (event) => {
  console.log("verifyToken");
  console.log(event.headers);
  try {
    const resp = await exports.callFunction(event, "validate-token", "GET", undefined, event.headers);
    console.log("Response status", resp.status);
    if (resp.status !== 403) return resp.data;
    return false;
  } catch (error) {
    //console.error(error);
    return false;
  }
};

// Depends on a situation, protocol for requests can be HTTP or HTTPS, get it's value from a Hosted Func/WebPage
function getProtocolFromOrigin(origin) {
  if (!origin) return "http";
  let tmp = origin.split("//")[0];
  return tmp.slice(0, -1);
}
