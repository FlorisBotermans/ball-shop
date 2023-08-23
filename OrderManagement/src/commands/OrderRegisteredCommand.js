const BaseCommand = require('./BaseCommand')

module.exports = class OrderRegisteredCommand extends BaseCommand {

    constructor(timestamp,ordernumber,orderdate,customerID,deliveryadress,products,paymentType) {
        super(timestamp)
        this.ordernumber = ordernumber
        this.orderdate = orderdate
        this.customerID = customerID
        this.deliveryadress = deliveryadress
        this.products = products
        this.paymentType = paymentType
    }
}
