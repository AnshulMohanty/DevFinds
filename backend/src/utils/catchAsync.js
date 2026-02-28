// yeh async fn argumant me leta hai and returns new fn jo asyac fn ko call krta hai 
const catchAsync = (fn) => {
  return (req, res, next) => {
    // If the function throws an error, .catch() catches it and hands it to Express's 'next' function
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;