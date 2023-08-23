const { OrderRead } = require('../models/order-read');
const CommandController = require('../controllers/command-controller')

module.exports = class EventHandler {
    async orderRegistered(data) {
        const order = new OrderRead(data.order)
        console.log(order)
        await order.save()
        CommandController.payOrder(data)
    }
}