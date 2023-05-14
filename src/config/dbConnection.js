const logger = require("../logger/index");
const uuid = require("uuid").v4();

const dbConnection = (db) => {
  db.connect(process.env.MONGODB_URL)
    .then(() =>
      logger.info("Database connection successful", {
        id: uuid,
      })
    )
    .catch((err) =>
      logger.fatal(err.message, {
        id: uuid,
      })
    );
};

module.exports = dbConnection;
