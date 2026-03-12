module.exports = (err, req, res, next) => {

  console.error(err);

  let message = "Transaction failed";

  if (err.reason) {
    message = err.reason;
  }

  else if (err.error && err.error.message) {
    message = err.error.message;
  }

  else if (err.message) {
    message = err.message;
  }

  res.status(400).json({
    success: false,
    message
  });
};