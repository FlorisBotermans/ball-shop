const mongoose = require('mongoose')


const customerReadSchema = mongoose.Schema({
    customerID: Number,
    firstname:String,
    lastname:String,
    email:String,
    city:String,
    street:String,
    housenumber:String,
    telephone:String
})
module.exports = mongoose.model('customerRead', customerReadSchema)