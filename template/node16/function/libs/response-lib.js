module.exports.generic = function (context, statusCode, body) {
  return buildResponse(context, statusCode, body);
};

module.exports.success = function (context, body) {
  return buildResponse(context, 200, body);
};

module.exports.notFound = function (context, body) {
  return buildResponse(context, 404, { message: body?.message || "The requested resource was not found." });
};

module.exports.unauthorized = function (context) {
  return buildResponse(context, 403, { message: "You are not authorized to perform the requested action." });
};

module.exports.created = function (context, body) {
  return buildResponse(context, 201, body);
};

module.exports.noContent = function (context) {
  return buildResponse(context, 204, null);
};

module.exports.failure = function (context, body) {
  return buildResponse(context, 500, body);
};

function buildResponse(context, statusCode, body) {
  // const result = {
  //   body: JSON.stringify(event.body),
  //   "content-type": event.headers["content-type"],
  // };
  if (context)
    context["headerValues"] = {
      "Content-Type": "application/json",
    };

  return context?.status(statusCode).succeed(body);
}
