const BaseCommand = require('./BaseCommand')

module.exports = class OrderRegisteredCommand extends BaseCommand {

    constructor(timestamp,orderID,orderStatus) {
        super(timestamp)
        this.orderId = orderID
        this.orderStatus = orderStatus
    }
}
