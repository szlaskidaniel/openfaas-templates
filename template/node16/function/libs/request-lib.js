const responseLib = require("./response-lib");

module.exports.getMissingProps = function (arrayObject, propList) {
  var missingPropsList = [];
  if (arrayObject) {
    for (const p of propList) {
      if (!arrayObject[p]) {
        missingPropsList.push(p);
      }
    }
  }
  return missingPropsList;
};

module.exports.getPathParameter = function (event, proxyPath, position, defaultValue) {
  if (event && Object.keys(event).includes("pathParameters") && event.pathParameters && Object.keys(event.pathParameters).includes("proxy")) {
    return event.pathParameters.proxy.split(proxyPath)[position + 1];
  } else {
    return defaultValue;
  }
};

module.exports.getBody = function (event) {
  if (event && event.body) {
    return JSON.parse(event.body);
  } else {
    console.warn(`No body found in event.`);
    return undefined;
  }
};

module.exports.handleError = function (error) {
  //console.error('handleError() called:', error);
  return new Promise((resolve) => {
    if (error.response && error.response && error.response.status) {
      console.error("Error.response.data: " + JSON.stringify(error.response.data, null, 2));
      console.error(error.response.data && Object.keys(error.response.data).length > 0 ? error.response.data.message : error.response.statusText);
      resolve(responseLib.generic(error.response.status, { message: error.response.data && Object.keys(error.response.data).length > 0 ? error.response.data.message : error.response.statusText }));
    } else {
      resolve(responseLib.failure(error));
    }
  });
};

module.exports.getQueryStringParameter = function (event, parameter, defaultValue) {
  if (event && Object.keys(event).includes("queryStringParameters") && event.queryStringParameters && Object.keys(event.queryStringParameters).includes(parameter)) {
    return event.queryStringParameters[parameter];
  } else {
    console.log(`${parameter} not found in queryStringParameters. Returning default value: ${defaultValue}`);
    return defaultValue;
  }
};
