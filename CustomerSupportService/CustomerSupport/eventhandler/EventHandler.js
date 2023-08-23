const User = require('../models/user.model')

module.exports = class EventHandler {

    async customerRegistered(data) {
        console.log(data);
        let customer = new User(data);
        await customer.save()
    }
    async customerUpdated(data) {
        console.log(data);
        let customer = new User(data);
        await customer.save()
    }
    async customerDeleted(data) {
        console.log(data);
        let customer = new User(data);
        await customer.delete()
    }
}