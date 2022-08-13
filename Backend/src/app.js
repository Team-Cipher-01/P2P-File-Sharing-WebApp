'use strict';

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('Request Served');
});

app.use('/v1', require('./routes/v1'));

// app.use(Response.success);
// app.use(Response.error);

module.exports = app;
