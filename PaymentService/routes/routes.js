const CommandController = require('../controllers/command-controller')
const QueryController = require('../controllers/query-controller')

module.exports = (app) => {
    app.get('/payment/:orderId', QueryController.getPaymentById)
    app.put('/payment/:orderId', CommandController.updatePaymentStatus)
}