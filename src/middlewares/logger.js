const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, printf, json } = format;

// const myFormat = printf(({ level, message, timestamp }) => {
//   return `${level}: ${message} - ${timestamp}`;
// });

const logger = createLogger({
  level: "debug",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  //   defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new transports.File({ filename: "./logs/combined.log" }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console());
}

module.exports = logger;
