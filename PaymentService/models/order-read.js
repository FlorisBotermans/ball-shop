const mongoose = require('mongoose')
const { paymentDatabaseConnection } = require('../connections/database-connection')

const orderReadSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    },
    deliveryAdress: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    }
})

const OrderRead = paymentDatabaseConnection.model('orderRead', orderReadSchema)

module.exports.OrderRead = OrderRead
module.exports.orderReadSchema = orderReadSchema