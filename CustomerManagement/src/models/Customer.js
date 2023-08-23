const mongoose = require('mongoose')

const CustomerSchema = mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    city: String,
    street: String,
    housenumber: Number,
    telephone: String,
    role: String
})

module.exports = mongoose.model('Customer', CustomerSchema)