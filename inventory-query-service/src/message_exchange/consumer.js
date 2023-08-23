const conn = require('../handlers/database.handler');

module.exports = {
    consumeMsg(message, acknowledge) {
        let key = message.fields.routingKey
        let content = JSON.parse(message.content.toString())
        
        //Only switch if there is a body with the event (content)
        if (content != null){
        switch(key) {
            //Add a product
            case 'inventory.product.created':
                conn.query('INSERT INTO product (`_id`, `NAME`, `description`, `price`, `amount`, `retailer`) VALUES(?, ?, ?, ?, ?, (SELECT `name` FROM `retailer` WHERE `_id` = ?));', 
                [content._id, content.name, content.description, content.price, content.amount, content.retailer], function(error, results, fields) {
                    if (error) console.log("Something went wrong while trying to insert product into the DB: " + error)
                    else acknowledge(message)
                })
                break;

            case 'inventory.product.updated':
                console.log("inventory.product.updated");
                conn.query('UPDATE product SET `amount` = ? WHERE `_id` = ?', 
                [content.amount, content._id], function(error, results, fields) {
                    if (error) console.log("Something went wrong while trying to insert product into the DB: " + error)
                    else acknowledge(message)
                })
                break;

            //Set product active to "false"
            case 'inventory.product.deleted':
                conn.query('UPDATE `product` SET active = false WHERE _id = ?;',
                [content._id], function(error, results, fields) {
                    if (error) console.log("Something went wrong while updating a product in the DB: " + error)
                    else acknowledge(message)
                })
                break;
                
            //Add a third party vendor"
            case 'inventory.retailer.created':
                conn.query('INSERT INTO retailer (_id, NAME) VALUES(?, ?);', 
                [content._id, content.name], function(error, results, fields) {
                    if (error) console.log("Something went wrong while trying to insert retailer into the DB: " + error)
                    else acknowledge(message)
                })
                break;
            
            //Remove a third party vendor"
            case 'inventory.retailer.deleted':
                conn.query('DELETE FROM retailer WHERE _id = (?);', 
                [content._id], function(error, results, fields) {
                    if (error) console.log("Something went wrong while trying to remove retailer from the DB: " + error)
                    else acknowledge(message)
                })
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
