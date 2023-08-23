const mongoose = require('mongoose')
const { orderReadSchema } = require('./order-read')
const { paymentDatabaseConnection } = require('../connections/database-connection')

const paymentReadSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true
    },
    orderNumber: {
        type: Number,
        required: true
    }
})

const PaymentRead = paymentDatabaseConnection.model('paymentRead', paymentReadSchema)

module.exports.PaymentRead = PaymentRead
module.exports.paymentReadSchema = paymentReadSchema