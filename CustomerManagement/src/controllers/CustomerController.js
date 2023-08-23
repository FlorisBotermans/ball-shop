const rabbitMQConnection = require('../connections/rabbitMqConnection');
const CustomerRegisteredEvent = require('../events/CustomerRegisteredEvent');
const CustomerUpdatedEvent = require('../events/CustomerUpdatedEvent');
const CustomerDeletedEvent = require('../events/CustomerDeletedEvent');
const Customer = require('../models/Customer');
const { Mongoose } = require('mongoose');
const { findOneAndUpdate } = require('../models/Customer');


module.exports = class CustomerController{
    async postCustomer(req, res, next){
        const customerId = await Customer.countDocuments({});
        const customer = new Customer({
            id: customerId+1,
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            city: req.body.city,
            street: req.body.street,
            housenumber: req.body.housenumber,
            telephone: req.body.telephone,
            role: req.body.role
        })

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
        return customer
    }

    async putCustomer(req, res, next){

        const filter = {id: req.params.id}
        const update = {
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            city: req.body.city,
            street: req.body.street,
            housenumber: req.body.housenumber,
            telephone: req.body.telephone,
            role: req.body.role
        }

        let customer = Customer.findOneAndUpdate(filter, update, { new: true}).then(result => {
            rabbitMQConnection.publishEvent(
                new CustomerUpdatedEvent(new Date().getTime,{
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
        return customer
    }

    async deleteCustomer(req, res, next){
        const filter = {id: req.params.id}

        let customer = Customer.findOneAndDelete(filter).then(result => {
            rabbitMQConnection.publishEvent(
                new CustomerDeletedEvent(new Date().getTime,{
                    id: result.id,
                })
            )
        })
        return customer
    }

}