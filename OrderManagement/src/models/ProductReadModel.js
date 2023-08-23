const mongoose = require('mongoose')


const productReadSchema = mongoose.Schema({
    productName:String,
    price:Number,
    amount:Number
})
module.exports = mongoose.model('productRead', productReadSchema)