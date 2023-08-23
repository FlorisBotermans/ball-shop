const RabbitMQ = require('../connections/rabbitmq')
const { PaymentRead } = require('../models/payment-read')
const { OrderRead } = require('../models/order-read')
const { EventStore } = require('../models/event-store')
const PaymentHandledEvent = require('../events/payment-handled-event')

module.exports.payOrder = async function payOrder(data) {
    const order = new OrderRead(data.order)

    let isPaid;
    if (order.paymentType == 'now') isPaid = true
    else if (order.paymentType == 'later') isPaid = false
    
    const payment = new PaymentRead({
        date: new Date().getTime(),
        isPaid: isPaid,
        orderNumber: order.orderNumber
    })
    await payment.save()

    const version = await EventStore.countDocuments({}).exec() + 1

    const eventStore = new EventStore({
        version: version,
        timestamp: new Date().getTime(),
        messageType: 'PaymentHandled',
        eventData: payment
    })
    await eventStore.save()

    RabbitMQ.publishEvent(
        new PaymentHandledEvent(new Date().getTime(), {
            orderNumber: order.orderNumber,
            isPaid: payment.isPaid,
            orderStatus: 'PaymentHandled'
        }) 
    )
}

module.exports = {
    async updatePaymentStatus(req, res) {
        const payment = await PaymentRead.findOne({ orderNumber: req.params.orderId })
        if (!payment) return res.status(404).send({ error: 'payment with this id does not exist' })

        if (payment.isPaid != true) payment.isPaid = true
        else return res.status(500).send({ error: 'payment status cannot be updated' })
        await payment.save()

        const version = await EventStore.countDocuments({}).exec() + 1

        const eventStore = new EventStore({
            version: version,
            timestamp: new Date().getTime(),
            messageType: 'PaymentHandled',
            eventData: payment
        })
        await eventStore.save()

        const order = await OrderRead.findOne({ orderNumber: req.params.orderId })
        if (!order) return res.status(404).send({ error: 'order with this id does not exist' })

        RabbitMQ.publishEvent(
            new PaymentHandledEvent(new Date().getTime(), {
                orderNumber: order.orderNumber,
                isPaid: payment.isPaid,
                orderStatus: 'PaymentHandled'
            }) 
        )

        return res.send(payment)
    }
}