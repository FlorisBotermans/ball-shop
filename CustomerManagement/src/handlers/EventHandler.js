const RandomUserTranslator = require('../../translators/RandomUserTranslator')
const Customer = require('../models/Customer')
const rabbitMQConnection = require('../connections/rabbitMqConnection');
const CustomerRegisteredEvent = require('../events/CustomerRegisteredEvent');

module.exports = class EventHandler {

    async randomCustomerRequested(data) {
        let translator = new RandomUserTranslator()
        let customer = translator.translateToCustomer(data)

        const customerId = await Customer.countDocuments({});
        customer.id = customerId+1

        customer.save().then(result => {
            rabbitMQConnection.publishEvent(
                new CustomerRegisteredEvent(new Date().getTime,{
                    id: result.id,
                    username: result.username,
                    firstname: result.firstname,
                    lastname: result.lastname,
                    email: result.email,
                    city: result.city,
                    street: result.street,
                    housenumber: result.housenumber,
                    telephone: result.telephone,
                    role: result.role
                })
            )
        })
    }
}