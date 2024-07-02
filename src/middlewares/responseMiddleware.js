function responseMiddleware(req, res, next) {
  res.success = function (data, code = 2000, message = '') {
    res.status(200).json({
      error: {},
      data,
      code,
      message,
      success: true,
    });
  };

  res.error = function (error, code = 2000, message = '') {
    res.status(200).json({
      error,
      data: [],
      code,
      message,
      success: false,
    });
  };

  next();
}

module.exports = responseMiddleware;
