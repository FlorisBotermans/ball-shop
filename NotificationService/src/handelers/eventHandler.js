const Customer = require('../models/UserReadModel')
const MailHandler = require('../handelers/mailHandler')

const mailHandler = new MailHandler()
module.exports = class EventHandler {
    async customerRegistered(data) {
        let info = data.data
        console.log(info.id)
        let customer = new Customer(
            {
                customerID:info.id,
                firstname:info.firstname,
                lastname:info.lastname,
                email:info.email,
                city:info.city,
                street:info.street,
                housenumber:info.housenumber,
                telephone:info.telephone
            }
        )
        console.log(customer)
        await customer.save()
    }
    async OrderRegistered(data){
        console.log(data)
        let customerinfo = {customer:{},order:{}}
        await Customer.findOne({customerID:data.data.order.customerID}).then(customer =>{
            customerinfo.customer = customer
            customerinfo.order = data.data.order
        })
        await mailHandler.sendMail(customerinfo)
    }
    async OrderStatusUpdated(data)
    {
        console.log(data)
        let customerinfo = {customer:{},order:{}}
        await Customer.findOne({customerID:data.data.order.customerID}).then(customer =>{
            customerinfo.customer = customer
            customerinfo.order = data.data.order
        })
        await mailHandler.sendMail(customerinfo)
    }
}