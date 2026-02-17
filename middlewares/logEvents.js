const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs").promises;
const path = require("path");

const logEvents = async (message, filePath) => {
  const dateTime = format(new Date(), "dd.MM.yyyy\tHH.mm.ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    await fs.appendFile(filePath, logItem, "utf-8");
  } catch (error) {
    console.log(error);
  }
};

const logger = async (req, res, next) => {
  const message = `${req.method}\t${req.url}\t${req.headers.origin}`;
  const filePath = path.join(__dirname, "..", "logs", "reqLog.log");

  await logEvents(message, filePath);

  next();
};

module.exports = { logger, logEvents };
