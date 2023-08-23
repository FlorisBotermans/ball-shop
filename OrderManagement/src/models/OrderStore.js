const mongoose = require("mongoose");
const ORDER_ADDED_EVENT = 'OrderRegisteredEvent'
const ORDER_STATUS_UPDATED_EVENT = 'OrderStatusUpdatedEvent'
const ADD_ORDER_DELIVERY_COMPANY_EVENT = 'AddOrderDeliverCompanyEvent'

const OrderSchema = new mongoose.Schema({
    events: [{
        eventType: {
            type: String,
            enum: [
                ORDER_ADDED_EVENT,
                ORDER_STATUS_UPDATED_EVENT,
                ADD_ORDER_DELIVERY_COMPANY_EVENT
            ],
            required: true
        },
        orderNumber: Number,
        orderDate: Date,
        customerID: Number,
        deliveryAdress:String,
        orderStatus:String,
        deliveryCompany:String,
        totalCost:Number,
        products:[{productID : String ,amount:Number}],
        paymentType:String
    }]
})
OrderSchema.virtual('customerInfo').get(function(){
    return this.events[0].customerID
})
OrderSchema.virtual('orderInfo').get(function(){
    return {orderNumber: this.events[0].orderNumber, orderDate:this.events[0].orderDate,orderStatus:this.events[0].orderStatus,deliveryAdress:this.events[0].deliveryAdress,totalPrice:this.events[0].totalCost,products:this.events[0].products,paymentType:this.events[0].paymentType}
})
module.exports = mongoose.model("OrderWrite", OrderSchema);
