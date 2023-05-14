   const { createLogger, format, transports, config } = require("winston");
const { combine, timestamp, json, errors,colorize } = format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const developmentLog = () => {
return createLogger({
  levels: logLevels,
  level: "debug",
  format: combine(
    colorize(),
    errors({ stack: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss:SSS A",
    }),
    json()
  ),
  transports: [
    new transports.Console(),
  ],
})
}

module.exports = developmentLog