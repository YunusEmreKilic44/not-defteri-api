const { logEvents } = require("./logEvents");
const path = require("path");
const fs = require("fs/promises");

const errorHandler = (err, req, res, next) => {
  // Hatayı Logla
  const errorMessage = `${err.name}: ${err.message}\t${req.method}\t${req.headers.origin}`;

  const filePath = path.join(__dirname, "..", "logs", "reqLog.log");

  logEvents(errorMessage);

  const status = res.status === 200 ? 500 : res.statusCode;
  res.status(status);
  res.json({
    message: err.message,
  });
};

module.exports = errorHandler;
