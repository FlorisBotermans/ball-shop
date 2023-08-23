const products = require('../models/ProductReadModel')
const orderStore = require('../models/OrderStore')
const orderRead = require('../models/OrderReadModel')

module.exports = class QueryController {

    async ProductByIdQuery(query){
        let product
        try{product = await products.findById(query.id)}
        catch(e){product = NULL}
        return product
    }
    
    async OrderByIdQuery(query){
        let order = new orderRead()
        let store
        console.log(query)
        try{
            store = await orderStore.findById(query.id)
        }
        catch(e){console.log(e)}
        
        let events = store.events
        for (let i = 0; i < events.length; i++) {
            order = await this.ApplyEvent(order,events[i])
          }
        return order
    }
    async ApplyEvent(object,event)
    {
        if(event.orderNumber){object.orderNumber = event.orderNumber}
        if(event.orderDate){object.orderDate = event.orderDate}
        if(event.customerID){object.customerID = event.customerID}
        if(event.deliveryAdress){object.deliveryAdress = event.deliveryAdress}
        if(event.deliveryCompany){object.deliveryCompany = event.deliveryCompany}
        if(event.orderStatus){object.orderStatus = event.orderStatus}
        if(event.totalCost){object.totalCost = event.totalCost}
        if(event.products.length > 0 ){object.products = event.products}
        return object
    }
}

