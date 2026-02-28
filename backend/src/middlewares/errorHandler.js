const errorHandler = (err, req, res, next) => {
  // default error ko 500 set krte hai agar koi status code provide nahi kiya gaya
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Specific Error: Mongoose Bad ObjectId (e.g., searching for a user ID that is formatted wrong)
  if (err.name === 'CastError') {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 404;
  }

  // Specific Error: Mongoose Duplicate Key (e.g., trying to register an email that already exists)
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Send -> JSON response
  res.status(statusCode).json({
    success: false,
    error: message,
    // dev mode me stack trace dikhayenge, production me nahi!
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

module.exports = errorHandler;