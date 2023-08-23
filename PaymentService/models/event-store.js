const mongoose = require('mongoose')
const { eventStoreConnection } = require('../connections/database-connection')

const eventStoreSchema = new mongoose.Schema({
    version: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    messageType: {
        type: String,
        required: true
    },
    eventData: {
        type: Object,
        required: true
    }
})

const EventStore = eventStoreConnection.model('eventStore', eventStoreSchema)

module.exports.EventStore = EventStore
module.exports.eventStoreSchema = eventStoreSchema