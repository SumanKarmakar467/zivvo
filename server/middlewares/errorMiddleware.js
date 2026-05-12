export const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const payload = {
    message: err.message || "Something went wrong"
  };
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }
  res.status(statusCode).json(payload);
};
