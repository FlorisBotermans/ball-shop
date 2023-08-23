const config = require('config')
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

const LocalStorageConnection = connectToDatabase(config.get('LocalStorage'), 'LocalStorage')
const EventStoreConnection = connectToDatabase(config.get('EventStore'), 'EventStore')

module.exports = {
    LocalStorageConnection,
    EventStoreConnection
}