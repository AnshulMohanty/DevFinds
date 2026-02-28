const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Zod's .parse() will throw an error if the data is invalid
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      next();
    } catch (error) {
      // Zod agar error throw karta hai, toh wo ek specific error format me hota hai. 
      // Hum usko map kar ke readable format me bhejenge.
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'), // e.g., 'body.email'
        message: err.message,      // e.g., 'Invalid email address'
      }));

      // Send -> 400 response asap with the validation errors
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }
  };
};

module.exports = validateRequest;