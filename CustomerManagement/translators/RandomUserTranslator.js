const Customer = require("../src/models/Customer")

module.exports = class RandomUserTranslator {

    translateToCustomer(data){
        let customer = new Customer({
            username: data.results[0].login.username,
            password: data.results[0].login.password,
            firstname: data.results[0].name.first,
            lastname: data.results[0].name.last,
            email: data.results[0].email,
            city: data.results[0].location.city,
            street: data.results[0].location.street.name,
            housenumber: data.results[0].location.street.number,
            telephone: data.results[0].phone,
            role: 'Customer'
        });
        return customer
    }

}