const express = require('express');
const config = require('config');
const cors = require('cors');
const mongoose = require('mongoose');

// Database
require('./connections/LocalStorage')();

// Routess
// Tickets [CRUD]
const app = express();
app.use(express.json())
const defaultRouter = require("./routes/default.js");
const ticketRouter = require("./routes/tickets.js");
app.use('/', defaultRouter);
app.use('/api/tickets', ticketRouter);

// CORS
app.use(cors());
app.all("/api/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});

// Rabbit MQ
const rabbitMQ = require("./connections/RabbitMQ");
rabbitMQ.connect();

// Server
app.listen(config.get('ServerPort'), ()=>{
    console.log(`server is running on port ${config.get('ServerPort')}`);
}); 