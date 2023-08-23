const config = require("config");
const express = require("express");

// Database
require('./connections/dbConnection')()

// Messaging
const rabbitMQConnection = require("./connections/rabbitMqConnection");
rabbitMQConnection.connect();

// API
const app = express();
app.use(express.json())
app.use('/customers', require('./routes/customerRoutes'))

app.listen(config.get('PORT'), () => {
    console.log("CustomerManagement is running..");
});