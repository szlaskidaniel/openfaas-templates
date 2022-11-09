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

// Call OpenFaaS Function Internally using built-in Kube-DNS records
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
    return resp;
  } catch (error) {
    let errResp;
    if (error?.response?.status) {
      errResp = `StatusCode: ${error?.response?.status}: ${JSON.stringify(error?.response?.statusText)}`;
    }
    console.error(errResp ? errResp : error);
    return;
  }
};

// Database Service shouldn't be exposed outside a Cluster. There is dedicated Container/Service handling those requests
module.exports.callDb = async (event, body) => {
  console.log("callDb()", body);
  const protocol = getProtocolFromOrigin(event?.headers?.origin);
  const path = process.env.IS_LOCALHOST ? "localhost:5430" : "db-client.database.svc.cluster.local:8080";

  try {
    const resp = await axios({
      url: `${protocol}://${path}`,
      method: "POST",
      data: body,
    });
    return resp;
  } catch (error) {
    let errResp;
    if (error?.response?.status) {
      errResp = `StatusCode: ${error?.response?.status}: ${JSON.stringify(error?.response?.statusText)}`;
    }
    console.error(errResp ? errResp : error);
    return;
  }
};

// Depends on a situation, protocol for requests can be HTTP or HTTPS, get it's value from a Hosted Func/WebPage
function getProtocolFromOrigin(origin) {
  if (!origin) return "http";
  let tmp = origin.split("//")[0];
  return tmp.slice(0, -1);
}
