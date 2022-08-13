const { ReadPreference } = require('mongodb');
const mongoose = require('mongoose');

const config = {
  dbUrl: process.env.MONGO_DB_URL,
  dbName: process.env.MONGO_DB_NAME,
  options: {},
};

class Database {
  connection = mongoose.connection;

  constructor() {
    try {
      this.connection
        .on('open', console.info.bind(console, 'Database connection: open'))
        .on('close', console.info.bind(console, 'Database connection: close'))
        .on('disconnected', console.info.bind(console, 'Database connection: disconnecting'))
        .on('disconnected', console.info.bind(console, 'Database connection: disconnected'))
        .on('reconnected', console.info.bind(console, 'Database connection: reconnected'))
        .on('fullsetup', console.info.bind(console, 'Database connection: fullsetup'))
        .on('all', console.info.bind(console, 'Database connection: all'))
        .on('error', console.error.bind(console, 'MongoDB connection: error:'));
    } catch (error) {
      console.error(error.message);
    }
  }

  async connect() {
    try {
      await mongoose.connect(config.dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true,
        readPreference: ReadPreference.SECONDARY_PREFERRED,
        serverSelectionTimeoutMS: 5000,
        autoIndex: false,
        ...config.options,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async close() {
    try {
      await this.connection.close();
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = new Database();
