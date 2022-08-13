'use strict';

async function start() {
  const dotenv = require('dotenv');
  dotenv.config();


  const http = require('http');

  const db = require('./db');
  await db.connect();

  const app = require('./app');
  const server = http.createServer(app);
  const socketController = require('./socketController');

  const port = process.env.PORT;
  server.listen(port, () => {
    console.info(`Listening in ${process.env.NODE_ENV} mode on port ${port}`);
    socketController(server);
  });

  // Promise rejected and no error handler is attached to that
  process.on('unhandledRejection', (ex) => {
    console.error('========= unhandledRejection =========');
    console.error(ex);
  });

  process.on('uncaughtexception', (ex) => {
    console.error('========= uncaughtexception =========');
    console.error(ex);
  });
}

start().catch((error) => {
  throw error;
});
// restart
