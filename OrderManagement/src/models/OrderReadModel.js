const mongoose = require('mongoose')

const orderReadSchema = mongoose.Schema({
    orderNumber: Number,
    orderDate: Date,
    customerID:Number,
    deliveryAdress:String,
    orderStatus:String,
    deliveryCompany:String,
    products:[{productID:String,amount:Number,price:Number}],
    totalPrice:Number
})
module.exports = mongoose.model('orderRead', orderReadSchema)