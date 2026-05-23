export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const handleCastError = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((error) => error.message);
  return new AppError(`Invalid input: ${messages.join(". ")}`, 400);
};

const handleDuplicateError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || "field";
  return new AppError(`${field} already exists. Please use a different value.`, 400);
};

const handleJWTError = () => new AppError("Invalid token. Please log in again.", 401);
const handleJWTExpiredError = () => new AppError("Your session has expired. Please log in again.", 401);

export const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message, statusCode: err.statusCode };

  if (err.name === "CastError") error = handleCastError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.code === 11000) error = handleDuplicateError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  const statusCode = error.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = error.message || "Something went wrong. Please try again.";

  if (process.env.NODE_ENV === "development") {
    console.error("ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
