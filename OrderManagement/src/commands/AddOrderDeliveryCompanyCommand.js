const BaseCommand = require('./BaseCommand')

module.exports = class AddOrderDeliveryCompanyCommand extends BaseCommand {

    constructor(timestamp,orderID) {
        super(timestamp)
        this.orderId = orderID
        this.deliveryCompany = ""
    }
}
