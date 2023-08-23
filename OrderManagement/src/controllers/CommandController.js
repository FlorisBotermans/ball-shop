const OrderStore = require('../models/OrderStore')
const OrderReadModel = require('../models/OrderReadModel')
const rabbitMQConnection = require('../connections/rabbitmqConnection');
const QueryController = require('./QueryController')
const OrderRegisteredEvent = require('../events/OrderRegisteredEvent');
const OrderUpdatedEvent = require('../events/OrderUpdatedEvent');
const logisticCompanyRepo = require('../connections/logisticCompanyRepo');
const UpdateOrderCommand = require('../commands/updateOrderCommand');
const ProductByIdQuery = require('../querys/ProductByIdQuery');


const queryController = new QueryController()

async function totalCost(products){
    let totalcost = 0;
    for (i = 0; i < products.length; i++) {
        let query = new ProductByIdQuery(products[i].productID)
        let product =  await queryController.ProductByIdQuery(query)
        totalcost = totalcost + (product.price * products[i].amount)
      }
    return totalcost.toFixed(2)
}
module.exports = class CommandController {

    async OrderRegisteredCommand(command) {
        const totalprice = await totalCost(command.products)
        const orderStore = new OrderStore({
        });
        const ordernumber = await OrderStore.countDocuments({}).exec();
        orderStore.events.push({
            eventType:'OrderRegisteredEvent',
            orderNumber: ordernumber+1,
            orderDate: command.orderdate,
            customerID:command.customerID,
            deliveryAdress : command.deliveryadress,
            deliveryCompany:"",
            orderStatus : 'Order Registered',
            totalCost:totalprice,
            products : command.products,
            paymentType: command.paymentType
        })
        await orderStore.save();
        
        const orderReadModel = new OrderReadModel({
            orderNumber: orderStore.orderInfo.orderNumber,
            orderDate: command.orderdate,
            customerID:command.customerID,
            deliveryAdress : command.deliveryadress,
            orderStatus : 'Order Registered',
            deliveryCompany:"",
            products : command.products,
            totalPrice : totalprice
        })
        orderReadModel._id = orderStore._id
        orderReadModel.save()
        let event = new OrderRegisteredEvent(new Date().getTime,{
            id:orderStore._id,
            order:orderStore.orderInfo,
            customer:orderStore.customerInfo,
        })
        console.log(event)
        rabbitMQConnection.publishEvent(
            event
        )
        return {
            id:orderStore._id,
            order:orderStore.orderInfo,
            customer:orderStore.customerInfo,
        }
        
    }
    async updateOrderCommand(command){
        let orderStore
        let updatedorder
        await OrderReadModel.findOne({orderNumber:command.orderId}).then(order =>{
            console.log(order)
            order.orderStatus = command.orderStatus
            updatedorder = order
            order.save()
        })
        console.log(updatedorder)
        try{orderStore = await OrderStore.findOne({_id: updatedorder._id})}
        catch(e){orderStore = NULL}

        if (!orderStore) {
            throw { type: 'OrderNotFound' }
        }
        orderStore.events.push({
            eventType:'OrderStatusUpdatedEvent',
            orderStatus : command.orderStatus,
        })
        await orderStore.save()
        rabbitMQConnection.publishEvent(
            new OrderUpdatedEvent(new Date().getTime,{
                order:updatedorder
            })
        )
        return {
            order: updatedorder
        }
    }
    async addOrderDeliveryCompanyCommand(command){
        let orderStore
        const repo = new logisticCompanyRepo()
        let company = repo.getCheapestCompanies()
        command.deliveryCompany = company.name
        try{orderStore = await OrderStore.findOne({_id:command.orderId})}
        catch(e){orderStore = null}

        if (!orderStore) {
            throw { type: 'OrderNotFound' }
        }
        orderStore.events.push({
            eventType:'AddOrderDeliverCompanyEvent',
            deliveryCompany : command.deliveryCompany,
        })
        await orderStore.save()
        let comm
        await OrderReadModel.findOne({_id:command.orderId}).then(order =>{
            order.deliveryCompany = command.deliveryCompany
            order.save()
            comm =  new UpdateOrderCommand(
                new Date().getTime(),
                order.orderNumber,
                "Order Ready for delivery"
                )
        })
        console.log(comm)
        try{
             return await this.updateOrderCommand(comm)
        }
        catch(e)
        {
            console.log(e)
        }

    }
}

