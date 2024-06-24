function buildFailureResponse(message, statusCode) {
  return {
    status: "failure",
    message,
    statusCode,
  };
}

function buildSuccessResponse(message, statusCode, data) {
  if (data) {
    return {
      status: "success",
      message,
      statusCode,
      data,
    };
  }
  return {
    status: "success",
    message,
    statusCode,
  };
}

module.exports = { buildFailureResponse, buildSuccessResponse };
