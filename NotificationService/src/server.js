const config = require("config");//test Config
const express = require("express");

// Database
require('./connections/dbConnection')()

// Messaging
const rabbitMQConnection = require("./connections/rabbitmqConnection");
rabbitMQConnection.connect();

// API
const app = express();
app.use(express.json())

app.listen(config.get('PORT'), () => {
    console.log("OrderManagement is running..");
});