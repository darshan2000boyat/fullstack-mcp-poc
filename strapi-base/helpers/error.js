const httpStatus = require("http-status");
const logger = require("./logger").default;

class CustomError extends Error {
  statusCode;
  error;
  message;

  constructor(message, errorCode, statusCode = httpStatus.BAD_REQUEST) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.error = httpStatus[statusCode];
    this.message = message;
  }

  toJSON() {
    return {
      status_code: this.statusCode,
      error: this.error,
      message: this.message,
      data: {},
      success: false,
    };
  }
}

const errorResponse = async (ctx, error) => {
  let mError;
  logger.error(error);
  error.statusCode =
    parseInt(error?.statusCode) || httpStatus.INTERNAL_SERVER_ERROR;
  error.message = error?.message || "An internal server error occurred";
  error.errorCode =
    parseInt(error?.errorCode) || httpStatus.INTERNAL_SERVER_ERROR;

  if (error?.errors) {
    error.message = error.errors[0];
    error.statusCode = 422;
  }

  mError = new CustomError(error.message, error.errorCode, error.statusCode);

  ctx.send(
    {
      data: null,
      success: false,
      error: {
        message: mError.message,
        name: mError.error,
        status: mError.statusCode,
        details: error?.details,
      },
    },
    mError.statusCode
  );
};

exports.default = CustomError;
exports.errorResponse = errorResponse;
