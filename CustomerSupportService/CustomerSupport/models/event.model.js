const mongoose = require ('mongoose');
const { EventStoreConnection } = require('../connections/Database')
const Schema = mongoose.Schema;

const EventStoreSchema = new mongoose.Schema({
    header: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    }
},
    { timestamps: true }
);

const Event = EventStoreConnection.model('Event', EventStoreSchema);
module.exports = Event;