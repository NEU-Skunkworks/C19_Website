const mongoose = require('mongoose');
const fs = require('fs');
const CONSTANTS = require('../CONSTANTS/constants');

mongoose.Promise = global.Promise;
const connectDatabase = async (callingFileName) => {
  const ca =
    process.env.NODE_ENV === 'production'
      ? [fs.readFileSync('rds-combined-ca-bundle.pem')]
      : null;
  const connectionOptions =
    process.env.NODE_ENV === 'production'
      ? {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          sslValidate: true,
          sslCA: ca,
        }
      : {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
  const MONGO_DB_URL =
    process.env.NODE_ENV === 'production'
      ? process.env.MONGO_DB_URL_DEV
      : process.env.MONGO_DB_URL_LOCAL;
  try {
    const db = await mongoose.connect(MONGO_DB_URL, connectionOptions);
    CONSTANTS.createLogMessage(
      callingFileName,
      `Connection establish to ${MONGO_DB_URL}`,
      'MONGODBCONNECTIONSUCCESS'
    );
    return db;
  } catch (error) {
    CONSTANTS.createLogMessage(
      callingFileName,
      error,
      'MONGODBCONNECTIONERROR'
    );
  }
};

module.exports = {
  connectDatabase,
};
