const mongoose = require('mongoose')


const customerReadSchema = mongoose.Schema({
    customerID: Number
})
module.exports = mongoose.model('customerRead', customerReadSchema)