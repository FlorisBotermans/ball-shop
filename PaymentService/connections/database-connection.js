const mongoose = require('mongoose')

function connectToDatabase(uri, name) {
    let database
    try {
        database = mongoose.createConnection(uri, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log(`connected to ${ name }`)
    } catch (e) {
        console.log(e)
        console.log('unable to connect to database, retrying in 5 sec')
        setTimeout(connectToDatabase, 5000)
    }

    return database
}

const paymentDatabaseConnection = connectToDatabase('mongodb://mongodbuser:testpass12345@mongodb:27017/AvansBall-Payment-Database?connectTimeoutMS=2000&bufferCommands=false&authSource=admin', 'payment database')
const eventStoreConnection = connectToDatabase('mongodb://mongodbuser:testpass12345@mongodb:27017/AvansBall-EventStore-Database?connectTimeoutMS=2000&bufferCommands=false&authSource=admin', 'event store')

module.exports = {
    paymentDatabaseConnection,
    eventStoreConnection
}