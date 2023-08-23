const Customer = require('../models/CustomerReadModel')
const Product = require('../models/ProductReadModel')
const UpdateOrderCommand = require('../commands/updateOrderCommand')
const CommandController = require('../controllers/CommandController')
const QueryController = require('../controllers/QueryController')
const ProductByIdQuery = require('../querys/ProductByIdQuery')

const commandController = new CommandController()
const queryController = new QueryController()

module.exports = class EventHandler {

    async customerRegistered(data) {
        console.log(data.data)
        let jsondata = data.data
        let customer = new Customer({customerID:jsondata.id})
        console.log(customer)
        await customer.save()
    }
    async productRegistered(data) {
        let product = new Product({productName:data.productName,price:data.price,amount:data.amount})//Aanpassen op basis van incomming event
        product._id = data._id
        await product.save()
    }
    async updateproduct(data){
        let query = new ProductByIdQuery(data._id)
        let product = await queryController.ProductByIdQuery(query)
        product.amount = data.amount
        console.log(product)
        try{
            await product.save()
        }
        catch(e)
        {
            console.log(e)
        }
    }
    async orderStatusUpdated(data){
        let command = new UpdateOrderCommand(
            new Date().getTime(),
            data.body.orderNumber,
            data.body.orderStatus
            )
        try{
            await commandController.updateOrderCommand(command)
        }
        catch(e)
        {
            console.log(e)
        }
    }
}