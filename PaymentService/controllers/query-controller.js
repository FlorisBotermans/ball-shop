const { PaymentRead } = require('../models/payment-read')

module.exports = {
    async getPaymentById(req, res){
        const payment = await PaymentRead.findOne({ orderNumber: req.params.orderId })
        if (!payment) return res.status(404).send({ error: 'payment with this id does not exist' })
        return res.send(payment)
    }
}