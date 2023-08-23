const publisher = require('../message_exchange/publisher')
const Product = require('../models/product.schema')
const mongoose = require('mongoose');


module.exports = {
    consumeMsg(message, acknowledge) {
        let key = message.properties.headers.MessageType
        let content = JSON.parse(message.content.toString())
        //Only switch if there is a body with the event (content)
        // console.log(content.order.products);
        if (content != null){
        switch(key) {
            //Update products
            case 'OrderRegisteredEvent':
                let products = content.data.order.products;
                for (let i = 0; i < products.length; i++) {
                    let product = products[i];
                    let productId = product.productID;
                    let query = {"_id": productId};
                    let projection = {"amount": 1};
                    let amount = product.amount * -1;
                    console.log(amount);
                    Product.update({_id: productId}, {$inc : {amount:amount}}, {upsert: true}, function(err, data){ 
                      if(err) return console.log(err);
                      Product.findOne(query, projection).then(result => {
                        if(result) {
                          console.log(`Successfully found product: ${result}.`);
                          let product2 = {
                            _id: productId,  
                            amount: result.amount
                          }
                          try {
                            publisher.publishMsg("inventory.product.updated", product2,"ProductUpdated")
                          } catch (e) {
                            console.log(e);
                         }
                        } else {
                          console.log("No product matches the provided query.");
                        }})
                        .catch(err => console.error(`Failed to find product: ${err}`));
                   });
                    
                }
                acknowledge(message);
                break;

              default:
                acknowledge(message);
                break;


            }
        }
        //If the event does not have a body, ignore it and remove from the stack
        else acknowledge(message)
    },
}
